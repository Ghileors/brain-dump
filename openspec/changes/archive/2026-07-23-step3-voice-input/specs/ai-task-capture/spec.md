## MODIFIED Requirements

### Requirement: Text capture input
The system SHALL provide a text input on the main page where the user can enter
free-form "brain dump" text and submit it for parsing, either by typing directly or by
dictating via the browser's native speech recognition (Web Speech API), when available.

#### Scenario: User submits non-empty text
- **WHEN** the user enters non-empty text and submits the capture form
- **THEN** the system sends the text to the parsing API and shows a loading state
  until a response arrives

#### Scenario: User submits empty text
- **WHEN** the user submits the capture form with empty or whitespace-only text
- **THEN** the system does not call the parsing API and no request is sent

#### Scenario: Speech recognition supported in browser
- **WHEN** the page loads in a browser that supports `SpeechRecognition` or
  `webkitSpeechRecognition`
- **THEN** a microphone button is shown next to the text input

#### Scenario: Speech recognition not supported in browser
- **WHEN** the page loads in a browser that supports neither `SpeechRecognition` nor
  `webkitSpeechRecognition`
- **THEN** the microphone button is not shown, and the text input remains fully usable
  by typing

#### Scenario: User dictates text
- **WHEN** the user activates the microphone button and speaks
- **THEN** the system shows a listening state and writes the recognized transcript into
  the same text input used for typed text, so it can be reviewed or edited before
  submission

#### Scenario: Speech recognition fails
- **WHEN** speech recognition ends with an error (e.g. microphone permission denied, no
  speech detected, or a network error)
- **THEN** the system shows a user-facing error message, returns to the idle (not
  listening) state, and does not submit anything to the parsing API

### Requirement: Parsed tasks land in Inbox
Validated candidate tasks SHALL be assigned an `id`, `status: 'inbox'`, and a `source`
of `'text'` or `'voice'` reflecting which input method produced the submitted text, then
appended to the persisted task list.

#### Scenario: Successful parse appends to Inbox
- **WHEN** the API route returns one or more validated candidate tasks for a
  submitted text
- **THEN** each candidate is added to the client's task list with
  `status: 'inbox'`, and the updated list is persisted via `saveTasks`

#### Scenario: No tasks found in submitted text
- **WHEN** the AI response contains zero valid candidate tasks after validation
- **THEN** the system shows the user a message indicating no tasks were found and
  does not modify the stored task list

#### Scenario: Submitted text was typed
- **WHEN** the submitted text was entered by typing (no dictation occurred, or the
  dictated text was subsequently edited by typing)
- **THEN** the resulting tasks are tagged `source: 'text'`

#### Scenario: Submitted text was dictated
- **WHEN** the submitted text is the transcript produced by speech recognition and was
  not edited by typing afterward
- **THEN** the resulting tasks are tagged `source: 'voice'`
