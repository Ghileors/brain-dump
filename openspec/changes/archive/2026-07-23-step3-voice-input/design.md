## Context

The capture form (`app/page.tsx`) currently has one input path: a controlled
`<textarea>` bound to `text` state, submitted to `/api/parse`, with results tagged
`source: 'text'`. `lib/types.ts` already defines `TaskSource = 'text' | 'voice'`, so the
data model needs no change — only a new way to populate `text` and a new value for the
tag written to `Task.source`.

The Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) is unevenly
supported (present in Chrome/Edge/Safari via the `webkit` prefix, absent in Firefox as
of this writing) and is inherently a client-only, stateful, event-driven API — it does
not fit the existing `fetch`-based request/response shape of the rest of the app.

## Goals / Non-Goals

**Goals:**
- Let the user dictate the brain dump instead of typing it, using the same textarea and
  the same submit path.
- Correctly tag tasks originating from a voice capture with `source: 'voice'`.
- Degrade gracefully (hidden mic button, no errors) on browsers without support.

**Non-Goals:**
- No new API route or server-side change — recognition happens entirely client-side.
- No streaming/continuous dictation across multiple utterances.
- No language picker; use the browser's default recognition locale.
- No visual/mobile-first redesign (Step 4).

## Decisions

- **Use the native Web Speech API directly, no wrapper library.** Alternatives
  considered: a third-party polyfill/wrapper (e.g. `react-speech-recognition`). Rejected
  per project conventions (`ANTHROPIC_API_KEY`-style minimalism, "перед додаванням нової
  npm-залежності — сообщить пользователю") — a native browser API needs no dependency,
  and the surface used here (start/stop, `onresult`, `onerror`) is small enough to wire
  directly.
- **Transcribed text flows into the existing `text` state, not a separate state.** This
  keeps one submit path (`handleSubmit` → `/api/parse`) instead of forking the pipeline
  by input method, and lets the user visually review/edit dictated text before
  submitting, same as typed text.
- **Track input provenance with a `source` ref/state (`'text' | 'voice'`), defaulted to
  `'text'` and set to `'voice'` only by the recognition `onresult` handler.** Any manual
  edit to the textarea (`onChange` from typing) resets it back to `'text'`, since manual
  edits after dictation mean the user is now composing/correcting by hand. This is a
  simple last-writer-wins heuristic, not perfect provenance tracking, but matches the
  step's scope (tag which method produced the submitted text, not track mixed edits
  precisely).
- **Feature-detect once on mount** (`'SpeechRecognition' in window ||
  'webkitSpeechRecognition' in window`) and hide the mic button entirely when
  unsupported, rather than showing a disabled button with a tooltip. Keeps the fallback
  path simplest and avoids dead UI.
- **Single-utterance capture (`continuous: false`, `interimResults: true`).** Interim
  results update the textarea live so the user sees transcription as they speak;
  recognition ends automatically on a pause, matching the "one brain dump, then submit"
  flow already established by the text path.

## Risks / Trade-offs

- [Browser support gap — no Web Speech API in Firefox] → Mitigated by feature detection
  and silent fallback to text-only; this is acceptable for MVP per the project's
  "працює, потім красиво" convention.
- [Microphone permission denial or no-speech/network errors mid-recognition] → Surface a
  short inline error message (reusing the existing error-message pattern already in
  `page.tsx`) and return the button to idle state; nothing is submitted.
- [`source` heuristic is coarse — editing one word of a dictated transcript flips the
  whole submission to `'text'`] → Accepted trade-off for this step; precise mixed-source
  tracking is not required by the proposal or the task-domain spec.

