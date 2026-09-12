# Codex adapter

Apply the shared work-package eligibility rule before using native subagents. Use them instead of `create_thread` or an API subprocess. User-visible standalone tasks are not a substitute for delegated agents. Keep existing login, Boss model, reasoning settings, and global config.

Inspect the actual spawn tool schema. Where the current `collaboration.spawn_agent` contract is available, pass:

```text
task_name: a short unique leaf-task name
model: the active resolved Worker model ID
reasoning_effort: a supported effort appropriate to the leaf task
fork_turns: "none"
message: the minimal task packet
```

This is a field mapping, not executable code or a universal Codex signature. In the current contract, full-history forks inherit model and effort and do not accept overrides. Do not omit `fork_turns` when its default is full history. A model override is authorized by the user's selection or this skill's auto-selection instructions, within higher-priority host rules.

Use native send/follow-up, wait, and interrupt tools exposed in the session. Follow their distinctions: sending a message may not restart an idle agent; a follow-up may. Do not assume a follow-up can change its model or effort. Reuse an agent only for a qualifying related routine work package when its model and effort match and it has no conflicting active task. Follow any host requirement that delegation accompany useful independent local work.

Prefer completion events. When bounded waiting is needed, use about 60 seconds where supported and permitted by the host; avoid repeated 10-second waits without new information. A timeout alone is not a reason to inspect partial files or send feedback. Include “return one consolidated result; contact Boss only for a genuine blocker” in the task packet, while respecting host-required reporting.

## Boss model and effort discovery

Prefer current-turn metadata supplied directly by the host. If missing, use the optional Node.js 20+ helper [codex-session-settings.mjs](../scripts/codex-session-settings.mjs) on activation, recovery, or a settings change. Resolve its path relative to this installed skill:

```sh
node <skill-directory>/scripts/codex-session-settings.mjs
```

It uses `CODEX_THREAD_ID` and `CODEX_HOME` (normally `~/.codex`). Supported arguments are `--session-id ID`, `--rollout PATH`, `--turn-id ID`, and `--codex-home PATH`. Only pass a current turn ID obtained from trusted host metadata, never the ID just read from the file to manufacture a match. Explicit rollout paths still check an available session ID; without one, the file must identify its session.

The helper finds matching filenames under the session directory and streams only the identified rollout. It returns JSON fields `status`, `session_id`, `model`, `effort`, `turn_id`, `timestamp`, `source`, `scope` and `diagnostic`. Missing values are `null`. `scope: latest-recorded` means the latest recorded session settings, not proof of the current turn; `current-turn` requires a matching supplied turn ID. This is host-recorded configuration, not proof of backend routing. The JSON contains no conversation text.

If Node, a matching rollout, identity metadata or readable records are unavailable, display unknown fields and continue. Do not install a runtime just for this helper, scan other sessions' contents, or call it on ordinary follow-ups. It does not resolve TOML defaults; handle configured Worker settings below.

## Defaults and custom agent types

Trust the current spawn tool contract for explicit model selection. Read configuration when using configured defaults, selecting a custom role, or diagnosing a concrete conflict or failure; do not audit all configuration layers before ordinary calls.

- For automatic selection, prefer a suitable `agents.default_subagent_model` and supported `agents.default_subagent_reasoning_effort`. Read the active user configuration (`$CODEX_HOME/config.toml`, normally `~/.codex/config.toml`) and applicable project overrides only as needed. A configured default does not create a fixed session lock.
- Explicit spawn model/effort values take precedence over `[agents]` defaults, then parent values. A selected custom agent file can subsequently override these settings. Inspect that role's configuration when using it. Resolve `agents.<name>.config_file` relative to its declaring configuration, or use the selected standalone agent file according to the installed contract.
- If spawn/defaults select a model without effort, Codex uses the model's default effort. A custom file setting only model retains the previously resolved effort; check compatibility when changing models this way.
- Model IDs and agent types (such as `worker` or `explorer`) are distinct. Pass an agent type only if the actual schema supports it; the mapping above has no `agent_type` parameter.
- If a concrete role override prevents the requested model, use a matching supported route or report the conflict. An unknown internal role or missing backend receipt alone does not prevent explicit selection through the host contract. Reuse validation until relevant settings or capabilities change.

Official references, rechecked on 2026-09-09:

- [Subagents and configuration precedence](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Models and reasoning](https://learn.chatgpt.com/docs/models)

Recheck relevant documentation when the installed contract differs, not on every leaf task. The model catalog, including any Luna candidate, must come from the current environment. No minimum CLI version alone proves correct routing.

Use the protocol for session selection and recovery.
