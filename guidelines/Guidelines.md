# Creator Design System — Make Kit Guidelines

You are building UI for **Zoho Creator** using the **Creator Design System (CDS)**.
Always follow these rules when generating code. Violations must be corrected.

## General guidelines

* Only use components from `@creator-kit/creator-ds-react`. Never compose raw `<div>`, `<button>`, `<input>`, or `<span>` when a DS component exists.
* Only use absolute positioning when truly necessary. Prefer flexbox and grid layouts.
* Keep file sizes small — put helper functions and reusable components in their own files.
* Refactor code as you go to keep code clean.
* Never add `console.log` or debug output in production screen files.
* Only use **Zoho Puvi** font — it is already set globally. Never override `font-family`.
* Use `--cds-*` CSS tokens for every color, spacing, and border-radius value. Never hardcode hex, rgb(), or pixel values.
* Do not install or import from any other UI library (MUI, Ant, Shadcn, etc.).

---

## 1. Package

```tsx
import "@creator-kit/creator-ds-react/styles"   // import ONCE at app root
import { ComponentName } from "@creator-kit/creator-ds-react"
```

**Never** import from any other UI library. All 42 components are in this package.

---

## 2. Required page shell

Every full-page screen must use this exact structure:

```tsx
import { TopBar, LeftNav } from "@creator-kit/creator-ds-react"

export default function MyScreen() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">
          {/* page content */}
        </main>
      </div>
    </div>
  )
}
```

- `TopBar` is always at the top
- `LeftNav` is always on the left
- Page content always goes inside `<main>`
- Never put navigation inside `<main>`

---

## 3. Non-negotiable rules

### Font
- **Only** `'Zoho Puvi'` is permitted. Do not use Inter, Roboto, system-ui, or any other font.
- Font is set globally — never override `font-family` on individual elements.

### Colors — always use tokens
```tsx
✅ color: "var(--cds-primary-text-default)"
✅ className="bg-[var(--cds-primary-surface-subtle)]"

❌ color: "#0D4EF2"
❌ className="text-blue-500"
❌ className="bg-blue-50"
```

### Spacing — always use tokens
```tsx
✅ className="p-[var(--cds-padding-card)] gap-[var(--cds-gap-default)]"

❌ className="p-4 gap-3"
❌ style={{ padding: "16px" }}
```

### Radius — always use tokens
```tsx
✅ className="rounded-[var(--cds-radius-r)]"   // 6px — default

❌ className="rounded-lg"
❌ style={{ borderRadius: "6px" }}
```

---

## 4. Component selection rules

| Intent | Use this | Never use |
|---|---|---|
| Any button/action | `Button` | raw `<button>` |
| Text field | `Label` + `Input` | raw `<input>` |
| Multi-line text | `Textarea` | raw `<textarea>` |
| Dropdown select | `Select` | raw `<select>` |
| Toggle with colour meaning | `Toggle` | `Switch`, custom div |
| Simple on/off | `Switch` | `Toggle` |
| Destructive confirm | `AlertDialog` | `Dialog`, `window.confirm()` |
| Slide-in panel | `Sheet` | `Dialog` |
| Action overflow | `DropdownMenu` | bare `<ul>` |
| Tooltip | `Tooltip` | `title` attribute |
| Overlay scrim | `Blanket` | custom div with background |
| Progress bar | `Progress` | custom div with inline width |
| Dismissible chip | `Tag` | styled `<span>` |
| Multi-chip input | `TagInput` | custom chip divs |
| Status pill | `StatusBadge` | Badge + icon combo |
| Toast | `Toaster` | alert div |
| User photo | `Avatar` | `<img>` with border-radius |
| Card container | `Card` + `CardContent` | div with manual border |

### ContentSwitcher vs Tabs
- **Same data, different view** (Grid/List, Day/Week) → `ContentSwitcher`
- **Different content areas** (Overview, Settings, Analytics) → `Tabs`

---

## 5. Key tokens quick reference

```
Body text:          var(--cds-huegrey-text-dark)           #26282B
Muted text:         var(--cds-huegrey-text-default)        #696C74
Primary blue:       var(--cds-primary-surface-default)     #0D4EF2
Primary text:       var(--cds-primary-text-default)        #0D4EF2
Success:            var(--cds-success-surface-default)     #078841
Warning:            var(--cds-warning-surface-default)     #D25704
Error:              var(--cds-error-surface-default)       #CC1914
White:              var(--cds-white)                       #FFFFFF
Border:             var(--border)                          #E5E5E7
Overlay:            var(--cds-blanket-overlay)             rgba(1,3,10,0.1)

Card padding:       var(--cds-padding-card)                16px
Section H padding:  var(--cds-padding-section-h)           24px
Section V padding:  var(--cds-padding-section-v)           16px
Icon ↔ label:       var(--cds-gap-tight)                   4px
Item gap:           var(--cds-gap-default)                 12px

Radius default:     var(--cds-radius-r)                    6px
Radius pill:        var(--cds-radius-full)                 999px
```

---

## 6. What NOT to do

- ❌ Do not install or import from any other UI library (MUI, Shadcn, Ant, etc.)
- ❌ Do not use Tailwind color utilities (`text-blue-500`, `bg-red-100`)
- ❌ Do not hardcode hex colors, rgb(), or pixel spacing values
- ❌ Do not override `font-family` — Zoho Puvi is already global
- ❌ Do not create custom modals, drawers, or tooltips — use `Dialog`, `Sheet`, `Tooltip`
- ❌ Do not build custom overlay/scrim — use `Blanket`
- ❌ Do not use raw `<span>` chips — use `Tag`
- ❌ Do not build custom chip inputs — use `TagInput`
- ❌ Do not skip `TopBar` + `LeftNav` for full-page screens
- ❌ Do not put `console.log` in production screen files

---

## 7. Missing components (not yet in the package)

Do not create custom implementations. Use a comment placeholder:

```tsx
{/* TODO: replace with <Spinner /> once built */}
{/* TODO: replace with <Skeleton /> once built */}
{/* TODO: replace with <EmptyState /> once built */}
{/* TODO: replace with <DatePicker /> once built */}
{/* TODO: replace with <Pagination /> once built */}
```

---

## 8. See also

- `guidelines/setup.md` — Installation and page shell details
- `guidelines/components.md` — Full component catalogue and decision guide
- `guidelines/tokens.md` — All `--cds-*` token values and usage
- `guidelines/styles.md` — CSS, Tailwind, and font rules
