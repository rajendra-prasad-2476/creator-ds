# Creator DS — Changelog

> Generated from `src/ds-changelog.ts` — do not edit by hand. Run `npm run ds:changelog`.

Current version: **v1.10.2**

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
