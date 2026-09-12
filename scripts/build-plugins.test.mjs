import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('build detects drift, removes stale generated files, and rejects symlinks', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'boss-plugin-test-'));
  try {
    for (const path of ['scripts/build-plugins.mjs', 'SKILL.md', 'agents', 'references', 'scripts/codex-session-settings.mjs', 'plugins/boss/.codex-plugin', '.agents/plugins', 'LICENSE']) {
      await mkdir(dirname(join(fixture, path)), { recursive: true });
      await cp(join(root, path), join(fixture, path), { recursive: true });
    }
    const run = (...args) => spawnSync(process.execPath, [join(fixture, 'scripts/build-plugins.mjs'), ...args], { encoding: 'utf8' });
    assert.equal(run().status, 0);
    assert.equal(run('--check').status, 0);
    assert.equal(
      await readFile(join(fixture, 'plugins/boss/skills/boss/scripts/codex-session-settings.mjs'), 'utf8'),
      await readFile(join(fixture, 'scripts/codex-session-settings.mjs'), 'utf8'),
      'the optional settings helper must ship with the skill'
    );
    const copied = join(fixture, 'plugins/boss/skills/boss/SKILL.md');
    await writeFile(copied, 'stale');
    assert.equal(run('--check').status, 1);
    assert.equal(await readFile(copied, 'utf8'), 'stale', 'check must not mutate output');
    await writeFile(join(fixture, 'plugins/boss/skills/extra.txt'), 'stale extra');
    assert.equal(run().status, 0);
    assert.equal(run('--check').status, 0);
    await symlink(join(fixture, 'LICENSE'), join(fixture, 'references/external.md'));
    assert.equal(run().status, 1);
    assert.equal(run('--unsupported').status, 2);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});
