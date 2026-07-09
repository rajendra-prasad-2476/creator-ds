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
| `StatusBadge` | `status-badge.tsx` | Semantic status pills (configured / not-configured / error / pending) with fixed colour + icon |
| `Blanket` | `blanket.tsx` | Overlay/scrim backdrop behind Sliders, Sheets, Dialogs (never build a custom scrim) |
| `Progress` | `progress.tsx` | Linear progress bars |
| `Separator` | `separator.tsx` | Horizontal/vertical dividers |
| `Blanket` | `blanket.tsx` | Scrim/overlay backdrop behind Sheets, Dialogs, Sliders & custom overlays |
| `RadioCard` | `radio-card.tsx` | Selectable card for mutually-exclusive choices (use inside RadioGroup) |
| `Tag` | `tag.tsx` | Dismissible chip/pill (4 style variants × 2 sizes) — use `closeable` + `onClose` for interactive tags |

### Molecules
| Component | Import | Use for |
|---|---|---|
| `Breadcrumb` | `breadcrumb.tsx` | Page hierarchy navigation |
| `ContentSwitcher` | `content-switcher.tsx` | Toggle between parallel views (Grid/List, Day/Week/Month) |
| `Tabs` | `tabs.tsx` | Switching between content panels within a page |
| `Select` | `select.tsx` | Dropdown single-select (searchable, creatable, grouped variants built-in) |
| `Popover` | `popover.tsx` | Floating overlay anchored to a trigger |
| `Tooltip` | `tooltip.tsx` | Short hover hints on interactive elements |
| `DropdownMenu` | `dropdown-menu.tsx` | Action menus triggered from a button |
| `NavigationMenu` | `navigation-menu.tsx` | Multi-level nav links |
| `Collapsible` | `collapsible.tsx` | Expand/collapse a single section |
| `ScrollArea` | `scroll-area.tsx` | Scrollable region with styled scrollbar |
| `Notes` | `notes.tsx` | Inline annotation / comment blocks |
| `InputSuffix` | `input-suffix.tsx` | Text field with trailing CTA (icon, label, or clear button) |
| `InputPrefix` | `input-prefix.tsx` | Text field with leading CTA (icon, label) and optional trailing icon / clear |
| `InputAffixed` | `input-affixed.tsx` | Text field with leading AND trailing CTAs on both sides |
| `Tile` | `tile.tsx` | Clickable card tiles in a grid |
| `Sonner` | `sonner.tsx` | Toast notifications |
| `TagInput` | `tag-input.tsx` | Multi-tag input field — type + Enter/comma to add tags, × to dismiss |
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
| `InputSuffix` | `input-suffix.tsx` | Text field with trailing CTA (icon, label, or clear button) |
| `InputPrefix` | `input-prefix.tsx` | Text field with leading CTA (icon, label) and optional trailing icon / clear |
| `InputAffixed` | `input-affixed.tsx` | Text field with leading AND trailing CTAs on both sides |
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
| Input needs a trailing action (copy, search, clear) | `InputSuffix` | raw `<div>` wrapper + `<button>` beside `<input>` |
| Input needs a leading context label/icon (currency, country code, URL scheme) | `InputPrefix` | raw `<span>` + `<input>` side by side |
| Input needs context on BOTH sides (currency + unit, code + extension) | `InputAffixed` | two raw `<span>` elements flanking an `<input>` |
| Mutually exclusive choice displayed as a card (with description) | `RadioCard` inside `RadioGroup` | custom card `<div>` with manual radio indicator |
| Display a label, category, or keyword as a pill | `Tag` | hand-styled `<span>` or `<div>` badge |
| Allow users to enter multiple values as dismissible chips | `TagInput` | raw `<input>` beside custom chip divs |
| Show a temporary status message | `Sonner` (toast) | raw `<div>` alert banners |
| Filter a list between 2–6 views | `ContentSwitcher` | `Tabs`, custom radio buttons |
| Navigate between page sections | `Tabs` | `ContentSwitcher`, `NavigationMenu` |
| Inline inline error / success message | `Badge` variant destructive/success on field, or future `InlineAlert` | custom styled `<p>` |
| Show a configured/enabled/error status | `StatusBadge` | hand-composed `Badge` + icon per screen |
| Action overflow menu | `DropdownMenu` | bare `<ul>` |
| Contextual help text | `Tooltip` | `title` attribute |
| Slide-in detail pane | `Sheet` | `Dialog` |
| Dimmed scrim behind an overlay / panel | `Blanket` | custom `<div>` with a background color |
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
  Blanket scrim:   var(--cds-blanket-overlay)            rgba(1,3,10,0.1)

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

