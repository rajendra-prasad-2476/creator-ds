/**
 * List — Organism
 *
 * A structured vertical list of data rows. Use when displaying a collection of
 * items in a scannable row format that does not need full table columns (e.g.
 * member lists, activity logs, app catalogs).
 *
 * Use Table when sortable columns and bulk selection are needed.
 *
 * Figma node: 6685:9545
 */
import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BadgeColour } from "@/components/ui/badge"

// ─── Public types ─────────────────────────────────────────────────────────────

export interface ListItemData {
  /** Unique identifier for this row */
  id: string
  /** Primary label text */
  title: string
  /** Secondary metadata shown below the title (requires the `subText` to be truthy) */
  subText?: string
  /**
   * Inline badge after the title.
   * Defaults to colour="success" variant="subtle" size="xs".
   */
  badge?: { label: string; colour?: BadgeColour }
  /** One- or two-character abbreviation displayed inside the avatar square (e.g. "EM") */
  avatarText?: string
  /**
   * Background CSS color for the avatar square.
   * Defaults to the DS wine accent (#CC3359).
   */
  avatarColour?: string
  /** Right-side meta text, e.g. "3 uses", "14 days ago" */
  meta?: string
  /** Primary action CTA label — renders a small primary Button */
  actionLabel?: string
  /** Called when the action button is clicked */
  onAction?: () => void
  /** When provided, shows a close × button and calls this on click */
  onRemove?: () => void
}

export type ListSize = "Default" | "Large"

export interface ListRowProps {
  item: ListItemData
  /**
   * Row height / density.
   * - `"Large"` — 64px, P1 title (16px)
   * - `"Default"` — 52px, P2 title (14px)
   */
  size?: ListSize
  /** Show a checkbox on the far left (multi-select mode) */
  showCheckbox?: boolean
  /** Show the avatar square on the left */
  showLeftIcon?: boolean
  /** Show the right-side slot (meta, action button, remove) */
  showRightContent?: boolean
  /** Controlled checked state for the checkbox */
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export interface ListProps {
  items: ListItemData[]
  /**
   * Row height / density applied to every row.
   * @default "Large"
   */
  size?: ListSize
  /**
   * When true, checkboxes are shown for multi-select.
   * Selection state is managed internally; use `selectedIds` / `onSelectionChange`
   * for controlled mode.
   */
  selectable?: boolean
  /** Controlled selected IDs (optional — uncontrolled by default) */
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  /** Show the right-side slot on every row. @default true */
  showRightContent?: boolean
  className?: string
}

// ─── ListRow ──────────────────────────────────────────────────────────────────

function ListRow({
  item,
  size = "Large",
  showCheckbox = false,
  showLeftIcon = true,
  showRightContent = true,
  checked = false,
  onCheckedChange,
  className,
}: ListRowProps) {
  const isLarge = size === "Large"
  const hasSubText = !!item.subText

  return (
    <div
      className={cn(
        "flex items-center w-full",
        "border border-[var(--border)]",
        "rounded-[var(--cds-radius-l)]",
        "gap-[var(--cds-gap-default)]",
        isLarge
          ? "min-h-[64px] px-[var(--cds-padding-card)] py-[var(--cds-padding-card)]"
          : "min-h-[52px] px-[var(--cds-padding-card)] py-[var(--cds-space-12)]",
        className
      )}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <Checkbox
          checked={checked}
          onCheckedChange={(val) => onCheckedChange?.(Boolean(val))}
          className="shrink-0"
        />
      )}

      {/* Avatar */}
      {showLeftIcon && item.avatarText && (
        <div
          className={cn(
            "flex items-center justify-center shrink-0",
            "rounded-[var(--cds-radius-r)]",
            isLarge ? "size-[32px]" : "size-[28px]"
          )}
          style={{ backgroundColor: item.avatarColour ?? "#CC3359" }}
        >
          <span
            className={cn(
              "font-['Zoho_Puvi'] font-semibold text-white text-center select-none",
              isLarge
                ? "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
                : "text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
            )}
          >
            {item.avatarText}
          </span>
        </div>
      )}

      {/* Title + badge (+ optional sub-text) */}
      <div
        className={cn(
          "flex shrink-0 min-w-0",
          hasSubText
            ? "flex-col gap-[var(--cds-space-2)]"
            : "items-center gap-[var(--cds-gap-small)]"
        )}
      >
        <div className="flex items-center gap-[var(--cds-gap-small)]">
          <span
            className={cn(
              "font-['Zoho_Puvi'] font-semibold",
              "text-[color:var(--cds-huegrey-text-dark)] whitespace-nowrap",
              isLarge
                ? "text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]"
                : "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
            )}
          >
            {item.title}
          </span>
          {item.badge && (
            <Badge colour={item.badge.colour ?? "success"} variant="subtle" size="xs">
              {item.badge.label}
            </Badge>
          )}
        </div>

        {item.subText && (
          <span
            className={cn(
              "font-['Zoho_Puvi'] text-[color:var(--cds-huegrey-text-default)] truncate",
              isLarge
                ? "text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
                : "text-[length:var(--cds-text-p4)] leading-[var(--cds-leading-p4)]"
            )}
          >
            {item.subText}
          </span>
        )}
      </div>

      {/* Flex spacer */}
      <div className="flex-1" />

      {/* Right content — meta · action button · remove */}
      {showRightContent && (
        <div className="flex items-center gap-[var(--cds-gap-small)] shrink-0">
          {item.meta && (
            <span
              className={cn(
                "font-['Zoho_Puvi'] font-semibold whitespace-nowrap text-right",
                "text-[color:var(--cds-huegrey-text-dark)]",
                "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
              )}
            >
              {item.meta}
            </span>
          )}

          {item.actionLabel && (
            <Button size="sm" onClick={item.onAction}>
              {item.actionLabel}
            </Button>
          )}

          {item.onRemove && (
            <button
              type="button"
              onClick={item.onRemove}
              aria-label="Remove"
              className={cn(
                "flex items-center justify-center size-[28px] shrink-0",
                "rounded-[var(--cds-radius-r)]",
                "text-[color:var(--cds-huegrey-text-default)]",
                "hover:text-[color:var(--cds-huegrey-text-dark)]",
                "hover:bg-[var(--cds-huegrey-surface-subtle)]",
                "transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default)]/40"
              )}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── List (container) ─────────────────────────────────────────────────────────

function List({
  items,
  size = "Large",
  selectable = false,
  selectedIds: controlledIds,
  onSelectionChange,
  showRightContent = true,
  className,
}: ListProps) {
  const [internalIds, setInternalIds] = React.useState<Set<string>>(new Set())
  const isControlled = controlledIds !== undefined
  const selectedIds = isControlled ? controlledIds : internalIds

  const handleCheckedChange = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) next.add(id)
    else next.delete(id)
    if (!isControlled) setInternalIds(next)
    onSelectionChange?.(next)
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--cds-space-16)] items-start w-full",
        className
      )}
    >
      {items.map((item) => (
        <ListRow
          key={item.id}
          item={item}
          size={size}
          showCheckbox={selectable}
          showLeftIcon={!!item.avatarText}
          showRightContent={showRightContent}
          checked={selectedIds.has(item.id)}
          onCheckedChange={(checked) => handleCheckedChange(item.id, checked)}
        />
      ))}
    </div>
  )
}

export { List, ListRow }
