import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base — 14 px box matching Figma
        "group peer relative flex size-[14px] shrink-0 items-center justify-center",
        "rounded-[var(--cds-radius-s)] border border-[var(--cds-huegrey-border-fairish)]",
        "bg-[var(--cds-white)] transition-colors outline-none",
        // Unchecked hover — white bg + primary border
        "hover:border-[var(--cds-primary-border-default)] hover:bg-[var(--cds-primary-surface-subtle)]",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-border-default)]/30 focus-visible:border-[var(--cds-primary-border-default)]",
        // Checked — filled primary blue
        "data-checked:bg-[var(--cds-primary-surface-default)] data-checked:border-[var(--cds-primary-border-default)]",
        "data-checked:hover:bg-[var(--cds-primary-surface-default-hover)]",
        // Indeterminate — grey fill, no hover colour change
        "data-indeterminate:bg-[var(--cds-huegrey-border-minimal-hover)] data-indeterminate:border-[var(--cds-huegrey-border-fairish)]",
        "data-indeterminate:hover:bg-[var(--cds-huegrey-border-minimal-hover)] data-indeterminate:hover:border-[var(--cds-huegrey-border-fairish)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Error (aria-invalid)
        "aria-invalid:border-[var(--cds-error-border-default)]",
        "aria-invalid:hover:border-[var(--cds-error-border-default)]",
        "aria-invalid:data-checked:bg-[var(--cds-error-surface-default)] aria-invalid:data-checked:border-[var(--cds-error-border-default)]",
        "aria-invalid:data-checked:hover:bg-[var(--cds-error-surface-default-hover)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-white"
      >
        {/* Checkmark — hidden when indeterminate */}
        <Check className="size-[10px] group-data-[indeterminate]:hidden" />
        {/* Minus — shown only when indeterminate */}
        <Minus className="size-[10px] hidden group-data-[indeterminate]:flex" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
