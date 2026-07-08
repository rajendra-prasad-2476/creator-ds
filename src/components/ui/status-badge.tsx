import * as React from "react"
import { CircleCheckIcon, AlertCircle, OctagonXIcon, Clock, type LucideIcon } from "lucide-react"

import { Badge, type BadgeColour } from "@/components/ui/badge"

/**
 * StatusBadge — semantic status pill.
 *
 * Locks the status → colour + icon + label contract so every screen shows the
 * same thing for the same state. Built on the DS `Badge` (subtle, xs, pill).
 * Prefer this over hand-composing a `<Badge>` with an icon for status states.
 */
export type StatusKind = "configured" | "not-configured" | "error" | "pending"

interface StatusConfig {
  colour: BadgeColour
  icon: LucideIcon
  label: string
}

const STATUS_MAP: Record<StatusKind, StatusConfig> = {
  "configured": { colour: "success", icon: CircleCheckIcon, label: "Configured" },
  "not-configured": { colour: "warning", icon: AlertCircle, label: "Not configured" },
  "error": { colour: "error", icon: OctagonXIcon, label: "Error" },
  // Badge has no neutral colour token — use primary/info blue for the pending state.
  "pending": { colour: "primary", icon: Clock, label: "Pending" },
}

export interface StatusBadgeProps {
  status: StatusKind
  /** Override the default label for this status */
  label?: string
  className?: string
  style?: React.CSSProperties
}

function StatusBadge({ status, label, className, style }: StatusBadgeProps) {
  const config = STATUS_MAP[status]
  const Icon = config.icon

  return (
    <Badge
      colour={config.colour}
      variant="subtle"
      size="xs"
      className={className}
      style={{
        borderRadius: "var(--cds-radius-full)",
        gap: "var(--cds-space-4)",
        ...style,
      }}
    >
      <Icon size={12} aria-hidden />
      {label ?? config.label}
    </Badge>
  )
}

export { StatusBadge }
