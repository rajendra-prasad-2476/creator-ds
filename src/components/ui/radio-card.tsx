"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from "@/lib/utils"

export interface RadioCardProps extends RadioPrimitive.Root.Props {
  label?: string
  description?: string
}

/**
 * RadioCard — a selectable card containing a radio indicator, label, and
 * optional description. Renders as a single `Radio.Root` (button) so it works
 * inside a standard `RadioGroup` via the `value` prop.
 *
 * Usage:
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <RadioCard value="a" label="Option A" description="Short description." />
 *   <RadioCard value="b" label="Option B" description="Another option." />
 * </RadioGroup>
 * ```
 */
function RadioCard({ className, label, description, ...props }: RadioCardProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-card"
      className={cn(
        // Card shell
        "group flex w-full cursor-pointer items-start gap-[8px] text-left",
        "rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)] px-[14px] pt-[12px] pb-[14px] outline-none transition-colors",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-border-default)]/30 focus-visible:border-[var(--cds-primary-border-default)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Radio circle — mirrors RadioGroupItem but styled via group classes */}
      <div
        className={cn(
          "mt-[2px] flex size-[14px] shrink-0 items-center justify-center",
          "rounded-full border border-[var(--cds-huegrey-border-fairish)] bg-[var(--cds-white)] transition-colors",
          // Hover: blue border
          "group-hover:border-[var(--cds-primary-border-default)] group-hover:bg-[var(--cds-primary-surface-subtle)]",
          // Checked: filled primary blue
          "group-data-[checked]:border-[var(--cds-primary-border-default)] group-data-[checked]:bg-[var(--cds-primary-surface-default)]",
          // Disabled: grey fill (pointer-events disabled by parent)
          "group-disabled:bg-[var(--cds-huegrey-border-minimal-hover)] group-disabled:border-[var(--cds-huegrey-border-fairish)]",
        )}
      >
        <RadioPrimitive.Indicator className="flex items-center justify-center">
          <span className="size-[5px] rounded-full bg-[var(--cds-white)]" />
        </RadioPrimitive.Indicator>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {label && (
          <p
            className={cn(
              "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-medium",
              "text-[var(--cds-huegrey-text-dark)]",
              "group-disabled:text-[var(--cds-huegrey-text-fairish)]",
            )}
          >
            {label}
          </p>
        )}
        {description && (
          <p
            className={cn(
              "mt-[var(--cds-gap-tight)]",
              "text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]",
              "text-[var(--cds-huegrey-text-default)]",
              "group-disabled:text-[var(--cds-huegrey-text-fairish)]",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </RadioPrimitive.Root>
  )
}

export { RadioCard }
