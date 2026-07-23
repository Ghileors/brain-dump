## ADDED Requirements

### Requirement: Mobile viewport configuration
The system SHALL configure the page viewport so that the app renders at native device
width and scale on mobile browsers, rather than being scaled down as a desktop layout.

#### Scenario: Page loads on a mobile browser
- **WHEN** the app is loaded in a mobile browser
- **THEN** the rendered layout uses the device's actual width (`width=device-width`)
  at an initial scale of 1, with no desktop-width layout being scaled to fit

### Requirement: Mobile-first responsive container
The system SHALL lay out the main page content full-width with mobile-appropriate
padding at small viewport widths, and SHALL constrain content to a bounded
reading width only at larger viewport widths.

#### Scenario: Small viewport
- **WHEN** the viewport width is at the small (mobile) breakpoint
- **THEN** the main content area spans the full available width with mobile-sized
  padding, and no fixed desktop max-width is applied

#### Scenario: Larger viewport
- **WHEN** the viewport width is at or above the `sm` breakpoint
- **THEN** the main content area is constrained to a bounded max-width and centered,
  matching the app's existing desktop presentation

### Requirement: Minimum touch target size on mobile
The system SHALL render primary interactive controls (capture submit, speak/mic
toggle, move-to-Today action) at a minimum comfortable touch-target size at small
viewport widths.

#### Scenario: Interactive control rendered on mobile
- **WHEN** the capture submit button, speak/mic button, or "Move to Today" button is
  rendered at a small (mobile) viewport width
- **THEN** its rendered height is at least 44 logical pixels

### Requirement: Reachable capture form
The system SHALL keep the text/voice capture form visible near the top of the
viewport while the user scrolls the Inbox/Today lists, without requiring the user to
scroll back up to start a new capture.

#### Scenario: User scrolls a long task list
- **WHEN** the Inbox or Today list is long enough to scroll and the user scrolls down
- **THEN** the capture form (textarea and its action buttons) remains visible at the
  top of the viewport

### Requirement: Non-overflowing list items
The system SHALL render Inbox and Today list items so that long task titles wrap
within the item instead of overflowing the viewport or clipping the item's action
button.

#### Scenario: Task with a long title
- **WHEN** a task's `title` is long enough that it would not fit on a single line at
  the current viewport width
- **THEN** the title text wraps onto additional lines within the list item, and any
  action button on that item remains fully visible and un-clipped
