## Context

`app/page.tsx` currently renders only a static title (Step 1). `lib/types.ts` and
`lib/storage.ts` already define the `Task` shape and a localStorage-backed
load/save pair (client-only, no-op on the server). `openspec/specs/task-domain/spec.md`
is the source of truth for the `Task`/Inbox/Today model and is not changing.

This step wires the first real, working scenario end-to-end: a user pastes free text,
an API route sends it to Claude for parsing, the client validates and merges the
result into Inbox, and the user can promote a task into Today.

## Goals / Non-Goals

**Goals:**
- One working round trip: textarea submit → `/api/parse` → Claude → validated
  `Task[]` → Inbox → Today.
- AI output is never trusted as-is; it is schema-validated before it touches
  client state or storage.
- `ANTHROPIC_API_KEY` only ever read server-side inside the API route.

**Non-Goals:**
- Voice input (Step 3).
- Visual polish / mobile-first layout (Step 4).
- Editing, deleting, or marking tasks done.
- Any persistence beyond localStorage (no backend DB in this step).
- Multi-device sync.

## Decisions

- **Model & call shape**: `app/api/parse/route.ts` (Node runtime) calls
  `claude-haiku-4-5` using Anthropic's tool-use (forced tool choice) with a JSON
  schema tool `record_tasks` accepting `{ tasks: { title, priority, dueDate }[] }`.
  Forcing tool use is more reliable than parsing free-form text out of a completion,
  and keeps the shape close to `Task` from the start.
  - Alternative considered: plain text completion + manual JSON.parse — rejected,
    higher chance of malformed/wrapped output.

- **Validation boundary**: the API route validates the tool-call output against a
  zod schema (`title: string, min 1`; `priority: enum('low','medium','high')`
  defaulting to `'medium'` when absent/unrecognized; `dueDate: string | null`,
  must be ISO date or null) before returning JSON to the client. Any task that
  fails validation is dropped, not the whole batch — one bad item shouldn't
  discard everything else the user dumped.
  - Alternative considered: validate client-side only — rejected, violates the
    project rule that AI output must be validated before it's trusted, and keeps
    the untrusted boundary as close to the AI call as possible.

- **ID / status / source assignment happens client-side**: the API route returns
  parsed candidates without `id`/`status`/`source`. The client assigns
  `id: crypto.randomUUID()`, `status: 'inbox'`, `source: 'text'` and appends to
  the array from `loadTasks()`, then calls `saveTasks()`. This keeps the API route
  stateless and localStorage as the single persistence mechanism, matching the
  MVP convention ("works first, pretty later").

- **UI shape**: `app/page.tsx` becomes a client component (or composes small client
  components) holding `tasks` state initialized from `loadTasks()`. Two derived
  lists render from that one array: Inbox (`status === 'inbox'`) and Today
  (`status === 'today'`). A "Move to Today" action per Inbox item flips `status`
  and persists. No separate route/page per list in this step — keeps the vertical
  slice minimal.

- **Error handling**: network/API/validation failures return a non-2xx JSON error
  from the route; the client shows an inline error state and does not touch
  storage. No partial/garbage tasks are ever written.

## Risks / Trade-offs

- [Claude returns zero valid tasks for ambiguous input] → surface an explicit
  "couldn't find any tasks in that" message rather than silently doing nothing.
- [Haiku call latency blocks perceived responsiveness] → disable submit + show a
  loading state while the request is in flight; no optimistic task insertion
  before validation.
- [localStorage is the only persistence] → acceptable for MVP per project.md;
  data loss on cache clear / different device is a known, accepted limitation.
- [New dependency: `@anthropic-ai/sdk`] → confirm with user before adding, per
  CLAUDE.md rule on new npm dependencies.

## Migration Plan

No data migration needed (no existing persisted tasks in production). Ship behind
the normal `step2-core-capture-flow` branch → `dev` → `master` flow from
CLAUDE.md workflow rules. Rollback is a revert of the merge commit; localStorage
schema is unchanged from Step 1's `Task` type, so no client-side migration needed
either way.

## Open Questions

- Should `record_tasks` also let Claude propose `scheduledTime` directly into
  Today, or should everything land in Inbox first regardless of AI confidence?
  Current decision: everything lands in Inbox first (matches task-domain spec's
  "AI не визначив пріоритет" scenario intent of always routing through Inbox).
