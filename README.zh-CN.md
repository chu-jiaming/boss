# Skills

[English](README.md) | [简体中文](README.zh-CN.md)

用于专注工作流的可复用 agent skills。首个 skill 是 **boss**：由当前会话模型掌握需求和决策，将边界清晰的执行任务委派给选定的 Worker 模型。

## 技能列表

| Skill | 用途 | 状态 |
| --- | --- | --- |
| [boss](skills/boss/SKILL.md) | 会话级 Worker 选择、最小上下文委派与证据验收 | Codex 优先；已完成结构校验和场景审查 |

## boss 如何工作

```text
用户需求
  → Boss：理解意图、约束、依赖与验收标准
  → Worker：搜索、阅读、实现、测试或批量处理明确任务
  → 压缩结果 + 证据
  → Boss：验收、纠偏、整合并回答
```

- **保留当前 Boss。** 当前 session 模型负责总控，Astra + Luna 是示例组合，不是强制配置。
- **一次指定，会话沿用。** 后续请求保持 Worker 选择，也可以随时切换。
- **显式模型是硬约束。** 指定模型不可用时暂停委派，不偷偷替换。
- **传递最小上下文。** 对兼容的 Codex 工具显式使用 `fork_turns="none"`。
- **有收益才委派。** 极小任务可由 Boss 直接完成；未另行设置时，初始最多两个独立 Worker 并行。
- **按证据验收。** Worker 返回产物、实际检查和未解决事项，Boss 判断是否完成。
- **按官方价格比较成本。** 纳入输入、缓存输入、输出及返工，不将它等同于 Plus 额度扣减。

## 安装到 Codex

克隆仓库，然后只将 `boss` 目录链接到个人 skills 目录：

```sh
git clone https://github.com/chu-jiaming/skills.git
cd skills
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD/skills/boss" "$HOME/.agents/skills/boss"
```

上述链接命令不会覆盖现有安装。如果目标位置已有 `boss`，先检查再决定是否替换，避免在多个发现路径重复安装。

Codex 支持软链接 skill；如果未显示，可重启 Codex。参见[官方技能文档](https://learn.chatgpt.com/docs/build-skills)。

也可将 `boss` 目录复制到项目的 `.agents/skills/` 下。软链接安装随源码更新，在仓库根目录运行 `git pull --ff-only` 即可更新；复制安装需要单独替换文件。

## 使用方式

先在宿主中选择希望担任 Boss 的模型，再输入：

```text
$boss，使用 gpt-5.6-luna 作为当前 session 的 Worker，帮我实现……
```

之后正常提出任务，无需重复调用：

```text
继续实现下一个功能。
```

切换 Worker：

```text
Worker 切换为 gpt-5.6-terra。
```

恢复自动选择：

```text
后续 Worker 恢复自动选择低成本模型。
```

模型名称仅为示例，必须在当前会话中可用。切换作用于新任务和后续跟进；正在运行的旧 Worker 默认完成已有工作，但不再接收新工作。如需停止旧任务并由新模型接手，请明确要求立即切换。

## 兼容性与限制

| 宿主 | 当前范围 |
| --- | --- |
| Codex | 已编写原生工具映射并完成指令场景审查；完整端到端验证待完成 |
| Claude Code | 提供适配指导，需兼容工具/配置及目标环境验证 |
| OpenCode | 提供适配指导，需兼容工具/配置及目标环境验证 |
| pi | 需要已安装的兼容子代理扩展，目标环境验证待完成 |

这是指令型 skill，不是独立调度服务。它无法添加不可用模型、绕过宿主权限或创造缺失工具。会话选择依靠宿主上下文或状态记录保留；没有宿主支持时，不保证重启后自动恢复。目前不宣称跨平台认证或任何实测节省比例。

成本以官方 token 价格为主要衡量口径，估算和实测用量分别标注。skill 保留现有登录方式，不会自行切换到 API 计费。

## 仓库结构

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

详细内容见[方案书](docs/boss-design.md)、[会话协议](skills/boss/references/protocol.md)和[成本规则](skills/boss/references/cost.md)。运行时只按需读取相关引用，不要求加载整份方案书。

## 参与贡献

欢迎提交 Issue 和 PR。反馈兼容性问题时，请提供宿主及版本、模型选择、最小复现、预期与实际行为，以及脱敏证据；请勿提交 API key 或私人会话全文。

修改时保持入口简洁、保留显式模型硬约束，并说明宿主限制。平台支持声明应有实际测试依据，场景审查不等于端到端验证。

## 许可证

[MIT](LICENSE) © 2026 chu-jiaming。允许使用、修改和再分发，包括商业用途，但需保留许可证声明。模型与平台服务仍受各自条款约束。
