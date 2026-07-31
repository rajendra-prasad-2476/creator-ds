import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeColour =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "pumpkin"
  | "wine"
  | "mustard"
  | "lawn"
  | "lime"
  | "aqua"
  | "indigo"
  | "lavender"
  | "lilac"

export type BadgeVariant = "prominent" | "subtle"

/** 16px → lg, 14px → md, 12px → sm, 11px → xs */
export type BadgeSize = "lg" | "md" | "sm" | "xs"

interface ColourTokens {
  prominentBg: string
  subtleBg: string
  border: string
  text: string
}

const COLOUR_MAP: Record<BadgeColour, ColourTokens> = {
  primary: {
    prominentBg: "var(--cds-primary-surface-low, #DDE6FD)",
    subtleBg: "var(--cds-primary-surface-subtle, #F5F8FE)",
    border: "var(--cds-primary-border-default, #0D4EF2)",
    text: "var(--cds-primary-text-default, #0D4EF2)",
  },
  success: {
    prominentBg: "var(--cds-success-surface-low, #E3FCEE)",
    subtleBg: "var(--cds-success-surface-subtle, #F6FEF9)",
    border: "var(--cds-success-border-default, #078841)",
    text: "var(--cds-success-text-default, #078841)",
  },
  warning: {
    prominentBg: "var(--cds-warning-surface-low, #FEEDE1)",
    subtleBg: "var(--cds-warning-surface-subtle, #FFF9F5)",
    border: "var(--cds-warning-border-default, #D25704)",
    text: "var(--cds-warning-text-default, #D25704)",
  },
  error: {
    prominentBg: "var(--cds-error-surface-low, #FCE4E3)",
    subtleBg: "var(--cds-error-surface-subtle, #FEF6F6)",
    border: "var(--cds-error-border-default, #CC1914)",
    text: "var(--cds-error-text-default, #CC1914)",
  },
  pumpkin: { prominentBg: "#FEF1E7", subtleBg: "#FEF9F5", border: "#F58D3D", text: "#C25A0A" },
  wine:    { prominentBg: "#FAEAEF", subtleBg: "#FDF6F8", border: "#D65C7A", text: "#CC3359" },
  mustard: { prominentBg: "#FCF5CF", subtleBg: "#FEFAE7", border: "#C2A30A", text: "#917A08" },
  lawn:    { prominentBg: "#E8F7D4", subtleBg: "#FAFDF6", border: "#72AD1F", text: "#558217" },
  lime:    { prominentBg: "#E9FBEC", subtleBg: "#F6FDF7", border: "#1FAD36", text: "#178229" },
  aqua:    { prominentBg: "#E7FAFE", subtleBg: "#F5FDFE", border: "#0AA3C2", text: "#087A91" },
  indigo:  { prominentBg: "#ECECF9", subtleBg: "#F7F7FC", border: "#4040BF", text: "#4040BF" },
  lavender:{ prominentBg: "#F0EBFA", subtleBg: "#F9F7FD", border: "#6633CC", text: "#6633CC" },
  lilac:   { prominentBg: "#FAEBFA", subtleBg: "#F9F7FD", border: "#CC33CC", text: "#A329A3" },
}

const SIZE_MAP: Record<BadgeSize, { fontSize: string; lineHeight: string; px: string; py: string }> = {
  lg: { fontSize: "16px", lineHeight: "21px", px: "10px", py: "6px" },
  md: { fontSize: "14px", lineHeight: "18px", px: "10px", py: "6px" },
  sm: { fontSize: "12px", lineHeight: "16px", px: "10px", py: "5px" },
  xs: { fontSize: "11px", lineHeight: "14px", px: "6px",  py: "2px" },
}

export interface BadgeProps {
  children?: React.ReactNode
  colour?: BadgeColour
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  style?: React.CSSProperties
}

function Badge({
  children,
  colour = "primary",
  variant = "prominent",
  size = "md",
  className,
  style,
}: BadgeProps) {
  const tokens = COLOUR_MAP[colour]
  const s = SIZE_MAP[size]

  return (
    <span
      className={cn("inline-flex items-center rounded-[4px] whitespace-nowrap font-medium", className)}
      style={{
        backgroundColor: variant === "prominent" ? tokens.prominentBg : tokens.subtleBg,
        border: variant === "subtle" ? `1px solid ${tokens.border}` : "none",
        color: tokens.text,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        padding: `${s.py} ${s.px}`,
        fontFamily: "'Zoho Puvi', 'Lato', sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export { Badge }
