/**
 * OperationsScreen
 *
 * Feature: 001 — Zia Configuration Enhancements
 * Role: Entry point — Operations landing page that links into Zia settings
 *
 * Layout: TopBar + LeftNav shell, page header, 3-column grid of
 * CardOperations cards (Applications / BI & Analytics / Integration Flow).
 * Each card uses the "floated title pill" variant from the DS.
 */

import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import {
  CardOperations,
  CardOperationsPill,
  CardOperationsBody,
  CardOperationsGrid,
  CardOperationsLink,
} from "@/components/ui/card"
import { useNavigation } from "@/screens/navigation"
import { LayoutGrid, BarChart3, GitFork } from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

interface OperationsCardItem {
  label: string
  onClick?: () => void
}

interface OperationsCardData {
  id: string
  title: string
  icon: React.ReactNode
  links: OperationsCardItem[]
}

// ─── OperationsScreen ─────────────────────────────────────────────────────────

export default function OperationsScreen() {
  const { navigate } = useNavigation()

  const CARDS: OperationsCardData[] = [
    {
      id: "applications",
      title: "Applications",
      icon: <LayoutGrid size={16} color="var(--cds-huegrey-text-default)" />,
      links: [
        { label: "Backup" },
        { label: "Audit Trail" },
        { label: "Email Management" },
        { label: "Domain Restriction" },
        { label: "API Management" },
        { label: "Blueprint Analytics" },
        { label: "Logs" },
        { label: "Publish" },
        { label: "Form Email" },
        { label: "Marketplace" },
        { label: "Support Access" },
        { label: "System Integrations" },
        { label: "Zia", onClick: () => navigate("zia-settings") },
        { label: "Payment Gateways" },
        { label: "Databridge" },
        { label: "Early Access Features" },
      ],
    },
    {
      id: "bi-analytics",
      title: "BI & Analytics",
      icon: <BarChart3 size={16} color="var(--cds-huegrey-text-default)" />,
      links: [
        { label: "Workspaces" },
        { label: "Data Sources" },
        { label: "Reports" },
        { label: "Dashboards" },
        { label: "Slideshows" },
        { label: "AI Assistant" },
        { label: "Permissions" },
        { label: "Shared Views" },
        { label: "Scheduled Reports" },
        { label: "Export Logs" },
        { label: "Theme Settings" },
        { label: "Email Schedules" },
      ],
    },
    {
      id: "integration-flow",
      title: "Integration Flow",
      icon: <GitFork size={16} color="var(--cds-huegrey-text-default)" />,
      links: [
        { label: "Flow Builder" },
        { label: "Triggers" },
        { label: "Actions" },
        { label: "Connectors" },
        { label: "Webhooks" },
        { label: "Schedules" },
        { label: "History" },
        { label: "Variables" },
        { label: "Custom Functions" },
        { label: "Error Logs" },
        { label: "API Calls" },
        { label: "Templates" },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId="operations" />
        <main className="flex-1 overflow-y-auto p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">
          <div className="px-[var(--cds-padding-section-h)] py-[var(--cds-padding-section-v)]">

            {/* Page header */}
            <div className="mb-[var(--cds-space-32)]">
              <h1 className={cn(
                "text-[length:var(--cds-text-h2)] leading-[var(--cds-leading-h2)] font-semibold",
                "text-[color:var(--cds-huegrey-text-dark)]"
              )}>
                Operations
              </h1>
              <p className={cn(
                "mt-[var(--cds-space-4)]",
                "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
                "text-[color:var(--cds-huegrey-text-default)]"
              )}>
                Define and manage various operations of your account using this centralised management system.
              </p>
            </div>

            {/* 3-column card grid */}
            <div className="grid grid-cols-3 gap-[var(--cds-space-20)]">
              {CARDS.map((card) => (
                <CardOperations key={card.id}>
                  <CardOperationsPill icon={card.icon} title={card.title} />
                  <CardOperationsBody>
                    <CardOperationsGrid>
                      {card.links.map((link) => (
                        <CardOperationsLink
                          key={link.label}
                          onClick={link.onClick}
                        >
                          {link.label}
                        </CardOperationsLink>
                      ))}
                    </CardOperationsGrid>
                  </CardOperationsBody>
                </CardOperations>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}
