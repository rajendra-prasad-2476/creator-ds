/**
 * OperationsScreen
 *
 * Feature: 001 — Zia Configuration Enhancements
 * Role: Entry point — Operations landing page that links into Zia settings
 *
 * Uses LinkCategoryTemplate. Zia is listed under "Applications" and navigates
 * to ZiaSettingsScreen via the prototype NavigationContext.
 */

import LinkCategoryTemplate from "@/templates/LinkCategoryTemplate"
import { useNavigation } from "@/screens/navigation"

export default function OperationsScreen() {
  const { navigate } = useNavigation()

  return (
    <LinkCategoryTemplate
      title="Operations"
      description="Define and manage various operations of your account using this centralised management system."
      showSearch
      activeNavId="operations"
      categories={[
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
            { label: "Domain Restriction" },
            { label: "Publish" },
            { label: "Form Email" },
            { label: "Zia", onClick: () => navigate("zia-settings") },
            { label: "API Management" },
            { label: "Marketplace" },
            { label: "Databridge" },
            { label: "Payment Gateways" },
          ],
        },
      ]}
    />
  )
}
