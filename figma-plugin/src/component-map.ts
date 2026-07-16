/**
 * component-map.ts
 *
 * Maps every React DS component name  →  the Figma component name (as it
 * appears in the Figma DS file) + how each React prop maps to a Figma
 * variant/property name and its value mapping.
 *
 * When the plugin starts, main.ts builds a { figmaName → key } registry from
 * the live document.  The UI joins this map with the registry to resolve the
 * Figma component key for each React component it encounters in the JSX.
 *
 * Prop mapping rules:
 *   - figmaProp   : the exact property name as shown in Figma
 *   - values      : React prop value  →  Figma variant value
 *                   use "*" as the key to pass the value through unchanged
 */

export interface PropMapping {
  figmaProp: string
  values: Record<string, string>
}

export interface ComponentMapEntry {
  /** Exact component name as it appears in the Figma file */
  figmaName: string
  /** React prop → Figma property mapping */
  props: Record<string, PropMapping>
}

export const COMPONENT_MAP: Record<string, ComponentMapEntry> = {
  // ── Atoms ──────────────────────────────────────────────────────────────────
  Button: {
    figmaName: "Button_Base ✦",
    props: {
      variant: {
        figmaProp: "Variant",
        values: {
          default:     "Primary",
          primary:     "Primary",
          secondary:   "Secondary",
          outline:     "Secondary",
          ghost:       "Ghost",
          destructive: "Danger",
          link:        "Link",
        },
      },
      size: {
        figmaProp: "Size",
        values: {
          default: "Medium",
          sm:      "Small",
          lg:      "Large",
          icon:    "Icon",
        },
      },
    },
  },

  Input: {
    figmaName: "Text_Input_Base ✦",
    props: {},
  },

  Textarea: {
    figmaName: "Textarea_Base ✦",
    props: {},
  },

  Label: {
    figmaName: "Label_Base ✦",
    props: {},
  },

  Checkbox: {
    figmaName: "Checkbox_Base ✦",
    props: {
      checked: {
        figmaProp: "State",
        values: { true: "Checked", false: "Unchecked" },
      },
    },
  },

  Switch: {
    figmaName: "Switch_Base ✦",
    props: {
      checked: {
        figmaProp: "Checked",
        values: { true: "True", false: "False" },
      },
    },
  },

  Toggle: {
    figmaName: "Toggle_Base ✦",
    props: {
      variant: {
        figmaProp: "Variant",
        values: { fill: "Fill", border: "Border", subtle: "Subtle" },
      },
      size: {
        figmaProp: "Size",
        values: { default: "Default", sm: "Small" },
      },
      color: {
        figmaProp: "Color",
        values: {
          primary: "Primary", success: "Success", info: "Info",
          warning: "Warning", error: "Error", huegrey: "HueGrey",
        },
      },
    },
  },

  Badge: {
    figmaName: "Badge_Base ✦",
    props: {
      variant: {
        figmaProp: "Variant",
        values: {
          default:     "Default",
          secondary:   "Secondary",
          destructive: "Destructive",
          outline:     "Outline",
          success:     "Success",
          warning:     "Warning",
          info:        "Info",
        },
      },
    },
  },

  StatusBadge: {
    figmaName: "StatusBadge_Base ✦",
    props: {
      status: {
        figmaProp: "Status",
        values: {
          configured:     "Configured",
          "not-configured": "Not Configured",
          error:          "Error",
          pending:        "Pending",
        },
      },
    },
  },

  Avatar: {
    figmaName: "Avatar_Base ✦",
    props: {
      size: {
        figmaProp: "Size",
        values: {
          default: "Medium",
          sm:      "Small",
          lg:      "Large",
        },
      },
    },
  },

  Tag: {
    figmaName: "Tag_Base ✦",
    props: {
      variant: {
        figmaProp: "Variant",
        values: {
          default:  "Default",
          bold:     "Bold",
          outlined: "Outlined",
          ghost:    "Ghost",
        },
      },
      size: {
        figmaProp: "Size",
        values: { default: "Base", sm: "Small" },
      },
    },
  },

  Slider: {
    figmaName: "Slider_Base ✦",
    props: {},
  },

  Progress: {
    figmaName: "Progress_Base ✦",
    props: {},
  },

  Separator: {
    figmaName: "Separator_Base ✦",
    props: {
      orientation: {
        figmaProp: "Orientation",
        values: { horizontal: "Horizontal", vertical: "Vertical" },
      },
    },
  },

  Blanket: {
    figmaName: "Blanket_Base ✦",
    props: {},
  },

  RadioCard: {
    figmaName: "RadioCard_Base ✦",
    props: {},
  },

  // ── Molecules ──────────────────────────────────────────────────────────────
  TooltipContent: {
    figmaName: "Tooltip_Base ✦",
    props: {
      side: {
        figmaProp: "Position",
        values: { bottom: "Bottom", top: "Top", left: "Left", right: "Right" },
      },
      align: {
        figmaProp: "Align",
        values: { start: "Left", center: "Center", end: "Right" },
      },
    },
  },

  RichTooltipContent: {
    figmaName: "Rich_Tooltip_Base ✦",
    props: {
      side: {
        figmaProp: "Position",
        values: { bottom: "Bottom", top: "Top", left: "Left", right: "Right" },
      },
      align: {
        figmaProp: "Align",
        values: { start: "Left", center: "Center", end: "Right" },
      },
      contentType: {
        figmaProp: "Type",
        values: { text: "Text", list: "List", table: "Table" },
      },
    },
  },

  Select: {
    figmaName: "Select_Base ✦",
    props: {},
  },

  Tabs: {
    figmaName: "Tabs_Base ✦",
    props: {},
  },

  ContentSwitcher: {
    figmaName: "ContentSwitcher_Base ✦",
    props: {},
  },

  Breadcrumb: {
    figmaName: "Breadcrumb_Base ✦",
    props: {},
  },

  Popover: {
    figmaName: "Popover_Base ✦",
    props: {},
  },

  DropdownMenu: {
    figmaName: "DropdownMenu_Base ✦",
    props: {},
  },

  Notes: {
    figmaName: "Notes_Base ✦",
    props: {
      variant: {
        figmaProp: "Variant",
        values: {
          info:    "Info",
          success: "Success",
          warning: "Warning",
          error:   "Error",
          neutral: "Neutral",
        },
      },
    },
  },

  TagInput: {
    figmaName: "TagInput_Base ✦",
    props: {},
  },

  InputSuffix: {
    figmaName: "InputSuffix_Base ✦",
    props: {},
  },

  InputPrefix: {
    figmaName: "InputPrefix_Base ✦",
    props: {},
  },

  InputAffixed: {
    figmaName: "InputAffixed_Base ✦",
    props: {},
  },

  Tile: {
    figmaName: "Tile_Base ✦",
    props: {},
  },

  // ── Organisms ──────────────────────────────────────────────────────────────
  Card: {
    figmaName: "Card_Base ✦",
    props: {},
  },

  Dialog: {
    figmaName: "Dialog_Base ✦",
    props: {},
  },

  AlertDialog: {
    figmaName: "AlertDialog_Base ✦",
    props: {},
  },

  Sheet: {
    figmaName: "Sheet_Base ✦",
    props: {
      side: {
        figmaProp: "Side",
        values: { right: "Right", left: "Left", top: "Top", bottom: "Bottom" },
      },
    },
  },

  Table: {
    figmaName: "Table_Base ✦",
    props: {},
  },

  TopBar: {
    figmaName: "TopBar_Base ✦",
    props: {},
  },

  LeftNav: {
    figmaName: "LeftNav_Base ✦",
    props: {},
  },
}
