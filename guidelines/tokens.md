# Creator DS — Design Token Guidelines

This file documents per-token usage patterns specific to the Creator DS kit.
Always use `var(--token-name)` over hardcoded color, spacing, or typography values so the kit's theming continues to apply.

## Naming pattern
```
--cds-{palette}-{role}-{scale}
```
- **palette**: `primary`, `success`, `warning`, `error`, `info`, `neutral`, `huegrey`
- **role**: `surface`, `text`, `border`
- **scale**: `subtle`, `low`, `minimal`, `default`, `bold` (and `-hover` variants)

## Semantic purpose
- `surface` tokens → background colors
- `text` tokens → foreground / type colors
- `border` tokens → outline / stroke colors
- `huegrey` → neutral grey palette (body text, muted text, dividers)
- `primary` → Creator brand blue (#0D4EF2)

## Core rule: always use `--cds-*` tokens
Never hardcode hex values, `rgb()`, or pixel values for colors, spacing, or border-radius.
Always use CSS custom properties via `var(--cds-*)`.

**Correct:**
```tsx
style={{ color: "var(--cds-primary-text-default)" }}
className="bg-[var(--cds-primary-surface-subtle)]"
```

**Wrong:**
```tsx
style={{ color: "#0D4EF2" }}
className="text-blue-500"
```

---

## Color tokens

### Naming pattern
```
--cds-{palette}-{role}-{scale}
```
- **palette**: `primary`, `success`, `warning`, `error`, `info`, `neutral`, `huegrey`
- **role**: `surface`, `text`, `border`
- **scale**: `subtle`, `low`, `minimal`, `default`, `bold` (and `-hover` variants)

### Primary (Creator brand blue)

| Token | Value | Use for |
|---|---|---|
| `--cds-primary-surface-default` | `#0D4EF2` | Primary button fill, active states |
| `--cds-primary-surface-default-hover` | `#0B44D5` | Primary button hover |
| `--cds-primary-surface-subtle` | `#F5F8FE` | Subtle blue backgrounds |
| `--cds-primary-surface-subtle-hover` | `#E7EDFE` | Minimal fill button bg |
| `--cds-primary-surface-low` | `#DDE6FD` | Minimal border button bg |
| `--cds-primary-surface-minimal` | `#C0D1FC` | Light borders |
| `--cds-primary-surface-bold` | `#031648` | Dark blue backgrounds |
| `--cds-primary-text-default` | `#0D4EF2` | Primary text, links |
| `--cds-primary-text-bold` | `#051F61` | Bold primary text |
| `--cds-primary-border-default` | `#0D4EF2` | Primary borders |
| `--cds-primary-border-low` | `#DDE6FD` | Subtle borders |
| `--cds-primary-border-minimal` | `#C0D1FC` | Very subtle borders |

### Semantic colours — decision tree

```
Is this a success/positive state?   → --cds-success-*
Is this a warning/caution state?    → --cds-warning-*
Is this an error/danger state?      → --cds-error-*
Is this informational?              → --cds-info-*  (same palette as primary)
Is this neutral/muted?              → --cds-huegrey-*
Is this body text on white?         → --cds-huegrey-text-dark  (#26282B)
Is this secondary/muted text?       → --cds-huegrey-text-default  (#696C74)
```

### Body text
| Token | Value | Use for |
|---|---|---|
| `--cds-huegrey-text-dark` | `#26282B` | Primary body text |
| `--cds-huegrey-text-default` | `#696C74` | Secondary/muted text |
| `--cds-huegrey-text-bold` | `#37383c` | Bold grey text |

### Success
| Token | Value |
|---|---|
| `--cds-success-surface-default` | `#078841` |
| `--cds-success-text-default` | `#078841` |
| `--cds-success-surface-subtle` | `#F6FEF9` |

### Warning
| Token | Value |
|---|---|
| `--cds-warning-surface-default` | `#D25704` |
| `--cds-warning-text-default` | `#D25704` |
| `--cds-warning-surface-subtle` | `#FFF9F5` |

### Error
| Token | Value |
|---|---|
| `--cds-error-surface-default` | `#CC1914` |
| `--cds-error-text-default` | `#CC1914` |
| `--cds-error-surface-subtle` | `#FEF6F6` |

### Special
| Token | Value | Use for |
|---|---|---|
| `--cds-white` | `#FFFFFF` | White text on coloured backgrounds |
| `--cds-black` | `#000000` | Pure black (rare) |
| `--cds-blanket-overlay` | `rgba(1,3,10,0.1)` | Overlay/scrim behind modals |
| `--border` | `#E5E5E7` | Default border colour |

---

## Spacing tokens

### Primitive scale
| Token | Value | When to use |
|---|---|---|
| `--cds-space-4` | `4px` | Tight internal gaps |
| `--cds-space-8` | `8px` | Related element gaps |
| `--cds-space-12` | `12px` | List item gaps |
| `--cds-space-16` | `16px` | Card padding, section gaps |
| `--cds-space-24` | `24px` | Between major sections |
| `--cds-space-32` | `32px` | Large section breaks |

### Semantic aliases (prefer these in components)
| Token | Value | Meaning |
|---|---|---|
| `--cds-gap-tight` | `4px` | Icon ↔ label gap |
| `--cds-gap-small` | `8px` | Between related elements |
| `--cds-gap-default` | `12px` | Between list items |
| `--cds-gap-medium` | `16px` | Between sections in a card |
| `--cds-gap-large` | `24px` | Between cards |
| `--cds-padding-card` | `16px` | Card internal padding |
| `--cds-padding-section-h` | `24px` | Content area horizontal padding |
| `--cds-padding-section-v` | `16px` | Content area vertical padding |

---

## Radius tokens

| Token | Value | Use for |
|---|---|---|
| `--cds-radius-xs` | `2px` | Tiny elements |
| `--cds-radius-s` | `4px` | Small buttons (xs size), tags |
| `--cds-radius-r` | `6px` | **Default** — cards, inputs, buttons |
| `--cds-radius-rl` | `8px` | Medium radius |
| `--cds-radius-l` | `10px` | Large cards |
| `--cds-radius-full` | `999px` | Pills, circle buttons, badges |

---

## Typography tokens

| Token | Size | Line-height | Use for |
|---|---|---|---|
| `--cds-text-h1` / `--cds-leading-h1` | `29px` | `38px` | Page titles |
| `--cds-text-h2` / `--cds-leading-h2` | `26px` | `34px` | Section headings |
| `--cds-text-h3` / `--cds-leading-h3` | `23px` | `30px` | Card headings |
| `--cds-text-p1` / `--cds-leading-p1` | `16px` | `21px` | Large body |
| `--cds-text-p2` / `--cds-leading-p2` | `14px` | `18px` | **Body default** |
| `--cds-text-p3` / `--cds-leading-p3` | `12px` | `15px` | Small labels |
| `--cds-text-p4` / `--cds-leading-p4` | `11px` | `14px` | Micro text |

### Font family
The only permitted font is **Zoho Puvi**. It is already set globally via `--cds-font-family-default`.
Do not override `font-family` on individual elements.

```css
/* Correct — inherits from body */
font-family: inherit;

/* Wrong */
font-family: 'Inter', sans-serif;
font-family: system-ui;
```

---

## Shadow tokens

| Token | Use for |
|---|---|
| `--cds-shadow-subtle` | Hovered cards, micro-elevation |
| `--cds-shadow-minimal` | Dropdowns, tooltips |
| `--cds-shadow-low` | Popovers, floating elements |
| `--cds-shadow-base` | Dialogs, sheets |
| `--cds-shadow-bold` | Modal overlays |

Colour-tinted variants also exist: `--cds-shadow-primary-*`, `--cds-shadow-success-*`, etc.
