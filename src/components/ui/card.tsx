import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** When true, adds hover-border-blue + pointer cursor for clickable cards */
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden",
        "rounded-[var(--cds-radius-l)]",
        "border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)]",
        interactive && [
          "cursor-pointer",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-[var(--cds-primary-border-default)]",
          "hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        ],
        className
      )}
      {...props}
    />
  )
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-[var(--cds-gap-small)]",
        "p-[var(--cds-padding-card)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardTitle ────────────────────────────────────────────────────────────────

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-[length:var(--cds-text-h5)] leading-[var(--cds-leading-h5)] font-medium",
        "text-[color:var(--cds-huegrey-text-dark)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardDescription ──────────────────────────────────────────────────────────

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[color:var(--cds-huegrey-text-default)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardAction ───────────────────────────────────────────────────────────────

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto shrink-0", className)}
      {...props}
    />
  )
}

// ─── CardContent ──────────────────────────────────────────────────────────────

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-[var(--cds-padding-card)] pb-[var(--cds-padding-card)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardFooter ───────────────────────────────────────────────────────────────

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-[var(--cds-gap-small)]",
        "border-t border-[var(--cds-huegrey-border-low)]",
        "bg-[var(--cds-huegrey-surface-subtle)]",
        "px-[var(--cds-padding-card)] py-[var(--cds-space-12)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontal ───────────────────────────────────────────────────────────
// Horizontal list-item card: [icon/illustration] [title + description] [CTA]
// Hover state: primary blue border; CTA switches from huegrey-bordered → primary fill.

function CardHorizontal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-horizontal"
      className={cn(
        "group",
        "flex flex-row items-center gap-[var(--cds-space-16)]",
        "px-[var(--cds-space-24)] py-[var(--cds-space-16)]",
        "overflow-hidden",
        "rounded-[var(--cds-radius-l)]",
        "border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)]",
        "cursor-pointer",
        "transition-[border-color,box-shadow] duration-150",
        "hover:border-[var(--cds-primary-border-default)]",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontalIcon ───────────────────────────────────────────────────────
// Fixed-size slot (78 × 65 px) for the service illustration or icon.

function CardHorizontalIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-horizontal-icon"
      className={cn(
        "shrink-0",
        "w-[78px] h-[65px]",
        "overflow-hidden relative",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontalBody ───────────────────────────────────────────────────────

function CardHorizontalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-horizontal-body"
      className={cn(
        "flex flex-1 flex-col min-w-0",
        "gap-[var(--cds-space-4)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontalTitle ──────────────────────────────────────────────────────

function CardHorizontalTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-horizontal-title"
      className={cn(
        "truncate font-semibold",
        "text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]",
        "text-[color:var(--cds-huegrey-text-dark)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontalDescription ────────────────────────────────────────────────

function CardHorizontalDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-horizontal-description"
      className={cn(
        "truncate",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[color:var(--cds-huegrey-text-default)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardHorizontalAction ─────────────────────────────────────────────────────
// Huegrey minimal-border button in default state; becomes primary-fill on
// group (card) hover via Tailwind group-hover utilities.

function CardHorizontalAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="card-horizontal-action"
      className={cn(
        "shrink-0",
        "inline-flex items-center justify-center",
        "h-[36px] min-w-[70px] px-[14px]",
        "rounded-[var(--cds-radius-r)]",
        "font-['Zoho_Puvi'] text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        // Default — huegrey minimal border
        "border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)]",
        "text-[color:var(--cds-huegrey-text-dark)]",
        // On card (group) hover → primary fill
        "group-hover:border-transparent",
        "group-hover:bg-[var(--cds-primary-surface-default)]",
        "group-hover:text-white",
        "transition-[background-color,border-color,color] duration-150",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── CardOperations ───────────────────────────────────────────────────────────
// "Floated title pill" card variant for the Operations / settings landing page.
//
// Pattern: a pill (icon + title) is absolutely positioned at the top, partially
// overlapping the white card body beneath it — creating a tabbed appearance.
//
// Anatomy:
//   <CardOperations>                    ← relative outer wrapper with top padding
//     <CardOperationsPill icon title />  ← absolutely-positioned floating pill
//     <CardOperationsBody>              ← white card (top padding clears the pill)
//       <CardOperationsGrid>            ← 2-column link grid
//         <CardOperationsLink>…</…>    ← individual link item
//       </CardOperationsGrid>
//     </CardOperationsBody>
//   </CardOperations>

function CardOperations({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-operations"
      className={cn(
        "relative",
        // Push the body down by half the pill height (24 px) so the pill
        // can float above and overlap the card body's top edge.
        "pt-[var(--cds-space-16)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardOperationsPill ───────────────────────────────────────────────────────

interface CardOperationsPillProps {
  /** Icon element displayed inside the circle badge */
  icon: React.ReactNode
  /** Title text next to the icon */
  title: string
  className?: string
}

function CardOperationsPill({ icon, title, className }: CardOperationsPillProps) {
  return (
    <div
      data-slot="card-operations-pill"
      className={cn(
        "absolute top-0 left-[var(--cds-space-16)]",
        "flex items-center gap-[var(--cds-gap-small)]",
        "h-[48px] pl-[var(--cds-space-8)] pr-[var(--cds-space-16)]",
        "rounded-[var(--cds-radius-full)]",
        "bg-[var(--cds-white)]",
        "shadow-[0_1px_6px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Icon circle */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0",
          "size-[36px]",
          "rounded-[var(--cds-radius-full)]",
          "border border-[var(--border)]",
          "bg-[var(--cds-white)]"
        )}
      >
        {icon}
      </div>
      {/* Title */}
      <span
        className={cn(
          "whitespace-nowrap font-semibold",
          "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
          "text-[color:var(--cds-huegrey-text-dark)]"
        )}
      >
        {title}
      </span>
    </div>
  )
}

// ─── CardOperationsBody ───────────────────────────────────────────────────────

function CardOperationsBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-operations-body"
      className={cn(
        "rounded-[var(--cds-radius-l)]",
        "border border-[var(--border)]",
        "bg-[var(--cds-white)]",
        "overflow-hidden",
        // pt-[40px]: pill is 48px tall, body starts at 16px → overlap = 32px.
        // 40px gives an 8px gap between pill bottom and first link row.
        "pt-[var(--cds-space-40)] pb-[var(--cds-padding-section-h)] px-[var(--cds-padding-section-h)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardOperationsGrid ───────────────────────────────────────────────────────

function CardOperationsGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-operations-grid"
      className={cn("grid grid-cols-2", className)}
      {...props}
    />
  )
}

// ─── CardOperationsLink ───────────────────────────────────────────────────────

function CardOperationsLink({
  className,
  children,
  onClick,
  href,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="card-operations-link"
      href={href ?? "#"}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault()
              onClick(e)
            }
          : undefined
      }
      className={cn(
        "block py-[var(--cds-space-4)]",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[color:var(--cds-huegrey-text-dark)]",
        "no-underline cursor-pointer",
        "transition-colors duration-150",
        "hover:text-[color:var(--cds-primary-text-default)]",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

// ─── CardBilling ──────────────────────────────────────────────────────────────
// Compact stat card used on Billing / Usage pages.
//
// Anatomy:
//   <CardBilling>                  ← outer card wrapper (default | hover | disabled)
//     <CardBillingIcon>            ← 48×48 neutral-surface icon slot
//       {icon}                     ← any ReactNode (e.g. lucide icon or <img>)
//     </CardBillingIcon>
//     <CardBillingBody>            ← flex-1 text area
//       <CardBillingValue>         ← primary stat value  (bold, p1 size)
//       <CardBillingLabel>         ← secondary label     (regular, p2 size)
//     </CardBillingBody>
//   </CardBilling>
//
// Variants
//   default  — white bg, subtle low border, interactive hover (blue border)
//   disabled — neutral-subtle bg, low border, 50% icon opacity, no hover

function CardBilling({
  className,
  disabled = false,
  ...props
}: React.ComponentProps<"div"> & { disabled?: boolean }) {
  return (
    <div
      data-slot="card-billing"
      data-disabled={disabled || undefined}
      className={cn(
        "flex flex-row items-center gap-[var(--cds-space-16)]",
        "px-[var(--cds-space-20)] py-[var(--cds-space-16)]",
        "overflow-hidden",
        "rounded-[var(--cds-radius-l)]",
        "border",
        disabled
          ? [
              "bg-[var(--cds-huegrey-surface-subtle)]",
              "border-[var(--cds-huegrey-border-low)]",
              "cursor-not-allowed",
            ]
          : [
              "bg-[var(--cds-white)]",
              "border-[var(--cds-huegrey-border-low)]",
              "cursor-pointer",
              "transition-[border-color,box-shadow] duration-150",
              "hover:border-[var(--cds-primary-border-default)]",
              "hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
            ],
        className
      )}
      {...props}
    />
  )
}

// ─── CardBillingIcon ──────────────────────────────────────────────────────────
// 48×48 rounded neutral-surface slot that holds an icon.
// Pass `disabled` to apply 50% opacity to the icon (matching the Disabled variant).

function CardBillingIcon({
  className,
  disabled = false,
  ...props
}: React.ComponentProps<"div"> & { disabled?: boolean }) {
  return (
    <div
      data-slot="card-billing-icon"
      className={cn(
        "shrink-0 flex items-center justify-center",
        "size-[48px]",
        "rounded-[var(--cds-radius-l)]",
        "bg-[var(--cds-huegrey-surface-low)]",
        "overflow-hidden",
        disabled && "opacity-50",
        className
      )}
      {...props}
    />
  )
}

// ─── CardBillingBody ──────────────────────────────────────────────────────────

function CardBillingBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-billing-body"
      className={cn(
        "flex flex-1 flex-col min-w-0",
        "gap-[var(--cds-space-4)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardBillingValue ─────────────────────────────────────────────────────────
// Primary stat value — semibold, p1 line-height, dark text.

function CardBillingValue({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-billing-value"
      className={cn(
        "truncate font-semibold",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p1)]",
        "text-[color:var(--cds-huegrey-text-dark)]",
        className
      )}
      {...props}
    />
  )
}

// ─── CardBillingLabel ─────────────────────────────────────────────────────────
// Secondary category label — regular weight, muted text.

function CardBillingLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-billing-label"
      className={cn(
        "truncate",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[color:var(--cds-huegrey-text-default)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardHorizontal,
  CardHorizontalIcon,
  CardHorizontalBody,
  CardHorizontalTitle,
  CardHorizontalDescription,
  CardHorizontalAction,
  CardOperations,
  CardOperationsPill,
  CardOperationsBody,
  CardOperationsGrid,
  CardOperationsLink,
  CardBilling,
  CardBillingIcon,
  CardBillingBody,
  CardBillingValue,
  CardBillingLabel,
}

