"use client"

import * as React from "react"
import { Check, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

export type FullPageDialogNavStyle = "section" | "stepper"

export type FullPageDialogSectionItem = {
  id: string
  label: string
}

export type FullPageDialogSection = {
  id: string
  label: string
  /** ReactNode icon (16px) displayed before the section group label */
  icon?: React.ReactNode
  items: FullPageDialogSectionItem[]
}

export type FullPageDialogStepStatus = "complete" | "active" | "pending"

export type FullPageDialogStep = {
  id: string
  label: string
  status: FullPageDialogStepStatus
}

export interface FullPageDialogProps {
  /** Title text in the dialog header */
  title: string
  /** Optional status label beside the title (e.g. "Draft") */
  status?: string
  /** Primary CTA button label in the header */
  actionLabel?: string
  /** Called when the primary CTA button is clicked */
  onAction?: () => void
  /** Called when the close (×) button is clicked */
  onClose?: () => void
  /**
   * Sidebar navigation style.
   * - "section" — grouped section headings with clickable items
   * - "stepper"  — numbered step progress list
   * @default "section"
   */
  navStyle?: FullPageDialogNavStyle
  /** Sections and items for section nav (`navStyle="section"`) */
  sections?: FullPageDialogSection[]
  /** Currently active item ID for section nav */
  activeItemId?: string
  /** Called when a section nav item is clicked */
  onItemSelect?: (itemId: string) => void
  /** Steps for stepper nav (`navStyle="stepper"`) */
  steps?: FullPageDialogStep[]
  /** When true, renders the hints panel on the right */
  showHints?: boolean
  /** Title of the hints panel */
  hintsTitle?: string
  /** Array of hint text strings displayed as bullet points */
  hints?: string[]
  /** Content rendered in the main scrollable area */
  children?: React.ReactNode
  className?: string
}

// ─── Internal: Step Circle variants ──────────────────────────────────────────

function StepCircleComplete() {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        "size-[20px] rounded-[var(--cds-radius-full)]",
        "bg-[var(--cds-primary-surface-default)]",
      )}
    >
      <Check size={12} className="[color:white]" strokeWidth={2.5} />
    </div>
  )
}

function StepCircleActive() {
  return (
    <div
      className={cn(
        "shrink-0 size-[20px] rounded-[var(--cds-radius-full)]",
        "bg-[var(--cds-white)] border-2 border-[var(--cds-primary-surface-default)]",
      )}
    />
  )
}

function StepCirclePending() {
  return (
    <div
      className={cn(
        "shrink-0 size-[20px] rounded-[var(--cds-radius-full)]",
        "bg-[var(--cds-white)] border-[1.5px] border-[var(--cds-huegrey-border-minimal)]",
      )}
    />
  )
}

// ─── Internal: SectionNav ────────────────────────────────────────────────────

