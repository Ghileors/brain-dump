## Context

The entire UI lives in `app/page.tsx`: a single client component rendered inside a
fixed `mx-auto max-w-2xl p-8` column (`app/page.tsx:174`), using shadcn `Button`
(`components/ui/button.tsx`) and `Textarea`. The `default` and `sm` button sizes are
`h-8` (32px) and `h-7` (28px) respectively — both under common mobile touch-target
guidance (~44px). `app/layout.tsx` has no `viewport` export, so the page relies on the
browser's default viewport handling. There is no existing responsive/breakpoint
convention in the codebase to build on — this change establishes the first one.

The user supplied a reference mockup (compact single-row input with inline
Record/Add buttons, flat colors, tight spacing) purely as visual-style inspiration, not
as a structural spec — the existing Inbox/Today two-section model and its actions
(Capture, Speak, Move to Today) are unchanged.

## Goals / Non-Goals

**Goals:**
- Make the app usable and legible on small (~360-430px wide) phone viewports without
  desktop-scale zooming.
- Bring all interactive controls (Capture, Speak, Move to Today) up to a comfortable
  minimum touch-target size on small screens.
- Keep the capture form reachable near the top of the viewport without forcing a
  scroll on load.
- Prevent overflow/clipping in list items when task titles are long.
- Adjust spacing, sizing, and button treatment to read closer to the supplied
  reference's compact, flat visual style, using the project's existing shadcn design
  tokens (no new color system).

**Non-Goals:**
- No new features, actions, or data model changes (no delete/"X", no "Done" toggle).
- No new dependencies — implemented entirely with Tailwind utilities already in use.
- No final branding/animation polish pass (that is step 5).
- No changes to `app/api/parse/route.ts`, `lib/types.ts`, or `lib/storage.ts`.

## Decisions

1. **Viewport configuration via Next.js `viewport` export, not a manual `<meta>` tag.**
   Add `export const viewport: Viewport = { width: "device-width", initialScale: 1 }`
   to `app/layout.tsx`. This is the App Router-idiomatic mechanism and keeps viewport
   config colocated with the existing `metadata` export in the same file.

2. **Mobile-first container: no fixed `max-w-2xl` at the base breakpoint.**
   Replace the current `mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-8` with
   mobile-first defaults (full-width, tighter gap/padding, e.g. `p-4 gap-6`) and push
   the existing desktop sizing (`max-w-2xl`, `p-8`, `gap-8`) behind an `sm:` breakpoint.
   Alternative considered: keep a single fixed width and rely on the browser's viewport
   scaling — rejected because it doesn't address touch-target size or spacing density,
   only zoom level.

3. **Touch targets: raise interactive control height to ~44px (`h-11`) via className
   overrides on the existing shadcn `Button`, rather than adding a new `size` variant
   to `buttonVariants`.**
   The component is shared UI infra (not owned by this change's capability), so a
   project-wide new size variant is a larger surface change than this step needs;
   a local `className` override (Tailwind's `cn` merge already supports this) is
   sufficient and reversible. Applied to the Capture button, the Speak/mic button, and
   the "Move to Today" button.

4. **Sticky capture form at the top of the viewport on mobile.**
   Wrap the heading + capture form in a `sticky top-0` container with an opaque
   background so it stays reachable while the user scrolls a long Inbox/Today list.
   Trade-off: reduces visible list space on very short viewports; acceptable since the
   capture form is the primary action of the app (per `project.md`'s core scenario).

5. **Visual style stays within existing shadcn semantic tokens
   (`primary`/`destructive`/`outline`/`muted`), adjusting only spacing, rounding, and
   sizing utility classes to feel closer to the reference's flat/compact look.**
   Rejected alternative: introduce new hardcoded colors matching the reference's exact
   red/blue — this would break dark-mode theming and diverge from the rest of the app's
   token-based styling for no functional benefit (user confirmed style-only intent).

6. **List item wrapping: switch Inbox/Today `<li>` layout to allow wrapping
   (`flex-wrap`, `min-w-0` on the title span, `break-words`) instead of the current
   single-line `flex items-center justify-between`.**
   Ensures long titles push the action button to a new line instead of clipping or
   causing horizontal overflow on narrow screens.

## Risks / Trade-offs

- **[Risk] Sticky header reduces visible content on very short mobile viewports
  (e.g. landscape phones with a browser toolbar).** → Mitigation: keep the sticky
  container's own padding minimal and let it size to content rather than a fixed
  height, so it never reserves more space than the form actually needs.
- **[Risk] Enlarging touch targets to ~44px makes controls look oversized on desktop
  once the same classes apply above the `sm:` breakpoint.** → Mitigation: scope the
  larger touch-target classes to the base (mobile) breakpoint only, reverting to the
  existing shadcn size at `sm:` and above, consistent with the "mobile-first, polish
  later" convention.
- **[Risk] Manual QA is required since there's no visual regression tooling in this
  project.** → Mitigation: tasks.md includes explicit manual verification steps across
  a small-viewport browser resize/device toolbar, matching how prior steps
  (e.g. step 3) verified UI behavior manually.

## Migration Plan

Pure client-side UI change with no data or API impact — no migration steps, feature
flags, or rollback plan beyond reverting the branch. Implemented and verified on
`step4-mobile-ui` (branched from `dev`), PR'd into `dev`, then `dev` → `master` after
manual testing, per the project's workflow rules.

## Open Questions

None outstanding — scope was confirmed with the user as "visual style only," keeping
the Inbox/Today structure and existing actions unchanged.
