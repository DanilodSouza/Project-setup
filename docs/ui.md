# UI Coding Standards

## Component library — shadcn/ui only

All UI elements must be built from [shadcn/ui](https://ui.shadcn.com) components. Do not build custom buttons, inputs, dialogs, dropdowns, tables, or any other interactive primitive from scratch with raw HTML + Tailwind.

Add a component when you need it:

```bash
npx shadcn@latest add <component>
# e.g.
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add calendar
```

Generated component files live in `components/ui/`. Never edit them directly — extend via wrapper components in `components/` when customisation is needed.

## Tailwind

Tailwind classes are allowed for **layout and spacing only** (flex, grid, padding, margin, gap, width, height). Visual styling of interactive elements (color, border, shadow, ring, radius) belongs to shadcn tokens, not ad-hoc Tailwind values.

Correct:

```tsx
<div className="flex flex-col gap-4 p-6">
  <Button>Save</Button>
</div>
```

Incorrect:

```tsx
<button className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700">
  Save
</button>
```

## Color palette

The design uses the **zinc** scale with full dark-mode support. Stick to these semantic roles:

| Role | Light | Dark |
|---|---|---|
| Page background | `zinc-50` / `white` | `zinc-950` / `black` |
| Surface (card, panel) | `white` | `zinc-900` |
| Border | `zinc-200` | `zinc-800` |
| Primary text | `zinc-900` | `zinc-100` |
| Secondary text | `zinc-600` | `zinc-400` |
| Muted / placeholder | `zinc-400` | `zinc-500` |

Always pair a light value with a `dark:` variant. Never use hard-coded hex values in JSX.

## Typography

Fonts are loaded in [app/layout.tsx](../app/layout.tsx) as CSS variables:

- `--font-geist-sans` → `font-sans` (body copy, UI text)
- `--font-geist-mono` → `font-mono` (data, weights, reps)

shadcn's typography tokens inherit these automatically. For data-dense content such as set tables, apply `font-mono` explicitly.

## Dark mode

Dark mode is driven by the OS `prefers-color-scheme` media query (configured in [app/globals.css](../app/globals.css)). Every class that sets a visible color must include a `dark:` counterpart. Never assume light-only rendering.

## Server vs. client components

- Components are **Server Components by default** — no `"use client"` unless the component uses browser APIs, React state, or event handlers.
- Keep `"use client"` boundaries as close to the leaf as possible.
- shadcn components that require interactivity (e.g. `Popover`, `Dialog`, `DropdownMenu`) are already marked internally; importing them in a Server Component is fine.

## File structure

```
components/
  ui/          ← shadcn-generated, do not edit
  <Feature>.tsx ← wrapper/composed components
app/
  <route>/
    page.tsx   ← Server Component, data fetching
    <Widget>.tsx ← "use client" leaf, only when needed
```

## Date formatting

All dates must be formatted with **date-fns**. Never use `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or hand-rolled formatting strings.

The standard display format is `do MMM yyyy`, which produces ordinal day + abbreviated month + 4-digit year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
```

Usage:

```tsx
import { format } from "date-fns";

format(date, "do MMM yyyy") // "1st Sep 2025"
```

Apply this format wherever a date is shown to the user (log entries, workout history, timestamps). Never show raw ISO strings or locale-default formats.

## Accessibility

shadcn components are built on Radix UI primitives and are keyboard-navigable and screen-reader-friendly by default. Do not remove `aria-*` props or `role` attributes that shadcn/Radix adds.
