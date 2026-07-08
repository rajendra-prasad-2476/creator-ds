/**
 * CardGridTemplate
 *
 * Pattern: Solutions / App gallery page
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header  — welcome title · search · filter select · primary CTA
 *   └── Content      — responsive grid of app / solution tiles
 *
 * Each tile shows: coloured initials avatar · name · date · type label ·
 *                  "More" overflow menu · secondary action button.
 *
 * Slots to customise:
 *   title        — page heading (e.g. "Welcome, rajendra.prasad")
 *   items        — array of CardGridItem
 *   ctaLabel     — primary button label (default "+ Create Solution")
 *   filterOptions — options for the filter select
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, MoreHorizontal, Pencil } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardGridItem {
  id: string
  /** Short label shown as initials inside the coloured avatar */
  initials: string
  /** Hex or CSS variable — background of the avatar circle */
  avatarColor: string
  name: string
  /** e.g. "Created on Jun 25, 2026" or "Installed on Jun 23, 2026" */
  dateLabel: string
  /** e.g. "Application" */
  typeLabel?: string
  /** Actions available in the "More" overflow dropdown */
  moreActions?: { label: string; onSelect?: () => void }[]
  onEdit?: () => void
}

export interface CardGridTemplateProps {
  /** Page heading — typically "Welcome, [username]" */
  title?: string
  items?: CardGridItem[]
  ctaLabel?: string
  filterOptions?: { value: string; label: string }[]
  onCtaClick?: () => void
  onSearch?: (query: string) => void
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: CardGridItem[] = [
  {
    id: "1",
    initials: "FPT",
    avatarColor: "#2563EB",
    name: "Figma Plugin Test",
    dateLabel: "Created on Jun 25, 2026",
    typeLabel: "Application",
    moreActions: [{ label: "Duplicate" }, { label: "Delete" }],
  },
  {
    id: "2",
    initials: "EX",
    avatarColor: "#059669",
    name: "Expenses",
    dateLabel: "Installed on Jun 23, 2026",
    typeLabel: "Application",
    moreActions: [{ label: "Duplicate" }, { label: "Delete" }],
  },
  {
    id: "3",
    initials: "FH",
    avatarColor: "#DC2626",
    name: "Fleet Hub",
    dateLabel: "Created on Jun 22, 2026",
    typeLabel: "Application",
    moreActions: [{ label: "Duplicate" }, { label: "Delete" }],
  },
  {
    id: "4",
    initials: "MFC",
    avatarColor: "#7C3AED",
    name: "My first Creator app",
    dateLabel: "Created on Jun 17, 2026",
    typeLabel: "Application",
    moreActions: [{ label: "Duplicate" }, { label: "Delete" }],
  },
]

const DEFAULT_FILTER_OPTIONS = [
  { value: "all", label: "All Apps" },
  { value: "created", label: "Created by me" },
  { value: "installed", label: "Installed" },
]

// ─── AppTile ──────────────────────────────────────────────────────────────────

function AppTile({ item }: { item: CardGridItem }) {
  return (
    <div
      style={{
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--border)",
        padding: "var(--cds-padding-card)",
        backgroundColor: "var(--cds-white)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--cds-gap-default)",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--cds-radius-r)",
          backgroundColor: item.avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--cds-white)",
          fontSize: "var(--cds-text-p3)",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {item.initials}
      </div>

      {/* Name + date */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
        <span
          style={{
            fontSize: "var(--cds-text-p1)",
            lineHeight: "var(--cds-leading-p1)",
            color: "var(--cds-huegrey-text-dark)",
            fontWeight: 500,
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            fontSize: "var(--cds-text-p3)",
            lineHeight: "var(--cds-leading-p3)",
            color: "var(--cds-huegrey-text-default)",
          }}
        >
          {item.dateLabel}
        </span>
      </div>

      {/* Footer: type + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--cds-gap-small)",
        }}
      >
        {/* Type label with icon */}
        {item.typeLabel && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-gap-tight)",
              fontSize: "var(--cds-text-p3)",
              color: "var(--cds-huegrey-text-default)",
            }}
          >
            {/* grid icon placeholder */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
              <rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
              <rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
              <rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
            {item.typeLabel}
          </span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
          {/* More dropdown */}
          {item.moreActions && item.moreActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" className="gap-1">
                  More <ChevronDown size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {item.moreActions.map((a) => (
                  <DropdownMenuItem key={a.label} onSelect={a.onSelect}>
                    {a.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Edit button */}
          <Button variant="ghost" size="xs" className="gap-1" onClick={item.onEdit}>
            <Pencil size={12} /> Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function CardGridTemplate({
  title = "Welcome, rajendra.prasad",
  items = DEFAULT_ITEMS,
  ctaLabel = "+ Create Solution",
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onCtaClick,
  onSearch,
}: CardGridTemplateProps) {
  const [search, setSearch] = React.useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding:
              "var(--cds-padding-section-v) var(--cds-padding-section-h)",
          }}
        >
          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--cds-space-24)",
              gap: "var(--cds-gap-default)",
              flexWrap: "wrap",
            }}
          >
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-small)",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative" }}>
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
                  placeholder="Search…"
                  style={{ paddingLeft: 30, width: 200 }}
                />
              </div>

              {/* Filter */}
              <Select defaultValue="all">
                <SelectTrigger style={{ width: 140 }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* CTA */}
              <Button onClick={onCtaClick}>{ctaLabel}</Button>
            </div>
          </div>

          {/* ── Card grid ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--cds-space-16)",
            }}
          >
            {items.map((item) => (
              <AppTile key={item.id} item={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
