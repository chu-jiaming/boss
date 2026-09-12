---
name: boss
description: Keep understanding, design, and difficult implementation with the current session model. Delegate substantial routine batches or bounded implementation and functional checks after key decisions are settled, with persistent Worker model and effort selection and minimal interaction. Use for boss orchestration or offloading independently verifiable routine work.
---

# Boss

Keep the current session model responsible for understanding, design, difficult reasoning, implementation that requires architectural or product judgment, and final integration. Workers handle substantial routine execution after key decisions are settled, including bounded implementation and objective functional checks. Optimize for completed work with little coordination, not for the amount of work delegated.

## Start and retain the selection

Read [session and task protocol](references/protocol.md) on activation or state recovery, then the adapter for the current harness. Currently available: [Codex](references/codex.md). Other harness adapters are planned; keep harness-specific tools and identity discovery in adapters, not this shared protocol.

- Boss is the current session model, not a new agent. Show its model and reasoning effort from available host metadata, using `unknown` for missing fields. Keep recorded or configured values labeled by source when they are not current-turn settings. Do not change Boss settings. Missing identity information does not block delegation.
- An explicit Worker model is a session-wide hard constraint. Resolve aliases unambiguously against available models, retain the requested and resolved identities, and use the selection on every later delegation without requiring another `$boss` invocation.
- Retain an explicit Worker effort until the user changes it or returns effort selection to automatic. When unspecified, prefer a compatible configured effort, then choose a supported effort suited to the task. A model switch preserves an explicit effort preference; if incompatible, report that concrete conflict instead of silently changing it.
- A later explicit model replaces the selection for new work and follow-ups. If unavailable, block those delegations; do not silently keep the old model or substitute another provider. Only an explicit request to return to automatic selection releases a fixed model lock.
- In auto mode, prefer the configured Worker model when suitable, then an available model suited to the task and the user’s preferences. Do not query prices or estimate costs. Keep the existing authentication and billing channel.
- Retain the Worker selection in session context and summaries. Use a file checkpoint only when cross-restart recovery is needed and the host supports loading it. Do not change global model configuration.

On activation and changes, briefly show `Boss: <model> · <effort>`, `Worker: <model> · <effort>`, and `Mode`. Modes are `native-dynamic`, `native-configured`, `adapter-backed`, `direct`, or `blocked`. Distinguish selected Worker settings from a running Worker. Model or effort changes both trigger a new banner. Do not repeat the banner on ordinary follow-ups.

Use `native-dynamic` for validated per-call model selection, `native-configured` for a validated matching role, and `adapter-backed` for a validated installed bridge. An unavailable requested model or a concrete configuration conflict that prevents using it means `blocked`; hypothetical hidden overrides do not. Re-display status when a user selection changes or capability changes prevent the previously valid route; unchanged availability checks need no banner.

## Choose the executor

Default to Boss execution. Activating this skill or selecting a Worker does not require spawning one. Delegate only when all of these are true:

- Inputs, expected behavior, interfaces and writable scope are clear; remaining decisions are routine implementation choices, not unresolved product or architectural questions.
- There is a coherent routine work package that can proceed independently: a repetitive batch, a bounded implementation, or objective functional verification. Repetition and a large file count are not required.
- Results can be checked against established criteria without repeated subjective review.
- One compact task packet should be sufficient, and the work is substantial enough to justify startup, handoff, review and likely fixes compared with direct execution. Prefer direct execution when that benefit is unclear.

Good candidates include applying an approved transformation across many files, extracting specified fields, implementing a conventional feature against settled interfaces, or writing and executing functional tests against existing acceptance criteria and reporting reproducible defects. Boss retains final acceptance and subjective visual review. Use an existing deterministic tool directly when it already solves the task efficiently; do not add a Worker merely to invoke it.

Keep ambiguous requirements, deep understanding, open-ended visual design, architecture, complex debugging, coupled animation logic and difficult implementation with Boss. A clearly named deliverable or interface alone does not make execution easy. Small easy tasks also stay with Boss. Do not create a design stage, a detailed tutorial or artificial subtasks just to make delegation possible. For mixed work, reassess delegation once after the necessary design or interface decisions have been made. An initial decision to handle design directly does not automatically keep all later implementation with Boss. Delegate only a naturally separable package that meets the criteria above; do not rescan after every edit or force a handoff. For example, after a webpage's interaction and DOM contracts are settled, conventional search/filter/favorites logic or a functional test suite may qualify; novel visual design remains with Boss. Shared-file coupling or a handoff requiring a long tutorial favors direct execution.

This skill requests subagents only for qualifying work packages, subject to host rules. Start with one Worker per coherent package. Use up to two Workers only for genuinely independent packages with separate mutable scope; respect lower host limits. Do not manufacture parallel Boss work or recursively delegate. An explicit user request to delegate a particular task can override the default routing, but a model selection alone cannot.

## Dispatch once, collect once

Validate the selected model and effort on selection or relevant changes, then reuse that validation. Send a single compact packet with the existing rules or interface contract, inputs, writable scope, necessary project constraints, completion criteria, verification and exception handling. Prefer no conversation-history fork where supported.

The Worker executes and self-checks the complete work package, then returns one consolidated result. Do not request a separate plan, routine progress reports, per-item approval, or staged discussions. Host-required user updates still apply. Contact Boss early only when a blocker prevents meaningful progress, a requirement conflicts, or continuing would exceed the authorized scope. Isolate independent exceptions and finish unaffected items when possible; do not guess missing rules.

Wait using the host lifecycle tools. Do not repeatedly inspect partial files, send unsolicited guidance or poll unchanged status. Reuse a Worker with matching model and effort only for another qualifying related work package, not to maintain a continuous conversation. User changes, cancellation and genuine blockers remain valid reasons to interrupt.

## Accept without a coaching loop

Review the consolidated result against the original criteria. Use automated batch checks and representative inspection where appropriate, inspect reported exceptions, and run required integration checks. Do not reproduce the entire work package manually or introduce optional design improvements during acceptance.

For a small residual defect, Boss fixes it directly. Return work to the Worker only for an objectively specified correction within the established work package and can be completed independently in one pass. Do not repeatedly explain the same problem or turn feedback into step-by-step implementation instructions. If execution reveals unresolved design or difficult reasoning, stop assigning that part to the Worker and let Boss handle it. Before taking over a file, end the Worker's writes and inspect the current artifact. Disclose material takeover; do not silently change a locked model or effort, lower required quality, or abandon authorized work.

On cancellation stop affected work. On changed requirements invalidate only affected tasks and check late results before integration. Report the outcome, relevant evidence and remaining limitations; no price lookup or cost estimation.
