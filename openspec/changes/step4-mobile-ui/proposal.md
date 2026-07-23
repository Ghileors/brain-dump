## Why

Steps 1-3 delivered a fully working core loop (text + voice capture → AI parse → Inbox →
Today), but the UI was built without mobile-specific layout, viewport, or touch-target
work: the page uses a single fixed `max-w-2xl` desktop-centered container, default
browser touch targets on buttons, and no explicit mobile viewport configuration. Since
the project is a "мобільний AI-планер" (`openspec/project.md`), roadmap step 4
("UX/UI, mobile-first") closes this gap before final polish/demo in step 5. The user
supplied a reference mockup (compact single-row input with inline action buttons, flat
colors, tight spacing) to guide the visual style of this pass.

## What Changes

- Add explicit mobile viewport configuration (Next.js `viewport` export in
  `app/layout.tsx`) so the app renders at device width instead of being desktop-scaled
  on phones.
- Rework the main page layout to be mobile-first: full-width fluid layout with
  comfortable padding on small screens, a bounded max-width only kicking in at larger
  breakpoints (replacing the single fixed `max-w-2xl` container).
- Restyle buttons and inputs toward the supplied reference's visual language (flat,
  compact, clearly colored action buttons; tighter spacing; consistent rounded corners)
  without changing which actions exist.
- Increase touch target size for interactive controls (Capture, Speak/mic,
  "Move to Today") to a minimum comfortable tap size on small screens.
- Keep the capture form (textarea + Capture/Speak buttons) prominently reachable
  near the top of the viewport on mobile without requiring a scroll to start a dump.
- Fix list-item layout (Inbox/Today) so long task titles wrap correctly and action
  buttons never overflow or get clipped on narrow viewports.
- Preserve existing listening/error state indicators (mic listening state, voice/parse
  error banners) with no layout shift introduced by the responsive changes.

Out of scope for this step: any new features or interactions not already present today
(e.g. no task delete/"X" action, no "Done" toggle), no changes to what data is shown or
how tasks are parsed/stored, no new API behavior, and no final branding/polish pass
(deferred to step 5, "Фінальна перевірка і полірування"). The reference image informs
visual styling only, not the Inbox/Today structure or available actions.

## Capabilities

### New Capabilities
- `mobile-responsive-layout`: viewport configuration, mobile-first responsive
  breakpoints, and minimum touch-target sizing requirements applied across the capture
  form and Inbox/Today board.

### Modified Capabilities
(none — `ai-task-capture` and `inbox-today-board` requirements are unchanged; only their
visual rendering is affected, governed by the new `mobile-responsive-layout` capability)

## Impact

- Modified files: `app/layout.tsx` (viewport export), `app/page.tsx` (layout markup,
  spacing, button/input styling, touch target sizes, responsive breakpoints),
  `app/globals.css` (only if shared spacing/breakpoint tokens are needed).
- No new API routes, no server-side changes, no new dependencies (responsive work uses
  Tailwind CSS utilities already in the project).
- No changes to `lib/types.ts` or `lib/storage.ts`.
- New spec file created by this change: `openspec/specs/mobile-responsive-layout/spec.md`.
