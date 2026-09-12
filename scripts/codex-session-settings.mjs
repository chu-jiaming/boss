#!/usr/bin/env node
// Read only the identified session; never emit conversation content.
import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const value = x => typeof x === 'string' && x.length ? x : null;
const empty = () => ({ status: 'unknown', session_id: null, model: null, effort: null,
  turn_id: null, timestamp: null, source: null, scope: 'latest-recorded', diagnostic: null });

async function findRollouts(dir, id, matches) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    // Do not follow symlinks into other session stores.
    if (entry.isDirectory()) await findRollouts(join(dir, entry.name), id, matches);
    else if (entry.isFile() && entry.name.startsWith('rollout-') && entry.name.endsWith(`-${id}.jsonl`)) {
      matches.push(join(dir, entry.name));
    }
  }
}

export async function readSessionSettings(options = {}) {
  const result = empty();
  const id = value(options.sessionId);
  if (id && !/^[a-zA-Z0-9_-]+$/.test(id)) return { ...result, diagnostic: 'invalid-session-id' };
  result.session_id = id;
  try {
    let path = options.rollout ? resolve(options.rollout) : null;
    if (!path) {
      if (!id) return { ...result, diagnostic: 'missing-session-id' };
      const matches = [];
      await findRollouts(join(options.codexHome || join(homedir(), '.codex'), 'sessions'), id, matches);
      if (matches.length !== 1) return { ...result, diagnostic: matches.length ? 'ambiguous-rollout' : 'rollout-not-found' };
      path = matches[0];
    }
    result.source = path;
    let sessionId = null;
    let mismatch = false;
    let latest = null;
    let malformed = false;
    const input = createReadStream(path, { encoding: 'utf8' });
    const lines = createInterface({ input, crlfDelay: Infinity });
    try {
      for await (const line of lines) {
        if (!line.trim()) continue;
        let record;
        try { record = JSON.parse(line); }
        catch { malformed = true; continue; } // Active files may end with an unfinished record.
        if (!record || typeof record !== 'object') continue;
        const p = record.payload;
        if (!p || typeof p !== 'object') continue;
        if (record.type === 'session_meta') {
          const nextId = value(p.id);
          if (nextId) {
            if ((id && nextId !== id) || (sessionId && nextId !== sessionId)) { mismatch = true; break; }
            sessionId = nextId;
          }
        } else if (record.type === 'turn_context') {
          // Take one complete context; never fill missing fields from an older turn.
          latest = { model: value(p.model), effort: value(p.effort) || value(p.reasoning_effort),
            turn_id: value(p.turn_id), timestamp: value(record.timestamp) };
        }
      }
    } finally { lines.close(); input.destroy(); }
    if (mismatch) return { ...result, diagnostic: 'session-id-mismatch' };
    if (!sessionId) return { ...result, diagnostic: 'session-identity-unavailable' };
    result.session_id = sessionId;
    if (!latest) return { ...result, diagnostic: 'turn-context-unavailable' };
    const current = Boolean(options.turnId && latest.turn_id === options.turnId);
    return { ...result, ...latest, status: latest.model && latest.effort ? 'ok' : 'partial',
      scope: current ? 'current-turn' : 'latest-recorded',
      diagnostic: malformed ? 'incomplete-or-malformed-record-skipped' : null };
  } catch (error) {
    return { ...result, diagnostic: ['ENOENT', 'EACCES', 'EPERM', 'EISDIR'].includes(error.code)
      ? `read-failed:${error.code}` : 'read-failed' };
  }
}

export function parseArgs(args, env = process.env) {
  const options = { sessionId: env.CODEX_THREAD_ID || null, codexHome: env.CODEX_HOME || undefined };
  const names = { '--session-id': 'sessionId', '--rollout': 'rollout', '--turn-id': 'turnId', '--codex-home': 'codexHome' };
  for (let i = 0; i < args.length; i += 2) {
    if (!names[args[i]] || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('invalid-arguments');
    options[names[args[i]]] = args[i + 1];
  }
  return options;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await readSessionSettings(parseArgs(process.argv.slice(2))))); }
  catch { console.log(JSON.stringify({ ...empty(), diagnostic: 'invalid-arguments' })); process.exitCode = 2; }
}
