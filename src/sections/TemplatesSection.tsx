import * as React from "react"
import CardGridTemplate from "@/templates/CardGridTemplate"
import TabbedSectionsTemplate from "@/templates/TabbedSectionsTemplate"
import SplitPanelTemplate from "@/templates/SplitPanelTemplate"
import LinkCategoryTemplate from "@/templates/LinkCategoryTemplate"
import BreadcrumbDetailTemplate from "@/templates/BreadcrumbDetailTemplate"
import BillingTemplate from "@/templates/BillingTemplate"
import ZiaSettingsScreen from "@/screens/zia-configuration/ZiaSettingsScreen"
import ZiaProviderDetailScreen from "@/screens/zia-configuration/ZiaProviderDetailScreen"

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
    label: "Environments",
    description: "Three-column split panel — list + stage + production",
    component: <SplitPanelTemplate />,
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
        <div style={{ height: "100%", overflow: "auto" }}>
          {active.component}
        </div>
      </div>
    </div>
  )
}
