<div align="center">

# boss

**Let Boss make the calls. Give Worker well-defined tasks.**

[简体中文](README.md)

[![GitHub Stars](https://img.shields.io/github/stars/chu-jiaming/boss)](https://github.com/chu-jiaming/boss/stargazers)
[![License](https://img.shields.io/github/license/chu-jiaming/boss)](https://github.com/chu-jiaming/boss/blob/main/LICENSE)

![Boss and Worker responsibilities](assets/boss-hero.png)

</div>

boss is a Codex skill that keeps understanding, design, difficult implementation and final acceptance with the current session model. Workers handle routine work suited to delegation, using the model and reasoning effort you choose.

> [!NOTE]
> **Design motivation**
>
> boss was inspired by the high cost of using Astra: the aim is to focus Astra's intelligence on key tasks such as understanding requirements, open-ended design, direction-setting and final acceptance, while handing repetitive batches, routine implementation or functional checks to lower-cost Worker models when key decisions are settled, boundaries are clear and the handoff is worthwhile.
>
> A typical pairing uses Astra as Boss and a lower-cost model such as Luna as Worker, combining Astra's intelligence with Worker's cost advantage to balance delivery quality and efficient use of the usage allowance.

> [!WARNING]
> boss works best for routine implementation, functional checks and repetitive tasks with clear boundaries, independently verifiable results and enough work to justify a handoff. Simple edits, open-ended design and complex judgment usually stay with Boss.
>
> Activating boss does not necessarily start a Worker or guarantee usage savings, especially for simple tasks or design work; delegation, execution and acceptance all consume usage allowance.
>
> Actual model availability, routing and usage are determined by the current environment; this pairing does not guarantee fixed usage savings.

## Quick start

**1. Install** — Send this to Codex:

```text
Install the boss skill from https://github.com/chu-jiaming/boss
```

Or choose either manual installation method below:

<details>
<summary>Install from Git</summary>

```sh
git clone https://github.com/chu-jiaming/boss.git
cd boss
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD/skills/boss" "$HOME/.agents/skills/boss"
```

</details>

<details>
<summary>Install the plugin from Marketplace</summary>

```sh
codex plugin marketplace add chu-jiaming/boss # add the Marketplace source
codex plugin add boss@chu-jiaming-skills # install boss
codex plugin list # list installed plugins
```

After `codex plugin marketplace add chu-jiaming/boss` succeeds, you can also open the Codex desktop app and find and install **boss** under **Plugins → Personal**.

</details>

**2. Start a task** — Select your primary model in Codex, then ask in a new task:

```text
$boss, use gpt-5.6-luna at medium effort as the Worker.
Add unit tests for this project's date utilities, covering normal inputs and edge cases, and run them.
```

This model pairing is just an example. Use models and effort levels supported by your environment.

## How work is shared

| Executor | Responsibilities |
| --- | --- |
| Boss | Understanding, design, architecture, complex debugging, difficult implementation and final acceptance |
| Worker | Routine implementation, functional checks and repetitive batches with settled contracts, verifiable results and a worthwhile handoff |
| Direct execution | Small edits, a single existing command or work an existing tool can handle efficiently |

By default, one Worker handles a complete work package with one handoff and one consolidated result. At most two genuinely independent packages may run concurrently, subject to environment limits. No recursive delegation. Boss fixes small residual defects and takes over unresolved design work.

## Adjust the Worker

Worker model and effort persist through the current session; you do not need to repeat `$boss` on follow-ups. To change them, tell Codex:

```text
Change Worker effort to low; keep the model.
```

```text
Switch Worker to gpt-5.6-terra.
```

```text
Return Worker model and effort to automatic selection.
```

boss does not change the primary model or global configuration. On activation or settings changes, it shows the Boss and Worker models, their effort levels and the current execution mode.

## Learn more

Currently supports Codex only. Core instructions need no additional runtime; the optional settings helper requires Node.js 20+.

[Installation, updates and development](docs/install.md) · [Skill source](skills/boss/SKILL.md) · [Design notes](docs/boss-design.md) · [Report an issue](https://github.com/chu-jiaming/boss/issues)

[MIT License](LICENSE) · © 2026 chu-jiaming
