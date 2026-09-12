<div align="center">

# boss

**关键判断交给 Boss，明确任务交给 Worker。**

[English](README.en.md)

[![GitHub Stars](https://img.shields.io/github/stars/chu-jiaming/boss)](https://github.com/chu-jiaming/boss/stargazers)
[![License](https://img.shields.io/github/license/chu-jiaming/boss)](https://github.com/chu-jiaming/boss/blob/main/LICENSE)

![Boss 与 Worker 分工](assets/boss-hero.png)

</div>

boss 是一个 Codex 技能，让当前会话的主模型负责理解需求、设计、困难实现与最终验收。适合交接的常规工作由 Worker 承担，你可以指定它使用的模型和推理强度（effort）。

> [!NOTE]
> **设计初衷**
>
> boss 灵感源于 Astra 成本高的痛点：希望把 Astra 的高智能优势集中用在需求理解、开放式设计、方向判断和最终验收等关键任务上，将关键决策已定、边界清晰且有交接收益的重复批次、常规实现或功能检查交给成本更低的 Worker 模型。
>
> 典型组合是由 Astra 担任 Boss，让 Luna 等成本较低的模型担任 Worker，结合 Astra 的智能优势与 Worker 的成本优势，兼顾交付质量与额度使用效率。

> [!WARNING]
> boss 更适合边界清晰、可独立验收且工作量值得交接的常规实现、功能检查和重复任务。简单修改、开放式设计或复杂判断通常由 Boss 直接处理。
>
> 启用 boss 不代表一定会启动 Worker，也不保证节省额度，尤其是在简单任务或设计场景中；委派、执行和验收本身都会消耗额度。
>
> 实际模型可用性、路由和用量仍由当前环境决定，这种组合不保证固定的额度节省。

## 快速开始

**1. 安装** — 将下面这句话发给 Codex：

```text
Install the boss skill from https://github.com/chu-jiaming/boss
```

或选择以下任一手动方式：

<details>
<summary>从git安装</summary>

```sh
git clone https://github.com/chu-jiaming/boss.git
cd boss
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD/skills/boss" "$HOME/.agents/skills/boss"
```

</details>

<details>
<summary>从 Marketplace 安装插件</summary>

```sh
codex plugin marketplace add chu-jiaming/boss #添加 Marketplace 源
codex plugin add boss@chu-jiaming-skills #安装boss
codex plugin list #查看已安装插件
```

运行``codex plugin marketplace add chu-jiaming/boss
``成功后，也可以在 Codex 桌面 App 的 **Plugins → Personal** 中找到并选择安装 **boss**。

</details>

**2. 开始使用** — 在 Codex 中选好主模型，然后在新任务中输入：

```text
$boss，Worker 使用 gpt-5.6-luna，effort medium。
为项目中的日期工具函数补充单元测试，覆盖正常输入与边界情况，并运行测试。
```

模型组合只是示例，请使用当前环境支持的模型与 effort。

## 如何分工

| 执行方 | 负责的工作 |
| --- | --- |
| Boss | 需求理解、设计、架构、复杂调试、困难实现与最终验收 |
| Worker | 接口与行为已定、可独立验证且值得交接的常规实现、功能检查和重复批次 |
| 直接执行 | 小修改、一条现成命令，或已有工具即可高效完成的工作 |

默认一个 Worker 处理一个完整工作包，一次交付、一次汇总。仅真正独立的工作可同时使用两个 Worker，且受环境并发限制；不递归委派。小范围残余问题由 Boss 修复，未解决的设计问题由 Boss 接管。

## 调整 Worker

Worker 的模型和 effort 在当前会话中持续有效，后续无需重复调用 `$boss`。想调整时，直接告诉 Codex：

```text
Worker effort 改为 low，模型保持不变。
```

```text
Worker 切换为 gpt-5.6-terra。
```

```text
Worker 模型和 effort 恢复自动选择。
```

boss 不修改主模型或全局配置。启用或调整设置时，会显示 Boss、Worker 的模型与 effort，以及当前执行模式。

## 了解更多

目前仅支持 Codex。核心指令无额外运行依赖，可选的设置读取脚本需要 Node.js 20+。

[安装、更新与开发](docs/install.md) · [技能源码](skills/boss/SKILL.md) · [设计说明](docs/boss-design.md) · [反馈问题](https://github.com/chu-jiaming/boss/issues)

[MIT License](LICENSE) · © 2026 chu-jiaming
