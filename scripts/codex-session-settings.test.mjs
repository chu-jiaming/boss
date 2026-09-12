import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readSessionSettings, parseArgs } from '../skills/boss/scripts/codex-session-settings.mjs';

const record = (type, payload, timestamp = '2026-09-09T05:00:00Z') => JSON.stringify({ type, payload, timestamp }) + '\n';
const meta = id => record('session_meta', { id });
const turn = (model = 'model-a', effort = 'low', turn_id = 'turn-a') => record('turn_context', { model, effort, turn_id });
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'boss-session-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const sessions = join(dir, 'sessions', '2026', '09', '09');
  await mkdir(sessions, { recursive: true });
  const path = join(sessions, 'rollout-date-session-a.jsonl');
  const write = text => writeFile(path, text);
  return { dir, sessions, path, write, read: opts => readSessionSettings({ sessionId: 'session-a', codexHome: dir, ...opts }) };
}

test('latest matching session and turn; no private content in output', async t => {
  const f = await fixture(t);
  await f.write(meta('session-a') + turn() + record('response_item', { text: 'PRIVATE' }) + turn('model-b', 'medium', 'turn-b'));
  const r = await f.read({ turnId: 'turn-b' });
  assert.equal(r.model, 'model-b'); assert.equal(r.effort, 'medium'); assert.equal(r.scope, 'current-turn');
  assert.equal(r.session_id, 'session-a'); assert.equal(r.source, f.path); assert.equal(r.status, 'ok');
  assert.equal(JSON.stringify(r).includes('PRIVATE'), false);
  assert.equal((await f.read({ turnId: 'older' })).scope, 'latest-recorded');
});

test('missing fields stay null instead of borrowing previous turn settings', async t => {
  const f = await fixture(t);
  await f.write(meta('session-a') + turn() + record('turn_context', { turn_id: 'new' }));
  const r = await f.read(); assert.equal(r.model, null); assert.equal(r.effort, null); assert.equal(r.status, 'partial');
  await f.write(meta('session-a') + record('turn_context', { model: 'model-c', reasoning_effort: 'high' }));
  assert.equal((await f.read()).effort, 'high');
});

test('unfinished trailing JSON and changed record format degrade gracefully', async t => {
  const f = await fixture(t);
  await f.write(meta('session-a') + turn() + '{"type":');
  const r = await f.read(); assert.equal(r.model, 'model-a'); assert.match(r.diagnostic, /skipped/);
  await f.write(meta('session-a') + record('new_unknown_format', {}));
  assert.equal((await f.read()).diagnostic, 'turn-context-unavailable');
});

test('identity mismatch, missing identity and conflicting metadata are rejected', async t => {
  const f = await fixture(t);
  for (const data of [meta('other') + turn(), meta('session-a') + turn() + meta('other')]) {
    await f.write(data); const r = await f.read(); assert.equal(r.diagnostic, 'session-id-mismatch'); assert.equal(r.model, null);
  }
  await f.write(turn()); assert.equal((await f.read()).diagnostic, 'session-identity-unavailable');
});

test('explicit rollout can identify itself, explicit session overrides environment', async t => {
  const f = await fixture(t); await f.write(meta('session-a') + turn());
  const r = await readSessionSettings({ rollout: f.path }); assert.equal(r.session_id, 'session-a');
  assert.equal(parseArgs(['--session-id', 'explicit'], { CODEX_THREAD_ID: 'environment' }).sessionId, 'explicit');
  assert.throws(() => parseArgs(['--bad']), /invalid/);
});

test('only matching filenames are opened, ambiguous matches are not guessed', async t => {
  const f = await fixture(t); await f.write(meta('session-a') + turn());
  const other = join(f.sessions, 'rollout-date-session-b.jsonl');
  await writeFile(other, 'NOT JSON'); await chmod(other, 0);
  assert.equal((await f.read()).status, 'ok');
  await writeFile(join(f.sessions, 'rollout-another-session-a.jsonl'), meta('session-a') + turn());
  assert.equal((await f.read()).diagnostic, 'ambiguous-rollout');
});

test('unavailable and unreadable files produce JSON diagnostics', async t => {
  const f = await fixture(t);
  assert.equal((await f.read()).diagnostic, 'rollout-not-found');
  assert.equal((await readSessionSettings({})).diagnostic, 'missing-session-id');
  assert.equal((await f.read({ rollout: f.path })).diagnostic, 'read-failed:ENOENT');
  assert.equal((await f.read({ rollout: f.sessions })).diagnostic, 'read-failed:EISDIR');
  await f.write(meta('session-a') + turn()); await chmod(f.path, 0);
  if (!process.getuid || process.getuid() !== 0) assert.equal((await f.read()).diagnostic, 'read-failed:EACCES');
});
