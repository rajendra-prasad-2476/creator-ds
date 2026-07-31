"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({
  className,
  state = "default",
  ...props
}: React.ComponentProps<"div"> & {
  /** Applies semantic colour to all child slots: default | error | success */
  state?: "default" | "error" | "success"
}) {
  return (
    <div
      data-slot="input-otp-group"
      data-state={state}
      className={cn("group flex items-center gap-[10px]", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // Base — 36×36 px, individually bordered cell (not connected)
        "relative flex size-[36px] shrink-0 items-center justify-center",
        "rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)] transition-colors outline-none",
        // Typography — P2 Semibold (600 weight)
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-semibold",
        "text-[var(--cds-huegrey-text-dark)]",
        // Hover
        "hover:border-[var(--cds-primary-border-default)]",
        // Active (user is typing into this cell)
        "data-[active=true]:border-[var(--cds-primary-border-default)]",
        "data-[active=true]:shadow-[var(--cds-shadow-primary-subtle)]",
        "data-[active=true]:z-10",
        // Error — whole group turns red (triggered by parent group's data-state)
        "group-data-[state=error]:border-[var(--cds-error-border-default)]",
        "group-data-[state=error]:bg-[var(--cds-error-surface-subtle)]",
        "group-data-[state=error]:text-[var(--cds-error-text-default)]",
        // Success — whole group turns green
        "group-data-[state=success]:border-[var(--cds-success-border-default)]",
        "group-data-[state=success]:bg-[var(--cds-success-surface-subtle)]",
        "group-data-[state=success]:text-[var(--cds-success-text-default)]",
        className
      )}
      {...props}
    >
      {/* Digit or placeholder */}
      {char ? (
        char
      ) : hasFakeCaret ? null : (
        // Empty-cell placeholder dot — muted, non-interactive
        <span
          aria-hidden
          className="font-normal text-[var(--cds-huegrey-text-fairish)] select-none"
        >
          ·
        </span>
      )}

      {/* Blinking cursor */}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[18px] w-px animate-caret-blink bg-[var(--cds-primary-surface-default)] duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        "mx-[4px] flex shrink-0 items-center",
        "text-[var(--cds-huegrey-text-fairish)] [&_svg]:size-[14px]",
        className
      )}
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
