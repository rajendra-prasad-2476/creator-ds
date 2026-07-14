/**
 * Figma Code Connect — Tooltip
 *
 * Links the React tooltip components to their Figma design-library nodes so
 * that Figma Dev Mode shows the correct usage snippet when a designer selects
 * a tooltip component.
 *
 * Figma file : CTS-DS-AI-AGENT-RAJ  (IIwYOKoTL0OThySpCpykqr)
 * Nodes:
 *   Tooltip_Base ✦        2393:4315   → TooltipContent
 *   Rich_Tooltip_Core     2401:258    → RichTooltipContent (content structure)
 *   Rich_Tooltip_Base ✦   2402:502    → RichTooltipContent (full positioned)
 *
 * Publish:  npm run figma:publish
 */

import figma from "@figma/code-connect"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  RichTooltipContent,
} from "@/components/ui/tooltip"

const FILE = "https://www.figma.com/design/IIwYOKoTL0OThySpCpykqr/CTS-DS-AI-AGENT-RAJ"

// ─────────────────────────────────────────────────────────────────────────────
// 1. Tooltip_Base ✦  (node 2393:4315)
//    Simple dark tooltip · optional icons · all position × align variants
// ─────────────────────────────────────────────────────────────────────────────
figma.connect(
  TooltipContent,
  `${FILE}?node-id=2393-4315`,
  {
    props: {
      side: figma.enum("Position", {
        Bottom: "bottom",
        Top:    "top",
        Left:   "left",
        Right:  "right",
      }),
      align: figma.enum("Align", {
        Left:   "start",
        Center: "center",
        Right:  "end",
      }),
    },
    example: ({ side, align }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent side={side} align={align}>
            Tooltip label
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// 2. Rich_Tooltip_Core  (node 2401:258)
//    Rich content structure · three body types: Text | List | Table
// ─────────────────────────────────────────────────────────────────────────────
figma.connect(
  RichTooltipContent,
  `${FILE}?node-id=2401-258`,
  {
    props: {
      contentType: figma.enum("Type", {
        Text:  "text",
        List:  "list",
        Table: "table",
      }),
    },
    example: ({ contentType }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <RichTooltipContent heading="Heading" contentType={contentType}>
            Body text goes here
          </RichTooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// 3. Rich_Tooltip_Base ✦  (node 2402:502)
//    Full positioned rich tooltip · all position × align variants · dark mode
// ─────────────────────────────────────────────────────────────────────────────
figma.connect(
  RichTooltipContent,
  `${FILE}?node-id=2402-502`,
  {
    props: {
      side: figma.enum("Position", {
        Bottom: "bottom",
        Top:    "top",
        Left:   "left",
        Right:  "right",
      }),
      align: figma.enum("Align", {
        Left:   "start",
        Center: "center",
        Right:  "end",
      }),
    },
    example: ({ side, align }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <RichTooltipContent
            side={side}
            align={align}
            heading="Heading"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </RichTooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  }
)
