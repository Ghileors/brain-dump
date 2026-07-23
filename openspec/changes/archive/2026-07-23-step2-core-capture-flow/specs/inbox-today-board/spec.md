## ADDED Requirements

### Requirement: Inbox list rendering
The system SHALL display all tasks with `status: 'inbox'` in an Inbox list on the
main page.

#### Scenario: Inbox has tasks
- **WHEN** the persisted task list contains one or more tasks with
  `status: 'inbox'`
- **THEN** the main page renders each of them in the Inbox list, showing at least
  the task's `title` and `priority`

#### Scenario: Inbox is empty
- **WHEN** the persisted task list contains no tasks with `status: 'inbox'`
- **THEN** the main page renders an empty-state message for the Inbox list

### Requirement: Today list rendering
The system SHALL display all tasks with `status: 'today'` in a Today list on the
main page.

#### Scenario: Today has tasks
- **WHEN** the persisted task list contains one or more tasks with
  `status: 'today'`
- **THEN** the main page renders each of them in the Today list, showing at least
  the task's `title` and `priority`

#### Scenario: Today is empty
- **WHEN** the persisted task list contains no tasks with `status: 'today'`
- **THEN** the main page renders an empty-state message for the Today list

### Requirement: Move task from Inbox to Today
The system SHALL let the user move a task from Inbox to Today via an explicit
action on that task.

#### Scenario: User moves an Inbox task to Today
- **WHEN** the user triggers the "move to Today" action on a task with
  `status: 'inbox'`
- **THEN** the task's `status` changes to `'today'`, the updated task list is
  persisted via `saveTasks`, and the task moves from the Inbox list to the Today
  list without a page reload
