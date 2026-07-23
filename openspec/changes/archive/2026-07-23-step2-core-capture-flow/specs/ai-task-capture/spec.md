## ADDED Requirements

### Requirement: Text capture input
The system SHALL provide a text input on the main page where the user can enter
free-form "brain dump" text and submit it for parsing.

#### Scenario: User submits non-empty text
- **WHEN** the user enters non-empty text and submits the capture form
- **THEN** the system sends the text to the parsing API and shows a loading state
  until a response arrives

#### Scenario: User submits empty text
- **WHEN** the user submits the capture form with empty or whitespace-only text
- **THEN** the system does not call the parsing API and no request is sent

### Requirement: Server-side AI parsing endpoint
The system SHALL expose a server-side API route that accepts raw text and returns
a list of candidate tasks derived from that text using the Anthropic API. The
`ANTHROPIC_API_KEY` SHALL be read only via `process.env` inside this route and
SHALL NOT be exposed to client code or logged.

#### Scenario: Route parses text into candidate tasks
- **WHEN** the API route receives a POST request with non-empty text
- **THEN** it calls `claude-haiku-4-5` and returns a JSON list of candidate tasks
  with `title`, `priority`, and `dueDate` fields

#### Scenario: Route rejects missing or empty text
- **WHEN** the API route receives a request with missing or empty text
- **THEN** it returns a non-2xx error response and does not call the Anthropic API

### Requirement: AI output validation before use
The system SHALL validate every candidate task returned by the AI against the
`Task` field constraints before it is merged into Inbox. Invalid individual
candidates SHALL be dropped without discarding the rest of the batch.

#### Scenario: Candidate missing a title
- **WHEN** a candidate task from the AI response has an empty or missing `title`
- **THEN** that candidate is dropped and the remaining valid candidates are still
  returned

#### Scenario: Candidate has unrecognized priority
- **WHEN** a candidate task has a `priority` value outside `'low' | 'medium' | 'high'`
  or missing
- **THEN** the system defaults that candidate's `priority` to `'medium'`

#### Scenario: Candidate has invalid dueDate
- **WHEN** a candidate task has a `dueDate` that is not a valid ISO date string
- **THEN** the system sets that candidate's `dueDate` to `null` rather than
  rejecting the candidate

#### Scenario: AI call fails or returns unparseable output
- **WHEN** the Anthropic API call fails, times out, or returns output that cannot
  be parsed into the expected schema at all
- **THEN** the API route returns an error response and no tasks are added to Inbox

### Requirement: Parsed tasks land in Inbox
Validated candidate tasks SHALL be assigned an `id`, `status: 'inbox'`, and
`source: 'text'`, then appended to the persisted task list.

#### Scenario: Successful parse appends to Inbox
- **WHEN** the API route returns one or more validated candidate tasks for a
  submitted text
- **THEN** each candidate is added to the client's task list with
  `status: 'inbox'` and `source: 'text'`, and the updated list is persisted via
  `saveTasks`

#### Scenario: No tasks found in submitted text
- **WHEN** the AI response contains zero valid candidate tasks after validation
- **THEN** the system shows the user a message indicating no tasks were found and
  does not modify the stored task list
