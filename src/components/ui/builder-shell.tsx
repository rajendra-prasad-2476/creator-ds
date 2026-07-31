"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Monitor, Tablet, Smartphone, Paintbrush, LayoutGrid, User, Power, Search, X } from "lucide-react"
import {
  BuilderTopBar,
  type BuilderTopBarProps,
  type BuilderTab,
} from "./builder-top-bar"
import {
  type BuilderNavSection,
  type BuilderNavItem,
  type BuilderNavItemType,
  type BuilderLeftNavUser,
} from "./builder-left-nav"
import { LeftNav } from "./left-nav"
import type { NavSectionDef } from "./left-nav"
import { Sheet, SheetContent } from "./sheet"
import { Blanket } from "./blanket"

/* ─── Mega-menu types ─── */

export interface BuilderMegaMenuItem {
  id: string
  label: string
  type: BuilderNavItemType
}

export interface BuilderMegaMenuColumn {
  id: string
  /** Column heading e.g. "Forms", "Reports", "Workflows", "Pages" */
  label: string
  items: BuilderMegaMenuItem[]
  /** Filter chip labels shown at top of column, e.g. ["Design Work Items"] */
  filteredBy?: string[]
  /** Shown when items is empty, e.g. "- No workflows to display -" */
  emptyMessage?: string
}

/* ─── Re-exports (consumers import everything from builder-shell) ─── */
export type { BuilderTab, BuilderNavSection, BuilderNavItem, BuilderNavItemType, BuilderLeftNavUser }

/* ─── Types ─── */

export type BuilderViewport = "web" | "tablet" | "phone"

/** Props forwarded to BuilderTopBar (minus className which the shell manages) */
type TopBarConfig = Omit<BuilderTopBarProps, "className" | "flyoutOpen">

export interface BuilderFlyoutUser {
  name: string
  email: string
  onLogout?: () => void
}

export interface BuilderTabSubNavItem {
  id: string
  label: string
}

