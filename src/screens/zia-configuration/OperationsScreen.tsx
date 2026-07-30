/**
 * OperationsScreen
 *
 * Feature: 001 — Zia Configuration Enhancements
 * Role: Entry point — Operations landing page that links into Zia settings
 *
 * Layout: LinkCategoryTemplate (structure category)
 *   Row 1 — Applications  (col-span-3, full-width, 4-col link grid)
 *   Row 2 — BI & Analytics · Integration Flows · RPA Flows
 */

import LinkCategoryTemplate from "@/templates/structure/LinkCategoryTemplate"
import type { LinkCategory } from "@/templates/structure/LinkCategoryTemplate"
import { useNavigation } from "@/screens/navigation"
import { LayoutGrid, BarChart3, Workflow, Bot } from "lucide-react"

const CATEGORIES: LinkCategory[] = [
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

export default function OperationsScreen() {
  const { navigate } = useNavigation()

  // Wire up Zia link navigation
  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    links: cat.links.map((link) =>
      link.label === "Zia" && cat.heading === "Applications"
        ? { ...link, onClick: () => navigate("zia-settings") }
        : link
    ),
  }))

  return (
    <LinkCategoryTemplate
      title="Operations"
      description="Define and manage various operations of your account using this centralized management system."
      categories={categories}
      activeNavId="operations"
      cardColumns={3}
    />
  )
}


