"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        // Base — 14 px circle matching Figma
        "peer relative flex aspect-square size-[14px] shrink-0 rounded-full outline-none",
        "border border-[var(--cds-huegrey-border-fairish)] bg-white transition-colors",
        // Hover
        "hover:border-[var(--cds-primary-border-default)] hover:bg-[var(--cds-primary-surface-subtle)]",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-border-default)]/30 focus-visible:border-[var(--cds-primary-border-default)]",
        // Checked — filled primary blue
        "data-checked:border-[var(--cds-primary-border-default)] data-checked:bg-[var(--cds-primary-surface-default)]",
        "data-checked:hover:bg-[var(--cds-primary-surface-default-hover)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Error (aria-invalid)
        "aria-invalid:border-[var(--cds-error-border-default)]",
        "aria-invalid:hover:border-[var(--cds-error-border-default)]",
        "aria-invalid:data-checked:bg-[var(--cds-error-surface-default)] aria-invalid:data-checked:border-[var(--cds-error-border-default)]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-[14px] items-center justify-center"
      >
        {/* 5 px white centre dot */}
        <span className="size-[5px] rounded-full bg-white" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
