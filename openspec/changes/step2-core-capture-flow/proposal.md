## Why

Step 1 delivered infra, deploy, and the task domain model, but the app has no working
scenario yet — `page.tsx` is a static placeholder. Step 2 must deliver the single
mandatory end-to-end flow from the project spec: brain dump → AI parse → Inbox → Today.
Without this, there is no working product to iterate the UI/voice/polish steps on top of.

## What Changes

- Add a text capture UI on the main page: a textarea + submit button where the user
  dumps unstructured text.
- Add a server-side API route (`app/api/parse/route.ts`) that sends the raw text to
  `claude-haiku-4-5` via the Anthropic API and asks it to return a structured list of
  tasks (title, priority, dueDate).
- Validate and sanitize the AI response against the `Task` shape before it ever reaches
  client state or storage — malformed or partial AI output must not corrupt the Inbox.
- Parsed tasks are appended to Inbox (`status: 'inbox'`) and persisted via the existing
  `lib/storage.ts` (localStorage).
- Render an Inbox list on the page showing captured tasks.
- Render a Today list, with a user action to move a task from Inbox to Today
  (`status` changes from `'inbox'` to `'today'`), per the existing task-domain spec
  scenario.
- `ANTHROPIC_API_KEY` is read only via `process.env` inside the API route (server-side),
  never exposed to the client, never logged.

Out of scope for this step (deferred to later roadmap steps): voice input (Step 3),
visual polish / mobile-first layout (Step 4), marking tasks done, editing/deleting
tasks, scheduledTime editing UI.

## Capabilities

### New Capabilities
- `ai-task-capture`: text capture UI and the server-side API route that turns raw
  brain-dump text into validated `Task[]` using the Anthropic API, appending results
  to Inbox.
- `inbox-today-board`: UI for listing Inbox and Today tasks and moving a task from
  Inbox to Today.

### Modified Capabilities
(none — `task-domain` data model already covers the `Task`/Inbox/Today shapes and
transitions needed here; no field or status changes required.)

## Impact

- New files: `app/api/parse/route.ts`, capture/list UI components under `app/` or
  `components/`.
- Modified files: `app/page.tsx` (wire up capture form + Inbox/Today lists using
  `lib/storage.ts` and `lib/types.ts`).
- New dependency: Anthropic SDK (`@anthropic-ai/sdk`) — to be confirmed with the user
  before adding, per project security rules.
- New env var required: `ANTHROPIC_API_KEY` (Vercel + local `.env.local`, never
  committed).
- No changes to `openspec/specs/task-domain/spec.md`.
