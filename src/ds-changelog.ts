/**
 * Creator DS — Changelog (single source of truth)
 *
 * This file is the ONE place DS component/variant/token changes are recorded.
 * It powers three outputs:
 *   1. The "What's New" panel + version badge in the showcase (designer-facing)
 *   2. The generated CHANGELOG.md   (run: npm run ds:changelog)
 *   3. Human/AI audit of what shipped in each version
 *
 * Promotion rule (see AGENTS.md §11): any change to `src/components/ui/`,
 * `src/templates/`, or design tokens MUST add an entry here and bump DS_VERSION.
 * Semver: minor = new component/variant, patch = fix, major = breaking change.
 */

export type DSChangeType = "added" | "changed" | "fixed"

export interface DSChange {
  /** added = new component/variant/token · changed = behaviour/API · fixed = bug */
  type: DSChangeType
  /** Component / template / token area, e.g. "Blanket", "Badge", "LinkCategoryTemplate" */
  scope: string
  /** One-line, designer-readable description of what changed */
  summary: string
  /** Matching component name in docs/ds-parity.csv, if this fills a parity gap */
  parity?: string
}

export interface DSChangeEntry {
  version: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  changes: DSChange[]
}

/** Current DS version — surfaced as the version badge in the showcase TopBar. */
export const DS_VERSION = "1.17.0"

