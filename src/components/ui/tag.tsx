import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  // Base shared across all variants
  [
    "inline-flex max-h-full items-center gap-[4px] overflow-hidden",
    "rounded-[var(--cds-radius-s)] transition-colors select-none",
    "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Filled grey pill — default usage in tag inputs */
        default: [
          "bg-[var(--cds-huegrey-surface-low)] text-[var(--cds-huegrey-text-bold)]",
          "hover:bg-[var(--cds-huegrey-border-minimal)] hover:text-[var(--cds-huegrey-text-dark)]",
        ].join(" "),
        /** Same as default but with semibold label */
        bold: [
          "bg-[var(--cds-huegrey-surface-low)] text-[var(--cds-huegrey-text-bold)] font-semibold",
          "hover:bg-[var(--cds-huegrey-border-minimal)] hover:text-[var(--cds-huegrey-text-dark)]",
        ].join(" "),
        /** Filled grey pill + border stroke */
        outlined: [
          "border border-[var(--cds-huegrey-border-minimal)]",
          "bg-[var(--cds-huegrey-surface-low)] text-[var(--cds-huegrey-text-bold)]",
          "hover:bg-[var(--cds-huegrey-border-minimal)] hover:text-[var(--cds-huegrey-text-dark)]",
        ].join(" "),
        /** Border stroke only, transparent fill */
        ghost: [
          "border border-[var(--cds-huegrey-border-minimal)]",
          "bg-transparent text-[var(--cds-huegrey-text-bold)]",
          "hover:bg-[var(--cds-huegrey-surface-low)] hover:text-[var(--cds-huegrey-text-dark)]",
        ].join(" "),
      },
      size: {
        /** 26 px tall — standard form field usage */
        base: "h-[26px] px-[6px]",
        /** 18 px tall — dense lists, data tables */
        small: "h-[18px] px-[4px] text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Optional leading icon or avatar (14 px for base, 10 px for small) */
  icon?: React.ReactNode
  /** Show the dismiss × button (default false for read-only tags) */
  closeable?: boolean
  /** Called when the × button is clicked */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      closeable = false,
      onClose,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const isSmall = size === "small"
    const iconSize = isSmall ? "size-[10px]" : "size-[14px]"

    return (
      <span
        ref={ref}
        data-slot="tag"
        className={cn(
          tagVariants({ variant, size }),
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Content group: optional leading icon + label text */}
        <span className="inline-flex items-center gap-[6px] shrink-0">
          {icon && (
            <span aria-hidden className={cn("shrink-0 inline-flex items-center", iconSize)}>
              {icon}
            </span>
          )}
          <span className="whitespace-nowrap">{children}</span>
        </span>

        {/* Dismiss button */}
        {closeable && (
          <button
            type="button"
            aria-label="Remove"
            disabled={disabled}
            onClick={e => {
              e.stopPropagation()
              onClose?.(e)
            }}
            className={cn(
              "inline-flex shrink-0 items-center justify-center",
              iconSize,
              "rounded-[2px] text-[var(--cds-huegrey-text-default)] transition-colors",
              "hover:text-[var(--cds-huegrey-text-dark)]",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cds-primary-border-default)]",
            )}
          >
            <X className={iconSize} />
          </button>
        )}
      </span>
    )
  }
)
Tag.displayName = "Tag"

export { Tag, tagVariants }
