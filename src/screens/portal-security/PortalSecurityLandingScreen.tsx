/**
 * PortalSecurityLandingScreen
 *
 * Feature: 002 — Portal Security Policies
 * PRD section: FR-1 (Security Policy Landing Page)
 *
 * Shown when no security policy has been configured yet.
 * Password Policy sub-nav item is active. Content shows the
 * intro card with feature highlights and the "Setup Password Policy" CTA.
 */

import { Button } from "@/components/ui/button"
import { useNavigation } from "@/screens/navigation"
import { PortalSecurityShell } from "./_PortalSecurityShell"

export default function PortalSecurityLandingScreen() {
  const { navigate } = useNavigation()

  return (
    <PortalSecurityShell activeNavId="password-policy">
      <div style={{ maxWidth: 600 }}>

        {/* Title */}
        <h2
          style={{
            fontSize: "var(--cds-text-h3)",
            lineHeight: "var(--cds-leading-h3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-dark)",
            margin: "0 0 var(--cds-space-8)",
          }}
        >
          Password Policy
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "var(--cds-text-p2)",
            lineHeight: "var(--cds-leading-p2)",
            color: "var(--cds-huegrey-text-default)",
            margin: "0 0 var(--cds-space-24)",
          }}
        >
          A strong password policy can prevent unauthorized access and reduce
          security threats. Set up a strong password policy and enforce secure
          practices in employees.
        </p>

        {/* Highlights box */}
        <div
          style={{
            backgroundColor: "var(--cds-huegrey-surface-low)",
            borderRadius: "var(--cds-radius-r)",
            padding: "var(--cds-space-20)",
            marginBottom: "var(--cds-space-32)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--cds-space-12)" }}>
            {[
              "Choose from predefined policy strengths or configure a custom policy.",
              "Configure password complexity.",
              "Enforce periodic password expiry.",
              "Prevent password reuse.",
            ].map((point) => (
              <li
                key={point}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--cds-gap-small)",
                  fontSize: "var(--cds-text-p2)",
                  lineHeight: "var(--cds-leading-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                }}
              >
                {/* Bullet dot */}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "var(--cds-radius-full)",
                    backgroundColor: "var(--cds-huegrey-border-default)",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Button onClick={() => navigate("portal-password-policy")}>
          Setup Password Policy
        </Button>
      </div>
    </PortalSecurityShell>
  )
}