/** Newest entry first. */
export const DS_CHANGELOG: DSChangeEntry[] = [
  {
    version: "1.17.0",
    date: "2026-08-27",
    changes: [
      {
        type: "added",
        scope: "PageHeader",
        summary:
          "New PageHeader organism: top-level page heading with title (H2), optional description (P2), optional right-side actions slot, and a bottom border separator (withBorder prop, default true). Promoted from the inline 'Page Header / Dashboard Header' showcase demo. Import from @/components/ui/page-header.",
        parity: "PageHeader",
      },
      {
        type: "added",
        scope: "MicroserviceCard",
        summary:
          "New MicroserviceCard organism: interactive catalog card for microservice / resource listing grids. Built on Card interactive (hover border turns blue). Props: icon (slot), title, subtitle, description, footer (slot), onClick, className. Promoted from the inline 'Microservices Cards' showcase demo. Import from @/components/ui/microservice-card.",
        parity: "MicroserviceCard",
      },
      {
        type: "added",
        scope: "FormField",
        summary:
          "New FormField organism: standard form field wrapper — Label (+ required asterisk) → input slot → helper text / validation error. Props: id, label, description, error, required, children, className. Closes the long-standing FormField parity gap. Import from @/components/ui/form-field.",
        parity: "FormField",
      },
    ],
  },
  {
    version: "1.16.0",
    date: "2026-07-30",
    changes: [
      {
        type: "added",
        scope: "BuilderShell",
        summary:
          "New BuilderShell organism + sub-components for the app builder layout. Includes: BuilderTopBar (dark top bar with app icon tile, Design/Workflow/Settings centre tabs, Upgrade pill, Access CTA), BuilderLeftNav (dark collapsible entity tree with form/report/page/workflow/stage item types, user row), BuilderViewportToolbar (Desktop/Tablet/Phone device switcher + theme/layout tool icons), and BuilderShell (full layout shell composing all zones — left nav auto-collapses on tablet/phone viewport). Right-hand PropertiesPanel is a named slot (propertiesPanel + propertiesPanelTitle props).",
        parity: "BuilderShell",
      },
    ],
  },
  {
    version: "1.15.0",
    date: "2026-07-30",
    changes: [
      {
        type: "added",
        scope: "ProductIllustration",
        summary:
          "New ProductIllustration atom: 22 scenario illustrations × Default / Active states (44 SVG assets). Use in empty-state panels, creation wizards, and type-selector tiles. Props: type (22 scenarios: create-report, create-form, create-page, create-workflow, page-blank, page-template, report-*, workflow-*), state (Default | Active), className, alt. SVG assets committed to public/illustrations/. Implemented from Figma node 7402:3230.",
        parity: "ProductIllustration",
      },
    ],
  },
  {
    version: "1.14.0",
    date: "2026-07-30",
    changes: [
      {
        type: "added",
        scope: "List",
        summary:
          "New List organism: structured vertical list of data rows with optional checkbox (multi-select), avatar square, title + badge, meta text, action button, and remove (×) control. Supports Large (64px) and Default (52px) row density. Controlled and uncontrolled selection via selectedIds / onSelectionChange. Implemented from Figma node 6685:9545.",
        parity: "List",
      },
    ],
  },
  {
    version: "1.13.0",
    date: "2026-07-29",
    changes: [
      {
        type: "added",
        scope: "FullPageDialog",
        summary:
          "New FullPageDialog organism: full-screen dialog shell with a header (title, status, action CTA, close), a 200px sidebar nav (section groups or numbered stepper), a scrollable content area, and an optional 240px hints panel. Supports navStyle='section' | 'stepper' and showHints prop. Implemented from Figma node 9072:26985.",
        parity: "FullPageDialog",
      },
    ],
  },
  {
    version: "1.12.0",
    date: "2026-07-28",
    changes: [
      {
        type: "added",
        scope: "Card",
        summary:
          "New CardOperations variant: 'floated title pill' card for Operations / settings landing pages. A pill (icon circle + title) is absolutely positioned overlapping the white card body top. Body contains a 2-column link grid. Sub-components: CardOperations, CardOperationsPill, CardOperationsBody, CardOperationsGrid, CardOperationsLink. Implemented from Figma node 7301:5223.",
        parity: "CardOperations",
      },
    ],
  },
  {
    version: "1.11.0",
    date: "2026-07-28",
    changes: [
      {
        type: "added",
        scope: "Card",
        summary:
          "New CardHorizontal variant: horizontal list-item card with illustration slot, title+description body, and CTA action button. CTA transitions from huegrey-bordered (default) to primary-fill on card hover via Tailwind group-hover. Sub-components: CardHorizontal, CardHorizontalIcon, CardHorizontalBody, CardHorizontalTitle, CardHorizontalDescription, CardHorizontalAction.",
        parity: "CardHorizontal",
      },
    ],
  },
  {
    version: "1.10.4",
    date: "2026-07-28",
    changes: [
      {
        type: "fixed",
        scope: "Card",
        summary:
          "Figma parity audit: replaced rounded-xl with radius-l (10px); replaced ring-1/ring-foreground/10 shadow with border border-huegrey-border-fairish; bg-card replaced with bg-white; CardTitle updated to H5 tokens (20px/26px); CardDescription updated to P2 tokens (14px/18px); CardFooter uses huegrey-surface-subtle background and huegrey-border-low top border. Added interactive prop for hover-border-primary-default on clickable microservice cards.",
      },
    ],
  },
  {
    version: "1.10.3",
    date: "2026-07-28",
    changes: [
      {
        type: "fixed",
        scope: "AlertDialog",
        summary:
          "Figma parity audit fixes: popup border-radius corrected from radius-r (6px) to radius-l (10px); footer now has rounded bottom corners; description used non-existent --cds-text-b2/leading-b2 tokens (corrected to --cds-text-p2/leading-p2); title colour token updated to --cds-huegrey-text-dark; description colour updated to --cds-huegrey-text-default; cancel button border uses --cds-huegrey-border-fairish (was neutral-border-default); icon-to-title gap corrected to 20px.",
      },
    ],
  },
  {
    version: "1.10.2",
    date: "2026-07-14",
    changes: [
      {
        type: "added",
        scope: "MCP Server",
        summary:
          "New Creator DS MCP server (mcp/) exposing 7 AI tools: list_components, get_component, find_tokens, list_templates, creator_coding_guidelines, list_screens, validate_component_usage. AI agents (Copilot, Cursor, Claude) can now query the full component catalogue, design tokens, templates, and DS coding rules at code-generation time to always produce DS-compliant screens.",
      },
    ],
  },
  {
    version: "1.10.1",
    date: "2026-07-14",
    changes: [
      {
        type: "changed",
        scope: "FeatureDashboard",
        summary:
          "Removed 'Copy for Figma' button from the Feature Dashboard screen list. Figma plugin integration is skipped for now; only the Preview action is shown per screen row.",
      },
    ],
  },
  {
    version: "1.10.0",
    date: "2026-07-10",
    changes: [
      {
        type: "changed",
        scope: "Tooltip",
        summary:
          "Redesigned to match Figma CDS spec. TooltipContent: dark navy background (--cds-secondary-surface-default-hover), P2 white text, px-8/py-6 spacing, radius-r arrow, new leadingIcon/trailingIcon props. New RichTooltipContent molecule (Figma: Rich_Tooltip_Core 2401:258 / Rich_Tooltip_Base 2402:502): 281 px wide, heading + optional headingIcon, three body layouts — text (paragraph), list (numbered ol), table (label:value rows with primary-minimal blue labels). Tooltip showcase moved from Atoms to Molecules.",
        parity: "Tooltip",
      },
    ],
  },
  {
    version: "1.9.0",
    date: "2026-07-09",
    changes: [
      {
        type: "changed",
        scope: "Toggle",
        summary:
          "Rebuilt as a DS-aligned sliding on/off switch (Figma: Toggle_Base ✦ 2435:645). 2 sizes (sm 14 px / default 16 px) × 3 variants (fill / border / subtle) × 6 colour states (primary / success / info / warning / error / huegrey). Fully accessible role=switch with aria-checked. Supports controlled & uncontrolled modes and an optional label inside the track. Replaces the legacy toolbar-button implementation.",
        parity: "Toggle",
      },
    ],
  },
  {
    version: "1.8.0",
    date: "2026-07-09",
    changes: [
      {
        type: "added",
        scope: "Tag",
        summary:
          "New atom — dismissible chip/pill. 4 variants: default (filled grey), bold (semibold), outlined (filled + border), ghost (border only). 2 sizes: base (26 px) and small (18 px). Use closeable + onClose for interactive tags. Hover darkens background to --cds-huegrey-border-minimal.",
        parity: "Tag / Chip",
      },
      {
        type: "added",
        scope: "TagInput",
        summary:
          "New molecule — multi-tag input field. Type + press Enter or comma to add a tag; Backspace on empty input removes the last tag; × dismisses individual tags. Supports controlled/uncontrolled mode, error state, disabled, and maxTags limit.",
        parity: "TagInput",
      },
    ],
  },
  {
    version: "1.7.0",
    date: "2026-07-09",
    changes: [
      {
        type: "fixed",
        scope: "Select",
        summary:
          "Trigger resized to 36 px height (was 32 px), border updated to --cds-huegrey-border-fairish, hover/active/focus use --cds-primary-border-default + primary shadow, placeholder uses --cds-huegrey-text-fairish. Dropdown popup uses --cds-shadow-base, --cds-huegrey-border-minimal border, 10 px padding, and 1 px item gap. Items use --cds-secondary-surface-subtle-hover on focus and --cds-secondary-surface-subtle when selected. Added searchable prop with built-in search input + clear button. Removed dark-mode overrides.",
      },
    ],
  },
  {
    version: "1.6.0",
    date: "2026-07-09",
    changes: [
      {
        type: "added",
        scope: "RadioCard",
        summary:
          "New atom — selectable card with built-in radio indicator, label, and description. Works inside RadioGroup via the value prop. States: Default · Hover · Checked · Disabled.",
        parity: "RadioCard",
      },
      {
        type: "fixed",
        scope: "Checkbox",
        summary:
          "Resized to 14 px (was 16 px) to match Figma. Updated border from generic border-input to --cds-huegrey-border-fairish. Corrected checked/hover/error colours to CDS primary tokens. Added indeterminate state (grey fill + minus icon via data-indeterminate). Removed dark-mode overrides.",
      },
      {
        type: "fixed",
        scope: "RadioGroupItem",
        summary:
          "Resized to 14 px (was 16 px) to match Figma. Updated border and hover/checked colours to CDS primary tokens. Reduced centre dot to 5 px. Corrected error state to use --cds-error-border-default. Removed dark-mode overrides.",
      },
    ],
  },
  {
    version: "1.5.0",
    date: "2026-07-09",
    changes: [
      {
        type: "added",
        scope: "InputAffixed",
        summary:
          "New molecule — text field with leading AND trailing interactive CTAs. Status (error/success) applies to the prefix CTA + input only; the right suffix CTA always stays in default grey. Use instead of two raw <span> elements flanking an <input>.",
        parity: "InputAffixed",
      },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-07-09",
    changes: [
      {
        type: "added",
        scope: "InputPrefix",
        summary:
          "New molecule — text field with a leading interactive CTA (icon, label) and optional trailing icon or clear ×. Supports default / error / success / disabled states. Use instead of composing a raw <span> + <input> side by side.",
        parity: "InputPrefix",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-09",
    changes: [
      {
        type: "added",
        scope: "InputSuffix",
        summary:
          "New molecule — text field with a trailing interactive CTA (icon, label, or clear ×). Supports default / error / success / disabled states. Use instead of composing a raw <div> + <button> beside an <input>.",
        parity: "InputSuffix",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-08",
    changes: [
      {
        type: "added",
        scope: "StatusBadge",
        summary:
          "New semantic status pill (configured / not-configured / error / pending) with a fixed colour + icon + label mapping. Use instead of hand-composing a Badge with an icon.",
        parity: "StatusBadge",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-07-08",
    changes: [
      {
        type: "added",
        scope: "Blanket",
        summary:
          "New overlay/scrim backdrop component — use behind Sliders, Sheets and Dialogs instead of a custom rectangle.",
        parity: "Blanket",
      },
      {
        type: "added",
        scope: "Tokens",
        summary:
          "New --cds-blanket-overlay token (primary-surface-bold-alpha10) for overlay scrims.",
      },
      {
        type: "fixed",
        scope: "Dialog · Sheet · AlertDialog",
        summary:
          "Overlay backdrops now use the Blanket scrim token and drop the backdrop blur to match the Figma spec.",
      },
      {
        type: "changed",
        scope: "LinkCategoryTemplate",
        summary:
          "Added an activeNavId prop so landing pages (e.g. Operations) highlight the correct LeftNav item.",
      },
    ],
  },
]

/** Most recent release — convenience for the showcase "What's New" panel. */
export const LATEST_RELEASE = DS_CHANGELOG[0]
