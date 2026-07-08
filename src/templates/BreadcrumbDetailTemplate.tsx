/**
 * BreadcrumbDetailTemplate
 *
 * Pattern: Operations inner-page — detail view with breadcrumb navigation
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Breadcrumb trail  — All / Category / Page
 *   ├── Page header       — title · description
 *   ├── Tabs (line variant)
 *   └── Tab content — one of three content variants:
 *       • "card-grid"  — service/integration cards (icon · name · desc · CTA button)
 *       • "empty"      — illustration + heading + description + CTA button
 *       • "table"      — filter controls + data table + empty state
 *
 * All three variants are shown by default (one per tab) in the demo.
 * In production, set `contentType` on each tab to pick the right variant.
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbCrumb {
  label: string
  href?: string
  onClick?: () => void
}

// ── Card-grid variant ──────────────────────────────────────────────────────────

export interface ServiceCard {
  id: string
  /** Icon element or initials string */
  icon?: React.ReactNode
  /** Short label shown when icon is missing */
  iconFallback?: string
  name: string
  description: string
  /** Button label, e.g. "Configure" or "Manage Domains" */
  ctaLabel?: string
  onCtaClick?: () => void
  /** Whether this card is highlighted / selected */
  isActive?: boolean
}

// ── Empty variant ──────────────────────────────────────────────────────────────

export interface EmptyStateConfig {
  /** Heading, e.g. "You haven't added any user's emails yet." */
  heading: string
  description?: string
  ctaLabel?: string
  onCtaClick?: () => void
}

// ── Table variant ─────────────────────────────────────────────────────────────

export interface TableColumn {
  key: string
  label: string
}

export interface TableRowData {
  [key: string]: React.ReactNode
}

export interface TableConfig {
  columns: TableColumn[]
  rows: TableRowData[]
  /** Controls for filtering/scoping the table, e.g. "Application" select */
  filters?: {
    label: string
    options: { value: string; label: string }[]
    defaultValue?: string
    onChange?: (value: string) => void
  }[]
  emptyHeading?: string
  emptyDescription?: string
}

// ── Tab ───────────────────────────────────────────────────────────────────────

export type TabContentType = "card-grid" | "empty" | "table"

export interface DetailTab {
  id: string
  label: string
  contentType: TabContentType
  /** Required when contentType === "card-grid" */
  cards?: ServiceCard[]
  /** Required when contentType === "empty" */
  emptyState?: EmptyStateConfig
  /** Required when contentType === "table" */
  table?: TableConfig
}

