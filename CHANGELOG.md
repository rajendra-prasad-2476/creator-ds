# Creator DS — Changelog

> Generated from `src/ds-changelog.ts` — do not edit by hand. Run `npm run ds:changelog`.

Current version: **v1.18.1**

## v1.18.1 — 2026-08-31

### Fixed
- **SplitPanelTemplate — DropdownMenuTrigger asChild** — Removed invalid asChild prop from DropdownMenuTrigger (Base UI does not support Radix-style asChild composition). Header action dropdown buttons now use buttonVariants() className directly on the trigger.
- **PdfExportSettingsScreen — PopoverTrigger asChild** — Removed invalid asChild prop from PopoverTrigger. Inner raw <button> merged into PopoverTrigger directly. Badge variant corrected from 'secondary' (non-existent) to 'subtle'.
- **OrganismsSection — unused imports** — Removed unused Copy import and unused onBack parameter to resolve TypeScript TS6133 errors.

## v1.18.0 — 2026-08-31

### Added
- **TemplatesSection — Builder Shell entry** — Builder Shell added to the Templates section picker. Renders BuilderShellDemo with Design / Workflow / Settings tab switching. Padded flag added to the template entry type so non-full-bleed components get section padding inside the preview frame.

### Changed
- **All templates — activeNavId** — All six page templates (CardGridTemplate, TabbedSectionsTemplate, SplitPanelTemplate, LinkCategoryTemplate, BreadcrumbDetailTemplate, BillingTemplate) now accept an activeNavId prop and pass it to LeftNav. Each template defaults to its canonical nav item (solutions, microservices, environments, operations, billing) so the left nav selection is correct out of the box.
- **SplitPanelTemplate — row-aligned grid layout** — Replaced the three-card flex layout with a CSS grid (240px left + 1fr per panel). Each app row now spans all columns at the same height. SplitPanelItem gains panelCells (Record<panelId, {label, sublabel, menuGroups}>) for per-app, per-environment cell data. SplitPanel now requires an id field. Search bar moved inside the left header cell. Column header height fixed with alignContent: start. Header action buttons unified to DS Button height via asChild.
- **BuilderShell — showViewportToolbar prop** — Added showViewportToolbar prop (default true) to BuilderShell. Setting false hides the Desktop/Tablet/Phone toolbar — used for the Settings tab where viewport switching is not applicable.
- **BuilderShellDemo — Settings tab** — BuilderShellDemo (Templates section showcase) now has full Settings tab interactivity: Settings Landing canvas (app icon + name/URL + category link grid) and Settings Detail canvas (DS LeftNav with app-settings sections + permissions table). Viewport switcher and properties panel are hidden when Settings is active.

## v1.17.0 — 2026-08-27

### Added
- **PageHeader** — New PageHeader organism: top-level page heading with title (H2), optional description (P2), optional right-side actions slot, and a bottom border separator (withBorder prop, default true). Promoted from the inline 'Page Header / Dashboard Header' showcase demo. Import from @/components/ui/page-header. _(ds-parity: PageHeader)_
- **MicroserviceCard** — New MicroserviceCard organism: interactive catalog card for microservice / resource listing grids. Built on Card interactive (hover border turns blue). Props: icon (slot), title, subtitle, description, footer (slot), onClick, className. Promoted from the inline 'Microservices Cards' showcase demo. Import from @/components/ui/microservice-card. _(ds-parity: MicroserviceCard)_
- **FormField** — New FormField organism: standard form field wrapper — Label (+ required asterisk) → input slot → helper text / validation error. Props: id, label, description, error, required, children, className. Closes the long-standing FormField parity gap. Import from @/components/ui/form-field. _(ds-parity: FormField)_

## v1.16.0 — 2026-07-30

### Added
- **BuilderShell** — New BuilderShell organism + sub-components for the app builder layout. Includes: BuilderTopBar (dark top bar with app icon tile, Design/Workflow/Settings centre tabs, Upgrade pill, Access CTA), BuilderLeftNav (dark collapsible entity tree with form/report/page/workflow/stage item types, user row), BuilderViewportToolbar (Desktop/Tablet/Phone device switcher + theme/layout tool icons), and BuilderShell (full layout shell composing all zones — left nav auto-collapses on tablet/phone viewport). Right-hand PropertiesPanel is a named slot (propertiesPanel + propertiesPanelTitle props). _(ds-parity: BuilderShell)_

## v1.15.0 — 2026-07-30

