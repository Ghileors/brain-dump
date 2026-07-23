## 1. Viewport configuration

- [ ] 1.1 Add a `viewport` export (`Viewport` type from `next`) to `app/layout.tsx`
      with `width: "device-width"` and `initialScale: 1`.

## 2. Mobile-first container layout

- [ ] 2.1 In `app/page.tsx`, change the `<main>` container from a fixed
      `mx-auto max-w-2xl p-8` to mobile-first defaults (full width, e.g. `p-4 gap-6`)
      with the existing desktop sizing (`max-w-2xl`, `p-8`, `gap-8`) applied only at
      `sm:` and above.
- [ ] 2.2 Verify no horizontal scroll/overflow appears at a 360px viewport width.

## 3. Touch targets

- [ ] 3.1 Increase the Capture submit button's height to `h-11` at the base
      breakpoint (reverting to the existing shadcn default size at `sm:` and above).
- [ ] 3.2 Apply the same `h-11` mobile touch-target treatment to the Speak/mic
      button.
- [ ] 3.3 Apply the same `h-11` mobile touch-target treatment to the "Move to Today"
      button.

## 4. Sticky capture form

- [ ] 4.1 Wrap the heading + capture form in a `sticky top-0` container with an
      opaque background so it stays visible while scrolling.
- [ ] 4.2 Verify the sticky header doesn't reserve excess space on a short mobile
      viewport (e.g. landscape phone height) and doesn't overlap list content.

## 5. List item layout

- [ ] 5.1 Update Inbox `<li>` layout to allow wrapping (`flex-wrap`, `min-w-0` on the
      title span, `break-words`) instead of a rigid single-line row.
- [ ] 5.2 Apply the same wrapping treatment to Today `<li>` items.
- [ ] 5.3 Verify a long task title wraps correctly and the "Move to Today" button
      stays fully visible and un-clipped at a 360px viewport width.

## 6. Visual style pass

- [ ] 6.1 Adjust spacing, rounding, and sizing utility classes on the capture
      form/buttons/list items to read closer to the supplied reference's compact,
      flat style, using only existing shadcn semantic color tokens (no new hardcoded
      colors).
- [ ] 6.2 Verify dark mode still renders correctly after the styling pass.

## 7. Verification

- [ ] 7.1 Manually test the full capture → Inbox → Today flow at a small mobile
      viewport (browser device toolbar, ~375px width), confirming no overflow,
      clipping, or unreachable controls.
- [ ] 7.2 Manually test the same flow at the existing desktop breakpoint (`sm:` and
      above) to confirm no regression from before this change.
- [ ] 7.3 Manually test voice capture (mic button, listening state, error state) at
      the small mobile viewport to confirm the step 3 behavior still works
      end-to-end with the new layout/sizing.
