import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FormFieldProps {
  /** Input element id — wires the Label htmlFor automatically */
  id: string
  label: string
  /** Helper text shown below the input when no error is present */
  description?: string
  /** Validation error — replaces description; colours text red */
  error?: string
  required?: boolean
  /** The input / select / textarea control */
  children: React.ReactNode
  className?: string
}

/**
 * FormField
 * Standard form field wrapper: Label (+ required marker) → input slot → helper/error text.
 * Implements the "Form Pattern" from the DS showcase.
 *
 * Usage:
 *   <FormField id="email" label="Email" required error={errors.email}>
 *     <Input id="email" type="email" placeholder="jane@company.com" />
 *   </FormField>
 */
export function FormField({
  id,
  label,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-[var(--cds-space-6)]", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
          "font-medium text-[color:var(--cds-huegrey-text-dark)]",
        )}
      >
        {label}
        {required && (
          <span
            className="ml-[var(--cds-space-2)] text-[color:var(--cds-error-text-default)]"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </Label>

      {children}

      {(error || description) && (
        <p
          className={cn(
            "text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]",
            error
              ? "text-[color:var(--cds-error-text-default)]"
              : "text-[color:var(--cds-huegrey-text-subtle)]",
          )}
        >
          {error ?? description}
        </p>
      )}
    </div>
  )
}