export interface BuilderTabSubNav {
  /** Sub-tab items shown as a horizontal strip */
  tabs: BuilderTabSubNavItem[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  /** Optional right-side content: search input, action buttons, etc. */
  actions?: React.ReactNode
}

export interface BuilderShellProps {
  /** All props for the persistent top bar */
  topBar: TopBarConfig
  /** Active device preview viewport (default: "web") */
  viewport?: BuilderViewport
  onViewportChange?: (viewport: BuilderViewport) => void
  /**
   * Live preview canvas content.
   * For web viewport this should include the app entity nav + content inside a browser frame.
   * For tablet/phone this should include the appropriate device frame.
   */
  children?: React.ReactNode
  /** Right-side customisation panel content (Report / Form / Page properties) */
  propertiesPanel?: React.ReactNode
  /** Show the right properties panel (default: true) */
  showPropertiesPanel?: boolean
  /** Title displayed in the properties panel header, e.g. "Report Customization - Web" */
  propertiesPanelTitle?: string
  /**
   * Creator platform nav sections shown in the hamburger flyout.
   * Defaults to the standard DEVELOP / DEPLOY / MANAGE sections.
   */
  platformNavSections?: NavSectionDef[]
  /** Active item id in the platform nav flyout */
  platformNavActiveId?: string
  onPlatformNavNavigate?: (id: string) => void
  /** User shown at the bottom of the hamburger flyout */
  flyoutUser?: BuilderFlyoutUser
  /**
   * Columns shown in the mega-menu dropdown triggered by the app name chevron.
   * Typically: Forms | Reports | Workflows | Pages
   */
  megaMenuColumns?: BuilderMegaMenuColumn[]
  /** Active item id in the mega-menu (highlighted in Forms column) */
  megaMenuActiveId?: string
  onMegaMenuItemClick?: (id: string) => void
  /**
   * Sub-navigation bar for the active builder tab (e.g. Workflow sub-tabs).
   * When provided, replaces the viewport toolbar. Set to undefined for Design tab
   * to restore the Desktop/Tablet/Phone switcher.
   */
  tabSubNav?: BuilderTabSubNav
  className?: string
}

/* ─── Viewport options ─── */

const VIEWPORT_OPTIONS: {
  id: BuilderViewport
  label: string
  Icon: React.ElementType
}[] = [
  { id: "web",    label: "Desktop", Icon: Monitor },
  { id: "tablet", label: "Tablet",  Icon: Tablet },
  { id: "phone",  label: "Phone",   Icon: Smartphone },
]

/* ─── BuilderViewportToolbar ─── */

function BuilderViewportToolbar({
  viewport,
  onViewportChange,
}: {
  viewport: BuilderViewport
  onViewportChange?: (v: BuilderViewport) => void
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-full shrink-0 items-center justify-between",
        "border-b border-[var(--border,#E5E5E7)] bg-[var(--cds-white)]",
        "px-[var(--cds-padding-section-h)]"
      )}
    >
      {/* Device switcher */}
      <div className="flex items-center gap-[var(--cds-gap-tight)]">
        {VIEWPORT_OPTIONS.map(({ id, label, Icon }) => {
          const active = viewport === id
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onViewportChange?.(id)}
              className={cn(
                "flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)]",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default,#0D4EF2)]/40",
                active
                  ? "text-[var(--cds-primary-text-default,#0D4EF2)] bg-[var(--cds-primary-surface-subtle,#f5f8fe)]"
                  : "text-[var(--cds-huegrey-text-default,#696C74)] hover:text-[var(--cds-huegrey-text-dark,#26282B)] hover:bg-[var(--cds-primary-surface-subtle,#f5f8fe)]"
              )}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>

      {/* Right tool icons */}
      <div className="flex items-center gap-[var(--cds-gap-tight)]">
        <button
          type="button"
          aria-label="Theme preview"
          className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)] text-[var(--cds-huegrey-text-default,#696C74)] transition-colors hover:text-[var(--cds-huegrey-text-dark,#26282B)] hover:bg-[var(--cds-primary-surface-subtle,#f5f8fe)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default,#0D4EF2)]/40"
        >
          <Paintbrush size={16} />
        </button>
        <button
          type="button"
          aria-label="Layout grid"
          className="flex items-center justify-center rounded-[var(--cds-radius-s)] p-[var(--cds-space-6)] text-[var(--cds-huegrey-text-default,#696C74)] transition-colors hover:text-[var(--cds-huegrey-text-dark,#26282B)] hover:bg-[var(--cds-primary-surface-subtle,#f5f8fe)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default,#0D4EF2)]/40"
        >
          <LayoutGrid size={16} />
        </button>
      </div>
    </div>
  )
}

/* ─── Platform nav flyout user section ─── */

function FlyoutUserSection({ user }: { user: BuilderFlyoutUser }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-[var(--cds-gap-small)] border-t border-[var(--border,#E5E5E7)] px-[var(--cds-padding-card)] py-[var(--cds-space-20)]">
      {/* Avatar */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cds-huegrey-surface-low)]">
        <User size={24} className="text-[color:var(--cds-huegrey-text-default)]" />
      </div>
      {/* Name */}
      <span
        className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-huegrey-text-dark,#26282B)] font-medium"
        style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
      >
        {user.name}
      </span>
      {/* Email */}
      <span
        className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] text-[var(--cds-huegrey-text-default,#696C74)]"
        style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
      >
        {user.email}
      </span>
      {/* Logout */}
      <button
        type="button"
        onClick={user.onLogout}
        className="flex items-center gap-[var(--cds-gap-tight)] rounded-[var(--cds-radius-s)] px-[var(--cds-space-12)] py-[var(--cds-space-6)] text-[var(--cds-error-surface-default,#CC1914)] outline-none transition-colors hover:bg-[#FFF0EF] focus-visible:ring-2 focus-visible:ring-[var(--cds-error-surface-default,#CC1914)]/30"
        style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "14px", fontWeight: 500 }}
      >
        <Power size={14} />
        Logout
      </button>
    </div>
  )
}

/* ─── BuilderShell ─── */

const DEFAULT_FLYOUT_USER: BuilderFlyoutUser = {
  name: "Rajendra Prasad",
  email: "rajendra.prasad@zohotest.com",
}

/* ─── BuilderSubNavBar — sub-tabs shown for Workflow / Settings tabs ─── */

