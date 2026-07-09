"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

/** sm = 14 px · default = 16 px · lg = 18 px */
export type ToggleSize = "sm" | "default" | "lg"
export type ToggleVariant = "fill" | "border" | "subtle"
export type ToggleColor =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "huegrey"

export interface ToggleProps {
  /** Controlled checked state */
  checked?: boolean
  /** Uncontrolled initial state */
  defaultChecked?: boolean
  /** Called when the toggle is clicked */
  onCheckedChange?: (checked: boolean) => void
  /** Track + thumb sizing — sm = 14 px · default = 16 px · lg = 18 px */
  size?: ToggleSize
  /** Visual style applied when toggled ON */
  variant?: ToggleVariant
  /** Semantic colour used when toggled ON */
  color?: ToggleColor
  /** Text or icon rendered inside the track alongside the thumb */
  label?: React.ReactNode
  disabled?: boolean
  id?: string
  className?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  style?: React.CSSProperties
}

// ─── Design tokens ───────────────────────────────────────────────────────────

// Off state is the same across all colours and variants
const OFF = {
  trackBg: "var(--cds-huegrey-surface-low, #eff0f1)",
  thumbBg: "var(--cds-white, #ffffff)",
  thumbShadow: "0px 2px 2px 0px rgba(5,5,6,0.05)",
  labelColor: "var(--cds-huegrey-text-bold, #37383c)",
  border: "transparent",
} as const

interface OnTokens {
  trackBg: string
  thumbBg: string
  thumbShadow: string
  labelColor: string
  borderColor: string
}

const COLOR_MAP: Record<ToggleColor, Record<ToggleVariant, OnTokens>> = {
  primary: {
    fill: {
      trackBg: "var(--cds-primary-surface-default, #0d4ef2)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(5,5,6,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-primary-surface-subtle, #f5f8fe)",
      thumbBg: "var(--cds-primary-surface-default, #0d4ef2)",
      thumbShadow: "0px 2px 2px 0px rgba(13,78,242,0.05)",
      labelColor: "var(--cds-primary-text-default, #0d4ef2)",
      borderColor: "var(--cds-primary-border-default, #0d4ef2)",
    },
    subtle: {
      trackBg: "var(--cds-primary-surface-low, #dde6fd)",
      thumbBg: "var(--cds-primary-surface-default, #0d4ef2)",
      thumbShadow: "0px 2px 2px 0px rgba(13,78,242,0.05)",
      labelColor: "var(--cds-primary-text-default, #0d4ef2)",
      borderColor: "transparent",
    },
  },
  success: {
    fill: {
      trackBg: "var(--cds-success-surface-default, #078841)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(7,136,65,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-success-surface-subtle, #f6fef9)",
      thumbBg: "var(--cds-success-surface-default, #078841)",
      thumbShadow: "0px 2px 2px 0px rgba(7,136,65,0.05)",
      labelColor: "var(--cds-success-text-default, #078841)",
      borderColor: "var(--cds-success-border-default, #078841)",
    },
    subtle: {
      trackBg: "var(--cds-success-surface-low, #e3fcee)",
      thumbBg: "var(--cds-success-surface-default, #078841)",
      thumbShadow: "0px 2px 2px 0px rgba(7,136,65,0.05)",
      labelColor: "var(--cds-success-text-default, #078841)",
      borderColor: "transparent",
    },
  },
  info: {
    fill: {
      trackBg: "var(--cds-info-surface-default, #0d4ef2)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(5,5,6,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-info-surface-subtle, #f5f8fe)",
      thumbBg: "var(--cds-info-surface-default, #0d4ef2)",
      thumbShadow: "0px 2px 2px 0px rgba(13,78,242,0.05)",
      labelColor: "var(--cds-info-text-default, #0d4ef2)",
      borderColor: "var(--cds-info-border-default, #0d4ef2)",
    },
    subtle: {
      trackBg: "var(--cds-info-surface-low, #dde6fd)",
      thumbBg: "var(--cds-info-surface-default, #0d4ef2)",
      thumbShadow: "0px 2px 2px 0px rgba(13,78,242,0.05)",
      labelColor: "var(--cds-info-text-default, #0d4ef2)",
      borderColor: "transparent",
    },
  },
  warning: {
    fill: {
      trackBg: "var(--cds-warning-surface-default, #d25704)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(210,87,4,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-warning-surface-subtle, #fff9f5)",
      thumbBg: "var(--cds-warning-surface-default, #d25704)",
      thumbShadow: "0px 2px 2px 0px rgba(210,87,4,0.05)",
      labelColor: "var(--cds-warning-text-default, #d25704)",
      borderColor: "var(--cds-warning-border-default, #d25704)",
    },
    subtle: {
      trackBg: "var(--cds-warning-surface-low, #feede1)",
      thumbBg: "var(--cds-warning-surface-default, #d25704)",
      thumbShadow: "0px 2px 2px 0px rgba(210,87,4,0.05)",
      labelColor: "var(--cds-warning-text-default, #d25704)",
      borderColor: "transparent",
    },
  },
  error: {
    fill: {
      trackBg: "var(--cds-error-surface-default, #cc1914)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(204,25,20,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-error-surface-subtle, #fef6f6)",
      thumbBg: "var(--cds-error-surface-default, #cc1914)",
      thumbShadow: "0px 2px 2px 0px rgba(204,25,20,0.05)",
      labelColor: "var(--cds-error-text-default, #cc1914)",
      borderColor: "var(--cds-error-border-default, #cc1914)",
    },
    subtle: {
      trackBg: "var(--cds-error-surface-low, #fce4e3)",
      thumbBg: "var(--cds-error-surface-default, #cc1914)",
      thumbShadow: "0px 2px 2px 0px rgba(204,25,20,0.05)",
      labelColor: "var(--cds-error-text-default, #cc1914)",
      borderColor: "transparent",
    },
  },
  huegrey: {
    fill: {
      trackBg: "var(--cds-huegrey-surface-default, #696c74)",
      thumbBg: "var(--cds-white, #ffffff)",
      thumbShadow: "0px 2px 2px 0px rgba(5,5,6,0.05)",
      labelColor: "var(--cds-white, #ffffff)",
      borderColor: "transparent",
    },
    border: {
      trackBg: "var(--cds-huegrey-surface-subtle, #fafafa)",
      thumbBg: "var(--cds-huegrey-surface-default, #696c74)",
      thumbShadow: "0px 2px 2px 0px rgba(105,108,116,0.05)",
      labelColor: "var(--cds-huegrey-text-default, #696c74)",
      borderColor: "var(--cds-huegrey-border-default, #696c74)",
    },
    subtle: {
      trackBg: "var(--cds-huegrey-surface-low, #eff0f1)",
      thumbBg: "var(--cds-huegrey-surface-default, #696c74)",
      thumbShadow: "0px 2px 2px 0px rgba(105,108,116,0.05)",
      labelColor: "var(--cds-huegrey-text-default, #696c74)",
      borderColor: "transparent",
    },
  },
}

