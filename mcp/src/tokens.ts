/**
 * tokens.ts
 * Searchable catalog of all --cds-* design tokens defined in src/index.css.
 */

export interface Token {
  name: string           // e.g. --cds-primary-surface-default
  value: string          // e.g. #0D4EF2
  group: string          // e.g. "color-primary", "spacing", "radius"
  description: string
}

export const TOKENS: Token[] = [
  // ─── Color — Primary ────────────────────────────────────────────────────────
  { name: "--cds-primary-surface-default",        value: "#0D4EF2",              group: "color-primary",   description: "Primary blue fill — main CTA backgrounds" },
  { name: "--cds-primary-surface-default-hover",  value: "#0B44D5",              group: "color-primary",   description: "Primary blue fill on hover" },
  { name: "--cds-primary-surface-subtle",         value: "#F5F8FE",              group: "color-primary",   description: "Very light blue tint — hover backgrounds" },
  { name: "--cds-primary-surface-subtle-hover",   value: "#E7EDFE",              group: "color-primary",   description: "Light blue tint hover — subtle button fill" },
  { name: "--cds-primary-surface-low",            value: "#DDE6FD",              group: "color-primary",   description: "Low-emphasis blue surface" },
  { name: "--cds-primary-surface-minimal",        value: "#C0D1FC",              group: "color-primary",   description: "Minimal blue surface — ghost button border" },
  { name: "--cds-primary-surface-bold",           value: "#031648",              group: "color-primary",   description: "Deep navy fill" },
  { name: "--cds-primary-surface-bold-hover",     value: "#020C27",              group: "color-primary",   description: "Deep navy fill on hover" },
  { name: "--cds-primary-text-default",           value: "#0D4EF2",              group: "color-primary",   description: "Primary blue text" },
  { name: "--cds-primary-text-bold",              value: "#051F61",              group: "color-primary",   description: "Bold navy text" },
  { name: "--cds-primary-text-dark",              value: "#031648",              group: "color-primary",   description: "Dark navy text" },
  { name: "--cds-primary-border-default",         value: "#0D4EF2",              group: "color-primary",   description: "Primary blue border" },
  { name: "--cds-primary-border-minimal",         value: "#C0D1FC",              group: "color-primary",   description: "Minimal blue border — ghost button" },
  { name: "--cds-primary-border-low",             value: "#DDE6FD",              group: "color-primary",   description: "Low-emphasis blue border" },
  { name: "--cds-primary-border-subtle",          value: "#F5F8FE",              group: "color-primary",   description: "Subtle blue border" },

  // ─── Color — Success ─────────────────────────────────────────────────────────
  { name: "--cds-success-surface-default",        value: "#078841",              group: "color-success",   description: "Success green fill" },
  { name: "--cds-success-surface-low",            value: "#E3FCEE",              group: "color-success",   description: "Light green tint surface" },
  { name: "--cds-success-surface-subtle",         value: "#F6FEF9",              group: "color-success",   description: "Very light green tint" },
  { name: "--cds-success-text-default",           value: "#078841",              group: "color-success",   description: "Success green text" },
  { name: "--cds-success-text-bold",              value: "#033F1E",              group: "color-success",   description: "Bold dark green text" },
  { name: "--cds-success-border-default",         value: "#078841",              group: "color-success",   description: "Success green border" },
  { name: "--cds-success-border-low",             value: "#E3FCEE",              group: "color-success",   description: "Light green border" },

  // ─── Color — Warning ─────────────────────────────────────────────────────────
  { name: "--cds-warning-surface-default",        value: "#D25704",              group: "color-warning",   description: "Warning orange fill" },
  { name: "--cds-warning-surface-low",            value: "#FEEDE1",              group: "color-warning",   description: "Light orange tint surface" },
  { name: "--cds-warning-surface-subtle",         value: "#FFF9F5",              group: "color-warning",   description: "Very light orange tint" },
  { name: "--cds-warning-text-default",           value: "#D25704",              group: "color-warning",   description: "Warning orange text" },
  { name: "--cds-warning-text-bold",              value: "#612802",              group: "color-warning",   description: "Bold dark orange text" },
  { name: "--cds-warning-border-default",         value: "#D25704",              group: "color-warning",   description: "Warning orange border" },

  // ─── Color — Error ───────────────────────────────────────────────────────────
  { name: "--cds-error-surface-default",          value: "#CC1914",              group: "color-error",     description: "Error red fill" },
  { name: "--cds-error-surface-low",              value: "#FCE4E3",              group: "color-error",     description: "Light red tint surface" },
  { name: "--cds-error-surface-subtle",           value: "#FEF6F6",              group: "color-error",     description: "Very light red tint" },
  { name: "--cds-error-text-default",             value: "#CC1914",              group: "color-error",     description: "Error red text" },
  { name: "--cds-error-text-bold",                value: "#5F0A07",              group: "color-error",     description: "Bold dark red text" },
  { name: "--cds-error-border-default",           value: "#CC1914",              group: "color-error",     description: "Error red border" },
  { name: "--cds-error-border-low",               value: "#FCE4E3",              group: "color-error",     description: "Light red border" },

  // ─── Color — HueGrey (body text) ─────────────────────────────────────────────
  { name: "--cds-huegrey-text-dark",              value: "#26282B",              group: "color-huegrey",   description: "Body text — primary readable text colour" },
  { name: "--cds-huegrey-text-default",           value: "#696C74",              group: "color-huegrey",   description: "Muted / secondary text" },
  { name: "--cds-huegrey-text-bold",              value: "#37383C",              group: "color-huegrey",   description: "Bold dark text" },
  { name: "--cds-huegrey-surface-default",        value: "#696C74",              group: "color-huegrey",   description: "HueGrey fill" },
  { name: "--cds-huegrey-surface-subtle",         value: "#FAFAFA",              group: "color-huegrey",   description: "Very light grey background" },
  { name: "--cds-huegrey-surface-low",            value: "#EFF0F1",              group: "color-huegrey",   description: "Low-emphasis grey surface" },
  { name: "--cds-huegrey-border-default",         value: "#696C74",              group: "color-huegrey",   description: "HueGrey border" },
  { name: "--cds-huegrey-border-low",             value: "#EFF0F1",              group: "color-huegrey",   description: "Low-emphasis grey border" },
  { name: "--cds-huegrey-border-minimal",         value: "#D5D6D9",              group: "color-huegrey",   description: "Minimal grey border" },

  // ─── Color — Neutral ─────────────────────────────────────────────────────────
  { name: "--cds-neutral-surface-default",        value: "#6C6D71",              group: "color-neutral",   description: "Neutral grey fill" },
  { name: "--cds-neutral-surface-subtle",         value: "#FAFAFA",              group: "color-neutral",   description: "Subtle off-white surface" },
  { name: "--cds-neutral-surface-bold",           value: "#25272C",              group: "color-neutral",   description: "Dark/bold neutral fill" },
  { name: "--cds-neutral-text-default",           value: "#6C6D71",              group: "color-neutral",   description: "Neutral grey text" },
  { name: "--cds-neutral-border-default",         value: "#6C6D71",              group: "color-neutral",   description: "Neutral grey border" },
  { name: "--cds-neutral-border-low",             value: "#F0F0F0",              group: "color-neutral",   description: "Very light border" },

  // ─── Color — Constants ───────────────────────────────────────────────────────
  { name: "--cds-white",                          value: "#FFFFFF",              group: "color-constant",  description: "Pure white" },
  { name: "--cds-black",                          value: "#000000",              group: "color-constant",  description: "Pure black" },
  { name: "--cds-blanket-overlay",                value: "rgba(1,3,10,0.1)",    group: "color-constant",  description: "Blanket scrim overlay colour — used by Blanket component" },

  // ─── Color — Border shorthand ─────────────────────────────────────────────────
  { name: "--border",                             value: "#E5E5E7",              group: "color-border",    description: "Default border colour — use for card edges, dividers" },

  // ─── Spacing — Primitive ──────────────────────────────────────────────────────
  { name: "--cds-space-0",   value: "0px",  group: "spacing-primitive",  description: "0px" },
  { name: "--cds-space-1",   value: "1px",  group: "spacing-primitive",  description: "1px" },
  { name: "--cds-space-2",   value: "2px",  group: "spacing-primitive",  description: "2px" },
  { name: "--cds-space-4",   value: "4px",  group: "spacing-primitive",  description: "4px" },
  { name: "--cds-space-6",   value: "6px",  group: "spacing-primitive",  description: "6px" },
  { name: "--cds-space-8",   value: "8px",  group: "spacing-primitive",  description: "8px" },
  { name: "--cds-space-12",  value: "12px", group: "spacing-primitive",  description: "12px" },
  { name: "--cds-space-16",  value: "16px", group: "spacing-primitive",  description: "16px" },
  { name: "--cds-space-20",  value: "20px", group: "spacing-primitive",  description: "20px" },
  { name: "--cds-space-24",  value: "24px", group: "spacing-primitive",  description: "24px" },
  { name: "--cds-space-32",  value: "32px", group: "spacing-primitive",  description: "32px" },
  { name: "--cds-space-40",  value: "40px", group: "spacing-primitive",  description: "40px" },
  { name: "--cds-space-48",  value: "48px", group: "spacing-primitive",  description: "48px" },
  { name: "--cds-space-64",  value: "64px", group: "spacing-primitive",  description: "64px" },
  { name: "--cds-space-80",  value: "80px", group: "spacing-primitive",  description: "80px" },

  // ─── Spacing — Semantic ───────────────────────────────────────────────────────
  { name: "--cds-gap-tight",          value: "var(--cds-space-4)  = 4px",   group: "spacing-semantic",  description: "4px — Icon ↔ label gap, chip internals" },
  { name: "--cds-gap-small",          value: "var(--cds-space-8)  = 8px",   group: "spacing-semantic",  description: "8px — Between related form elements" },
  { name: "--cds-gap-default",        value: "var(--cds-space-12) = 12px",  group: "spacing-semantic",  description: "12px — Between items in a list or row" },
  { name: "--cds-gap-medium",         value: "var(--cds-space-16) = 16px",  group: "spacing-semantic",  description: "16px — Between sections within a card" },
  { name: "--cds-gap-large",          value: "var(--cds-space-24) = 24px",  group: "spacing-semantic",  description: "24px — Between cards, major sections" },
  { name: "--cds-padding-card",       value: "var(--cds-space-16) = 16px",  group: "spacing-semantic",  description: "16px — Card internal padding (all sides)" },
  { name: "--cds-padding-section-h",  value: "var(--cds-space-24) = 24px",  group: "spacing-semantic",  description: "24px — Content area horizontal padding" },
  { name: "--cds-padding-section-v",  value: "var(--cds-space-16) = 16px",  group: "spacing-semantic",  description: "16px — Content area vertical padding" },
  { name: "--cds-padding-row-v",      value: "var(--cds-space-16) = 16px",  group: "spacing-semantic",  description: "16px — Row vertical padding" },
  { name: "--cds-padding-row-h",      value: "var(--cds-space-24) = 24px",  group: "spacing-semantic",  description: "24px — Row horizontal padding" },

  // ─── Border Radius ────────────────────────────────────────────────────────────
  { name: "--cds-radius-null",  value: "0px",   group: "radius",  description: "No radius — square corners" },
  { name: "--cds-radius-xs",    value: "2px",   group: "radius",  description: "Extra small radius" },
  { name: "--cds-radius-s",     value: "4px",   group: "radius",  description: "Small radius — badges, tags" },
  { name: "--cds-radius-r",     value: "6px",   group: "radius",  description: "Regular radius — default for cards, inputs" },
  { name: "--cds-radius-rl",    value: "8px",   group: "radius",  description: "Regular-large radius" },
  { name: "--cds-radius-l",     value: "10px",  group: "radius",  description: "Large radius" },
  { name: "--cds-radius-xl",    value: "14px",  group: "radius",  description: "Extra-large radius" },
  { name: "--cds-radius-2xl",   value: "18px",  group: "radius",  description: "2x large radius" },
  { name: "--cds-radius-3xl",   value: "20px",  group: "radius",  description: "3x large radius" },
  { name: "--cds-radius-full",  value: "999px", group: "radius",  description: "Pill / fully-rounded" },

  // ─── Typography ───────────────────────────────────────────────────────────────
  { name: "--cds-font-family-default",  value: "'Zoho Puvi', system-ui, sans-serif",  group: "typography",  description: "ONLY permitted font — do not override" },
  { name: "--cds-text-h1",   value: "29px",  group: "typography",  description: "Heading 1 font-size" },
  { name: "--cds-text-h2",   value: "26px",  group: "typography",  description: "Heading 2 font-size" },
  { name: "--cds-text-h3",   value: "23px",  group: "typography",  description: "Heading 3 font-size" },
  { name: "--cds-text-p1",   value: "16px",  group: "typography",  description: "Paragraph 1 (large body)" },
  { name: "--cds-text-p2",   value: "14px",  group: "typography",  description: "Paragraph 2 — body default" },
  { name: "--cds-text-p3",   value: "12px",  group: "typography",  description: "Paragraph 3 (small)" },
  { name: "--cds-text-p4",   value: "11px",  group: "typography",  description: "Paragraph 4 (caption)" },
  { name: "--cds-leading-h1", value: "38px", group: "typography",  description: "H1 line-height" },
  { name: "--cds-leading-h2", value: "34px", group: "typography",  description: "H2 line-height" },
  { name: "--cds-leading-h3", value: "30px", group: "typography",  description: "H3 line-height" },
  { name: "--cds-leading-p1", value: "21px", group: "typography",  description: "P1 line-height" },
  { name: "--cds-leading-p2", value: "18px", group: "typography",  description: "P2 line-height" },
  { name: "--cds-leading-p3", value: "15px", group: "typography",  description: "P3 line-height" },
  { name: "--cds-leading-p4", value: "14px", group: "typography",  description: "P4 line-height" },

  // ─── Shadows ──────────────────────────────────────────────────────────────────
  { name: "--cds-shadow-subtle",         value: "0 2px 2px 0 rgba(38,40,43,0.05)",                                                        group: "shadow",  description: "Subtle shadow — minimal lift" },
  { name: "--cds-shadow-minimal",        value: "0 2px 4px 0 rgba(38,40,43,0.08), 0 2px 2px 0 rgba(5,5,6,0.05)",                         group: "shadow",  description: "Minimal shadow" },
  { name: "--cds-shadow-low",            value: "0 4px 8px 0 rgba(38,40,43,0.08), 0 2px 2px 0 rgba(5,5,6,0.05)",                         group: "shadow",  description: "Low shadow — cards" },
  { name: "--cds-shadow-base",           value: "0 12px 16px -4px rgba(38,40,43,0.08), 0 2px 2px 0 rgba(5,5,6,0.05)",                    group: "shadow",  description: "Base shadow — popovers, dropdowns" },
  { name: "--cds-shadow-bold",           value: "0 20px 24px -4px rgba(38,40,43,0.12), 0 2px 2px 0 rgba(5,5,6,0.05)",                    group: "shadow",  description: "Bold shadow — modals, sheets" },
  { name: "--cds-shadow-primary-base",   value: "0 12px 16px -4px rgba(13,78,242,0.08), 0 2px 2px 0 rgba(13,78,242,0.05)",               group: "shadow",  description: "Primary blue shadow — focused CTAs" },
]

export function findTokens(query: string): Token[] {
  const q = query.toLowerCase()
  return TOKENS.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.group.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.value.toLowerCase().includes(q)
  )
}

export function listTokenGroups(): string[] {
  return [...new Set(TOKENS.map(t => t.group))].sort()
}
