# Skills

[English](README.md) | [简体中文](README.zh-CN.md)

Reusable agent skills for focused workflows. The first skill is **boss**: keep the current session model in charge of decisions, and delegate bounded execution to a selected Worker model.

## Available skills

| Skill | Purpose | Status |
| --- | --- | --- |
| [boss](skills/boss/SKILL.md) | Session-level Worker selection, minimal-context delegation, and evidence-based acceptance | Codex-first; structure validated and scenarios reviewed |

## How boss works

```text
User request
  → Boss: understand intent, constraints, dependencies, and acceptance criteria
  → Worker: search, read, implement, test, or batch-process a bounded task
  → Concise results + evidence
  → Boss: verify, correct, integrate, and respond
```

- **Keep your Boss.** The current session model remains in charge. Astra + Luna is an example, not a mandatory pairing.
- **Choose once per session.** Subsequent requests retain the Worker selection; switch it whenever needed.
- **Respect explicit models.** An unavailable requested model blocks delegation instead of silently falling back.
- **Send minimal context.** On compatible Codex tools, explicitly use `fork_turns="none"`.
- **Delegate when useful.** Tiny tasks can stay with Boss. Start with at most two independent Workers unless configured otherwise.
- **Check evidence.** Workers report artifacts, actual checks, and unresolved issues; Boss decides whether the task is complete.
- **Compare official-price costs.** Account for input, cached input, output, and rework. This is not a measurement of Plus allowance.

## Install in Codex

Clone the repository, then link only the `boss` directory into your personal skills directory:

```sh
git clone https://github.com/chu-jiaming/skills.git
cd skills
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD/skills/boss" "$HOME/.agents/skills/boss"
```

The link command deliberately does not overwrite an existing installation. If `boss` already exists there, inspect it before choosing whether to replace it. Avoid duplicate installations under multiple skill discovery paths.

Codex supports symlinked skills. If the skill does not appear, restart Codex. See the [official skill documentation](https://learn.chatgpt.com/docs/build-skills).

Alternatively, copy the `boss` directory into your project's `.agents/skills/` directory. A linked installation follows your checkout; update it with `git pull --ff-only` from the repository root. A copied installation must be updated separately.

## Usage

Select your preferred Boss model in the host, then start with:

```text
$boss, use gpt-5.6-luna as the Worker for this session. Help me implement …
```

Continue normally:

```text
Now implement the next feature.
```

Switch the selection:

```text
Switch the Worker to gpt-5.6-terra.
```

Or return to automatic selection:

```text
Use automatic low-cost Worker selection from now on.
```

Model names are examples and must be available in your session. A switch applies to new tasks and follow-ups; existing Workers finish by default without receiving more work. Request an immediate switch explicitly if you want existing work stopped and continued with the new model.

## Compatibility and limits

| Host | Current scope |
| --- | --- |
| Codex | Native tool mapping and instruction-level scenario review; full end-to-end validation remains pending |
| Claude Code | Adapter guidance; requires compatible tools/configuration and target-runtime validation |
| OpenCode | Adapter guidance; requires compatible tools/configuration and target-runtime validation |
| pi | Requires an installed compatible subagent extension; target-runtime validation pending |

This is an instruction-based skill, not a scheduler service. It cannot add unavailable models, override host permissions, or create missing tool capabilities. Session selection is retained through host context/checkpoints; automatic recovery after restart is not guaranteed without host support. No cross-platform certification or measured cost-saving percentage is claimed.

Official token prices are the main comparison metric. Estimates and measured usage must be labeled separately. The skill keeps your existing authentication and does not switch you to API billing.

## Repository layout

```text
skills/
├── README.md
├── README.zh-CN.md
├── LICENSE
├── docs/boss-design.md
└── skills/
    └── boss/
        ├── SKILL.md
        ├── agents/openai.yaml
        └── references/
```

Read [the design](docs/boss-design.md), [the session protocol](skills/boss/references/protocol.md), or [cost accounting](skills/boss/references/cost.md) for details. Runtime use loads only the relevant references; the design document is not required context.

## Contributing

Issues and pull requests are welcome. For compatibility reports, include the host/version, model selection, minimal reproduction, expected and actual behavior, and redacted evidence. Do not include API keys or private session transcripts.

Keep the entry point short, preserve explicit model constraints, and document any host limitations. Platform support claims should be backed by actual tests; scenario review alone is not end-to-end verification.

## License

[MIT](LICENSE) © 2026 chu-jiaming. You may use, modify, and redistribute the work, including commercially, subject to retaining the license notice. Model and platform services remain subject to their own terms.
