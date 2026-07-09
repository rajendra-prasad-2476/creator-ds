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
export const DS_VERSION = "1.4.0"

/** Newest entry first. */
export const DS_CHANGELOG: DSChangeEntry[] = [
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
