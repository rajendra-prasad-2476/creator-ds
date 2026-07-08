# AGENTS.md — Creator DS · AI Coding Instructions

> This file is the authoritative rule set for any AI agent generating screens, components,
> or code in the **Creator design system** ecosystem.
> It is auto-synced from `creator-ds-react` into `creator-features` on every merge to main.

---

## 1. Non-Negotiable Rules

These rules are hard constraints. Violating any of them produces output that **must be rejected**.

### 1.1 Component source
- **Only** use components from `src/components/ui/`. Never compose raw `<div>`, `<button>`, `<input>`, or `<span>` elements when a DS component exists for that purpose.
- Import path is always `@/components/ui/<component-name>`.

### 1.2 Font
- The **only** permitted font family is `'Zoho Puvi'`.
- Never use `Inter`, `Roboto`, `system-ui`, `sans-serif` alone, or any other typeface anywhere in generated code.
- Font is already set globally via `--cds-font-family-default`. Do not override it on individual elements.

### 1.3 Design tokens — colors
- Use `--cds-*` CSS custom properties for every color. Never hardcode hex, `rgb()`, or `hsl()` values.
- Correct: `color: var(--cds-primary-text-default)`
- Wrong: `color: #0D4EF2` or `color: blue`

### 1.4 Design tokens — spacing & radius
- Use `--cds-space-*` and `--cds-gap-*` / `--cds-padding-*` tokens for all spacing.
- Use `--cds-radius-*` tokens for all border radii.
- Never write arbitrary pixel values for spacing or radius inline.

### 1.5 Page structure
Every generated screen **must** compose the following shell:

```tsx
<div className="flex flex-col h-screen">
  <TopBar />
  <div className="flex flex-1 overflow-hidden">
    <LeftNav />
    <main className="flex-1 overflow-y-auto p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">
      {/* page content */}
    </main>
  </div>
</div>
```

Never put page-level navigation inside `<main>`. Never skip `TopBar` or `LeftNav` for full-page screens.

---

## 2. Available Components

### Atoms
| Component | Import | Use for |
|---|---|---|
| `Button` | `button.tsx` | All interactive actions |
| `Input` | `input.tsx` | Single-line text entry |
| `Textarea` | `textarea.tsx` | Multi-line text entry |
| `Label` | `label.tsx` | Form field labels |
| `Checkbox` | `checkbox.tsx` | Boolean / multi-select options |
| `RadioGroup` + `RadioGroupItem` | `radio-group.tsx` | Mutually exclusive options |
| `Switch` | `switch.tsx` | On/off toggles |
| `Toggle` | `toggle.tsx` | Toolbar/icon toggle buttons |
| `Slider` | `slider.tsx` | Range input |
| `InputOTP` | `input-otp.tsx` | One-time password entry |
| `Avatar` | `avatar.tsx` | User/entity portraits |
| `Badge` | `badge.tsx` | Status labels, counts, tags |
| `Progress` | `progress.tsx` | Linear progress bars |
| `Separator` | `separator.tsx` | Horizontal/vertical dividers |

### Molecules
| Component | Import | Use for |
|---|---|---|
| `Breadcrumb` | `breadcrumb.tsx` | Page hierarchy navigation |
| `ContentSwitcher` | `content-switcher.tsx` | Toggle between parallel views (Grid/List, Day/Week/Month) |
| `Tabs` | `tabs.tsx` | Switching between content panels within a page |
| `Select` | `select.tsx` | Dropdown single-select |
| `Popover` | `popover.tsx` | Floating overlay anchored to a trigger |
| `Tooltip` | `tooltip.tsx` | Short hover hints on interactive elements |
| `DropdownMenu` | `dropdown-menu.tsx` | Action menus triggered from a button |
| `NavigationMenu` | `navigation-menu.tsx` | Multi-level nav links |
| `Collapsible` | `collapsible.tsx` | Expand/collapse a single section |
| `ScrollArea` | `scroll-area.tsx` | Scrollable region with styled scrollbar |
| `Notes` | `notes.tsx` | Inline annotation / comment blocks |
| `Tile` | `tile.tsx` | Clickable card tiles in a grid |
| `Sonner` | `sonner.tsx` | Toast notifications |

### Organisms
| Component | Import | Use for |
|---|---|---|
| `Card` | `card.tsx` | Content containers / panels |
| `Dialog` | `dialog.tsx` | Modal dialogs requiring user response |
| `AlertDialog` | `alert-dialog.tsx` | Destructive confirmation dialogs |
| `Sheet` | `sheet.tsx` | Slide-in side panels |
| `Table` | `table.tsx` | Tabular data display |
| `TopBar` | `top-bar.tsx` | Global app header (always present) |
| `LeftNav` | `left-nav.tsx` | Global sidebar navigation (always present) |