### Added
- **ProductIllustration** — New ProductIllustration atom: 22 scenario illustrations × Default / Active states (44 SVG assets). Use in empty-state panels, creation wizards, and type-selector tiles. Props: type (22 scenarios: create-report, create-form, create-page, create-workflow, page-blank, page-template, report-*, workflow-*), state (Default | Active), className, alt. SVG assets committed to public/illustrations/. Implemented from Figma node 7402:3230. _(ds-parity: ProductIllustration)_

## v1.14.0 — 2026-07-30

### Added
- **List** — New List organism: structured vertical list of data rows with optional checkbox (multi-select), avatar square, title + badge, meta text, action button, and remove (×) control. Supports Large (64px) and Default (52px) row density. Controlled and uncontrolled selection via selectedIds / onSelectionChange. Implemented from Figma node 6685:9545. _(ds-parity: List)_

## v1.13.0 — 2026-07-29

### Added
- **FullPageDialog** — New FullPageDialog organism: full-screen dialog shell with a header (title, status, action CTA, close), a 200px sidebar nav (section groups or numbered stepper), a scrollable content area, and an optional 240px hints panel. Supports navStyle='section' | 'stepper' and showHints prop. Implemented from Figma node 9072:26985. _(ds-parity: FullPageDialog)_

## v1.12.0 — 2026-07-28

### Added
- **Card** — New CardOperations variant: 'floated title pill' card for Operations / settings landing pages. A pill (icon circle + title) is absolutely positioned overlapping the white card body top. Body contains a 2-column link grid. Sub-components: CardOperations, CardOperationsPill, CardOperationsBody, CardOperationsGrid, CardOperationsLink. Implemented from Figma node 7301:5223. _(ds-parity: CardOperations)_

## v1.11.0 — 2026-07-28

### Added
- **Card** — New CardHorizontal variant: horizontal list-item card with illustration slot, title+description body, and CTA action button. CTA transitions from huegrey-bordered (default) to primary-fill on card hover via Tailwind group-hover. Sub-components: CardHorizontal, CardHorizontalIcon, CardHorizontalBody, CardHorizontalTitle, CardHorizontalDescription, CardHorizontalAction. _(ds-parity: CardHorizontal)_

## v1.10.4 — 2026-07-28

### Fixed
- **Card** — Figma parity audit: replaced rounded-xl with radius-l (10px); replaced ring-1/ring-foreground/10 shadow with border border-huegrey-border-fairish; bg-card replaced with bg-white; CardTitle updated to H5 tokens (20px/26px); CardDescription updated to P2 tokens (14px/18px); CardFooter uses huegrey-surface-subtle background and huegrey-border-low top border. Added interactive prop for hover-border-primary-default on clickable microservice cards.

## v1.10.3 — 2026-07-28

### Fixed
- **AlertDialog** — Figma parity audit fixes: popup border-radius corrected from radius-r (6px) to radius-l (10px); footer now has rounded bottom corners; description used non-existent --cds-text-b2/leading-b2 tokens (corrected to --cds-text-p2/leading-p2); title colour token updated to --cds-huegrey-text-dark; description colour updated to --cds-huegrey-text-default; cancel button border uses --cds-huegrey-border-fairish (was neutral-border-default); icon-to-title gap corrected to 20px.

## v1.10.2 — 2026-07-14

### Added
- **MCP Server** — New Creator DS MCP server (mcp/) exposing 7 AI tools: list_components, get_component, find_tokens, list_templates, creator_coding_guidelines, list_screens, validate_component_usage. AI agents (Copilot, Cursor, Claude) can now query the full component catalogue, design tokens, templates, and DS coding rules at code-generation time to always produce DS-compliant screens.

## v1.10.1 — 2026-07-14

### Changed
- **FeatureDashboard** — Removed 'Copy for Figma' button from the Feature Dashboard screen list. Figma plugin integration is skipped for now; only the Preview action is shown per screen row.

## v1.10.0 — 2026-07-10

### Changed
- **Tooltip** — Redesigned to match Figma CDS spec. TooltipContent: dark navy background (--cds-secondary-surface-default-hover), P2 white text, px-8/py-6 spacing, radius-r arrow, new leadingIcon/trailingIcon props. New RichTooltipContent molecule (Figma: Rich_Tooltip_Core 2401:258 / Rich_Tooltip_Base 2402:502): 281 px wide, heading + optional headingIcon, three body layouts — text (paragraph), list (numbered ol), table (label:value rows with primary-minimal blue labels). Tooltip showcase moved from Atoms to Molecules. _(ds-parity: Tooltip)_

