# Session and task protocol

## Persistent selection

Persist policy, not a permanently running Worker. Maintain this compact record in host session state or its durable summary:

```yaml
boss_enabled: true
session_id: trusted-host-session-id
selection_mode: fixed
requested_model: gpt-5.6-luna
resolved_model_id: gpt-5.6-luna
provider: unknown
selection_revision: 1
model_assurance: configuration-verified
```

The values above are an example. Store actual identities, not example IDs. Also retain explicit effort preferences, concurrency changes, unfinished task IDs, acceptance criteria, artifact references, and correction counts when relevant. In `auto`, preserve the selection policy; record each task's resolved model separately rather than pretending auto locks one model.

Keep the record in the host's persisted session context whenever possible. If the host exposes a trusted stable session ID and a writable session-state directory, save a small JSON checkpoint there, with a filename scoped to that ID, and retain its absolute location in the session summary. Use the host's file tools; do not create a Python dependency merely to serialize state. Do not scan arbitrary transcripts or other sessions for a plausible selection, store secrets, or edit global configuration. An optional local checkpoint must not overwrite another session's record.

On resume, use the same session's record and revalidate affected capabilities. A separate session starts independently. A fork may contain a snapshot of the parent's choice, but must not share a mutable state record; confirm inherited choice from its available context and bind any subsequent state to the new session ID.

If the host cannot durably retain instructions or automatically reload the checkpoint, mark resume persistence as unsupported. Conversation memory alone is not a guaranteed restart hook. When selection is lost, ask for the missing choice before delegation. Never claim this Markdown skill can force a host to load itself after restart.

## Switching

A new explicit model immediately becomes the requested target and increments `selection_revision`, even when validation fails. Pending and new delegations then block until that target is usable or the user changes it. Do not revert to the previous model.

By default let already running tasks finish under their recorded model and revision, and briefly disclose this on switching. Do not send them further work or corrections. A new Worker receives the minimum needed continuation facts. If the user requests an immediate switch of all work, stop old Workers first, inspect partial changes and completed side effects, and send only remaining work to the new model. Do not duplicate mutations.

Changing the Worker does not change the Boss. Availability changes trigger validation, not automatic release of a fixed lock. User changes in a message apply before scheduling that message’s task.

## Minimal task packet

Use short prose or structured data, whichever is smaller without losing necessary context:

```yaml
task_id: parser-empty-input
selection_revision: 1
objective: Make empty input return an empty result.
facts_and_decisions:
  - The public signature must remain unchanged.
inputs: [src/parser.ts, tests/parser.test.ts]
writable_scope: [src/parser.ts, tests/parser.test.ts]
constraints:
  - No new dependencies or unrelated refactoring.
  - Apply relevant repository instructions and current authorization.
  - Do not delegate; report ambiguity to Boss.
acceptance:
  - Empty input returns an empty result.
  - Existing nonempty behavior remains valid.
verification: Run the existing parser test command discovered in the project.
return: Status, concise change summary, file locations, actual checks and unresolved issues.
```

Replace example facts and paths with verified task inputs. Resolve applicable local instructions through the host or direct references. A roughly 1,000-token packet is a soft initial target, not a reason to omit constraints. No-history startup still includes host instructions and tool definitions; never call that zero-context or zero-cost.

## Result and evidence

Request `done`, `partial`, `blocked`, or `failed`, plus concise findings, artifact references, actual command and exit status when relevant, source links for research, and unresolved issues. Store long logs only when needed and return their location with the decisive excerpt. Do not ask for a full transcript or hidden reasoning.

Model assurance comes from the host, not Worker prose: `runtime-reported`, `configuration-verified`, or `unverified`. Validate known effective configuration and precedence before using a fixed model. If an unresolved override can change it, block. If the host accepts an unambiguous explicit configuration but offers no backend receipt, report configuration verification rather than falsely asserting backend identity.

Only the Boss marks overall completion after acceptance. An older selection revision alone does not invalidate a task legitimately started before a switch; changed requirements or conflicting artifact state can invalidate it.
