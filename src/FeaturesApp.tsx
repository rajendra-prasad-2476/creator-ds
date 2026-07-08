/**
 * FeaturesApp.tsx
 *
 * Standalone app shell for the Feature Dashboard page (/features.html).
 * Completely separate from the DS component showcase.
 */

import { FeatureDashboardSection } from "@/sections/FeatureDashboardSection"

export function FeaturesApp() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        fontFamily: "'Zoho Puvi', sans-serif",
      }}
    >
      {/* App header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--cds-padding-section-h)",
          height: 52,
          borderBottom: "1px solid var(--border)",
          background: "var(--cds-white)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)" }}>
          {/* Creator logo mark */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--cds-primary-surface-default)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span
            style={{
              fontSize: "var(--cds-text-p1)",
              fontWeight: 700,
              color: "var(--cds-huegrey-text-dark)",
            }}
          >
            Feature Previews
          </span>
          <span
            style={{
              fontSize: "var(--cds-text-p3)",
              color: "var(--cds-huegrey-text-default)",
              padding: "2px 8px",
              background: "var(--cds-surface-subtle, #F5F5F5)",
              borderRadius: "var(--cds-radius-full)",
              border: "1px solid var(--border)",
            }}
          >
            creator-ds
          </span>
        </div>

        <a
          href="/index.html"
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-primary-text-default)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "var(--cds-gap-tight)",
          }}
        >
          ← Component Showcase
        </a>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "var(--cds-space-32) var(--cds-padding-section-h)",
        }}
      >
        <FeatureDashboardSection />
      </main>
    </div>
  )
}