## v1.9.0 — 2026-07-09

### Changed
- **Toggle** — Rebuilt as a DS-aligned sliding on/off switch (Figma: Toggle_Base ✦ 2435:645). 2 sizes (sm 14 px / default 16 px) × 3 variants (fill / border / subtle) × 6 colour states (primary / success / info / warning / error / huegrey). Fully accessible role=switch with aria-checked. Supports controlled & uncontrolled modes and an optional label inside the track. Replaces the legacy toolbar-button implementation. _(ds-parity: Toggle)_

## v1.8.0 — 2026-07-09

### Added
- **Tag** — New atom — dismissible chip/pill. 4 variants: default (filled grey), bold (semibold), outlined (filled + border), ghost (border only). 2 sizes: base (26 px) and small (18 px). Use closeable + onClose for interactive tags. Hover darkens background to --cds-huegrey-border-minimal. _(ds-parity: Tag / Chip)_
- **TagInput** — New molecule — multi-tag input field. Type + press Enter or comma to add a tag; Backspace on empty input removes the last tag; × dismisses individual tags. Supports controlled/uncontrolled mode, error state, disabled, and maxTags limit. _(ds-parity: TagInput)_

## v1.7.0 — 2026-07-09

### Fixed
- **Select** — Trigger resized to 36 px height (was 32 px), border updated to --cds-huegrey-border-fairish, hover/active/focus use --cds-primary-border-default + primary shadow, placeholder uses --cds-huegrey-text-fairish. Dropdown popup uses --cds-shadow-base, --cds-huegrey-border-minimal border, 10 px padding, and 1 px item gap. Items use --cds-secondary-surface-subtle-hover on focus and --cds-secondary-surface-subtle when selected. Added searchable prop with built-in search input + clear button. Removed dark-mode overrides.

## v1.6.0 — 2026-07-09

### Added
- **RadioCard** — New atom — selectable card with built-in radio indicator, label, and description. Works inside RadioGroup via the value prop. States: Default · Hover · Checked · Disabled. _(ds-parity: RadioCard)_

### Fixed
- **Checkbox** — Resized to 14 px (was 16 px) to match Figma. Updated border from generic border-input to --cds-huegrey-border-fairish. Corrected checked/hover/error colours to CDS primary tokens. Added indeterminate state (grey fill + minus icon via data-indeterminate). Removed dark-mode overrides.
- **RadioGroupItem** — Resized to 14 px (was 16 px) to match Figma. Updated border and hover/checked colours to CDS primary tokens. Reduced centre dot to 5 px. Corrected error state to use --cds-error-border-default. Removed dark-mode overrides.

## v1.5.0 — 2026-07-09

### Added
- **InputAffixed** — New molecule — text field with leading AND trailing interactive CTAs. Status (error/success) applies to the prefix CTA + input only; the right suffix CTA always stays in default grey. Use instead of two raw <span> elements flanking an <input>. _(ds-parity: InputAffixed)_

## v1.4.0 — 2026-07-09

### Added
- **InputPrefix** — New molecule — text field with a leading interactive CTA (icon, label) and optional trailing icon or clear ×. Supports default / error / success / disabled states. Use instead of composing a raw <span> + <input> side by side. _(ds-parity: InputPrefix)_

## v1.3.0 — 2026-07-09

### Added
- **InputSuffix** — New molecule — text field with a trailing interactive CTA (icon, label, or clear ×). Supports default / error / success / disabled states. Use instead of composing a raw <div> + <button> beside an <input>. _(ds-parity: InputSuffix)_

## v1.2.0 — 2026-07-08

### Added
- **StatusBadge** — New semantic status pill (configured / not-configured / error / pending) with a fixed colour + icon + label mapping. Use instead of hand-composing a Badge with an icon. _(ds-parity: StatusBadge)_

## v1.1.0 — 2026-07-08

### Added
- **Blanket** — New overlay/scrim backdrop component — use behind Sliders, Sheets and Dialogs instead of a custom rectangle. _(ds-parity: Blanket)_
- **Tokens** — New --cds-blanket-overlay token (primary-surface-bold-alpha10) for overlay scrims.

### Changed
- **LinkCategoryTemplate** — Added an activeNavId prop so landing pages (e.g. Operations) highlight the correct LeftNav item.

### Fixed
- **Dialog · Sheet · AlertDialog** — Overlay backdrops now use the Blanket scrim token and drop the backdrop blur to match the Figma spec.
