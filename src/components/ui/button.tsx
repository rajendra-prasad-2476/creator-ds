import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * CDS Primary Button System
 *
 * Sizes    xs (26px) · sm (32px) · default/base (36px) · lg (40px)
 * Styles   default(fill) · outline(border) · ghost(minimal-border) ·
 *          subtle(minimal-fill) · link · hyperlink · secondary(huegrey) · destructive
 * Shapes   text buttons · icon (square) · circle icon
 */

const buttonVariants = cva(
  // ─── Shared base ──────────────────────────────────────────────────────────
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap " +
  "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal " +
  "transition-colors outline-none select-none " +
  "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default)]/40 focus-visible:ring-offset-1 " +
  "disabled:pointer-events-none disabled:opacity-40 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[14px]",
  {
    variants: {
      variant: {
        // Fill — blue bg, white text
        default:
          "bg-[var(--cds-primary-surface-default)] text-white " +
          "hover:bg-[var(--cds-primary-surface-default-hover)]",

        // Border — white bg, blue 1px border + blue text
        outline:
          "bg-white border border-[var(--cds-primary-border-default)] text-[var(--cds-primary-text-default)] " +
          "hover:bg-[var(--cds-primary-surface-subtle)] hover:border-[var(--cds-primary-surface-default-hover)] hover:text-[var(--cds-primary-surface-default-hover)]",

        // Minimal Border — white bg, very subtle border (#DDE6FD), blue text
        ghost:
          "bg-white border border-[var(--cds-primary-border-low)] text-[var(--cds-primary-text-default)] " +
          "hover:bg-[var(--cds-primary-surface-subtle)] hover:border-[var(--cds-primary-border-minimal)]",

        // Minimal Fill — light blue bg (#E7EDFE), blue text
        subtle:
          "bg-[var(--cds-primary-surface-subtle-hover)] text-[var(--cds-primary-text-default)] " +
          "hover:bg-[var(--cds-primary-surface-low)] hover:text-[var(--cds-primary-surface-default-hover)]",

        // Link — no bg/border, blue text, subtle bg on hover
        link:
          "text-[var(--cds-primary-text-default)] " +
          "hover:bg-[var(--cds-primary-surface-subtle)] hover:text-[var(--cds-primary-surface-default-hover)]",

        // Hyperlink — underlined blue text
        hyperlink:
          "text-[var(--cds-primary-text-default)] underline underline-offset-2 " +
          "hover:text-[var(--cds-primary-surface-default-hover)]",

        // HueGrey / Secondary — grey style
        secondary:
          "bg-[var(--cds-huegrey-surface-subtle)] text-[var(--cds-huegrey-text-dark)] " +
          "border border-[var(--cds-neutral-border-low)] " +
          "hover:bg-[var(--cds-neutral-border-low)]",

        // Danger / Destructive
        destructive:
          "bg-[var(--cds-error-surface-default)] text-white " +
          "hover:opacity-90",
      },

      size: {
        // ── Text button sizes ──────────────────────────────────────────────
        // Base✦ (default) — 36px
        default: "h-[36px] gap-[8px] px-[14px] rounded-[var(--cds-radius-r)]",
        // Large — 40px
        lg:      "h-[40px] gap-[8px] px-[16px] rounded-[var(--cds-radius-r)]",
        // Small — 32px
        sm:      "h-[32px] gap-[6px] px-[12px] rounded-[var(--cds-radius-r)]",
        // Extra Small — 26px
        xs:      "h-[26px] gap-[6px] px-[10px] rounded-[var(--cds-radius-s)]",

        // ── Icon button sizes (square) ─────────────────────────────────────
        icon:      "size-[36px] rounded-[var(--cds-radius-r)]",
        "icon-lg": "size-[40px] rounded-[var(--cds-radius-r)]",
        "icon-sm": "size-[32px] rounded-[var(--cds-radius-r)]",
        "icon-xs": "size-[26px] rounded-[var(--cds-radius-s)]",

        // ── Circle icon button sizes ───────────────────────────────────────
        circle:      "size-[36px] rounded-full",
        "circle-lg": "size-[40px] rounded-full",
        "circle-sm": "size-[32px] rounded-full",
        "circle-xs": "size-[26px] rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  intent,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { intent?: SplitButtonIntent }) {
  // When a semantic intent is supplied (and variant is a style key), override colors
  if (intent && intent !== "primary") {
    const styleKey = (variant as string) in (splitIntentMap[intent] ?? {})
      ? (variant as SplitButtonStyle)
      : "default"
    const entry = splitIntentMap[intent][styleKey]
    return (
      <ButtonPrimitive
        data-slot="button"
        className={cn(SPLIT_BASE, buttonVariants({ size }), entry.parts, className)}
        {...props}
      />
    )
  }
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// ─── Split Button ─────────────────────────────────────────────────────────────
// Two joined button parts: [Label | chevron]. Supports 7 semantic intents
// (primary, secondary, success, info, warning, error, huegrey) × 4 styles
// (default=Fill, outline=Border, ghost=Minimal Border, subtle=Minimal Fill) × 4 sizes.

type SplitButtonSize    = "default" | "lg" | "sm" | "xs"
type SplitButtonStyle   = "default" | "outline" | "ghost" | "subtle"
type SplitButtonIntent  = "primary" | "secondary" | "success" | "info" | "warning" | "error" | "huegrey"

// Shared non-color base for each button part
const SPLIT_BASE =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap " +
  "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal " +
  "transition-colors outline-none select-none " +
  "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default)]/40 focus-visible:ring-offset-1 " +
  "disabled:pointer-events-none disabled:opacity-40 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[14px]"

// Size classes: label part (height + padding + gap), chevron part (square)
const splitSizeMap: Record<SplitButtonSize, { label: string; chevron: string; radiusL: string; radiusR: string }> = {
  default: { label: "h-[36px] gap-[8px] px-[14px]", chevron: "size-[36px]", radiusL: "rounded-l-[var(--cds-radius-r)]", radiusR: "rounded-r-[var(--cds-radius-r)]" },
  lg:      { label: "h-[40px] gap-[8px] px-[16px]", chevron: "size-[40px]", radiusL: "rounded-l-[var(--cds-radius-r)]", radiusR: "rounded-r-[var(--cds-radius-r)]" },
  sm:      { label: "h-[32px] gap-[6px] px-[12px]", chevron: "size-[32px]", radiusL: "rounded-l-[var(--cds-radius-r)]", radiusR: "rounded-r-[var(--cds-radius-r)]" },
  xs:      { label: "h-[26px] gap-[6px] px-[10px]", chevron: "size-[26px]", radiusL: "rounded-l-[var(--cds-radius-s)]", radiusR: "rounded-r-[var(--cds-radius-s)]" },
}

// Color + style classes per intent × style
// `hasBorder` = true means left/right inner border removal is needed
type SplitStyleEntry = { parts: string; sep: string; hasBorder: boolean }
type SplitStyleMap = Record<SplitButtonStyle, SplitStyleEntry>

const splitIntentMap: Record<SplitButtonIntent, SplitStyleMap> = {
  primary: {
    default: { parts: "bg-[var(--cds-primary-surface-default)] text-white hover:bg-[var(--cds-primary-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-primary-border-default)] text-[var(--cds-primary-text-default)] hover:bg-[var(--cds-primary-surface-subtle)] hover:border-[var(--cds-primary-surface-default-hover)] hover:text-[var(--cds-primary-surface-default-hover)]", sep: "bg-[var(--cds-primary-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-primary-border-low)] text-[var(--cds-primary-text-default)] hover:bg-[var(--cds-primary-surface-subtle)] hover:border-[var(--cds-primary-border-minimal)]", sep: "bg-[var(--cds-primary-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-primary-surface-subtle-hover)] text-[var(--cds-primary-text-default)] hover:bg-[var(--cds-primary-surface-low)] hover:text-[var(--cds-primary-surface-default-hover)]", sep: "bg-[var(--cds-primary-border-low)]", hasBorder: false },
  },
  secondary: {
    default: { parts: "bg-[var(--cds-secondary-surface-default)] text-white hover:bg-[var(--cds-secondary-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-secondary-border-default)] text-[var(--cds-secondary-text-default)] hover:bg-[var(--cds-secondary-surface-subtle)] hover:border-[var(--cds-secondary-border-default-hover)] hover:text-[var(--cds-secondary-text-default-hover)]", sep: "bg-[var(--cds-secondary-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-secondary-border-low)] text-[var(--cds-secondary-text-default)] hover:bg-[var(--cds-secondary-surface-subtle)] hover:border-[var(--cds-secondary-border-low-hover)] hover:text-[var(--cds-secondary-text-default-hover)]", sep: "bg-[var(--cds-secondary-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-secondary-surface-subtle-hover)] text-[var(--cds-secondary-text-default)] hover:bg-[var(--cds-secondary-surface-low)] hover:text-[var(--cds-secondary-text-default-hover)]", sep: "bg-[var(--cds-secondary-border-low)]", hasBorder: false },
  },
  success: {
    default: { parts: "bg-[var(--cds-success-surface-default)] text-white hover:bg-[var(--cds-success-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-success-border-default)] text-[var(--cds-success-text-default)] hover:bg-[var(--cds-success-surface-subtle)] hover:border-[var(--cds-success-border-default-hover)] hover:text-[var(--cds-success-text-default-hover)]", sep: "bg-[var(--cds-success-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-success-border-low)] text-[var(--cds-success-text-default)] hover:bg-[var(--cds-success-surface-subtle)] hover:border-[var(--cds-success-border-low-hover)] hover:text-[var(--cds-success-text-default-hover)]", sep: "bg-[var(--cds-success-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-success-surface-subtle-hover)] text-[var(--cds-success-text-default)] hover:bg-[var(--cds-success-surface-low)] hover:text-[var(--cds-success-text-default-hover)]", sep: "bg-[var(--cds-success-border-low)]", hasBorder: false },
  },
  info: {
    default: { parts: "bg-[var(--cds-info-surface-default)] text-white hover:bg-[var(--cds-info-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-info-border-default)] text-[var(--cds-info-text-default)] hover:bg-[var(--cds-info-surface-subtle)] hover:border-[var(--cds-info-border-default-hover)] hover:text-[var(--cds-info-text-default-hover)]", sep: "bg-[var(--cds-info-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-info-border-low)] text-[var(--cds-info-text-default)] hover:bg-[var(--cds-info-surface-subtle)] hover:border-[var(--cds-info-border-low-hover)] hover:text-[var(--cds-info-text-default-hover)]", sep: "bg-[var(--cds-info-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-info-surface-subtle-hover)] text-[var(--cds-info-text-default)] hover:bg-[var(--cds-info-surface-low)] hover:text-[var(--cds-info-text-default-hover)]", sep: "bg-[var(--cds-info-border-low)]", hasBorder: false },
  },
  warning: {
    default: { parts: "bg-[var(--cds-warning-surface-default)] text-white hover:bg-[var(--cds-warning-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-warning-border-default)] text-[var(--cds-warning-text-default)] hover:bg-[var(--cds-warning-surface-subtle)] hover:border-[var(--cds-warning-border-default-hover)] hover:text-[var(--cds-warning-text-default-hover)]", sep: "bg-[var(--cds-warning-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-warning-border-low)] text-[var(--cds-warning-text-default)] hover:bg-[var(--cds-warning-surface-subtle)] hover:border-[var(--cds-warning-border-low-hover)] hover:text-[var(--cds-warning-text-default-hover)]", sep: "bg-[var(--cds-warning-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-warning-surface-subtle-hover)] text-[var(--cds-warning-text-default)] hover:bg-[var(--cds-warning-surface-low)] hover:text-[var(--cds-warning-text-default-hover)]", sep: "bg-[var(--cds-warning-border-low)]", hasBorder: false },
  },
  error: {
    default: { parts: "bg-[var(--cds-error-surface-default)] text-white hover:bg-[var(--cds-error-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-error-border-default)] text-[var(--cds-error-text-default)] hover:bg-[var(--cds-error-surface-subtle)] hover:border-[var(--cds-error-border-default-hover)] hover:text-[var(--cds-error-text-default-hover)]", sep: "bg-[var(--cds-error-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-error-border-low)] text-[var(--cds-error-text-default)] hover:bg-[var(--cds-error-surface-subtle)] hover:border-[var(--cds-error-border-low-hover)] hover:text-[var(--cds-error-text-default-hover)]", sep: "bg-[var(--cds-error-border-low)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-error-surface-subtle-hover)] text-[var(--cds-error-text-default)] hover:bg-[var(--cds-error-surface-low)] hover:text-[var(--cds-error-text-default-hover)]", sep: "bg-[var(--cds-error-border-low)]", hasBorder: false },
  },
  huegrey: {
    default: { parts: "bg-[var(--cds-huegrey-surface-default)] text-white hover:bg-[var(--cds-huegrey-surface-default-hover)]", sep: "bg-white/30", hasBorder: false },
    outline: { parts: "bg-white border border-[var(--cds-huegrey-border-default)] text-[var(--cds-huegrey-text-default)] hover:bg-[var(--cds-huegrey-surface-subtle)] hover:border-[var(--cds-huegrey-border-default-hover)] hover:text-[var(--cds-huegrey-text-default-hover)]", sep: "bg-[var(--cds-huegrey-border-default)]", hasBorder: true },
    ghost:   { parts: "bg-white border border-[var(--cds-huegrey-border-minimal)] text-[var(--cds-huegrey-text-default)] hover:bg-[var(--cds-huegrey-surface-subtle)] hover:border-[var(--cds-huegrey-border-minimal-hover)] hover:text-[var(--cds-huegrey-text-default-hover)]", sep: "bg-[var(--cds-huegrey-border-minimal)]", hasBorder: true },
    subtle:  { parts: "bg-[var(--cds-huegrey-surface-subtle-hover)] text-[var(--cds-huegrey-text-default)] hover:bg-[var(--cds-huegrey-surface-low)] hover:text-[var(--cds-huegrey-text-default-hover)]", sep: "bg-[var(--cds-huegrey-border-minimal)]", hasBorder: false },
  },
}

interface SplitButtonProps {
  children: React.ReactNode
  intent?: SplitButtonIntent
  variant?: SplitButtonStyle
  size?: SplitButtonSize
  className?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onDropdownClick?: React.MouseEventHandler<HTMLButtonElement>
}

function SplitButton({
  children,
  intent = "primary",
  variant = "default",
  size = "default",
  className,
  disabled,
  onClick,
  onDropdownClick,
}: SplitButtonProps) {
  const sz = splitSizeMap[size]
  const st = splitIntentMap[intent][variant]

  const leftRemove  = st.hasBorder ? "border-r-0" : ""
  const rightRemove = st.hasBorder ? "border-l-0" : ""

  return (
    <div
      data-slot="split-button"
      className={cn("inline-flex", className)}
      role="group"
    >
      {/* Label portion */}
      <ButtonPrimitive
        data-slot="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(SPLIT_BASE, sz.label, st.parts, "rounded-r-none", sz.radiusL, leftRemove)}
      >
        {children}
      </ButtonPrimitive>

      {/* Vertical separator */}
      <div className={cn("w-px shrink-0 self-stretch my-[6px]", st.sep)} aria-hidden="true" />

      {/* Chevron / dropdown trigger */}
      <ButtonPrimitive
        data-slot="button"
        disabled={disabled}
        onClick={onDropdownClick}
        aria-label="Open dropdown"
        className={cn(SPLIT_BASE, sz.chevron, st.parts, "rounded-l-none", sz.radiusR, rightRemove)}
      >
        <ChevronDown />
      </ButtonPrimitive>
    </div>
  )
}

export { Button, SplitButton, buttonVariants }
