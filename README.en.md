# boss

Keep judgment with the primary model; delegate bounded routine work to a Worker.

[简体中文](README.md) · [Installation](docs/install.md) · [Skill source](SKILL.md)

![Boss and Worker](assets/boss-hero.png)

boss is a standalone Codex skill. The current session model handles understanding, design, difficult implementation and final acceptance. Workers receive routine implementation, functional verification or repetitive batches when the boundaries are clear, results are independently verifiable and the work justifies coordination overhead.

Activation does not require delegation. Small tasks, open-ended design and tightly coupled work remain with Boss. After key design or interface decisions, reassess delegation once without inventing extra stages.

## Quick start

```sh
git clone https://github.com/chu-jiaming/boss.git
cd boss
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD" "$HOME/.agents/skills/boss"
```

For an existing installation, check its source first using the [installation guide](docs/install.md). Select the primary model in Codex, then ask:

```text
$boss, use gpt-5.6-luna at medium effort as the Worker. Complete the current task.
```

Worker model and effort persist through the session. They must be supported by the current environment. Boss does not change the primary model or global configuration; Astra + Luna is an example pairing.

## Responsibilities

| Work | Executor |
| --- | --- |
| Understanding, visual design, architecture, complex debugging | Boss |
| Conventional features with settled contracts | Worker when handoff is worthwhile |
| Writing functional tests and reporting reproducible defects | Worker when substantial and independent |
| Repetitive work under established rules | Worker or an existing deterministic tool |
| Small edits or a single existing command | Direct execution |
| Visual judgment, final acceptance and integration | Boss |

Default to one Worker per coherent package, with one handoff and one consolidated result. At most two independent packages may run concurrently, subject to host limits. No recursive delegation or continuous coaching. Boss fixes small residual defects and takes over unresolved design work.

## Settings

```text
Change Worker effort to low; keep the model.
Switch Worker to gpt-5.6-terra.
Return Worker model and effort to automatic selection.
```

On activation or a settings change, show Boss and Worker model/effort and the available execution mode. Selected settings do not mean a Worker has started. Missing identity is unknown; latest recorded settings are distinguished from current-turn evidence.

## Development and limitations

The root `SKILL.md`, `agents/`, `references/` and session helper are the source. `plugins/boss/` is the generated installation package; its nested skill directory is packaging only. See [installation and updates](docs/install.md) and the [design notes](docs/boss-design.md).

```sh
node scripts/build-plugins.mjs
node scripts/build-plugins.mjs --check
node --test scripts/*.test.mjs
```

Currently supports Codex only. Core instructions need no Node runtime; the optional settings helper needs Node.js 20+.

There is no established allowance-saving claim. Delegation, execution and acceptance all consume resources. Experiments are paused; unfinished fixtures and raw run records are excluded from publication.

[Report an issue](https://github.com/chu-jiaming/boss/issues) with model/effort, a minimal reproduction and redacted evidence.

[MIT License](LICENSE) · © 2026 chu-jiaming
