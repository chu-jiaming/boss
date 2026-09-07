# pi adapter — requires an installed compatible extension

Check whether a subagent extension/tool is installed and inspect its actual schema. The official repository provides a subagent example using separate processes and isolated contexts; existence of that example does not mean the user has it installed.

Use an installed extension only when model selection, context initialization, permissions, results and cancellation satisfy the protocol. Where model selection comes from agent definitions, verify the effective definition and provider. Never assume a tool call accepts a model field just because a process CLI does.

Keep the current pi session as Boss. Do not launch ad hoc API clients or install the example automatically. If the extension is missing or cannot enforce the selected model, describe the missing capability. Follow the protocol for persistent selection; an extension must provide or integrate a reload mechanism before restart persistence can be guaranteed.

[Official subagent example](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions/subagent). This adapter is guidance, not a tested compatibility certification.