function SectionNav({
  sections = [],
  activeItemId,
  onItemSelect,
}: {
  sections?: FullPageDialogSection[]
  activeItemId?: string
  onItemSelect?: (itemId: string) => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col shrink-0 h-full w-[200px] overflow-y-auto",
        "bg-[var(--cds-primary-surface-subtle)]",
        "border-r border-[var(--border)]",
        "pt-[var(--cds-space-16)]",
      )}
    >
      {sections.map((section) => (
        <React.Fragment key={section.id}>
          {/* Section group header */}
          <div
            className={cn(
              "flex shrink-0 items-center gap-[var(--cds-gap-small)] w-full overflow-clip",
              "px-[var(--cds-space-20)] pb-[var(--cds-space-8)] pt-[var(--cds-space-12)]",
            )}
          >
            {section.icon && (
              <span className="shrink-0 size-[16px] flex items-center justify-center text-[color:var(--cds-huegrey-text-default)]">
                {section.icon}
              </span>
            )}
            <p
              className={cn(
                "shrink-0 whitespace-nowrap uppercase tracking-[1.5px]",
                "text-[length:var(--cds-text-p4)] font-semibold",
                "text-[color:var(--cds-huegrey-text-default)]",
              )}
            >
              {section.label}
            </p>
          </div>

          {/* Section items */}
          {section.items.map((item) => {
            const isActive = item.id === activeItemId
            return (
              <button
                key={item.id}
                onClick={() => onItemSelect?.(item.id)}
                className={cn(
                  "flex shrink-0 items-center w-full overflow-clip text-left",
                  "pl-[24px] pr-[var(--cds-space-20)] py-[var(--cds-space-8)]",
                  "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] whitespace-nowrap",
                  "transition-colors outline-none",
                  isActive
                    ? [
                        "bg-[var(--cds-primary-surface-subtle-hover)]",
                        "text-[color:var(--cds-primary-text-default)] font-medium",
                      ]
                    : [
                        "text-[color:var(--cds-huegrey-text-dark)] font-normal",
                        "hover:bg-[var(--cds-primary-surface-subtle-hover)]/60",
                        "focus-visible:bg-[var(--cds-primary-surface-subtle-hover)]/60",
                      ],
                )}
              >
                {item.label}
              </button>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Internal: StepperNav ────────────────────────────────────────────────────

function StepperNav({ steps = [] }: { steps?: FullPageDialogStep[] }) {
  return (
    <div
      className={cn(
        "flex flex-col shrink-0 h-full w-[200px] overflow-y-auto",
        "bg-[var(--cds-secondary-surface-subtle)]",
        "py-[var(--cds-space-32)]",
      )}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <React.Fragment key={step.id}>
            {/* Step row */}
            <div
              className={cn(
                "flex shrink-0 items-center gap-[var(--cds-gap-default)] w-full overflow-clip",
                "pl-[var(--cds-space-24)] py-[var(--cds-space-8)]",
              )}
            >
              {step.status === "complete" && <StepCircleComplete />}
              {step.status === "active" && <StepCircleActive />}
              {step.status === "pending" && <StepCirclePending />}
              <p
                className={cn(
                  "shrink-0 whitespace-nowrap text-[length:var(--cds-text-p2)]",
                  step.status === "complete" &&
                    "font-normal text-[color:var(--cds-huegrey-text-bold)]",
                  step.status === "active" &&
                    "font-medium text-[color:var(--cds-primary-text-default)]",
                  step.status === "pending" &&
                    "font-normal text-[color:var(--cds-huegrey-text-default)]",
                )}
              >
                {step.label}
              </p>
            </div>

            {/* Connector line — pl-[33px] centers the 2px bar under the 20px circle at pl-24px */}
            {!isLast && (
              <div className="flex shrink-0 items-start pl-[33px]">
                <div
                  className={cn(
                    "h-[24px] w-[2px] shrink-0",
                    step.status === "complete"
                      ? "bg-[var(--cds-primary-surface-default)]"
                      : "bg-[var(--cds-huegrey-border-minimal)]",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Internal: HintsPanel ────────────────────────────────────────────────────

function HintsPanel({
  title = "Hints",
  hints = [],
}: {
  title?: string
  hints?: string[]
}) {
  return (
    <div
      className={cn(
        "flex flex-col shrink-0 h-full w-[240px] gap-[var(--cds-gap-medium)]",
        "bg-[var(--cds-huegrey-surface-subtle)]",
        "border-l border-[var(--border)]",
        "p-[var(--cds-space-24)] overflow-y-auto",
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-[var(--cds-gap-small)] w-full overflow-clip">
        <Info
          size={18}
          className="shrink-0 text-[color:var(--cds-secondary-surface-default)]"
        />
        <p
          className={cn(
            "shrink-0 whitespace-nowrap font-medium",
            "text-[length:var(--cds-text-p1)] leading-normal",
            "text-[color:var(--cds-secondary-surface-default)]",
          )}
        >
          {title}
        </p>
      </div>

      {/* Hint items */}
      <div className="flex flex-col flex-1 gap-[var(--cds-gap-default)] min-h-0 overflow-clip">
        {hints.map((hint, i) => (
          <div
            key={i}
            className="flex gap-[var(--cds-gap-small)] items-start shrink-0 w-full overflow-clip"
          >
            <p className="shrink-0 whitespace-nowrap text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-border-minimal)]">
              •
            </p>
            <p
              className={cn(
                "flex-1 min-w-0",
                "text-[length:var(--cds-text-p3)] leading-[20px]",
                "text-[color:var(--cds-huegrey-text-bold)]",
              )}
            >
              {hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FullPageDialog ───────────────────────────────────────────────────────────

/**
 * FullPageDialog — Full-screen dialog shell with a header, sidebar nav, content
 * area, and optional hints panel. Supports two nav styles:
 *
 * - **section** — grouped section headings with clickable nav items
 * - **stepper** — numbered multi-step progress list with status indicators
 *
 * The dialog fills its container. Wrap it in `fixed inset-0 z-50` to cover the
 * full viewport.
 *
 * @example
 * ```tsx
 * <FullPageDialog
 *   title="Create API"
 *   status="Draft"
 *   actionLabel="Save"
 *   navStyle="stepper"
 *   steps={steps}
 *   showHints
 *   hints={["Name it descriptively.", "The link name is appended to the endpoint URL."]}
 * >
 *   <FormContent />
 * </FullPageDialog>
 * ```
 */
export function FullPageDialog({
  title,
  status,
  actionLabel,
  onAction,
  onClose,
  navStyle = "section",
  sections,
  activeItemId,
  onItemSelect,
  steps,
  showHints = false,
  hintsTitle = "Hints",
  hints = [],
  children,
  className,
}: FullPageDialogProps) {
  return (
    <div className={cn("flex flex-col w-full h-full bg-[var(--cds-white)]", className)}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-[var(--cds-gap-default)] w-full",
          "h-[52px] px-[var(--cds-space-20)]",
          "bg-[var(--cds-white)] border-b border-[var(--border)]",
        )}
      >
        <p
          className={cn(
            "flex-1 min-w-0 truncate font-medium",
            "text-[length:var(--cds-text-p1)] leading-normal",
            "text-[color:var(--cds-secondary-surface-default)]",
          )}
        >
          {title}
        </p>

        {status && (
          <p className="shrink-0 whitespace-nowrap text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">
            {status}
          </p>
        )}

        {actionLabel && (
          <Button size="xs" onClick={onAction}>
            {actionLabel}
          </Button>
        )}

        <button
          onClick={onClose}
          aria-label="Close dialog"
          className={cn(
            "flex shrink-0 items-center justify-center",
            "size-[32px] rounded-[var(--cds-radius-s)]",
            "text-[color:var(--cds-huegrey-text-default)]",
            "hover:bg-[var(--cds-huegrey-surface-low)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default)]/40",
          )}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Body row ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 items-start min-h-0 overflow-clip w-full">
        {/* Sidebar nav */}
        {navStyle === "section" ? (
          <SectionNav
            sections={sections}
            activeItemId={activeItemId}
            onItemSelect={onItemSelect}
          />
        ) : (
          <StepperNav steps={steps} />
        )}

        {/* Content slot */}
        <main className="flex flex-col flex-1 h-full min-w-0 items-start overflow-y-auto bg-[var(--cds-white)] px-[var(--cds-space-32)] py-[var(--cds-space-24)]">
          {children ?? (
            <p className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)] w-full">
              Content goes here. Add form fields, cards, or other components.
            </p>
          )}
        </main>

        {/* Optional hints panel */}
        {showHints && <HintsPanel title={hintsTitle} hints={hints} />}
      </div>
    </div>
  )
}
