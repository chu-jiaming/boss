# 安装与开发 / Installation and development

[中文首页](../README.md) · [English](../README.en.md)

## 独立技能 / Standalone skill

```sh
git clone https://github.com/chu-jiaming/boss.git
cd boss
mkdir -p "$HOME/.agents/skills"
ln -s "$PWD" "$HOME/.agents/skills/boss"
```

仓库根目录即技能目录。链接命令不会覆盖已有安装；升级旧版时先用 `ls -l` 检查已有路径，只替换确认属于旧 boss 仓库的符号链接。不要把真实目录当作链接删除。独立技能和插件二选一，避免重复发现。

The repository root is the skill directory. The symlink command does not overwrite existing installations. Inspect an old installation first; replace only a verified boss symlink, never delete a real directory as if it were a link. Choose either the standalone skill or the plugin.

链接安装在仓库根目录执行 `git pull --ff-only` 即可更新。项目级复制安装可复制生成的 `plugins/boss/skills/boss/` 到项目 `.agents/skills/boss/`。更新后在新任务中使用 `$boss`，必要时重启应用。

Update symlink installations with `git pull --ff-only`. For a project-local copy, copy the generated `plugins/boss/skills/boss/` directory into `.agents/skills/boss/`. Use a fresh task after updating; restart the app if needed.

## 插件 / Plugin

```sh
codex plugin marketplace add chu-jiaming/boss
```

在来源 **Chu Jiaming Skills** 中安装 **boss**。为兼容已有安装，marketplace 标识仍为 `chu-jiaming-skills`；这只是来源标识，GitHub 仓库现在是独立的 boss。该来源不代表已被官方公共目录收录。

Install **boss** from **Chu Jiaming Skills**. The marketplace ID remains `chu-jiaming-skills` for compatibility with existing installations; the GitHub repository is now boss. This repository source is not a claim of official directory listing.

```sh
codex plugin marketplace upgrade chu-jiaming-skills
```

刷新后在应用中更新插件。安装副本有缓存，源码变更不会自动更新安装副本。本地开发可使用 `codex plugin marketplace add .`；用 `codex plugin marketplace list` 检查来源，避免同时注册相同标识的本地和 GitHub 来源。

After refreshing, update the plugin in the app. Installed copies are cached. Local development can use `codex plugin marketplace add .`; inspect sources with `codex plugin marketplace list` and avoid registering both sources under the same ID.

## 运行依赖 / Runtime

核心指令无额外运行依赖。可选身份读取脚本需要 Node.js 20+：

The core skill needs no additional runtime. The optional settings helper needs Node.js 20+:

```sh
node scripts/codex-session-settings.mjs --session-id <session-id>
```

环境提供 `CODEX_THREAD_ID` 时可省略参数。`latest-recorded` 表示最近记录；只有可信的当前 `--turn-id` 与记录匹配时才标记 `current-turn`。脚本不输出对话正文，不解析全局配置；未知字段为 null，读取失败不阻塞正常委派。

Omit the argument when `CODEX_THREAD_ID` is supplied. `latest-recorded` identifies recorded settings; only a trusted matching current `--turn-id` yields `current-turn`. The helper emits no conversation text, does not parse global configuration and reports unknown fields as null.

## 开发 / Development

根目录 `SKILL.md`、`agents/`、`references/` 和 `scripts/codex-session-settings.mjs` 是唯一运行源码。`scripts/` 中其他文件用于构建和测试，不随插件打包；`plugins/boss/skills/` 为生成副本，不手工修改。

Root skill files and the session helper are the runtime source. Other scripts are development tools and are excluded from the plugin. Do not edit generated `plugins/boss/skills/` by hand.

```sh
node scripts/build-plugins.mjs
node scripts/build-plugins.mjs --check
node --test scripts/*.test.mjs
```

发布时更新清单版本，构建并验证后一起提交源码和插件副本。实验草稿仅在本地 `.local/archive/` 保留，该目录被 Git 忽略，不属于发布内容。

For publication, bump the manifest version, rebuild, validate and commit both source and package. Paused experiment drafts stay in the ignored local `.local/archive/` directory.
