#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir, rm, lstat } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--check')) {
  console.error('Usage: node scripts/build-plugins.mjs [--check]');
  process.exit(2);
}
const check = args[0] === '--check';
const skill = join(root, 'skills/boss');
const plugin = join(root, 'plugins/boss');

async function files(dir, prefix = '') {
  const result = new Map();
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed: ${join(dir, entry.name)}`);
    if (entry.isDirectory()) {
      for (const [key, value] of await files(join(dir, entry.name), name + '/')) result.set(key, value);
    } else if (entry.isFile()) result.set(name, await readFile(join(dir, entry.name)));
    else throw new Error(`Unsupported file: ${name}`);
  }
  return result;
}

async function safeDirectory(path) {
  try {
    const stat = await lstat(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Expected real directory: ${path}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

try {
  for (const path of [join(root, 'plugins'), plugin, join(plugin, 'skills')]) await safeDirectory(path);
  const manifest = JSON.parse(await readFile(join(plugin, '.codex-plugin/plugin.json'), 'utf8'));
  if (manifest.name !== 'boss' || manifest.skills !== './skills/' || !/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error('Invalid boss manifest name, skills path, or release version');
  const marketplace = JSON.parse(await readFile(join(root, '.agents/plugins/marketplace.json'), 'utf8'));
  const entries = marketplace.plugins.filter(entry => entry.name === 'boss');
  if (entries.length !== 1 || entries[0].source.source !== 'local' || entries[0].source.path !== './plugins/boss') throw new Error('Marketplace must resolve boss to ./plugins/boss');
  const expected = new Map();
  // Explicit runtime allowlist: never ship local environments or design documents.
  expected.set('boss/SKILL.md', await readFile(join(skill, 'SKILL.md')));
  for (const part of ['agents', 'references']) {
    await safeDirectory(join(skill, part));
    for (const [name, data] of await files(join(skill, part))) expected.set(`boss/${part}/${name}`, data);
  }
  expected.set('boss/scripts/codex-session-settings.mjs', await readFile(join(skill, 'scripts/codex-session-settings.mjs')));
  const license = await readFile(join(root, 'LICENSE'));
  const licensePath = join(plugin, 'LICENSE');
  try { if ((await lstat(licensePath)).isSymbolicLink()) throw new Error('Plugin LICENSE must not be a symlink'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (check) {
    const actual = await files(join(plugin, 'skills'));
    const differences = new Set([...expected.keys(), ...actual.keys()]);
    const stale = [...differences].filter(name => !expected.has(name) || !actual.has(name) || !expected.get(name).equals(actual.get(name)));
    if (!(await readFile(licensePath)).equals(license)) stale.push('LICENSE');
    if (stale.length) throw new Error(`Generated package differs: ${stale.join(', ')}. Run node scripts/build-plugins.mjs`);
    console.log('Plugin package matches source; marketplace path verified.');
  } else {
    // Only this generated subtree is replaced; authored manifest stays untouched.
    await rm(join(plugin, 'skills'), { recursive: true, force: true });
    for (const [name, data] of expected) {
      const target = join(plugin, 'skills', name);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, data);
    }
    await writeFile(licensePath, license);
    console.log(`Built ${relative(root, plugin)} from skills/boss (${expected.size} runtime files).`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