## 7. File Naming & Registration for Generated Screens

When an AI agent produces a new screen file, follow this convention:

```
src/screens/<feature-slug>/<ScreenName>.tsx
```

Examples:
```
src/screens/crm/ContactListScreen.tsx
src/screens/leave-management/LeaveRequestFormScreen.tsx
src/screens/zia-configuration/ZiaSettingsScreen.tsx
```

Rules:
- `<feature-slug>` is kebab-case, matches the feature folder in `creator-features`
- `<ScreenName>` is PascalCase, suffixed with `Screen`
- One screen per file — do not combine multiple screens in one file
- The file must export a single default export: `export default function ContactListScreen()`

### MANDATORY: Register every screen in the Feature Registry

After creating a screen, **always** add it to `src/screens/feature-registry.tsx`.
Screens not in the registry will not appear in the Feature Dashboard or be previewable.

```tsx
// src/screens/feature-registry.tsx
import MyNewScreen from "@/screens/my-feature/MyNewScreen"

export const FEATURE_REGISTRY: FeatureEntry[] = [
  {
    id: "002",
    name: "My Feature Name",
    prdRef: "#002",
    version: "v1.0",
    status: "draft",
    owner: "pm.name",           // PM's login name
    lastUpdated: "2026-07-08",
    screens: [
      {
        id: "my-screen",
        name: "My Screen",
        factory: () => <MyNewScreen />,
        sourcePath: "src/screens/my-feature/MyNewScreen.tsx",
        destPath: "features/002-my-feature/screens/MyNewScreen.tsx",
      },
    ],
    versionHistory: [],
  },
]
```

---

## 8. Screen-to-Screen Navigation

Screens rendered inside the Feature Dashboard preview use a lightweight `NavigationContext`.
Use `useNavigation()` for all navigation — never use `href`, `window.location`, or `console.log`.

```tsx
import { useNavigation } from "@/screens/navigation"

export default function MyScreen() {
  const { navigate, goBack, canGoBack, params } = useNavigation()

  // Navigate to another screen (must be registered in same feature's screens[])
  navigate("target-screen-id", { someParam: "value" })

  // Go back to the previous screen in the navigation stack
  if (canGoBack) goBack()

  // Read params passed from the previous screen
  const id = params.someParam as string
}
```

### Navigation rules
- Every `onClick` that changes screens must call `navigate(screenId, params?)`
- Breadcrumb links must use `canGoBack ? goBack() : undefined` — never hardcode `href="#"`
- The first screen in a feature's `screens[]` array is the entry point
- Link category items (e.g. Operations menu) use `onClick: () => navigate("target-screen-id")`
- `screenId` must exactly match an `id` in the same feature's `screens[]` array

### Full navigation pattern (Operations → feature → detail → back)
```tsx
// OperationsScreen.tsx — entry point
import { LinkCategoryTemplate } from "@/templates/LinkCategoryTemplate"
import { useNavigation } from "@/screens/navigation"

export default function OperationsScreen() {
  const { navigate } = useNavigation()
  return (
    <LinkCategoryTemplate
      categories={[{
        heading: "Applications",
        links: [
          { label: "Zia", onClick: () => navigate("zia-settings") },
        ]
      }]}
    />
  )
}
```

---

## 9. What Agents Must NOT Do

- Do not install or import any UI library other than the components in `src/components/ui/`
- Do not use `className="text-blue-500"` or any Tailwind color utility — use `--cds-*` tokens
- Do not use `style={{ fontFamily: "Inter" }}` or any font override
- Do not create a custom modal, drawer, or tooltip — use `Dialog`, `Sheet`, `Tooltip`
- Do not build a custom overlay/scrim backdrop — use `Blanket` (Dialog/Sheet already render it automatically)
- Do not add `console.log` or debug output to production screen files
- Do not generate placeholder images with external URLs (use `Avatar` or `Tile` components)
- Do not skip the `TopBar` + `LeftNav` shell for full-page screen outputs
- Do not compose raw `<span>` or `<div>` chips/pills — use `Tag`
- Do not build a custom multi-value chip input — use `TagInput`

