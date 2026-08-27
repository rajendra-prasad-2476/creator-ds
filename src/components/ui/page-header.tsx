import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  /** Right-side action buttons or controls */
  actions?: React.ReactNode
  /** Adds a bottom border separator below the header row */
  withBorder?: boolean
  className?: string
}

/**
 * PageHeader / Dashboard Header
 * Top-level page heading with an optional description and right-side actions.
 * Implements the "Page Header / Dashboard Header" pattern from the DS showcase.
 *
 * Usage:
 *   <PageHeader
 *     title="All Records"
 *     description="Manage and view all your records in one place."
 *     actions={<><Button variant="outline">Filter</Button><Button>+ Add</Button></>}
 *   />
 */
export function PageHeader({
  title,
  description,
  actions,
  withBorder = true,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-[var(--cds-gap-default)]",
        withBorder && "border-b border-[var(--border)] pb-[var(--cds-space-16)]",
        "mb-[var(--cds-space-24)]",
        className,
      )}
    >
      <div className="flex flex-col gap-[var(--cds-space-4)]">
        <h1
          className={cn(
            "text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]",
            "font-medium text-[color:var(--cds-huegrey-text-dark)]",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
              "text-[color:var(--cds-huegrey-text-default)]",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-[var(--cds-gap-small)] shrink-0 pt-[var(--cds-space-2)]">
          {actions}
        </div>
      )}
    </div>
  )
}