export interface BreadcrumbDetailTemplateProps {
  crumbs?: BreadcrumbCrumb[]
  title?: string
  description?: string
  tabs?: DetailTab[]
  defaultTabId?: string
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_CRUMBS: BreadcrumbCrumb[] = [
  { label: "All", href: "#" },
  { label: "Applications", href: "#" },
  { label: "Email Management" },
]

const DEFAULT_TABS: DetailTab[] = [
  {
    id: "outgoing",
    label: "Outgoing Email Channels",
    contentType: "card-grid",
    cards: [
      {
        id: "built-in",
        iconFallback: "BI",
        name: "Built-in Email",
        description:
          "Send emails using Creator's built-in mail service with no setup required.",
        ctaLabel: "Manage Domains",
        isActive: true,
      },
      {
        id: "zeptomail",
        iconFallback: "ZM",
        name: "Zeptomail",
        description:
          "Connect your ZeptoMail account to utilise Zoho's transactional email service.",
        ctaLabel: "Configure",
      },
      {
        id: "outlook",
        iconFallback: "OL",
        name: "Microsoft Outlook",
        description:
          "Integrate with Microsoft Outlook's mail server to send emails through their service.",
        ctaLabel: "Configure",
      },
      {
        id: "gmail",
        iconFallback: "GM",
        name: "Gmail",
        description:
          "Associate with Google's mail server to send emails through their channel.",
        ctaLabel: "Configure",
      },
      {
        id: "smtp",
        iconFallback: "SMTP",
        name: "Custom SMTP",
        description:
          "Route outgoing emails using your own SMTP server by providing external server details.",
        ctaLabel: "Configure",
      },
    ],
  },
  {
    id: "sender",
    label: "Sender Email",
    contentType: "empty",
    emptyState: {
      heading: "You haven't added any user's emails yet.",
      description:
        "Other than the application admin's email address or the logged in user's email address, you can have a different personalised email address to send mail from your Zoho Creator app.",
      ctaLabel: "+ Create New",
    },
  },
]

// ─── Card-grid content ────────────────────────────────────────────────────────

function ServiceCardGrid({ cards }: { cards: ServiceCard[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "var(--cds-space-16)",
        paddingTop: "var(--cds-space-16)",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            borderRadius: "var(--cds-radius-r)",
            border: card.isActive
              ? "2px solid var(--cds-primary-border-default)"
              : "1px solid var(--border)",
            backgroundColor: "var(--cds-white)",
            padding: "var(--cds-padding-card)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--cds-gap-default)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--cds-radius-r)",
              backgroundColor: "var(--cds-primary-surface-low)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {card.icon ?? (
              <span
                style={{
                  fontSize: "var(--cds-text-p3)",
                  fontWeight: 700,
                  color: "var(--cds-primary-text-default)",
                }}
              >
                {card.iconFallback ?? card.name.slice(0, 2)}
              </span>
            )}
          </div>

          {/* Name + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
            <span
              style={{
                fontSize: "var(--cds-text-p1)",
                lineHeight: "var(--cds-leading-p1)",
                fontWeight: 500,
                color: "var(--cds-huegrey-text-dark)",
              }}
            >
              {card.name}
            </span>
            <p
              style={{
                fontSize: "var(--cds-text-p3)",
                lineHeight: "var(--cds-leading-p3)",
                color: "var(--cds-huegrey-text-default)",
                margin: 0,
              }}
            >
              {card.description}
            </p>
          </div>

          {/* CTA */}
          {card.ctaLabel && (
            <Button variant="outline" size="sm" onClick={card.onCtaClick} style={{ alignSelf: "flex-start" }}>
              {card.ctaLabel}
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Empty-state content ──────────────────────────────────────────────────────

function EmptyStateContent({ config }: { config: EmptyStateConfig }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--cds-gap-default)",
        paddingTop: "var(--cds-space-32)",
        paddingBottom: "var(--cds-space-32)",
        textAlign: "center",
      }}
    >
      {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
      {/* Illustration placeholder */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "var(--cds-huegrey-surface-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
          <rect x="4" y="8" width="28" height="20" rx="3" stroke="var(--cds-huegrey-text-default)" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M12 18 L18 12 L24 18" stroke="var(--cds-huegrey-text-default)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <circle cx="22" cy="12" r="2" fill="var(--cds-huegrey-text-default)" opacity="0.4" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
        <p
          style={{
            fontSize: "var(--cds-text-p1)",
            lineHeight: "var(--cds-leading-p1)",
            fontWeight: 500,
            color: "var(--cds-huegrey-text-dark)",
            margin: 0,
          }}
        >
          {config.heading}
        </p>
        {config.description && (
          <p
            style={{
              fontSize: "var(--cds-text-p2)",
              lineHeight: "var(--cds-leading-p2)",
              color: "var(--cds-huegrey-text-default)",
              margin: 0,
              maxWidth: 460,
            }}
          >
            {config.description}
          </p>
        )}
      </div>

      {config.ctaLabel && (
        <Button onClick={config.onCtaClick}>{config.ctaLabel}</Button>
      )}
    </div>
  )
}

// ─── Table content ────────────────────────────────────────────────────────────

function TableContent({ config }: { config: TableConfig }) {
  const isEmpty = config.rows.length === 0

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--cds-space-16)",
        paddingTop: "var(--cds-space-16)",
      }}
    >
      {/* Filters row */}
      {config.filters && config.filters.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)" }}>
          {config.filters.map((filter) => (
            <div
              key={filter.label}
              style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}
            >
              <span
                style={{
                  fontSize: "var(--cds-text-p2)",
                  lineHeight: "var(--cds-leading-p2)",
                  color: "var(--cds-huegrey-text-default)",
                }}
              >
                {filter.label}
              </span>
              <Select
                defaultValue={filter.defaultValue ?? filter.options[0]?.value}
                onValueChange={(val) => val && filter.onChange?.(val)}
              >
                <SelectTrigger style={{ width: 200 }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div
        style={{
          borderRadius: "var(--cds-radius-r)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backgroundColor: "var(--cds-white)",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length}
                  style={{ textAlign: "center", padding: "var(--cds-space-32)" }}
                >
                  {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "var(--cds-gap-small)",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "var(--cds-radius-r)",
                        backgroundColor: "var(--cds-huegrey-surface-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--cds-huegrey-text-default)" strokeWidth="1.5" fill="none" opacity="0.4" />
                        <line x1="2" y1="9" x2="22" y2="9" stroke="var(--cds-huegrey-text-default)" strokeWidth="1.5" opacity="0.4" />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: "var(--cds-text-p1)",
                        fontWeight: 500,
                        color: "var(--cds-huegrey-text-dark)",
                        margin: 0,
                      }}
                    >
                      {config.emptyHeading ?? "No records found"}
                    </p>
                    {config.emptyDescription && (
                      <p
                        style={{
                          fontSize: "var(--cds-text-p2)",
                          color: "var(--cds-huegrey-text-default)",
                          margin: 0,
                        }}
                      >
                        {config.emptyDescription}
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              config.rows.map((row, idx) => (
                <TableRow key={idx}>
                  {config.columns.map((col) => (
                    <TableCell key={col.key}>{row[col.key]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function BreadcrumbDetailTemplate({
  crumbs = DEFAULT_CRUMBS,
  title = "Email Management",
  description = "Manage outgoing email channels, sender email addresses, and domain authentication to control how emails are sent from your apps.",
  tabs = DEFAULT_TABS,
  defaultTabId,
}: BreadcrumbDetailTemplateProps) {
  const firstTabId = defaultTabId ?? tabs[0]?.id

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
          {/* ── Breadcrumb ── */}
          <Breadcrumb style={{ marginBottom: "var(--cds-space-12)" }}>
            <BreadcrumbList>
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1
                return (
                  <React.Fragment key={crumb.label}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href ?? "#"} onClick={crumb.onClick}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--cds-gap-tight)",
              marginBottom: "var(--cds-space-16)",
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
            {description && (
              <p
                style={{
                  fontSize: "var(--cds-text-p2)",
                  lineHeight: "var(--cds-leading-p2)",
                  color: "var(--cds-huegrey-text-default)",
                  maxWidth: 700,
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultValue={firstTabId}>
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.contentType === "card-grid" && tab.cards && (
                  <ServiceCardGrid cards={tab.cards} />
                )}
                {tab.contentType === "empty" && tab.emptyState && (
                  <EmptyStateContent config={tab.emptyState} />
                )}
                {tab.contentType === "table" && tab.table && (
                  <TableContent config={tab.table} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
