/**
 * SplitPanelTemplate
 *
 * Pattern: Environments page — multi-column pipeline / stage view
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header  — title · description · right-aligned action button group
 *   ├── Search bar   — filters the left-hand list pane
 *   └── Three-column layout
 *       ├── List pane  (left, narrow) — searchable entity list or empty state
 *       ├── Panel A    (e.g. "Stage")
 *       └── Panel B    (e.g. "Production")
 *
 * Slots to customise:
 *   title          — page heading
 *   description    — subheading text with optional "Learn more" link
 *   headerActions  — array of action buttons rendered top-right
 *   listItems      — entities shown in the left pane
 *   panels         — array of SplitPanel (label + accentColor + items)
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, MoreHorizontal } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SplitPanelMenuGroup {
  label?: string
  items: { label: string; onSelect?: () => void; destructive?: boolean }[]
}

export interface SplitPanelItem {
  id: string
  label: string
  /** Optional second line under the label */
  sublabel?: string
  /** Color for the sublabel text */
  sublabelColor?: string
  /** Accent color for the avatar/icon circle */
  accentColor?: string
  /** Grouped menu items for the ··· overflow menu */
  menuGroups?: SplitPanelMenuGroup[]
  /** Per-panel cell data keyed by SplitPanel.id */
  panelCells?: Record<string, { label?: string; sublabel?: string; menuGroups?: SplitPanelMenuGroup[] }>
  /** Called when any menu item label is clicked */
  onMenuAction?: (label: string) => void
  onClick?: () => void
}

export interface SplitPanel {
  /** Unique id used to match SplitPanelItem.panelCells */
  id: string
  /** Column header label, e.g. "Stage" */
  label: string
  /** Header background color (hex or CSS var) */
  accentColor?: string
  emptyMessage?: string
}

export interface HeaderAction {
  label: string
  variant?: "default" | "outline" | "secondary"
  /** If set, renders as a DropdownMenu trigger */
  dropdownItems?: { label: string; onSelect?: () => void; onClick?: () => void }[]
  onClick?: () => void
}