---

## 10. Missing Components (Do Not Stub)

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
| `StatCard` | `{/* TODO: replace with <StatCard /> once built — ds-parity P2 */}` |
| `FileUpload` | `{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` |
| `Stepper` | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` |
| `CommandPalette` | `{/* TODO: replace with <CommandPalette /> once built — ds-parity P3 */}` |

---

## 11. Promoting a New Component or Variant (Living Guideline)

When screen generation legitimately needs UI that the DS doesn't yet have, it goes through
a **Proposal → Approval → Promotion** gate. Nothing is added to `src/components/ui/` until a
designer / DS owner has approved it. A component is only a "living guideline" once it is
**approved** and all applicable promotion boxes are ticked.

### 11.0 Approval gate (do this FIRST)

```
Gap found → PROPOSED → (designer/DS-owner review) → APPROVED → PROMOTE → DONE → Rejected↩
```

Status vocabulary (tracked in the `Status` column of `docs/ds-parity.csv`):

| Status | Meaning | May build source? |
|---|---|---|
| `Proposed` | Candidate logged, awaiting review | ❌ No — screen uses the `{/* TODO … ds-parity */}` placeholder (§10) |
| `Approved` | Designer / DS owner signed off | ✅ Yes — begin the §11 promotion |
| `Done` | Built + fully promoted (all boxes ticked) | ✅ Shipped |
| `Rejected` | Stays as one-off usage, not promoted | ❌ No |

Rules:
1. **Propose, don't build.** When a gap is found, add a `Proposed` row to `docs/ds-parity.csv`
   (name, category, why, requesting screen) and, if helpful, sketch the proposed API in the PR.
   Do **not** create the `src/components/ui/` file yet.
2. **Two sign-offs are required before `Done`:**
   - the `Status` moves `Proposed → Approved` in `docs/ds-parity.csv`, **and**
   - the promotion PR is approved by a code owner (see `.github/CODEOWNERS`).
3. **Only after `Approved`** do you run the promotion checklist below and set `Status = Done`.
4. The **changelog entry + version bump happen at promotion time only** — so the showcase
   "What's New" panel only ever advertises approved, shipped changes.

### New component (run only after status is `Approved`)
- [ ] **Source** — create `src/components/ui/<name>.tsx` (import path `@/components/ui/<name>`)
- [ ] **Showcase** — add a live demo to the relevant section (`AtomsSection` / `MoleculesSection` / `OrganismsSection.tsx`)
- [ ] **§2 Available Components** — add a row (Atom / Molecule / Organism table)
- [ ] **§3 Use-Case Mapping** — add a row if it replaces a common anti-pattern (raw `<div>`, custom modal, etc.)
- [ ] **§9 Must NOT Do** — add a "use `<X>` instead of a custom …" line if relevant
- [ ] **§5 Token Quick Reference** — add any new `--cds-*` token the component introduces
- [ ] **`docs/ds-parity.csv`** — add the row (or flip status to `Done`) with the Figma node id
- [ ] **§10 Missing Components** — remove its row if it was previously listed as Missing
- [ ] **Changelog + version** — add an entry to `src/ds-changelog.ts`, bump `DS_VERSION` (minor for a new component), and run `npm run ds:changelog`. This is what surfaces the change to designers via the showcase "What's New" panel.

### New variant of an existing component (run only after status is `Approved`)
- [ ] **Source** — add the variant to the component's variant map / union (e.g. a new `size`, `colour`, `variant`)
- [ ] **Showcase** — demo the new variant alongside the existing ones
- [ ] **§2 / §3** — update the component's row/notes only if the variant changes its intended use
- [ ] **Changelog + version** — add an entry to `src/ds-changelog.ts`, bump `DS_VERSION` (minor for a new variant), and run `npm run ds:changelog`
- [ ] No `ds-parity.csv` change needed — the component already exists

> Rule of thumb: **usage** of existing props (e.g. `<Badge size="xs">` with an icon) is *not*
> a new variant and needs no promotion. Only changes to `src/components/ui/` source count.

---

## 13. DS Audit Checklist — Default Steps for Every Change

Any time a DS audit results in a component, variant, token, or template being
**added**, **modified**, or **deleted**, an AI agent must execute the full
checklist for the relevant operation below — without being asked.
No step is optional unless the column explicitly marks it N/A.

> Semver rule: **minor** bump for Added · **patch** bump for Modified/Fixed · **major** for breaking

---

### 13.1 ADDED — new component or template

| # | File / Action | Notes |
|---|---|---|
| 1 | `src/components/ui/<name>.tsx` | Create the source file |
| 2 | `src/sections/<Category>Section.tsx` | Add a live showcase demo |
| 3 | `AGENTS.md` §2 table | Add a row (Atom / Molecule / Organism) |
| 4 | `AGENTS.md` §3 use-case mapping | Add row if it replaces a raw-HTML anti-pattern |
| 5 | `AGENTS.md` §9 Must NOT Do | Add "use `<X>` instead of custom …" if relevant |
| 6 | `AGENTS.md` §10 Missing list | Remove its row if it was previously listed there |
| 7 | `docs/ds-parity.csv` | Add row — `Status = Done`, include Figma node ID |
| 8 | `src/ds-changelog.ts` | Add entry `type: "added"`, bump `DS_VERSION` (minor) |
| 9 | Run `npx tsx scripts/gen-changelog.ts` | Regenerates `CHANGELOG.md` |
| 10 | Commit → branch → `gh pr create` → `gh pr merge` | PR title: `feat(<scope>): add <ComponentName>` |

---

### 13.2 MODIFIED — existing component, variant, or token changed

| # | File / Action | Notes |
|---|---|---|
| 1 | `src/components/ui/<name>.tsx` | Edit the source file |
| 2 | `src/sections/<Category>Section.tsx` | Update showcase demo if the visual changes |
| 3 | `AGENTS.md` §2 / §3 / §5 | Update rows only if usage intent or tokens change |
| 4 | `docs/ds-parity.csv` | Update `Notes` column; keep `Status = Done` |
| 5 | `src/ds-changelog.ts` | Add entry `type: "changed"` or `"fixed"`, bump `DS_VERSION` (patch or minor for new variant) |
| 6 | Run `npx tsx scripts/gen-changelog.ts` | Regenerates `CHANGELOG.md` |
| 7 | Commit → branch → `gh pr create` → `gh pr merge` | PR title: `fix(<scope>): …` or `feat(<scope>): add <variant>` |

---

### 13.3 DELETED / DEPRECATED — component removed or retired

| # | File / Action | Notes |
|---|---|---|
| 1 | `src/components/ui/<name>.tsx` | Delete file (or add `@deprecated` JSDoc and keep for one release) |
| 2 | `src/sections/<Category>Section.tsx` | Remove the showcase demo block |
| 3 | `AGENTS.md` §2 table | Remove the row |
| 4 | `AGENTS.md` §3 use-case mapping | Remove or update the row |
| 5 | `AGENTS.md` §9 Must NOT Do | Remove any rule that referenced this component |
| 6 | `docs/ds-parity.csv` | Set `Status = Deprecated` |
| 7 | `src/ds-changelog.ts` | Add entry `type: "changed"` noting deprecation/removal, bump `DS_VERSION` (patch) |
| 8 | Run `npx tsx scripts/gen-changelog.ts` | Regenerates `CHANGELOG.md` |
| 9 | Grep repo for import references | Fix or remove all `import { X } from "@/components/ui/x"` usages |
| 10 | Commit → branch → `gh pr create` → `gh pr merge` | PR title: `chore(<scope>): deprecate <ComponentName>` |

---

### 13.4 Version bump quick reference

```
DS_VERSION lives in src/ds-changelog.ts
  New component or template  →  minor bump  (e.g. 1.2.0 → 1.3.0)
  New variant / API addition →  minor bump  (e.g. 1.3.0 → 1.4.0)
  Bug fix / token correction →  patch bump  (e.g. 1.3.0 → 1.3.1)
  Breaking API change        →  major bump  (e.g. 1.3.0 → 2.0.0)
```

After bumping, always run:
```bash
npx tsx scripts/gen-changelog.ts
```

---

## 14. Sync Notes for Maintainers

- This file lives in `creator-ds-react/AGENTS.md` (source of truth)
- It is copied verbatim to `creator-features/AGENTS.md` by the GitHub Actions sync workflow
- Update this file whenever: a new component is added, a component is deprecated, or a naming convention changes
- After updating, merge to `main` — the sync runs automatically

