# OpenCode adapter — requires target-runtime validation

Inspect the actual task tool and effective agent configuration. A configured agent may use `mode: subagent` and a `provider/model-id` model identity. Select a matching, loaded role; do not assume the task tool accepts an arbitrary model override. Unspecified subagent models can inherit the primary model, so omission does not enforce the user’s selection.

Verify model resolution, project/user overrides, permitted tools, context initialization, and available wait/cancel behavior. Use the protocol’s minimal packet and session checkpoint. If fixed model selection or clean context cannot be enforced with the installed capabilities, report the gap rather than silently weakening either requirement.

Do not rewrite global agent definitions on a session model switch. Use a matching existing role or an explicitly authorized setup path. Treat role names as routing labels, not evidence of the actual model.

[Official agent documentation](https://opencode.ai/docs/agents/). This adapter is guidance based on documentation, not a tested compatibility certification.