function BuilderSubNavBar({ subNav }: { subNav: BuilderTabSubNav }) {
  return (
    <div
      className={cn(
        "flex h-10 w-full shrink-0 items-center justify-between",
        "border-b border-[var(--border,#E5E5E7)] bg-[var(--cds-white)]",
        "px-[var(--cds-padding-section-h)]"
      )}
    >
      {/* Sub-tab strip */}
      <nav className="flex h-full items-center" role="tablist">
        {subNav.tabs.map((tab) => {
          const active = tab.id === subNav.activeTabId
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => subNav.onTabChange?.(tab.id)}
              className={cn(
                "relative flex h-full items-center px-[var(--cds-space-16)]",
                "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-surface-default,#0D4EF2)]/40",
                active
                  ? "text-[var(--cds-primary-text-default,#0D4EF2)] font-semibold"
                  : "text-[var(--cds-huegrey-text-default,#696C74)] hover:text-[var(--cds-huegrey-text-dark,#26282B)] font-normal"
              )}
              style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--cds-primary-surface-default,#0D4EF2)] rounded-t-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Right-side actions */}
      {subNav.actions && (
        <div className="flex items-center gap-[var(--cds-gap-small)]">
          {subNav.actions}
        </div>
      )}
    </div>
  )
}

/* ─── Mega-menu item type icons (same as builder-left-nav inline SVGs) ─── */

function MegaMenuItemIcon({ type }: { type: BuilderNavItemType }) {
  if (type === "report") return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
      <rect x="1.5" y="1.5" width="11" height="3" rx="1" fill="currentColor" opacity="0.5" />
      <path d="M3.5 7h7M3.5 9.5h7" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
  if (type === "page") return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M3 1.5h5.5l3 3v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V2A.5.5 0 013 1.5z" stroke="currentColor" strokeWidth="0.9" />
      <path d="M8.5 1.5V4.5h3" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  )
  if (type === "workflow") return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="2.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="11.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="11.5" cy="11" r="1.5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M4 7h3.5V3.5h2M7.5 7v3.5h2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (type === "stage") return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="1.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="0.9" />
      <rect x="8.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="0.9" />
      <path d="M5.5 7h3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
  // Default: form
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

/* ─── BuilderMegaMenu ─── */

function BuilderMegaMenu({
  columns,
  activeId,
  onItemClick,
  onClose,
}: {
  columns: BuilderMegaMenuColumn[]
  activeId?: string
  onItemClick?: (id: string) => void
  onClose: () => void
}) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!search.trim()) return columns
    const q = search.toLowerCase()
    return columns.map((col) => ({
      ...col,
      items: col.items.filter((item) => item.label.toLowerCase().includes(q)),
    }))
  }, [columns, search])

  return (
    <>
      {/* Blanket behind the mega menu */}
      <Blanket
        className="z-30"
        onClick={onClose}
      />

      {/* Mega menu panel */}
      <div
        className={cn(
          "absolute inset-0 z-40",
          "flex flex-col bg-[var(--cds-white)]",
          "shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        )}
        role="dialog"
        aria-label="App navigation"
      >
        {/* Search row */}
        <div className="flex items-center gap-[var(--cds-gap-small)] border-b border-[var(--border,#E5E5E7)] px-[var(--cds-space-16)] py-[var(--cds-space-8)]">
          <Search size={14} className="shrink-0 text-[var(--cds-huegrey-text-default,#696C74)]" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className={cn(
              "flex-1 bg-transparent outline-none",
              "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
              "text-[var(--cds-huegrey-text-dark,#26282B)]",
              "placeholder:text-[var(--cds-huegrey-text-default,#696C74)]"
            )}
            style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex items-center justify-center rounded-[var(--cds-radius-xs)] p-[var(--cds-space-2)] text-[var(--cds-huegrey-text-default)] hover:text-[var(--cds-huegrey-text-dark)] outline-none"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Columns */}
        <div className="flex flex-1 overflow-y-auto divide-x divide-[var(--border,#E5E5E7)]">
          {filtered.map((col) => (
              <div key={col.id} className="flex flex-col min-w-[180px]" style={{ flex: col.id === "forms" ? "0 0 220px" : "1" }}>
                {/* Column heading */}
                <div className="px-[var(--cds-space-16)] py-[var(--cds-space-8)] border-b border-[var(--border,#E5E5E7)]">
                  <span
                    className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-dark,#26282B)] font-semibold"
                    style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                  >
                    {col.label}
                  </span>
                </div>

                {/* Filter chips */}
                {col.filteredBy && col.filteredBy.length > 0 && (
                  <div className="flex flex-wrap items-center gap-[var(--cds-gap-tight)] px-[var(--cds-space-16)] py-[var(--cds-space-8)] border-b border-[var(--border,#E5E5E7)]">
                    <span className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)]" style={{ fontFamily: "'Zoho Puvi', sans-serif" }}>
                      Filtered by :
                    </span>
                    {col.filteredBy.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "inline-flex items-center gap-[var(--cds-gap-tight)]",
                          "rounded-full border border-[var(--cds-primary-surface-default,#0D4EF2)]",
                          "px-[var(--cds-space-8)] py-[var(--cds-space-2)]",
                          "text-[length:var(--cds-text-p3)] text-[var(--cds-primary-text-default,#0D4EF2)]"
                        )}
                        style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                      >
                        {tag}
                        <button type="button" className="outline-none hover:opacity-70">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Items */}
                <div className="flex flex-col py-[var(--cds-space-4)]">
                  {col.items.length === 0 ? (
                    <div className="px-[var(--cds-space-16)] py-[var(--cds-space-12)]">
                      <span
                        className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default,#696C74)]"
                        style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                      >
                        {col.emptyMessage ?? `- No ${col.label.toLowerCase()} to display -`}
                      </span>
                    </div>
                  ) : (
                    col.items.map((item) => {
                      const isActive = item.id === activeId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onItemClick?.(item.id)
                            onClose()
                          }}
                          className={cn(
                            "flex w-full items-center gap-[var(--cds-gap-small)] px-[var(--cds-space-16)] py-[var(--cds-space-8)] text-left outline-none transition-colors",
                            isActive
                              ? "bg-[var(--cds-primary-surface-subtle,#f5f8fe)] text-[var(--cds-primary-text-default,#0D4EF2)]"
                              : "text-[var(--cds-huegrey-text-dark,#26282B)] hover:bg-[var(--cds-primary-surface-subtle,#f5f8fe)]"
                          )}
                        >
                          <MegaMenuItemIcon type={item.type} />
                          <span
                            className="flex-1 truncate text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
                            style={{ fontFamily: "'Zoho Puvi', sans-serif", fontWeight: isActive ? 600 : 400 }}
                          >
                            {item.label}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export function BuilderShell({
  topBar,
  viewport = "web",
  onViewportChange,
  children,
  propertiesPanel,
  showPropertiesPanel = true,
  propertiesPanelTitle,
  platformNavSections,
  platformNavActiveId,
  onPlatformNavNavigate,
  flyoutUser = DEFAULT_FLYOUT_USER,
  megaMenuColumns,
  megaMenuActiveId,
  onMegaMenuItemClick,
  tabSubNav,
  className,
}: BuilderShellProps) {
  const [flyoutOpen, setFlyoutOpen] = React.useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false)

  const handleMenuToggle = () => {
    setFlyoutOpen((prev) => !prev)
    topBar.onMenuToggle?.()
  }

  const handleAppChevronClick = () => {
    setMegaMenuOpen((prev) => !prev)
    topBar.onAppChevronClick?.()
  }

  return (
    <div
      data-slot="builder-shell"
      className={cn("flex flex-col h-screen overflow-hidden", className)}
    >
      {/* ── Persistent top bar ── */}
      <BuilderTopBar
        {...topBar}
        flyoutOpen={flyoutOpen}
        megaMenuOpen={megaMenuOpen}
        onMenuToggle={handleMenuToggle}
        onAppChevronClick={handleAppChevronClick}
      />

      {/* ── Body row ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Centre: viewport toolbar + live preview canvas + mega menu overlay */}
        <div className="relative flex flex-1 flex-col overflow-hidden">

          {/* Mega-menu dropdown — covers only the canvas area; properties panel stays visible */}
          {megaMenuOpen && megaMenuColumns && (
            <BuilderMegaMenu
              columns={megaMenuColumns}
              activeId={megaMenuActiveId}
              onItemClick={onMegaMenuItemClick}
              onClose={() => setMegaMenuOpen(false)}
            />
          )}
          {/* Sub-nav OR viewport toolbar depending on active tab */}
          {tabSubNav ? (
            <BuilderSubNavBar subNav={tabSubNav} />
          ) : (
            <BuilderViewportToolbar
              viewport={viewport}
              onViewportChange={onViewportChange}
            />
          )}
          <main
            className="flex-1 overflow-auto bg-[var(--cds-primary-surface-subtle,#f5f8fe)]"
            data-viewport={viewport}
          >
            {children}
          </main>
        </div>

        {/* Right: customisation / properties panel */}
        {showPropertiesPanel && (
          <aside
            className="flex w-[280px] shrink-0 flex-col border-l border-[var(--border,#E5E5E7)] bg-[var(--cds-white)]"
            data-slot="builder-properties-panel"
          >
            {propertiesPanelTitle && (
              <div className="flex h-12 shrink-0 items-center border-b border-[var(--border,#E5E5E7)] px-[var(--cds-padding-card)]">
                <span
                  className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-huegrey-text-dark,#26282B)] font-semibold truncate"
                  style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
                >
                  {propertiesPanelTitle}
                </span>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {propertiesPanel}
            </div>
          </aside>
        )}
      </div>

      {/* ── Platform nav flyout (hamburger → Sheet from left) ── */}
      <Sheet open={flyoutOpen} onOpenChange={setFlyoutOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="flex flex-col p-0 w-[260px] gap-0"
        >
          {/* Creator platform LeftNav */}
          <div className="flex-1 overflow-y-auto">
            <LeftNav
              sections={platformNavSections}
              activeId={platformNavActiveId}
              onNavigate={(id) => {
                onPlatformNavNavigate?.(id)
                setFlyoutOpen(false)
              }}
              className="min-h-full"
            />
          </div>

          {/* User section */}
          <FlyoutUserSection user={flyoutUser} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
