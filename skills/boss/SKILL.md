---
name: boss
description: Coordinate bounded subagent work with the current session model as Boss, a session-persistent user-selected or low-cost Worker model, minimal delegation context, and evidence-based acceptance. Use when the user asks for boss orchestration, cheaper workers, or retaining and switching a worker model across follow-ups.
---

# Boss

Keep the current session model responsible for intent, constraints, acceptance criteria, dependencies, decisions, and final integration. Delegate substantial, well-bounded execution to Workers. Do not delegate interpretation of the entire request.

## Start and retain the selection

Read [session and task protocol](references/protocol.md) on activation or state recovery. Read only the applicable adapter: [Codex](references/codex.md), [Claude Code](references/claude-code.md), [OpenCode](references/opencode.md), or [pi](references/pi.md). For another host, inspect its actual tools and apply the protocol only where supported. Never invent tool parameters.

- Boss is the current session model, not a new agent. Report its model ID only from trusted effective session metadata; otherwise use `current-session (model-id unavailable)`.
- An explicit Worker model is a session-wide hard constraint. Resolve aliases unambiguously against available models, retain the requested and resolved identities, and use the selection on every later delegation without requiring another `$boss` invocation.
- A later explicit model replaces the selection for new work and follow-ups. If unavailable, block those delegations; do not silently keep the old model or substitute another provider. Only an explicit request to return to automatic selection releases a fixed model lock.
- In auto mode, choose an available model suited to the leaf task using official token prices and expected total work. A known low-cost preference may be reused; unknown prices are not zero. See [cost accounting](references/cost.md) when choosing or measuring cost. Do not introduce a new billing channel.
- Persist the small selection checkpoint using the protocol. Compaction or resume is not permission to reset it. Do not change global model configuration.

On activation and changes, briefly show `Boss`, `Worker`, and `Mode`. Modes are `native-dynamic`, `native-configured`, `adapter-backed`, `direct`, or `blocked`. Distinguish a selected model from an already running Worker. Report unavailable identity or unsupported persistence honestly. Do not repeat the banner on ordinary follow-ups.

Use `native-dynamic` for validated per-call model selection, `native-configured` for a validated matching role, and `adapter-backed` for a validated installed bridge. Unresolved overrides or an unavailable requested model mean `blocked`. Re-display status when a user selection changes or capability changes prevent the previously valid route; unchanged availability checks need no banner.

## Decide and delegate

This skill requests subagent delegation for useful bounded execution, subject to the host's higher-priority delegation rules. Favor Workers for substantial search, targeted reading, implementation against a decided interface, tests, and homogeneous batch changes. Boss reads only enough material to set direction, then reviews decisive evidence rather than duplicating the Worker’s exploration.

Before spawning, ask whether execution savings exceed startup, communication, review, and likely rework. Handle tiny tasks directly unless the user requires delegation. Split by independently verifiable deliverable, not by tool call. Batch related small work sharing inputs.

Use at most two concurrent Workers initially, respecting lower host limits and explicit user preferences. Parallelize only independent work; serialize shared-file writes and shared mutable tools unless genuinely isolated. If the host requires useful parallel Boss work, satisfy that condition or work directly; do not invent busywork. Workers must not recursively delegate.

For each task:

1. Boss defines the objective, relevant facts and decisions, permitted changes, acceptance criteria, verification, and dependencies.
2. Verify the effective Worker model choice, including role overrides, and supported reasoning effort. Prefer supported low/medium effort for bounded work; do not blindly inherit expensive Boss effort. Respect explicit effort choices.
3. Start with no conversation-history fork where supported. Send a minimal task packet, not the original conversation or the entire project plan. Preserve necessary project instructions and authorization. Use relevant file/source references instead of large dumps.
4. Use the platform’s native lifecycle tools to wait, steer, cancel, and collect results. Avoid repeated status polling and redundant parallel execution of the same work.

## Accept and integrate

Require `status`, a short result, artifact locations, verification evidence, and unresolved issues. Evidence must distinguish checks actually run from proposed checks. Do not request hidden reasoning or long transcripts; preserve failures and uncertainty even when compressing.

Boss checks acceptance criteria and critical changes, then resolves ambiguities and integrates. Verify missing evidence selectively; run needed integration checks after combining changes. Do not repeat valid checks without a changed condition.

Allow one focused correction after a failed acceptance check. Continue the same Worker only if its model still matches the active selection. After another failure, reassess the split, handle a small critical issue directly, or request missing input. Never silently upgrade a locked Worker. Do not abandon authorized work merely because the correction limit was reached.

On cancellation stop affected work. On changed requirements invalidate only affected tasks; check task revision and artifact state before accepting late results. Report the outcome, relevant evidence, and remaining limitations. Show cost only when useful or requested, with measured versus estimated labeling.
