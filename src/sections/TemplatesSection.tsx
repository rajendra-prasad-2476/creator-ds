import * as React from "react"
import CardGridTemplate from "@/templates/collection/CardGridTemplate"
import TabbedSectionsTemplate from "@/templates/collection/TabbedSectionsTemplate"
import SplitPanelTemplate, { DEFAULT_LIST_ITEMS, DEFAULT_PANELS_WITH_APP } from "@/templates/structure/SplitPanelTemplate"
import LinkCategoryTemplate from "@/templates/structure/LinkCategoryTemplate"
import BreadcrumbDetailTemplate from "@/templates/structure/BreadcrumbDetailTemplate"
import BillingTemplate from "@/templates/domain/BillingTemplate"
import ZiaSettingsScreen from "@/screens/zia-configuration/ZiaSettingsScreen"
import ZiaProviderDetailScreen from "@/screens/zia-configuration/ZiaProviderDetailScreen"
import { BuilderShellDemo } from "@/sections/OrganismsSection"

const TEMPLATES = [
  {
    id: "card-grid",
    label: "Solutions",
    description: "App / solution gallery with search, filter, and tile grid",
    component: <CardGridTemplate />,
  },
  {
    id: "tabbed-sections",
    label: "Microservices",
    description: "Tabbed content sections with grouped service cards",
    component: <TabbedSectionsTemplate />,
  },
  {
    id: "split-panel",
    label: "Environments (empty)",
    description: "Three-column split panel — empty list state",
    component: <SplitPanelTemplate />,
  },
  {
    id: "split-panel-with-app",
    label: "Environments (with app)",
    description: "Three-column split panel — Fleet Hub with Stage / Production columns",
    component: <SplitPanelTemplate listItems={DEFAULT_LIST_ITEMS} panels={DEFAULT_PANELS_WITH_APP} />,
  },
  {
    id: "link-category",
    label: "Operations",
    description: "Category landing page with grouped navigation links",
    component: <LinkCategoryTemplate />,
  },
  {
    id: "breadcrumb-detail",
    label: "Inner Page",
    description: "Detail page with breadcrumb, tabs, card grid, empty state, and table variants",
    component: <BreadcrumbDetailTemplate />,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Subscription page with plan summary, stat tiles, and usage details",
    component: <BillingTemplate />,
  },
  {
    id: "zia-settings",
    label: "Zia Settings",
    description: "001 · Zia Config — LLM Providers tab (4 provider cards) + Features tab (mapping + toggle)",
    component: <ZiaSettingsScreen />,
  },
  {
    id: "zia-provider-detail",
    label: "Zia Provider Detail",
    description: "001 · Zia Config — Provider detail with key management (Configuration tab) + Usage tab",
    component: <ZiaProviderDetailScreen />,
  },
  {
    id: "builder-shell",
    label: "Builder Shell",
    description: "App builder layout — dark top bar + entity nav + viewport toolbar + canvas + properties panel",
    component: <BuilderShellDemo />,
    padded: true,
  },
]

export function TemplatesSection() {
  const [activeId, setActiveId] = React.useState(TEMPLATES[0].id)
  const active = TEMPLATES.find((t) => t.id === activeId)!

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[var(--cds-text-h3)] font-semibold text-foreground mb-1">
          Page Templates
        </h2>
        <p className="text-[var(--cds-text-p2)] text-muted-foreground">
          Full-page shells composed from DS components. Use these as the starting point for any new screen.
        </p>
      </div>

      {/* Template picker */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--cds-radius-r)",
              border: "1px solid var(--border)",
              background: activeId === t.id
                ? "var(--cds-primary-surface-default)"
                : "var(--cds-white)",
              color: activeId === t.id
                ? "var(--cds-white)"
                : "var(--cds-huegrey-text-dark)",
              fontSize: "var(--cds-text-p2)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active template description */}
      <p className="text-[var(--cds-text-p3)] text-muted-foreground mb-4">
        {active.description}
      </p>

      {/* Preview frame */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--cds-radius-l)",
          overflow: "hidden",
          height: "80vh",
          background: "var(--background)",
        }}
      >
        <div style={{ height: "100%", overflow: "auto", padding: active.padded ? "var(--cds-padding-section-v) var(--cds-padding-section-h)" : 0 }}>
          {active.component}
        </div>
      </div>
    </div>
  )
}