export interface SplitPanelTemplateProps {
  title?: string
  description?: string
  /** Optional URL for a "Learn more" link in the description */
  learnMoreHref?: string
  headerActions?: HeaderAction[]
  listItems?: SplitPanelItem[]
  panels?: SplitPanel[]
  onSearch?: (query: string) => void
  /** LeftNav activeId — which nav item should be highlighted */
  activeNavId?: string
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [
  { label: "Version History", variant: "outline" },
  {
    label: "Manage",
    variant: "default",
    dropdownItems: [
      { label: "Settings" },
      { label: "Variables" },
    ],
  },
  { label: "Publish", variant: "secondary" },
]

const DEFAULT_PANELS: SplitPanel[] = [
  {
    id: "stage",
    label: "Stage",
    accentColor: "var(--cds-primary-surface-default)",
    emptyMessage: "No applications in Stage yet",
  },
  {
    id: "production",
    label: "Production",
    accentColor: "var(--cds-success-surface-default)",
    emptyMessage: "No applications in Production yet",
  },
]

// Pre-populated dataset matching the Fleet Hub scenario in the screenshot
export const DEFAULT_LIST_ITEMS: SplitPanelItem[] = [
  {
    id: "fleet-hub",
    label: "Fleet Hub",
    accentColor: "#DC2626",
    sublabel: "No changes available",
    sublabelColor: "var(--cds-huegrey-text-default)",
    menuGroups: [
      {
        label: "Development",
        items: [
          { label: "Edit" },
          { label: "Access" },
          { label: "Settings" },
          { label: "Logs" },
          { label: "Export" },
        ],
      },
    ],
    panelCells: {
      stage: {
        label: "1.0",
        sublabel: "Aug 31, 2026",
        menuGroups: [{
          label: "Stage",
          items: [{ label: "Access" }, { label: "Settings" }, { label: "Logs" }, { label: "Export" }],
        }],
      },
      production: {
        label: "1.0",
        sublabel: "Aug 31, 2026",
        menuGroups: [{
          label: "Production",
          items: [{ label: "Access" }, { label: "Settings" }, { label: "Logs" }, { label: "Export" }],
        }],
      },
    },
  },
]

export const DEFAULT_PANELS_WITH_APP = DEFAULT_PANELS

// ─── PanelCell ────────────────────────────────────────────────────────────────

function PanelCell({ cell, item, isLast }: {
  cell: { label?: string; sublabel?: string; menuGroups?: SplitPanelMenuGroup[] } | undefined
  item: SplitPanelItem
  isLast: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--cds-gap-small)",
        padding: "var(--cds-space-12) var(--cds-padding-card)",
        borderLeft: "1px solid var(--border)",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        minHeight: 56,
      }}
    >
      {cell ? (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {cell.label}
            </div>
            {cell.sublabel && (
              <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{cell.sublabel}</div>
            )}
          </div>
          {cell.menuGroups && cell.menuGroups.length > 0 && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2px 6px", background: "transparent", border: "none", borderRadius: "var(--cds-radius-s)", cursor: "pointer", color: "var(--cds-huegrey-text-default)", flexShrink: 0 }}
              >
                <MoreHorizontal size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {cell.menuGroups.map((group, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuGroup>
                      {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                      {group.items.map(mi => (
                        <DropdownMenuItem
                          key={mi.label}
                          onClick={(e) => { e.stopPropagation(); mi.onSelect?.(); item.onMenuAction?.(mi.label) }}
                          style={mi.destructive ? { color: "var(--cds-error-text-default)" } : undefined}
                        >
                          {mi.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ) : (
        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>—</span>
      )}
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function SplitPanelTemplate({
  title = "Environments",
  description = "Multi-stage deployment space to test and publish your application without affecting the production.",
  learnMoreHref,
  headerActions = DEFAULT_HEADER_ACTIONS,
  listItems = [],
  panels = DEFAULT_PANELS,
  onSearch,
  activeNavId = "environments",
}: SplitPanelTemplateProps) {
  const [search, setSearch] = React.useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch?.(e.target.value)
  }

  const filteredList = listItems.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId={activeNavId} />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)",
          }}
        >
          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--cds-gap-default)",
              marginBottom: "var(--cds-space-24)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
              <h1
                style={{
                  fontSize: "var(--cds-text-p1)",
                  lineHeight: "var(--cds-leading-p1)",
                  color: "var(--cds-huegrey-text-dark)",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {title}
              </h1>
              {description && (
                <p
                  style={{
                    fontSize: "var(--cds-text-p2)",
                    lineHeight: "var(--cds-leading-p2)",
                    color: "var(--cds-huegrey-text-default)",
                  }}
                >
                  {description}
                  {learnMoreHref && (
                    <>
                      {" "}
                      <a
                        href={learnMoreHref}
                        style={{
                          color: "var(--cds-primary-text-default)",
                          textDecoration: "underline",
                        }}
                      >
                        Learn more
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-small)",
                flexShrink: 0,
              }}
            >
              {headerActions.map((action) =>
                action.dropdownItems ? (
                  <DropdownMenu key={action.label}>
                    <DropdownMenuTrigger className={buttonVariants({ variant: action.variant ?? "default" })}>
                      {action.label} <ChevronDown size={12} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {action.dropdownItems.map((di) => (
                        <DropdownMenuItem
                          key={di.label}
                          onSelect={di.onSelect}
                          onClick={di.onClick ?? di.onSelect}
                        >
                          {di.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    key={action.label}
                    variant={action.variant ?? "default"}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* ── Grid layout ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `240px repeat(${panels.length}, 1fr)`,
              alignContent: "start",
              border: "1px solid var(--border)",
              borderRadius: "var(--cds-radius-r)",
              overflow: "hidden",
              backgroundColor: "var(--cds-white)",
              minHeight: 400,
            }}
          >
            {/* Header row: search in left cell + panel headers */}
            <div style={{ borderBottom: "1px solid var(--border)", padding: "var(--cds-space-8) var(--cds-padding-card)", display: "flex", alignItems: "center" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--cds-huegrey-text-default)", pointerEvents: "none" }} />
                <Input value={search} onChange={handleSearch} placeholder="Search" style={{ paddingLeft: 28 }} />
              </div>
            </div>
            {panels.map((panel) => (
              <div
                key={panel.id}
                style={{
                  backgroundColor: panel.accentColor ?? "var(--cds-primary-surface-default)",
                  padding: "var(--cds-space-12) var(--cds-padding-card)",
                  color: "var(--cds-white)",
                  fontWeight: 600,
                  fontSize: "var(--cds-text-p2)",
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {panel.label}
              </div>
            ))}

            {/* App rows */}
            {filteredList.length > 0 ? (
              filteredList.map((item, idx) => {
                const isLast = idx === filteredList.length - 1
                return (
                  <React.Fragment key={item.id}>
                    {/* Left cell — app info */}
                    <div
                      onClick={item.onClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--cds-gap-default)",
                        padding: "var(--cds-space-12) var(--cds-padding-card)",
                        borderBottom: isLast ? "none" : "1px solid var(--border)",
                        cursor: item.onClick ? "pointer" : "default",
                        minHeight: 56,
                      }}
                    >
                      {item.accentColor && (
                        <div style={{ width: 32, height: 32, borderRadius: "var(--cds-radius-s)", background: item.accentColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>
                          {item.label.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                        {item.sublabel && (
                          <div style={{ fontSize: "var(--cds-text-p3)", color: item.sublabelColor ?? "var(--cds-huegrey-text-default)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sublabel}</div>
                        )}
                      </div>
                      {item.menuGroups && item.menuGroups.length > 0 && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2px 6px", flexShrink: 0, background: "transparent", border: "none", borderRadius: "var(--cds-radius-s)", cursor: "pointer", color: "var(--cds-huegrey-text-default)" }}
                          >
                            <MoreHorizontal size={14} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.menuGroups.map((group, gi) => (
                              <React.Fragment key={gi}>
                                {gi > 0 && <DropdownMenuSeparator />}
                                <DropdownMenuGroup>
                                  {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                                  {group.items.map(mi => (
                                    <DropdownMenuItem
                                      key={mi.label}
                                      onClick={(e) => { e.stopPropagation(); mi.onSelect?.(); item.onMenuAction?.(mi.label) }}
                                      style={mi.destructive ? { color: "var(--cds-error-text-default)" } : undefined}
                                    >
                                      {mi.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              </React.Fragment>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Panel cells — one per panel column */}
                    {panels.map((panel) => (
                      <PanelCell
                        key={panel.id}
                        cell={item.panelCells?.[panel.id]}
                        item={item}
                        isLast={isLast}
                      />
                    ))}
                  </React.Fragment>
                )
              })
            ) : (
              <React.Fragment>
                {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                <div
                style={{
                  gridColumn: `1 / ${panels.length + 2}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--cds-gap-default)",
                  padding: "var(--cds-space-48) var(--cds-padding-card)",
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: "var(--cds-radius-r)", backgroundColor: "var(--cds-huegrey-surface-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                    <rect x="2" y="2" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                    <rect x="12" y="2" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                    <rect x="2" y="12" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                    <rect x="12" y="12" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                  </svg>
                </div>
                <p style={{ fontSize: "var(--cds-text-p3)", lineHeight: "var(--cds-leading-p3)", color: "var(--cds-huegrey-text-default)", textAlign: "center" }}>
                  There are no applications added to the environment
                </p>
                <Button size="sm">Add Application</Button>
              </div>
              </React.Fragment>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
