"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Globe,
  GitBranch,
  Settings,
  Menu,
  Plus,
  ChevronDown,
  Bell,
  Zap,
  X,
} from "lucide-react"

/* ─── Types ─── */

export type BuilderTab = "design" | "workflow" | "settings"

export interface BuilderTopBarProps {
  /** App display name, e.g. "Figma Plugin Test" */
  appName: string
  /** 2–3 letter initials for the coloured app icon, e.g. "FPT" */
  appInitials?: string
  /** Background colour for the app icon tile, e.g. "#5C2D91" */
  appIconColor?: string
  /** Currently selected entity shown as a subtitle, e.g. "Design Work Items Report" */
  activePageName?: string
  /** Active builder tab */
  activeTab?: BuilderTab
  onTabChange?: (tab: BuilderTab) => void
  /** Fired when the hamburger icon is clicked (parent controls nav state) */
  onMenuToggle?: () => void
  onAddPage?: () => void
  /** When true the platform-nav flyout is open; left section shows × close instead of chevron/+ */
  flyoutOpen?: boolean
  /** When true the mega-menu dropdown is open; chevron rotates to indicate open state */
  megaMenuOpen?: boolean
  /** Fired when the app name / chevron is clicked to open the mega-menu dropdown */
  onAppChevronClick?: () => void
  /** Show the orange Upgrade pill */
  showUpgrade?: boolean
  className?: string
}

/* ─── Tab definitions ─── */

const TABS: { id: BuilderTab; label: string; Icon: React.ElementType }[] = [
  { id: "design",   label: "Design",   Icon: Globe },
  { id: "workflow", label: "Workflow", Icon: GitBranch },
  { id: "settings", label: "Settings", Icon: Settings },
]

/* ─── Small inline app-page icon (green) ─── */

function AppPageIcon() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--cds-radius-s)]"
      style={{ backgroundColor: "#25A566" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="2" y="1.5" width="10" height="11" rx="1" stroke="white" strokeWidth="0.9" />
        <path d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ─── BuilderTopBar ─── */

export function BuilderTopBar({
  appName,
  appInitials = "A",
  appIconColor = "#5C2D91",
  activePageName,
  activeTab = "design",
  onTabChange,
  onMenuToggle,
  onAddPage,
  flyoutOpen = false,
  megaMenuOpen = false,
  onAppChevronClick,
  showUpgrade = true,
  className,
}: BuilderTopBarProps) {
  return (
    <header
      data-slot="builder-top-bar"
      className={cn(
        "sticky top-0 z-50 flex h-12 w-full items-center",
        "bg-[var(--cds-primary-surface-bold,#041644)]",
        className
      )}
    >
      {/* ── Left: hamburger + app selector (or × close when flyout open) ── */}
      <div className="flex items-center gap-[var(--cds-gap-small)] px-[var(--cds-padding-card)]">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={flyoutOpen ? "Close navigation" : "Open navigation"}
          className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)] text-white/70 transition-colors hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Menu size={16} />
        </button>

        {flyoutOpen ? (
          /* Flyout open: app name + × close */
          <div className="flex items-center gap-[var(--cds-gap-small)]">
            <span
              className="text-white text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] whitespace-nowrap"
              style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
            >
              {appName}
            </span>
            <button
              type="button"
              onClick={onMenuToggle}
              aria-label="Close navigation"
              className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-4)] text-white/70 transition-colors hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          /* Normal: app icon tile + name + chevron + add */
          <>
            <button
              type="button"
              onClick={onAppChevronClick}
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
              className="flex items-center gap-[var(--cds-gap-small)] rounded-[var(--cds-radius-s)] px-[var(--cds-space-8)] py-[var(--cds-space-4)] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {/* Coloured app icon tile */}
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--cds-radius-xs)] text-white select-none"
                style={{
                  backgroundColor: appIconColor,
                  fontSize: "10px",
                  fontFamily: "'Zoho Puvi', sans-serif",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {appInitials}
              </div>

              {/* Name + optional page subtitle */}
              <div className="flex flex-col items-start">
                <span
                  className="text-white text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] whitespace-nowrap"
                  style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                >
                  {appName}
                </span>
                {activePageName && (
                  <span
                    className="text-white/50 text-[length:var(--cds-text-p3)] leading-none whitespace-nowrap"
                    style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                  >
                    {activePageName}
                  </span>
                )}
              </div>

              <ChevronDown
                size={12}
                className={cn(
                  "text-white/60 shrink-0 transition-transform duration-150",
                  megaMenuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Add page */}
            <button
              type="button"
              onClick={onAddPage}
              aria-label="Add page"
              className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)] text-white/70 transition-colors hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Plus size={15} />
            </button>
          </>
        )}
      </div>

      {/* ── Center: Design / Workflow / Settings tabs (absolutely centred) ── */}
      <div className="absolute inset-x-0 flex h-12 items-center justify-center pointer-events-none">
        <nav className="flex items-center pointer-events-auto" role="tablist" aria-label="Builder sections">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange?.(id)}
                className={cn(
                  "relative flex items-center gap-[var(--cds-gap-tight)] h-12 px-[var(--cds-space-16)]",
                  "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
                  "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/40",
                  active
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white/80 font-normal"
                )}
                style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
              >
                <Icon size={14} className="shrink-0" />
                {label}
                {/* Active indicator line */}
                {active && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--cds-primary-surface-default,#0D4EF2)] rounded-t-full" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Right: Upgrade + bell + app icon + Access CTA ── */}
      <div className="ml-auto flex items-center gap-[var(--cds-gap-small)] px-[var(--cds-padding-card)]">
        {showUpgrade && (
          <button
            type="button"
            className="flex items-center rounded-full bg-[#E8700A] px-[var(--cds-space-12)] py-[var(--cds-space-4)] text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "12px", fontWeight: 600, lineHeight: "18px" }}
          >
            Upgrade
          </button>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)] text-white/70 transition-colors hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Bell size={16} />
        </button>

        {/* Green app page icon button */}
        <button
          type="button"
          aria-label="App forms"
          className="outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/40 rounded-[var(--cds-radius-s)]"
        >
          <AppPageIcon />
        </button>

        {/* Access this application CTA */}
        <button
          type="button"
          className="flex items-center gap-[var(--cds-gap-tight)] rounded-[var(--cds-radius-s)] bg-[var(--cds-primary-surface-default,#0D4EF2)] px-[var(--cds-space-12)] py-[var(--cds-space-6)] text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px" }}
        >
          <Zap size={13} className="shrink-0" />
          Access this application
        </button>
      </div>
    </header>
  )
}
