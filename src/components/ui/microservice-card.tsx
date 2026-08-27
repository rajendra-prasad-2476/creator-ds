import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

// ─── Sub-components ───────────────────────────────────────────────────────────

export interface MicroserviceCardProps {
  /** Icon slot — typically an Avatar or a branded icon div */
  icon: React.ReactNode
  title: string
  /** Optional subtitle / connection-name line below the title */
  subtitle?: string
  /** Optional description paragraph */
  description?: string
  /** Bottom meta row — status badges, action labels, or stat pills */
  footer?: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * MicroserviceCard
 * Interactive catalog card used in microservice / resource listing grids.
 * Built on `Card interactive` — hover state turns the border blue.
 *
 * Layout (top-to-bottom):
 *   icon  →  title  →  subtitle?  →  description?  →  footer?
 *
 * Usage:
 *   <MicroserviceCard
 *     icon={<Avatar size="xl" shape="squircle"><AvatarFallback color="primary">AI</AvatarFallback></Avatar>}
 *     title="AI Models"
 *     description="Subtext description for the AI model service."
 *     footer={<><span>Prediction</span><span>Draft</span></>}
 *     onClick={() => navigate("ai-model-detail")}
 *   />
 */
export function MicroserviceCard({
  icon,
  title,
  subtitle,
  description,
  footer,
  onClick,
  className,
}: MicroserviceCardProps) {
  return (
    <Card
      interactive
      onClick={onClick}
      className={cn(
        "flex flex-col gap-[var(--cds-space-12)]",
        "p-[var(--cds-space-24)] pb-[var(--cds-space-20)]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {/* Icon */}
      <div className="shrink-0">{icon}</div>

      {/* Title */}
      <p
        className={cn(
          "text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]",
          "font-medium text-[color:var(--cds-huegrey-text-dark)]",
        )}
      >
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
            "text-[color:var(--cds-huegrey-text-default)] -mt-[var(--cds-space-8)]",
          )}
        >
          {subtitle}
        </p>
      )}

      {/* Description */}
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

      {/* Footer row */}
      {footer && (
        <div className="flex items-center justify-between pt-[var(--cds-space-4)] mt-auto">
          {footer}
        </div>
      )}
    </Card>
  )
}
