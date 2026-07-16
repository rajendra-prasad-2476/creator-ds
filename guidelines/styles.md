# Creator DS — Style Guidelines

Style guidelines for Make — covers layout, spacing, typography, border-radius, and responsive behavior.

## Stylesheet entry point
The package exports a single CSS file that must be imported once at the app root:

```tsx
import "@creator-kit/creator-ds-react/styles"
```

This provides the complete Creator DS theme — tokens, fonts, and base resets.
**Do not import individual component CSS files separately.**

---

## Tailwind CSS
The DS uses Tailwind CSS v4. All utility classes are available inside Figma Make.

### Allowed Tailwind utilities
- Layout: `flex`, `grid`, `flex-col`, `flex-1`, `items-center`, `justify-between`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`
- Typography: `text-*`, `font-*`, `leading-*`, `truncate`, `line-clamp-*`
- Display: `hidden`, `block`, `inline-flex`
- Overflow: `overflow-hidden`, `overflow-y-auto`

### Forbidden Tailwind utilities (use `--cds-*` tokens instead)
```
text-blue-500       → color: var(--cds-primary-text-default)
bg-red-100          → background: var(--cds-error-surface-subtle)
text-gray-600       → color: var(--cds-huegrey-text-default)
border-gray-200     → border-color: var(--border)
rounded-lg          → border-radius: var(--cds-radius-l)
p-4                 → padding: var(--cds-padding-card)
```

---

## Applying tokens in className

Use Tailwind's arbitrary value syntax to reference CDS tokens:

```tsx
// Color
<div className="bg-[var(--cds-primary-surface-subtle)] text-[var(--cds-huegrey-text-dark)]">

// Spacing
<div className="p-[var(--cds-padding-card)] gap-[var(--cds-gap-default)]">

// Radius
<div className="rounded-[var(--cds-radius-r)]">

// Shadow
<div className="shadow-[var(--cds-shadow-base)]">
```

---

## Font rules

**Only `'Zoho Puvi'` is the permitted font.** It is set globally — do not override:

```tsx
// ✅ Correct — inherits global font
<p className="text-sm">Hello</p>

// ❌ Wrong — never override font-family
<p style={{ fontFamily: "Inter" }}>Hello</p>
<p className="font-['Inter']">Hello</p>
```

---

## Border defaults

Use `var(--border)` (`#E5E5E7`) for all standard borders:

```tsx
<div className="border border-[var(--border)]">
```

---

## Dark mode
Dark mode is supported via `.dark` class on the root element. The CDS tokens automatically adapt. Do not manually override colors for dark mode — use semantic tokens which handle it.
