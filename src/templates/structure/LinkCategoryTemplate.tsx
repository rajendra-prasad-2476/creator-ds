/**
 * LinkCategoryTemplate
 *
 * Pattern: Operations landing page — multi-column link hub
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header  — title · description · optional search
 *   └── Category cards — each category rendered as a CardOperations card
 *       (floated title pill + 2-column link grid)
 *
 * Slots to customise:
 *   title          — page heading (e.g. "Operations")
 *   description    — subheading text
 *   categories     — array of LinkCategory (heading + optional icon + links)
 *   showSearch     — whether to show a search input (default true)
 *   cardColumns    — number of cards per row (default 3)
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Input } from "@/components/ui/input"
import { Search, LayoutGrid, BarChart3, Workflow, Bot } from "lucide-react"
import {
  CardOperations,
  CardOperationsPill,
  CardOperationsBody,
  CardOperationsGrid,
  CardOperationsLink,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
  /**
   * Optional icon for the pill header.
   * Defaults to a small grid icon if omitted.
   */
  icon?: React.ReactNode
  /**
   * How many grid columns this card spans (default 1).
   * Use `cardColumns` (e.g. 3) to make a card span the full row.
   */
  span?: number
  /** @deprecated Column count is no longer used — CardOperations always renders a 2-col grid */
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
  /** Number of category cards per row (default 3) */
  cardColumns?: 1 | 2 | 3 | 4
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: LinkCategory[] = [
  {
    heading: "Applications",
    span: 3,
    icon: <LayoutGrid size={16} color="var(--cds-huegrey-text-default)" />,
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
  {
    heading: "BI & Analytics",
    icon: <BarChart3 size={16} color="var(--cds-huegrey-text-default)" />,
    links: [
      { label: "Backup" },
      { label: "Feature Controls" },
      { label: "Logo Rebrand" },
      { label: "Manage Roles" },
      { label: "Portal" },
      { label: "Audit Logs" },
      { label: "Databridge" },
      { label: "Email Management" },
      { label: "Migration" },
      { label: "Security Controls" },
      { label: "Notifications" },
    ],
  },
  {
    heading: "Integration Flows",
    icon: <Workflow size={16} color="var(--cds-huegrey-text-default)" />,
    links: [
      { label: "History" },
      { label: "Email Template" },
      { label: "Connections" },
      { label: "Audit Trail" },
      { label: "Support Access" },
      { label: "Custom Function" },
    ],
  },
  {
    heading: "RPA Flows",
    icon: <Bot size={16} color="var(--cds-huegrey-text-default)" />,
    links: [
      { label: "History" },
      { label: "Zia" },
      { label: "Connections" },
      { label: "Custom Functions" },
      { label: "Audit Trail" },
      { label: "Support Access" },
      { label: "RPA Agents" },
    ],
  },
]

// ─── Fallback icon ────────────────────────────────────────────────────────────

function DefaultCategoryIcon() {
  return <LayoutGrid size={16} color="var(--cds-huegrey-text-default)" />
}

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: LinkCategory }) {
  return (
    <CardOperations>
      <CardOperationsPill
        icon={category.icon ?? <DefaultCategoryIcon />}
        title={category.heading}
      />
      <CardOperationsBody>
        <CardOperationsGrid
          className={category.span && category.span >= 3 ? "grid-cols-4" : undefined}
        >
          {category.links.map((link) => (
            <CardOperationsLink
              key={link.label}
              href={link.href}
              onClick={link.onClick}
            >
              {link.label}
            </CardOperationsLink>
          ))}
        </CardOperationsGrid>
      </CardOperationsBody>
    </CardOperations>
  )
}

// ─── Span map ─────────────────────────────────────────────────────────────────

const SPAN_CLASS: Record<number, string> = {
  1: "",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
}


const COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function LinkCategoryTemplate({
  title = "Operations",
  description = "Define and manage various operations of your account using this centralized management system.",
  categories = DEFAULT_CATEGORIES,
  showSearch = true,
  onSearch,
  activeNavId,
  cardColumns = 3,
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
        <main className="flex-1 overflow-y-auto px-[var(--cds-padding-section-h)] py-[var(--cds-padding-section-v)]">

          {/* ── Page header ── */}
          <div className={cn(
            "flex items-start justify-between flex-wrap",
            "gap-[var(--cds-gap-default)]",
            "mb-[var(--cds-space-32)]"
          )}>
            <div className="flex flex-col gap-[var(--cds-gap-tight)]">
              <h1 className={cn(
                "m-0 font-medium",
                "text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]",
                "text-[color:var(--cds-huegrey-text-dark)]"
              )}>
                {title}
              </h1>
              {description && (
                <p className={cn(
                  "m-0 max-w-[700px]",
                  "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
                  "text-[color:var(--cds-huegrey-text-default)]"
                )}>
                  {description}
                </p>
              )}
            </div>

            {/* Search */}
            {showSearch && (
              <div className="relative shrink-0">
                <Search
                  size={14}
                  className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--cds-huegrey-text-default)]"
                />
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search"
                  className="pl-[30px] w-[220px]"
                />
              </div>
            )}
          </div>

          {/* ── Category cards grid ── */}
          <div className={cn("grid gap-[var(--cds-space-20)]", COLS_CLASS[cardColumns])}>
            {categories.map((cat) => (
              <div
                key={cat.heading}
                className={cat.span && cat.span > 1 ? SPAN_CLASS[cat.span] : undefined}
              >
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
