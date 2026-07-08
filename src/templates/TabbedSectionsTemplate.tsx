/**
 * TabbedSectionsTemplate
 *
 * Pattern: Microservices page — service category hub
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header  — title · description · primary CTA (right-aligned)
 *   ├── Line-variant Tabs  — "All" + one per section category
 *   └── Tab content  — named sections, each with a list of items or empty state
 *
 * Slots to customise:
 *   title          — page heading
 *   description    — subheading under title
 *   ctaLabel       — primary button label (default "+ Create New")
 *   tabs           — array of TabbedSection (id, label, sections[])
 *   defaultTabId   — which tab is active on mount
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabbedSectionItem {
  id: string
  label: string
}

export interface TabbedSection {
  /** Heading displayed above the group of items */
  heading: string
  items: TabbedSectionItem[]
  /** Whether this section currently has no items */
  isEmpty?: boolean
  emptyMessage?: string
}

export interface TabbedTab {
  id: string
  label: string
  sections: TabbedSection[]
}

export interface TabbedSectionsTemplateProps {
  title?: string
  description?: string
  ctaLabel?: string
  tabs?: TabbedTab[]
  defaultTabId?: string
  onCtaClick?: () => void
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_TABS: TabbedTab[] = [
  {
    id: "all",
    label: "All Services",
    sections: [
      {
        heading: "AI Models",
        items: [],
        isEmpty: true,
        emptyMessage: "There are no AI models yet",
      },
      {
        heading: "AR Library",
        items: [],
        isEmpty: true,
        emptyMessage: "There are no AR sets available",
      },
      {
        heading: "Connections",
        items: [],
        isEmpty: true,
        emptyMessage: "No connections added",
      },
    ],
  },
  {
    id: "ai-models",
    label: "AI Models",
    sections: [
      {
        heading: "AI Models",
        items: [],
        isEmpty: true,
        emptyMessage: "There are no AI models yet",
      },
    ],
  },
  {
    id: "ar-library",
    label: "AR Library",
    sections: [
      {
        heading: "AR Library",
        items: [],
        isEmpty: true,
        emptyMessage: "There are no AR sets available",
      },
    ],
  },
  {
    id: "connections",
    label: "Connections",
    sections: [
      {
        heading: "Connections",
        items: [],
        isEmpty: true,
        emptyMessage: "No connections added",
      },
    ],
  },
  {
    id: "datasources",
    label: "Datasources",
    sections: [
      {
        heading: "Datasources",
        items: [],
        isEmpty: true,
        emptyMessage: "No datasources added",
      },
    ],
  },
  {
    id: "custom-api",
    label: "Custom API",
    sections: [
      {
        heading: "Custom API",
        items: [],
        isEmpty: true,
        emptyMessage: "No custom APIs added",
      },
    ],
  },
]

// ─── SectionBlock ─────────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: TabbedSection }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-default)" }}>
      {/* Section heading */}
      <h2
        style={{
          fontSize: "var(--cds-text-p1)",
          lineHeight: "var(--cds-leading-p1)",
          fontWeight: 600,
          color: "var(--cds-huegrey-text-dark)",
        }}
      >
        {section.heading}
      </h2>

      {/* Content or empty state */}
      <div
        style={{
          borderRadius: "var(--cds-radius-r)",
          border: "1px solid var(--border)",
          backgroundColor: "var(--cds-white)",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--cds-space-32)",
          gap: "var(--cds-gap-default)",
        }}
      >
        {section.isEmpty || section.items.length === 0 ? (
          <>
            {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "var(--cds-huegrey-surface-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="8" height="8" rx="1.5" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" fill="var(--cds-huegrey-text-default)" opacity="0.3" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "var(--cds-text-p2)",
                lineHeight: "var(--cds-leading-p2)",
                color: "var(--cds-huegrey-text-default)",
                textAlign: "center",
              }}
            >
              {section.emptyMessage ?? `No ${section.heading.toLowerCase()} yet`}
            </p>
          </>
        ) : (
          <ul style={{ width: "100%", listStyle: "none", padding: 0, margin: 0 }}>
            {section.items.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "var(--cds-space-12) var(--cds-space-16)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "var(--cds-text-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function TabbedSectionsTemplate({
  title = "Microservices",
  description = "Add connections, datasources, custom APIs, AI models and AR sets as Microservices to work in tandem with your application.",
  ctaLabel = "+ Create New",
  tabs = DEFAULT_TABS,
  defaultTabId,
  onCtaClick,
}: TabbedSectionsTemplateProps) {
  const firstTabId = defaultTabId ?? tabs[0]?.id ?? "all"

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
                    maxWidth: 700,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            <Button onClick={onCtaClick} style={{ flexShrink: 0 }}>
              {ctaLabel}
            </Button>
          </div>

          {/* ── Tabs + content ── */}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--cds-space-24)",
                    paddingTop: "var(--cds-space-16)",
                  }}
                >
                  {tab.sections.map((section) => (
                    <SectionBlock key={section.heading} section={section} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
