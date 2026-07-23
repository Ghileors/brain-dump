## 1. Feature detection & state

- [ ] 1.1 Add a `speechSupported` check on mount
      (`'SpeechRecognition' in window || 'webkitSpeechRecognition' in window`).
- [ ] 1.2 Add `isListening` and `voiceError` state, and a `source` ref/state
      (`'text' | 'voice'`, default `'text'`) to track submission provenance.

## 2. Microphone button & recognition wiring

- [ ] 2.1 Render the microphone button next to the existing textarea, only when
      `speechSupported` is true.
- [ ] 2.2 On click, instantiate `SpeechRecognition`/`webkitSpeechRecognition` with
      `continuous: false`, `interimResults: true`, and start listening; set
      `isListening` true.
- [ ] 2.3 On `onresult`, write the interim/final transcript into the existing `text`
      state and set `source` to `'voice'`.
- [ ] 2.4 On `onend`, set `isListening` false.
- [ ] 2.5 On `onerror`, set a user-facing `voiceError` message, set `isListening`
      false, and ensure nothing is submitted.

## 3. Manual-edit provenance reset

- [ ] 3.1 In the textarea's existing `onChange` handler, reset `source` to `'text'`
      whenever the change did not originate from the recognition `onresult` handler
      (i.e. any direct user keystroke).

## 4. Submission tagging

- [ ] 4.1 In `handleSubmit`, tag newly created tasks with the current `source` value
      instead of the hardcoded `'text'`.
- [ ] 4.2 Reset `source` back to `'text'` after a successful submit, alongside the
      existing `setText("")`.

## 5. UI feedback

- [ ] 5.1 Show a listening indicator on the mic button while `isListening` is true
      (e.g. label/style change), reusing the existing loading-state visual pattern.
- [ ] 5.2 Render `voiceError` using the same inline error style already used for
      parse errors.

## 6. Verification

- [ ] 6.1 Manually test in a supported browser (Chrome/Edge): dictate text, verify it
      appears in the textarea, submit, and confirm the created task has
      `source: 'voice'` in `localStorage`.
- [ ] 6.2 Manually test editing a dictated transcript by typing before submit, and
      confirm the resulting task has `source: 'text'`.
- [ ] 6.3 Manually verify the mic button does not render (or app still works via
      typing) in a browser without Web Speech API support, or via feature-detection
      override.
- [ ] 6.4 Manually test denying microphone permission and confirm an error message
      appears and no request is sent.
