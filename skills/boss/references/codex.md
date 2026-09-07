# Codex adapter

Use native subagents, not `create_thread` or an API subprocess. User-visible standalone tasks are not a substitute for delegated agents. Keep existing login, Boss model, reasoning settings, and global config.

Inspect the actual spawn tool schema. Where the current `collaboration.spawn_agent` contract is available, pass:

```text
task_name: a short unique leaf-task name
model: the active resolved Worker model ID
reasoning_effort: a supported effort appropriate to the leaf task
fork_turns: "none"
message: the minimal task packet
```

This is a field mapping, not executable code or a universal Codex signature. In the current contract, full-history forks inherit model and effort and do not accept overrides. Do not omit `fork_turns` when its default is full history. A model override is authorized by the user's selection or this skill's auto-selection instructions, within higher-priority host rules.

Use native send/follow-up, wait, and interrupt tools exposed in the session. Follow their distinctions: sending a message may not restart an idle agent; a follow-up may. Do not assume a follow-up can change its model. Reuse an agent only for the same bounded work and matching selection. Follow any host requirement that delegation accompany useful independent local work.

Prefer direct spawn parameters over creating custom roles. Existing custom-agent configuration can take precedence over explicit model/effort parameters; inspect applicable effective configuration if roles are involved. Explicit spawn settings override `[agents]` defaults, but do not assume they override custom agent files. Unknown effective overrides block strict selection. Never solve a conflict by silently changing global configuration.

Official references, checked during design on 2026-09-07:

- [Subagents and configuration precedence](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Models and reasoning](https://learn.chatgpt.com/docs/models)

Recheck relevant documentation when the installed contract differs, not on every leaf task. The model catalog, including any Luna candidate, must come from the current environment. No minimum CLI version alone proves correct routing.

Session persistence uses the host's persisted context/checkpoint mechanisms described in the protocol. This skill installs no automatic resume hook. If the host fails to retain the selection and skill instructions, report the gap instead of pretending persistence is guaranteed.
