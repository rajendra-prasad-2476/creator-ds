"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import * as React from "react"

import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Provider & Root
// ─────────────────────────────────────────────────────────────────────────────

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared arrow  — matches Figma Tip_Core (node 2393:4311)
// ─────────────────────────────────────────────────────────────────────────────

function TooltipArrow() {
  return (
    <TooltipPrimitive.Arrow
      className={cn(
        "z-50 size-2.5 rotate-45 rounded-[2px]",
        "bg-[var(--cds-secondary-surface-default-hover)]",
        "fill-[var(--cds-secondary-surface-default-hover)]",
        // top tooltip → arrow points down
        "translate-y-[calc(-50%-2px)]",
        "data-[side=top]:-bottom-2.5",
        // bottom tooltip → arrow points up
        "data-[side=bottom]:top-1",
        // left / right tooltips
        "data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2",
        "data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2",
        // logical inline directions
        "data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2",
        "data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2",
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple Tooltip Content — Figma: Tooltip_Base (node 2393:4315)
//
// Dark navy bubble · P2 text · optional leading/trailing icons · arrow
// px-8 py-6  gap-6  min-w-8  max-w-xs  radius-r
// ─────────────────────────────────────────────────────────────────────────────

interface TooltipContentProps
  extends TooltipPrimitive.Popup.Props,
    Pick<
      TooltipPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  /** 14 × 14 px icon rendered before the label. */
  leadingIcon?: React.ReactNode
  /** 14 × 14 px icon rendered after the label. */
  trailingIcon?: React.ReactNode
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            // layout
            "inline-flex items-start min-w-8 max-w-xs",
            leadingIcon || trailingIcon ? "gap-[var(--cds-space-6)]" : "",
            // spacing
            "px-[var(--cds-space-8)] py-[var(--cds-space-6)]",
            // visual
            "rounded-[var(--cds-radius-r)]",
            "bg-[var(--cds-secondary-surface-default-hover)]",
            // typography — P2 regular white
            "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
            "text-[var(--cds-white)] font-normal",
            // entrance / exit animation
            "origin-(--transform-origin)",
            "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            className
          )}
          {...props}
        >
          {leadingIcon && (
            <span className="mt-[2px] shrink-0 size-[14px] overflow-hidden">
              {leadingIcon}
            </span>
          )}
          <span className="flex-1 min-w-0 break-words">{children}</span>
          {trailingIcon && (
            <span className="mt-[2px] shrink-0 size-[14px] overflow-hidden">
              {trailingIcon}
            </span>
          )}
          <TooltipArrow />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich Tooltip Content — Figma: Rich_Tooltip_Core (node 2401:258)
//                                Rich_Tooltip_Base (node 2402:502)
//
// Dark navy · 281 px wide · heading + body · three content types:
//   "text"  — free-form paragraph (default)
//   "list"  — numbered ordered list
//   "table" — label : value rows
// ─────────────────────────────────────────────────────────────────────────────

/** A single row for `contentType="table"`. */
export interface TooltipTableRow {
  /** Row label — rendered in primary-minimal blue (#C0D1FC). */
  label: string
  /** Row value — rendered in white. */
  value: string
}

interface RichTooltipContentProps
  extends TooltipPrimitive.Popup.Props,
    Pick<
      TooltipPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  /**
   * Heading text displayed at the top of the tooltip.
   * Rendered in P2 white with optional leading icon.
   */
  heading?: React.ReactNode
  /**
   * Optional 14 × 14 px icon shown to the left of the heading text.
   */
  headingIcon?: React.ReactNode
  /**
   * Controls how body content is rendered.
   * - `"text"`  — paragraph; pass body copy in `children` (default)
   * - `"list"`  — numbered list; provide items via `listItems`
   * - `"table"` — key / value rows; provide data via `tableRows`
   */
  contentType?: "text" | "list" | "table"
  /** Items for `contentType="list"`. */
  listItems?: string[]
  /** Rows for `contentType="table"`. */
  tableRows?: TooltipTableRow[]
}

function RichTooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  heading,
  headingIcon,
  contentType = "text",
  listItems,
  tableRows,
  children,
  ...props
}: RichTooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            // layout
            "flex flex-col gap-[var(--cds-gap-small)] items-start",
            // width — matches Rich_Tooltip_Core spec (281 px)
            "w-[281px]",
            // spacing — px-12 / py-10 per Figma spec
            "px-[var(--cds-space-12)] py-[10px]",
            // visual
            "overflow-hidden rounded-[var(--cds-radius-r)]",
            "bg-[var(--cds-secondary-surface-default-hover)]",
            // entrance / exit animation
            "origin-(--transform-origin)",
            "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            className
          )}
          {...props}
        >
          {/* ── Heading row ── */}
          {heading && (
            <div className="flex items-start gap-[var(--cds-space-6)] shrink-0 w-full">
              {headingIcon && (
                <span className="mt-[2px] shrink-0 size-[14px] overflow-hidden text-[var(--cds-white)]">
                  {headingIcon}
                </span>
              )}
              <p className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-white)] font-normal whitespace-nowrap shrink-0">
                {heading}
              </p>
            </div>
          )}

          {/* ── Body: Text ── */}
          {contentType === "text" && children != null && (
            <p className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-white)] font-normal break-words w-full min-w-0">
              {children}
            </p>
          )}

          {/* ── Body: Ordered list ── */}
          {contentType === "list" && listItems && listItems.length > 0 && (
            <ol className="list-decimal text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-white)] font-normal w-full ps-[21px]">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          )}

          {/* ── Body: Key / value table ── */}
          {contentType === "table" && tableRows && tableRows.length > 0 && (
            <div className="w-full">
              {tableRows.map((row, i) => (
                <p
                  key={i}
                  className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal whitespace-pre-wrap break-words w-full"
                >
                  {/* label in primary-minimal blue */}
                  <span className="text-[var(--cds-primary-surface-minimal)]">{row.label}</span>
                  {/* separator in muted huegrey */}
                  <span className="text-[var(--cds-huegrey-border-fairish)]">{"       :       "}</span>
                  {/* value in white */}
                  <span className="text-[var(--cds-white)]">{row.value}</span>
                </p>
              ))}
            </div>
          )}

          <TooltipArrow />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, RichTooltipContent }
