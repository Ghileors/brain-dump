## Why

Steps 1-2 delivered the core text-based brain dump flow (capture → AI parse → Inbox →
Today). The project spec (`openspec/project.md`) requires voice as an equally first-class
input method ("голосом або текстом"), and `Task.source` already models `'voice'` as a
valid origin (`lib/types.ts`) — it is just never produced yet. Step 3 closes that gap by
adding speech-to-text capture that feeds the exact same parse pipeline, without
introducing a second, divergent flow.

## What Changes

- Add a microphone button next to the existing text capture form on the main page that
  starts/stops speech recognition via the browser's native Web Speech API
  (`SpeechRecognition` / `webkitSpeechRecognition`).
- While recording, show a visible "listening" state; interim/final transcribed text is
  written into the same textarea the text flow already uses, so the user can review or
  edit it before submitting.
- Submitting a voice-transcribed capture reuses the existing `/api/parse` route
  unchanged — no new API route, no server-side changes. The only difference is the
  captured tasks are tagged `source: 'voice'` instead of `'text'` on the client before
  being appended to Inbox.
- Handle the case where the browser does not support the Web Speech API: hide/disable
  the microphone button and fall back silently to text-only capture (no broken button,
  no crash).
- Handle recognition errors (permission denied, no speech detected, network error) by
  surfacing a user-facing message and returning to the idle state, without submitting
  anything.

Out of scope for this step (deferred to later roadmap steps): mobile-first visual
polish (Step 4), continuous/hands-free dictation, editing tasks after capture, non-English
language selection UI (use the browser's default recognition language).

## Capabilities

### New Capabilities
(none — voice capture is a client-side input method for the existing capture flow, not a
new capability boundary)

### Modified Capabilities
- `ai-task-capture`: the "Text capture input" requirement is extended so the capture
  form accepts input from either typing or voice transcription, and the "Parsed tasks
  land in Inbox" requirement is extended so the `source` tag reflects which input method
  produced the text (`'text'` vs `'voice'`).

## Impact

- Modified files: `app/page.tsx` (add microphone button, `SpeechRecognition` wiring,
  listening/error state, `source` tagging on submit).
- No new files, no new API routes, no changes to `app/api/parse/route.ts`.
- No new dependency — Web Speech API is a native browser API (per project tech stack:
  "Web Speech API (нативний, безкоштовний)").
- No changes to `lib/types.ts` (`TaskSource` already includes `'voice'`) or
  `lib/storage.ts`.
- Browser support caveat: Web Speech API is not supported in all browsers (e.g. no
  support in Firefox as of this writing); feature-detection and graceful fallback are
  required, not optional.
