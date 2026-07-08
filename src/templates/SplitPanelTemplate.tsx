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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SplitPanelItem {
  id: string
  label: string
}

export interface SplitPanel {
  /** Column header label, e.g. "Stage" */
  label: string
  /** Header background color (hex or CSS var) */
  accentColor?: string
  /** Items in this stage column */
  items?: SplitPanelItem[]
  emptyMessage?: string
}

export interface HeaderAction {
  label: string
  variant?: "default" | "outline" | "secondary"
  /** If set, renders as a DropdownMenu trigger */
  dropdownItems?: { label: string; onSelect?: () => void }[]
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
    label: "Stage",
    accentColor: "var(--cds-primary-surface-default)",
    items: [],
    emptyMessage: "No applications in Stage yet",
  },
  {
    label: "Production",
    accentColor: "var(--cds-success-surface-default)",
    items: [],
    emptyMessage: "No applications in Production yet",
  },
]

// ─── PanelColumn ──────────────────────────────────────────────────────────────

function PanelColumn({ panel }: { panel: SplitPanel }) {
  const accent = panel.accentColor ?? "var(--cds-primary-surface-default)"
  const hasItems = panel.items && panel.items.length > 0

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: "var(--cds-radius-r)",
        overflow: "hidden",
        backgroundColor: "var(--cds-white)",
        minHeight: 400,
      }}
    >
      {/* Column header */}
      <div
        style={{
          backgroundColor: accent,
          padding: "var(--cds-space-12) var(--cds-padding-card)",
          color: "var(--cds-white)",
          fontWeight: 600,
          fontSize: "var(--cds-text-p2)",
          lineHeight: "var(--cds-leading-p2)",
        }}
      >
        {panel.label}
      </div>

      {/* Column body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: hasItems ? "flex-start" : "center",
          padding: "var(--cds-padding-card)",
          gap: "var(--cds-gap-default)",
        }}
      >
        {hasItems ? (
          <ul style={{ width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
            {panel.items!.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "var(--cds-space-8) var(--cds-space-12)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "var(--cds-text-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
            <p
              style={{
                fontSize: "var(--cds-text-p2)",
                lineHeight: "var(--cds-leading-p2)",
                color: "var(--cds-huegrey-text-default)",
                textAlign: "center",
              }}
            >
              {panel.emptyMessage ?? `No items in ${panel.label}`}
            </p>
          </>
        )}
      </div>
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
}: SplitPanelTemplateProps) {
  const [search, setSearch] = React.useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch?.(e.target.value)
  }

  const hasListItems = listItems.length > 0
  const filteredList = listItems.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
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
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
              <h1
                style={{
                  fontSize: "var(--cds-text-h2)",
                  lineHeight: "var(--cds-leading-h2)",
                  color: "var(--cds-huegrey-text-dark)",
                  fontWeight: 600,
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
                    <DropdownMenuTrigger style={{ border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4, fontSize:"var(--cds-text-p2)", padding:"4px 12px", borderRadius:"var(--cds-radius-r)", background:"var(--cds-primary-surface-default)", color:"var(--cds-white)" }}>{action.label} <ChevronDown size={12} /></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {action.dropdownItems.map((di) => (
                        <DropdownMenuItem key={di.label} onSelect={di.onSelect}>
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

          {/* ── Search ── */}
          <div style={{ position: "relative", width: 240, marginBottom: "var(--cds-space-16)" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--cds-huegrey-text-default)",
                pointerEvents: "none",
              }}
            />
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search"
              style={{ paddingLeft: 30 }}
            />
          </div>

          {/* ── Split layout ── */}
          <div style={{ display: "flex", gap: "var(--cds-space-16)", alignItems: "stretch" }}>
            {/* Left pane — application list */}
            <div
              style={{
                width: 240,
                flexShrink: 0,
                border: "1px solid var(--border)",
                borderRadius: "var(--cds-radius-r)",
                backgroundColor: "var(--cds-white)",
                display: "flex",
                flexDirection: "column",
                alignItems: hasListItems ? "flex-start" : "center",
                justifyContent: hasListItems ? "flex-start" : "center",
                padding: hasListItems ? 0 : "var(--cds-padding-card)",
                gap: "var(--cds-gap-default)",
                minHeight: 400,
              }}
            >
              {filteredList.length > 0 ? (
                <ul style={{ width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
                  {filteredList.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        padding: "var(--cds-space-8) var(--cds-padding-card)",
                        borderBottom: "1px solid var(--border)",
                        fontSize: "var(--cds-text-p2)",
                        color: "var(--cds-huegrey-text-dark)",
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--cds-radius-r)",
                      backgroundColor: "var(--cds-huegrey-surface-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                      <rect x="2" y="2" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                      <rect x="12" y="2" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                      <rect x="2" y="12" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                      <rect x="12" y="12" width="8" height="8" rx="1" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--cds-text-p3)",
                      lineHeight: "var(--cds-leading-p3)",
                      color: "var(--cds-huegrey-text-default)",
                      textAlign: "center",
                    }}
                  >
                    There are no applications added to the environment
                  </p>
                  <Button size="sm">Add Application</Button>
                </>
              )}
            </div>

            {/* Stage / Production panels */}
            {panels.map((panel) => (
              <PanelColumn key={panel.label} panel={panel} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
