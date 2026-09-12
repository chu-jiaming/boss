<div align="center">

# boss

### 主模型负责判断，Worker 承担边界明确的常规工作

[English](README.en.md) · [安装指南](docs/install.md) · [技能源码](SKILL.md)

![Boss 与 Worker 分工](assets/boss-hero.png)

**Codex 支持 · 模型与 effort 可控 · MIT**

</div>

boss 是一个独立的 Codex 技能。当前会话模型负责理解需求、设计、困难实现与最终验收；当工作边界清晰、结果可独立验证，且值得付出交接开销时，将常规实现、功能检查或重复批次交给 Worker。

启用 boss 不保证启动子代理。小任务、开放式设计和难以拆开的工作仍由主模型直接完成。关键设计或接口确定后，会重新判断一次是否适合委派，不为了委派制造步骤。

## 快速开始

```sh
git clone https://github.com/chu-jiaming/boss.git
cd boss
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD" "$HOME/.agents/skills/boss"
```

已有同名安装时，先按[安装指南](docs/install.md)核对来源。然后在 Codex 中选择主模型，发送：

```text
$boss，Worker 使用 gpt-5.6-luna，effort medium。完成当前任务。
```

Worker 的模型和 effort 在会话中保持，后续无需重复调用 `$boss`。它们必须受当前环境支持；boss 不修改主模型或全局配置。Astra + Luna 只是示例组合。

## 如何分工

| 工作 | 执行方式 |
| --- | --- |
| 需求理解、开放式设计、架构、复杂调试 | Boss 直接处理 |
| 接口和行为已定的独立常规功能 | 满足交接收益条件时委派 |
| 按既定标准编写测试、执行检查并汇总缺陷 | 工作量足够时委派 |
| 规则明确的重复批次 | 可委派，也可直接使用已有工具 |
| 小修改、运行一条现成命令 | 直接执行 |
| 视觉判断、最终验收与交付整合 | Boss 负责 |

默认一个 Worker 处理一个完整工作包，一次交付、一次汇总。仅真正独立的工作可使用两个 Worker；不递归委派，不反复教学。小范围残余问题由 Boss 修复，设计问题由 Boss 接管。

## 设置与状态

```text
Worker effort 改为 low，模型保持不变。
Worker 切换为 gpt-5.6-terra。
Worker 模型和 effort 恢复自动选择。
```

首次启用或设置变化时展示 Boss、Worker 的模型与 effort，以及当前可用的执行模式。“已选择”不表示 Worker 已运行；缺失身份信息标记为 unknown，最近记录与当前轮证据分开标注。

## 安装、开发与边界

- 根目录 [SKILL.md](SKILL.md)、[agents/](agents/)、[references/](references/) 和会话辅助脚本是技能源码；不再使用 `skills/boss/` 源码层级。
- [plugins/boss/](plugins/boss/) 是可安装的生成插件包；其中的 `skills/boss/` 仅为插件运行格式。
- [安装指南](docs/install.md)说明独立技能、插件安装与更新；[设计文档](docs/boss-design.md)说明调度规则和验证范围。
- 当前支持 Codex，其他 harness 尚未提供适配。核心指令不依赖 Node；可选会话读取脚本需要 Node.js 20+。

```sh
node scripts/build-plugins.mjs
node scripts/build-plugins.mjs --check
node --test scripts/*.test.mjs
```

目前没有足以公布的额度节省结论。委派、执行和验收都会产生消耗，收益取决于任务与模型配置。实验暂缓，不随发布包提供未完成实验或原始运行记录。

[提交问题](https://github.com/chu-jiaming/boss/issues)时，请附模型与 effort、最小复现步骤和脱敏结果。

[MIT License](LICENSE) · © 2026 chu-jiaming
