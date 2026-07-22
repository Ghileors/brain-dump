## 1. Branch & dependency setup

- [ ] 1.1 Create branch `step2-core-capture-flow` from `dev` (per CLAUDE.md workflow rules)
- [ ] 1.2 Confirm with user and add `@anthropic-ai/sdk` dependency, explaining why it's needed
- [ ] 1.3 Add `ANTHROPIC_API_KEY` to local `.env.local` (git-ignored) and document it's required on Vercel

## 2. API route: AI parsing

- [ ] 2.1 Create `app/api/parse/route.ts` accepting POST with raw text
- [ ] 2.2 Reject empty/missing text with a non-2xx response before calling the Anthropic API
- [ ] 2.3 Call `claude-haiku-4-5` with forced tool-use (`record_tasks` tool) to get structured `{ tasks: [...] }` output
- [ ] 2.4 Add zod schema validating each candidate task (`title` non-empty, `priority` enum with `'medium'` default, `dueDate` ISO-or-null)
- [ ] 2.5 Drop invalid individual candidates without discarding the rest of the batch
- [ ] 2.6 Return a clear error response (no partial data) when the AI call fails, times out, or returns totally unparseable output
- [ ] 2.7 Verify `ANTHROPIC_API_KEY` is only read via `process.env` inside this route and never logged

## 3. Client capture flow

- [ ] 3.1 Add a capture form (textarea + submit) to the main page
- [ ] 3.2 Block submission of empty/whitespace-only text client-side
- [ ] 3.3 Show a loading state while the API request is in flight; disable the submit control
- [ ] 3.4 On success, assign `id` (`crypto.randomUUID()`), `status: 'inbox'`, `source: 'text'` to each returned candidate
- [ ] 3.5 Merge new tasks into the list from `loadTasks()` and persist via `saveTasks()`
- [ ] 3.6 Show an inline error state on API failure without modifying stored tasks
- [ ] 3.7 Show a "no tasks found" message when the response contains zero valid tasks

## 4. Inbox / Today board

- [ ] 4.1 Render Inbox list from tasks with `status: 'inbox'`, with empty-state message
- [ ] 4.2 Render Today list from tasks with `status: 'today'`, with empty-state message
- [ ] 4.3 Add a "Move to Today" action per Inbox item that sets `status: 'today'` and persists via `saveTasks()`
- [ ] 4.4 Verify moving a task updates both lists without a page reload

## 5. Verification

- [ ] 5.1 Manual end-to-end test: submit sample brain-dump text, confirm tasks appear in Inbox
- [ ] 5.2 Manual test: move a task to Today, confirm it appears in Today and disappears from Inbox
- [ ] 5.3 Manual test: submit text with no actionable tasks, confirm "no tasks found" message and no storage mutation
- [ ] 5.4 Manual test: temporarily break the API key/env to confirm error path doesn't corrupt stored tasks
- [ ] 5.5 Run `npx tsc --noEmit` and `npm run lint`
- [ ] 5.6 Push branch, open PR into `dev`, verify Vercel preview deploy works end-to-end
