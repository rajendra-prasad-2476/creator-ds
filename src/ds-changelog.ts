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
export const DS_VERSION = "1.8.0"

/** Newest entry first. */
export const DS_CHANGELOG: DSChangeEntry[] = [
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
