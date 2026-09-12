# Session and task protocol

## Persistent selection

Persist policy, not a permanently running Worker. Maintain this compact record in host session state or its durable summary:

```yaml
boss_enabled: true
selection_mode: fixed
requested_model: gpt-5.6-luna
resolved_model_id: gpt-5.6-luna
effort_mode: fixed
requested_effort: medium
resolved_effort: medium
selection_revision: 1
```

The values above are an example. Model selection and effort selection may independently be fixed or automatic; returning one to automatic does not release the other. Store actual identities, not example IDs. Also retain explicit effort preferences, concurrency changes, unfinished task IDs, acceptance criteria, artifact references, and relevant failure history when relevant. In `auto`, preserve the selection policy; record each task's resolved model separately rather than pretending auto locks one model.

Keep the selection in session context and durable summaries. Use a separate file only when cross-restart recovery is needed and the host provides a stable session ID and a way to reload it. Scope such files to the session; forks must not share mutable records. Do not create a dependency merely to serialize this small record.

On resume, recover the choice from the available session context. Revalidate only changed capabilities. If a previously fixed selection is genuinely lost, ask for that choice before delegating; in auto mode continue the saved policy. Explain restart limitations when recovery is relevant, rather than on every activation.

## Switching

A new explicit model or effort immediately becomes the requested target and increments `selection_revision`, even when validation fails. Pending and new delegations then block until the resulting model/effort combination is usable or the user changes it. Do not revert to the previous model.

By default let already running tasks finish under their recorded model, effort and revision, and briefly disclose this on switching. Do not send them further work or corrections. A new Worker receives the minimum needed continuation facts. If the user requests an immediate switch of all work, stop old Workers first, inspect partial changes and completed side effects, and send only remaining work to the new model. Do not duplicate mutations.

Changing Worker model or effort does not change Boss settings. Reuse requires both settings to match; if follow-up cannot change effort, start a new Worker for the remaining related work. Availability changes trigger validation, not automatic release of a fixed lock. User changes in a message apply before scheduling that message’s task.

## Settings display

On activation and settings changes, show model and effort together:

```text
Boss: gpt-6-astra · low
Worker: gpt-5.6-luna · medium (selected)
Mode: native-dynamic
```

This is an example, not identity evidence. Keep missing fields as `unknown`. Qualify the Boss line as `latest recorded` or `configured default` when appropriate; do not present those sources as current-turn metadata. Worker selection reflects the requested spawn settings, not a backend receipt. Do not repeat the banner on ordinary follow-ups. Adapters discover settings; the shared protocol only retains and displays them.

## Work package

Use concise prose or a small structured packet. Include enough to execute without a planning exchange. Example only; replace paths and rules with actual task inputs:

```yaml
task_id: normalize-catalog-links
selection_revision: 1
objective: Apply the approved documentation URL replacement to the listed files.
inputs: docs/catalog/*.md
rule: Replace the exact URL https://example.org/v1/guide with https://example.org/v2/guide.
writable_scope: docs/catalog/*.md
constraints:
  - Preserve all other content and apply the referenced project instructions.
  - Do not delegate or add unrelated improvements.
verification: Check the target files for the old URL and inspect the diff for unrelated changes.
exceptions: Report unreadable files; finish independent files without inventing replacements.
return: One summary of changed files, checks actually run, and exceptions.
```

Do not require every task to use YAML or fill empty fields. Reference existing instructions and examples instead of copying large documents. The Worker should not request approval of its plan or report after each item. Return a consolidated result at completion; surface a blocker early only when necessary. No-history startup still includes host instructions and tools.

## Result and evidence

Request one consolidated result: completed scope, necessary verification evidence, and exceptions or unresolved issues. Include artifact references, commands and exit status, or research sources when relevant. Preserve failures and distinguish checks run from checks proposed; use log references instead of long transcripts.

Use the host tool contract and any applicable known role configuration to select the requested model. Investigate concrete conflicts or failures; absence of a backend model receipt alone is not a blocker. Do not treat Worker prose as independent proof of backend identity. Describe verification limits only when relevant.

Only the Boss marks overall completion after acceptance. An older selection revision alone does not invalidate a task legitimately started before a switch; changed requirements or conflicting artifact state can invalidate it.
