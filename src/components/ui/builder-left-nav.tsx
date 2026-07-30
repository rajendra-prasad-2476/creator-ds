"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Settings2, Bell } from "lucide-react"

/* ─── Item-type icons (inline SVGs, match Creator builder tree icons) ─── */

function IconForm({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

function IconReport({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
      <rect x="1.5" y="1.5" width="11" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <path d="M3.5 7h7M3.5 9.5h7M3.5 11.5h4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

function IconPage({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 1.5h5.5l3 3v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V2A.5.5 0 013 1.5z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path d="M8.5 1.5V4.5h3" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  )
}

function IconWorkflow({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="2.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="11.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="11.5" cy="11" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <path
        d="M4 7h3.5V3.5h2M7.5 7v3.5h2"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconStage({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="0.9" />
      <rect x="8.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="0.9" />
      <path d="M5.5 7h3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M7.5 5.5L9 7l-1.5 1.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function iconForType(type: BuilderNavItemType) {
  switch (type) {
    case "report":   return <IconReport />
    case "page":     return <IconPage />
    case "workflow": return <IconWorkflow />
    case "stage":    return <IconStage />
    default:         return <IconForm />
  }
}

/* ─── Types ─── */

export type BuilderNavItemType = "form" | "report" | "page" | "workflow" | "stage"

export interface BuilderNavItem {
  id: string
  label: string
  type: BuilderNavItemType
  active?: boolean
  onClick?: () => void
}

export interface BuilderNavSection {
  id: string
  label: string
  items: BuilderNavItem[]
  /** Whether the section starts expanded (default: true) */
  defaultExpanded?: boolean
}

export interface BuilderLeftNavUser {
  name: string
  initials: string
}

export interface BuilderLeftNavProps {
  /** App display name */
  appName: string
  /** 2–3 letter initials for the app icon tile */
  appInitials?: string
  /** Background colour for the app icon tile */
  appIconColor?: string
  /** Entity tree sections (forms, reports, pages…) */
  sections: BuilderNavSection[]
  /** ID of the currently active/selected nav item */
  activeItemId?: string
  onItemClick?: (id: string) => void
  /** User displayed at the bottom of the nav */
  user?: BuilderLeftNavUser
  className?: string
}

/* ─── NavItemRow ─── */

function NavItemRow({
  item,
  activeItemId,
  onItemClick,
}: {
  item: BuilderNavItem
  activeItemId?: string
  onItemClick?: (id: string) => void
}) {
  const isActive = item.id === activeItemId || item.active

  return (
    <button
      type="button"
      onClick={() => onItemClick?.(item.id)}
      data-active={isActive || undefined}
      className={cn(
        "flex w-full items-center gap-[var(--cds-gap-small)] pl-[var(--cds-space-32)] pr-[var(--cds-space-16)] py-[var(--cds-space-8)] text-left outline-none transition-colors",
        isActive
          ? "bg-white/15 text-white"
          : "text-white/65 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="shrink-0">{iconForType(item.type)}</span>
      <span
        className="flex-1 truncate text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
        style={{ fontFamily: "'Zoho Puvi', sans-serif", fontWeight: isActive ? 600 : 400 }}
      >
        {item.label}
      </span>
    </button>
  )
}

/* ─── SectionRow ─── */

function SectionRow({
  section,
  activeItemId,
  onItemClick,
}: {
  section: BuilderNavSection
  activeItemId?: string
  onItemClick?: (id: string) => void
}) {
  const [expanded, setExpanded] = React.useState(section.defaultExpanded ?? true)

  return (
    <div className="flex flex-col">
      {/* Section header (collapsible) */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-[var(--cds-gap-small)] px-[var(--cds-space-16)] py-[var(--cds-space-8)] text-white/60 transition-colors hover:text-white/90 outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        aria-expanded={expanded}
      >
        {expanded
          ? <ChevronDown size={13} className="shrink-0" />
          : <ChevronRight size={13} className="shrink-0" />
        }
        <span
          className="flex-1 truncate text-left text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
          style={{ fontFamily: "'Zoho Puvi', sans-serif", fontWeight: 500 }}
        >
          {section.label}
        </span>
      </button>

      {/* Items */}
      {expanded && section.items.map((item) => (
        <NavItemRow
          key={item.id}
          item={item}
          activeItemId={activeItemId}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  )
}

/* ─── BuilderLeftNav ─── */

export function BuilderLeftNav({
  appName,
  appInitials = "A",
  appIconColor = "#5C2D91",
  sections,
  activeItemId,
  onItemClick,
  user = { name: "Rajendra Prasad", initials: "RP" },
  className,
}: BuilderLeftNavProps) {
  return (
    <nav
      data-slot="builder-left-nav"
      className={cn(
        "flex w-[220px] shrink-0 flex-col overflow-hidden",
        "bg-[var(--cds-primary-surface-bold,#041644)]",
        className
      )}
    >
      {/* App header row */}
      <div className="flex shrink-0 items-center gap-[var(--cds-gap-small)] border-b border-white/10 px-[var(--cds-padding-card)] py-[var(--cds-space-12)]">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--cds-radius-xs)] text-white select-none"
          style={{
            backgroundColor: appIconColor,
            fontSize: "11px",
            fontFamily: "'Zoho Puvi', sans-serif",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {appInitials}
        </div>
        <span
          className="flex-1 truncate text-white text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
          style={{ fontFamily: "'Zoho Puvi', sans-serif", fontWeight: 500 }}
        >
          {appName}
        </span>
      </div>

      {/* Entity tree */}
      <div className="flex flex-1 flex-col overflow-y-auto py-[var(--cds-space-4)]">
        {sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            activeItemId={activeItemId}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* User row */}
      <div className="flex shrink-0 items-center gap-[var(--cds-gap-small)] border-t border-white/10 px-[var(--cds-padding-card)] py-[var(--cds-space-12)]">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white select-none"
          style={{ fontSize: "11px", fontFamily: "'Zoho Puvi', sans-serif", fontWeight: 500 }}
        >
          {user.initials}
        </div>
        <span
          className="flex-1 truncate text-white/75 text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
          style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
        >
          {user.name}
        </span>
        <button
          type="button"
          aria-label="Settings"
          className="flex items-center justify-center rounded-[var(--cds-radius-xs)] p-[var(--cds-space-4)] text-white/50 transition-colors hover:text-white outline-none"
        >
          <Settings2 size={14} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex items-center justify-center rounded-[var(--cds-radius-xs)] p-[var(--cds-space-4)] text-white/50 transition-colors hover:text-white outline-none"
        >
          <Bell size={14} />
        </button>
      </div>
    </nav>
  )
}

export { IconForm, IconReport, IconPage, IconWorkflow, IconStage }
