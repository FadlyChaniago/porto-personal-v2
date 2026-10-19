## Principles

- The portfolio is the main event. The blog is a second destination on the same surfaces, type and tokens.
- Use tokens only. Never write a raw hex value, font size, radius or shadow in page code; name the token.
- Compose with space and type before boxes. Use a card only for a discrete item, such as a project.
- One accent moment per view: one display headline, one primary button, one highlighted block.

## Colour

- Page background is `surface-100`. Use `surface-200` for an alternate section band, and no more than two bands on one page.
- Headings and body text are `ink`. Captions, dates and excerpts are `ink-muted`. Never set text in `primary`, `secondary` or `accent`.
- Filled buttons take `action` as fill and `on-action` as label. One primary button per view.
- Inline links and the active navigation item use `link`. Show hover with an underline, not colour alone.
- Keyboard focus is an outline in `focus-ring`, 2px with 2px offset, on every interactive element. Never remove it.
- Dark theme: set `data-theme="dark"` on `<html>`. The theme toggle writes the explicit choice to `localStorage`. On first visit, follow `prefers-color-scheme`.
- No status colour tokens yet. Any future status colour must be paired with a word or icon.

## Typography

- Hero and section headlines use `display-xl` (desktop and tablet) or `display-lg` (below 768px). Serif, Newsreader.
- Interface text uses `nav`, `body-lg`, `body`, `body-sm`, `heading-md` and `heading-lg`. Sans, Manrope.
- Article text uses `article-body` inside `container-prose`, with `article-h2` for section headings.
- Code uses `code`. Numbered project labels, categories and dates use `label`, in uppercase only. Mono, JetBrains Mono.
- Three families at most. Do not add a fourth.
- Fonts are hosted (Google Fonts), so no font files ship with this system. Basic reading must still work with the system fallbacks in `type.families`.

## Layout and spacing

- Page content sits within `container-wide`. Article columns sit within `container-prose`.
- Use `space-24` between major homepage sections on desktop and `space-16` on mobile.
- Use `space-8` between a section heading and its content, and `space-4` between list items.
- Horizontal page padding is `space-6` on mobile and `space-8` from 768px.
- The header is `header-height`. It stays compact and gains `shadow-raised` only after scroll.

## Shape and depth

- Buttons and inputs use `radius-md`. Code and tags use `radius-sm`. Project media frames use `radius-lg`. `radius-pill` is for a single status marker.
- Separate content with `border` lines first. Use `shadow-raised` only on hover of a project preview or on the floating header.

## Motion

- `motion-fast` for colour and underline transitions, `motion-normal` for state changes, `motion-slow` for one reveal per section. Every transition uses `ease-standard`.
- Scroll reveals fade in and rise once. Animate sections, not individual paragraphs.
- Parallax moves a single hero or project visual with `transform` only. Disable it below 768px and under `prefers-reduced-motion: reduce`.
- Under `prefers-reduced-motion: reduce`, remove parallax, reveals and smooth scrolling. Content stays fully visible without any animation.

## Accessibility

- Body text meets 4.5:1 on its ground in both themes. The pairs are listed in each token's usage note.
- Control edges, focus rings and meaningful icons meet 3:1, using `border-strong` and `focus-ring`.
- Touch targets are at least 44px square.
- Each page has one `h1`. Headings do not skip levels.

## Iconography and imagery

- Icons are Bootstrap Icons, drawn in `currentColor`. Set the colour on the parent: `ink`, `ink-muted` or `link`.
- Project imagery is a real screenshot only when it may be shared. Otherwise use an honest placeholder frame: `surface-200` fill, `radius-lg`, and an `ink-muted` caption. Never use stock photography.
- No logo has been supplied. Set the name as plain text in `heading-md` (serif).

## Components

- No component library exists yet. Build from the patterns above.
- When a pattern repeats three times, add it under `components/` with a README and a preview.