---

## 3. Component-to-Use-Case Mapping

When a design intent could map to multiple components, follow this table.

| Intent | Use this | Never use |
|---|---|---|
| User confirms a destructive action | `AlertDialog` | `Dialog`, `window.confirm()` |
| User fills in a form field | `Label` + `Input` (or `Textarea`) | raw `<input>` / `<textarea>` |
| Show a temporary status message | `Sonner` (toast) | raw `<div>` alert banners |
| Filter a list between 2–6 views | `ContentSwitcher` | `Tabs`, custom radio buttons |
| Navigate between page sections | `Tabs` | `ContentSwitcher`, `NavigationMenu` |
| Inline inline error / success message | `Badge` variant destructive/success on field, or future `InlineAlert` | custom styled `<p>` |
| Action overflow menu | `DropdownMenu` | bare `<ul>` |
| Contextual help text | `Tooltip` | `title` attribute |
| Slide-in detail pane | `Sheet` | `Dialog` |
| Page-level loading state | future `Skeleton` or `Spinner` | `<div className="animate-spin">` |
| Empty list / zero-data state | future `EmptyState` | raw centred `<p>` text |
| User / entity photo | `Avatar` | `<img>` with manual border-radius |
| Multi-step form wizard | future `Stepper` | manual numbered `<div>` steps |

---

## 4. ContentSwitcher vs Tabs — Decision Rule

```
Is the user switching between views of the SAME data?  →  ContentSwitcher
  e.g. Grid view / List view, Day / Week / Month

Is the user switching between DIFFERENT content areas?  →  Tabs
  e.g. Overview | Analytics | Settings tabs in a detail page
```

`ContentSwitcher` sits **above** the content region. `Tabs` wraps content in `TabsContent`.

---

## 5. Token Quick Reference

```
Colors
  Primary blue:    var(--cds-primary-surface-default)   #0D4EF2
  Primary text:    var(--cds-primary-text-default)       #0D4EF2
  Body text:       var(--cds-huegrey-text-dark)          #26282B
  Muted text:      var(--cds-huegrey-text-default)       #696C74
  White:           var(--cds-white)                      #FFFFFF
  Error:           var(--cds-error-surface-default)      #CC1914
  Success:         var(--cds-success-surface-default)    #078841
  Warning:         var(--cds-warning-surface-default)    #D25704
  Border default:  var(--border)                         #E5E5E7

Spacing
  4px:   var(--cds-space-4)
  8px:   var(--cds-space-8)
  12px:  var(--cds-space-12)
  16px:  var(--cds-space-16)
  24px:  var(--cds-space-24)
  32px:  var(--cds-space-32)

Semantic spacing
  Icon ↔ label gap:       var(--cds-gap-tight)          4px
  Related elements gap:   var(--cds-gap-small)          8px
  List item gap:          var(--cds-gap-default)        12px
  Card internal padding:  var(--cds-padding-card)       16px
  Section padding H:      var(--cds-padding-section-h)  24px
  Section padding V:      var(--cds-padding-section-v)  16px

Radius
  Pill / full:  var(--cds-radius-full)   999px
  Large:        var(--cds-radius-l)       10px
  Regular:      var(--cds-radius-r)        6px  ← default for cards, inputs
  Small:        var(--cds-radius-s)        4px
  XSmall:       var(--cds-radius-xs)       2px

Typography (font-size / line-height)
  H1:  var(--cds-text-h1) / var(--cds-leading-h1)   29px / 38px
  H2:  var(--cds-text-h2) / var(--cds-leading-h2)   26px / 34px
  H3:  var(--cds-text-h3) / var(--cds-leading-h3)   23px / 30px
  P1:  var(--cds-text-p1) / var(--cds-leading-p1)   16px / 21px
  P2:  var(--cds-text-p2) / var(--cds-leading-p2)   14px / 18px  ← body default
  P3:  var(--cds-text-p3) / var(--cds-leading-p3)   12px / 15px
  P4:  var(--cds-text-p4) / var(--cds-leading-p4)   11px / 14px
```

---

## 6. Available Page Templates

Before composing a screen from scratch, **always check whether a template already covers the layout**.
Templates live in `src/templates/` and export typed props for every slot.

