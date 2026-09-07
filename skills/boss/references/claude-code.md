# Claude Code adapter — requires target-runtime validation

Inspect available Agent/subagent tools and effective custom-agent definitions. Prefer an already loaded role with the exact desired model and appropriate tools. Validate model resolution and overrides; do not assume invocation-level model switching exists. If no matching role or supported dynamic model parameter exists, report the setup gap rather than substituting a model.

Select a fresh isolated context where supported. Avoid a fork mode that copies the full parent conversation. Pass the minimal packet, preserve applicable project instructions, and check the current version's actual behavior. Skills alone do not add an Agent tool or change provider access.

Do not install agents or modify user configuration merely to persist a session choice. Use protocol checkpoints and native lifecycle controls. If loading a new definition requires a restart, say so; do not claim it is active before verification. Validate continuous selection and resume behavior separately.

[Official subagent documentation](https://code.claude.com/docs/en/sub-agents). This adapter is guidance based on documentation, not a tested compatibility certification.
