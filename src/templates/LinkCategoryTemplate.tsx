/**
 * LinkCategoryTemplate
 *
 * Pattern: Operations landing page — multi-column link hub
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header  — title · description · optional search
 *   └── Category cards — each card has a tab-style header + a 4-column link grid
 *
 * Slots to customise:
 *   title          — page heading (e.g. "Operations")
 *   description    — subheading text
 *   categories     — array of LinkCategory (heading + links)
 *   showSearch     — whether to show a search input (default true)
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LinkCategoryLink {
  label: string
  href?: string
  onClick?: () => void
}

export interface LinkCategory {
  /** Category heading, e.g. "Applications" */
  heading: string
  /** All the links inside this category */
  links: LinkCategoryLink[]
  /** Number of columns to display links in (default 4) */
  columns?: number
}

export interface LinkCategoryTemplateProps {
  title?: string
  description?: string
  categories?: LinkCategory[]
  showSearch?: boolean
  onSearch?: (query: string) => void
  /** Left-nav item id to highlight as active (e.g. "operations") */
  activeNavId?: string
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: LinkCategory[] = [
  {
    heading: "Applications",
    columns: 4,
    links: [
      { label: "Backup" },
      { label: "Blueprint Analytics" },
      { label: "Support Access" },
      { label: "Early Access Features" },
      { label: "Audit Trail" },
      { label: "Logs" },
      { label: "System Integrations" },
      { label: "Email Management" },
      { label: "Publish" },
      { label: "Zia" },
      { label: "Domain Restriction" },
      { label: "Form Email" },
      { label: "Payment Gateways" },
      { label: "API Management" },
      { label: "Marketplace" },
      { label: "Databridge" },
    ],
  },
]

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: LinkCategory }) {
  const cols = category.columns ?? 4

  return (
    <div
      style={{
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--border)",
        backgroundColor: "var(--cds-white)",
        overflow: "hidden",
      }}
    >
      {/* Category heading row — tab-style */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--cds-gap-small)",
          padding: "var(--cds-space-12) var(--cds-padding-section-h)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--cds-huegrey-surface-subtle)",
        }}
      >
        {/* small grid icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <rect x="0" y="0" width="6" height="6" rx="1" fill="var(--cds-huegrey-text-default)" />
          <rect x="8" y="0" width="6" height="6" rx="1" fill="var(--cds-huegrey-text-default)" />
          <rect x="0" y="8" width="6" height="6" rx="1" fill="var(--cds-huegrey-text-default)" />
          <rect x="8" y="8" width="6" height="6" rx="1" fill="var(--cds-huegrey-text-default)" />
        </svg>
        <span
          style={{
            fontSize: "var(--cds-text-p2)",
            lineHeight: "var(--cds-leading-p2)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-dark)",
          }}
        >
          {category.heading}
        </span>
      </div>

      {/* Link grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 0,
          padding: "var(--cds-space-16) var(--cds-padding-section-h)",
          rowGap: "var(--cds-space-8)",
        }}
      >
        {category.links.map((link) => (
          <a
            key={link.label}
            href={link.href ?? "#"}
            onClick={
              link.onClick
                ? (e) => {
                    e.preventDefault()
                    link.onClick?.()
                  }
                : undefined
            }
            style={{
              fontSize: "var(--cds-text-p2)",
              lineHeight: "var(--cds-leading-p2)",
              color: "var(--cds-huegrey-text-dark)",
              textDecoration: "none",
              padding: "var(--cds-space-4) 0",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                "var(--cds-primary-text-default)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                "var(--cds-huegrey-text-dark)"
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function LinkCategoryTemplate({
  title = "Operations",
  description = "Define and manage various operations of your account using this centralized management system.",
  categories = DEFAULT_CATEGORIES,
  showSearch = true,
  onSearch,
  activeNavId,
}: LinkCategoryTemplateProps) {
  const [search, setSearch] = React.useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch?.(e.target.value)
  }

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
                    maxWidth: 700,
                  }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Search */}
            {showSearch && (
              <div style={{ position: "relative", flexShrink: 0 }}>
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
                  style={{ paddingLeft: 30, width: 220 }}
                />
              </div>
            )}
          </div>

          {/* ── Category cards ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--cds-space-16)",
            }}
          >
            {categories.map((cat) => (
              <CategoryCard key={cat.heading} category={cat} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