| Template file | Pattern | Use when |
|---|---|---|
| `CardGridTemplate` | Title + search/filter bar + responsive tile grid | App galleries, solution lists, any browsable card collection |
| `TabbedSectionsTemplate` | Page header + tabs + grouped content cards per tab | Multi-category resource pages (Microservices, Marketplace, etc.) |
| `SplitPanelTemplate` | Search list + two status columns | Deployment / environment views with multi-stage pipelines |
| `LinkCategoryTemplate` | Page header + grouped navigation link cards | Settings / Operations landing pages with named sub-sections |
| `BreadcrumbDetailTemplate` | Breadcrumb + page header + tabs with 3 content variants (card-grid \| empty \| table) | Any inner detail or sub-section page reached via navigation |
| `BillingTemplate` | Page header + tabs + plan summary card + stat tile grid | Subscription, billing, usage, or plan management pages |

### How to use a template

```tsx
// 1. Import the template
import CardGridTemplate from "@/templates/CardGridTemplate"

// 2. Pass only the props you need — all have sensible defaults
export default function MySolutionsScreen() {
  return (
    <CardGridTemplate
      title="Welcome, rajendra.prasad"
      ctaLabel="+ Create Solution"
      items={myItems}
    />
  )
}
```

- Do **not** copy-paste the template body into a new file — import and extend via props.
- If a template is 80%+ right but needs a structural change, note the gap in `docs/ds-parity.csv` and use the closest template with prop overrides for now.

---

## 7. File Naming for Generated Screens

When an AI agent produces a new screen file, follow this convention:

```
src/screens/<feature-slug>/<ScreenName>.tsx
```

Examples:
```
src/screens/crm/ContactListScreen.tsx
src/screens/crm/ContactDetailScreen.tsx
src/screens/leave-management/LeaveRequestFormScreen.tsx
src/screens/reports/ReportDashboardScreen.tsx
```

Rules:
- `<feature-slug>` is kebab-case, matches the feature folder in `creator-features`
- `<ScreenName>` is PascalCase, suffixed with `Screen`
- One screen per file — do not combine multiple screens in one file
- The file must export a single default export: `export default function ContactListScreen()`

---

## 8. What Agents Must NOT Do

- Do not install or import any UI library other than the components in `src/components/ui/`
- Do not use `className="text-blue-500"` or any Tailwind color utility — use `--cds-*` tokens
- Do not use `style={{ fontFamily: "Inter" }}` or any font override
- Do not create a custom modal, drawer, or tooltip — use `Dialog`, `Sheet`, `Tooltip`
- Do not add `console.log` or debug output to production screen files
- Do not generate placeholder images with external URLs (use `Avatar` or `Tile` components)
- Do not skip the `TopBar` + `LeftNav` shell for full-page screen outputs

---

## 9. Missing Components (Do Not Stub)

These components appear in `docs/ds-parity.csv` as **Missing** or **In Progress**.
Do not generate a custom implementation — flag the gap in a code comment instead.

| Component | Placeholder comment |
|---|---|
| `Spinner` | `{/* TODO: replace with <Spinner /> once built — ds-parity P1 */}` |
| `Skeleton` | `{/* TODO: replace with <Skeleton /> once built — ds-parity P1 */}` |
| `EmptyState` | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| `InlineAlert` | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |
| `FormField` | `{/* TODO: replace with <FormField /> once built — ds-parity P1 */}` |
| `Pagination` | `{/* TODO: replace with <Pagination /> once built — ds-parity P1 */}` |
| `DatePicker` | `{/* TODO: replace with <DatePicker /> once built — ds-parity P2 */}` |
| `Accordion` | `{/* TODO: replace with <Accordion /> once built — ds-parity P2 */}` |
| `Tag / Chip` | `{/* TODO: replace with <Tag /> once built — ds-parity P2 */}` |
| `StatCard` | `{/* TODO: replace with <StatCard /> once built — ds-parity P2 */}` |
| `FileUpload` | `{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` |
| `Stepper` | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` |
| `CommandPalette` | `{/* TODO: replace with <CommandPalette /> once built — ds-parity P3 */}` |

---

## 10. Sync Notes for Maintainers

- This file lives in `creator-ds-react/AGENTS.md` (source of truth)
- It is copied verbatim to `creator-features/AGENTS.md` by the GitHub Actions sync workflow
- Update this file whenever: a new component is added, a component is deprecated, or a naming convention changes
- After updating, merge to `main` — the sync runs automatically
# sync test — Wed Jul  8 14:43:53 IST 2026