// ─── Size tokens ─────────────────────────────────────────────────────────────

const SIZE = {
  /** 14 px track · 10 px thumb */
  sm: {
    trackHeight: "14px",
    trackMinWidth: "30px",
    thumbSize: "10px",
    padding: "2px",
    gap: "2px",
    labelFontSize: "var(--cds-text-p6, 9px)",
    labelLineHeight: "var(--cds-leading-p6, 12px)",
  },
  /** 16 px track · 12 px thumb */
  default: {
    trackHeight: "16px",
    trackMinWidth: "34px",
    thumbSize: "12px",
    padding: "2px",
    gap: "2px",
    labelFontSize: "var(--cds-text-p6, 9px)",
    labelLineHeight: "var(--cds-leading-p6, 12px)",
  },
  /** 18 px track · 14 px thumb */
  lg: {
    trackHeight: "18px",
    trackMinWidth: "38px",
    thumbSize: "14px",
    padding: "2px",
    gap: "2px",
    labelFontSize: "var(--cds-text-p5, 10px)",
    labelLineHeight: "var(--cds-leading-p5, 13px)",
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  size = "default",
  variant = "fill",
  color = "primary",
  label,
  disabled = false,
  id,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? controlledChecked : internalChecked

  function handleClick() {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  const sz = SIZE[size]
  const tokens: OnTokens = COLOR_MAP[color][variant]

  const trackBg = isChecked ? tokens.trackBg : OFF.trackBg
  const thumbBg = isChecked ? tokens.thumbBg : OFF.thumbBg
  const thumbShadow = isChecked ? tokens.thumbShadow : OFF.thumbShadow
  const labelColor = isChecked ? tokens.labelColor : OFF.labelColor
  const trackBorder =
    isChecked && tokens.borderColor !== "transparent"
      ? `0.5px solid ${tokens.borderColor}`
      : "0.5px solid transparent"

  const hasLabel = label !== undefined && label !== null && label !== ""

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      data-slot="toggle"
      data-checked={isChecked ? "" : undefined}
      onClick={handleClick}
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--cds-primary-surface-default,#0d4ef2)] rounded-full disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent", ...style }}
    >
      {/*
       * Track — flex row.
       * Layout matches Figma exactly: thumb and label/icon are both flex items.
       * When OFF: [thumb] [label]  (justify-start)
       * When ON:  [label] [thumb]  (justify-end)
       * Using CSS `order` to swap positions avoids absolute-positioning overlap.
       */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: isChecked ? "flex-end" : "flex-start",
          height: sz.trackHeight,
          minWidth: sz.trackMinWidth,
          borderRadius: "var(--cds-radius-full, 999px)",
          padding: sz.padding,
          gap: sz.gap,
          backgroundColor: trackBg,
          border: trackBorder,
          boxSizing: "border-box",
          transition: "background-color 200ms ease, border-color 200ms ease",
        }}
      >
        {/* Thumb — flex item, order swaps with label on state change */}
        <span
          style={{
            display: "block",
            flexShrink: 0,
            width: sz.thumbSize,
            height: sz.thumbSize,
            borderRadius: "var(--cds-radius-full, 999px)",
            backgroundColor: thumbBg,
            boxShadow: thumbShadow,
            order: isChecked ? 1 : 0,
            transition: "background-color 200ms ease, box-shadow 200ms ease",
          }}
        />

        {/* Label / icon — rendered on opposite side of thumb */}
        {hasLabel && (
          <span
            aria-hidden
            style={{
              fontFamily:
                "var(--cds-font-family-default, 'Zoho Puvi', sans-serif)",
              fontSize: sz.labelFontSize,
              lineHeight: sz.labelLineHeight,
              fontWeight: 400,
              color: labelColor,
              whiteSpace: "nowrap",
              userSelect: "none",
              display: "inline-flex",
              alignItems: "center",
              order: isChecked ? 0 : 1,
              transition: "color 200ms ease",
            }}
          >
            {label}
          </span>
        )}
      </span>
    </button>
  )
}

export { Toggle }
