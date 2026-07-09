import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  /**
   * Visual validation status.
   * - "error"   → aria-invalid is set; error surface bg + red border
   * - "success" → success surface bg + green border
   * Defaults to "default" (no validation state).
   */
  status?: "default" | "error" | "success"
}

function Textarea({ className, status, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-status={status}
      aria-invalid={status === "error" || props["aria-invalid"]}
      className={cn(
        // Layout
        "flex min-h-[80px] w-full resize-y",
        // Typography — P2 Regular (14px / 18px)
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal",
        // Shape & spacing — radius-r (6px), 12px H / 10px V padding
        "rounded-[var(--cds-radius-r)] border px-3 py-[10px]",
        // Default — white bg, fairish border, dark body text
        "bg-white border-[var(--cds-huegrey-border-fairish)] text-[var(--cds-huegrey-text-dark)]",
        // Placeholder
        "placeholder:text-[var(--cds-huegrey-text-fairish)]",
        // Transitions
        "outline-none transition-[border-color,box-shadow]",
        // Hover (non-disabled, non-error, non-success) — primary border
        "hover:enabled:border-[var(--cds-primary-border-default)]",
        // Focus / Active — primary border + blue elevation shadow
        "focus:border-[var(--cds-primary-border-default)]",
        "focus:[box-shadow:0px_2px_2px_rgba(13,78,242,0.08),0px_1px_1px_rgba(13,78,242,0.05)]",
        // Disabled — subtle grey bg, same fairish border, muted text & placeholder
        "disabled:cursor-not-allowed disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
        "disabled:border-[var(--cds-huegrey-border-fairish)] disabled:text-[var(--cds-huegrey-text-fairish)]",
        "disabled:placeholder:text-[var(--cds-huegrey-text-fairish)]",
        "disabled:focus:[box-shadow:none]",
        // Error state (aria-invalid) — red tint bg + red border, no focus shadow
        "aria-invalid:bg-[var(--cds-error-surface-subtle)] aria-invalid:border-[var(--cds-error-border-default)]",
        "aria-invalid:hover:border-[var(--cds-error-border-default)]",
        "aria-invalid:focus:border-[var(--cds-error-border-default)] aria-invalid:focus:[box-shadow:none]",
        // Success state — green tint bg + green border, no focus shadow
        "data-[status=success]:bg-[var(--cds-success-surface-subtle)] data-[status=success]:border-[var(--cds-success-border-default)]",
        "data-[status=success]:hover:border-[var(--cds-success-border-default)]",
        "data-[status=success]:focus:border-[var(--cds-success-border-default)] data-[status=success]:focus:[box-shadow:none]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
