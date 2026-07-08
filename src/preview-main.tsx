/**
 * preview-main.tsx
 *
 * Full-screen screen preview page.
 * Opened in a new tab by the Feature Dashboard.
 *
 * URL params:
 *   ?feature=001&screen=zia-settings
 *
 * Renders the screen inside a NavigationProvider so all click actions work.
 * The entire tab IS the screen — no chrome, no sidebar, no header.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import * as React from "react"
import { FEATURE_REGISTRY } from "@/screens/feature-registry"
import { NavigationProvider } from "@/screens/navigation"

function PreviewApp() {
  const params = new URLSearchParams(window.location.search)
  const featureId = params.get("feature")
  const screenId = params.get("screen")

  const feature = FEATURE_REGISTRY.find((f) => f.id === featureId)
  const screen = feature?.screens.find((s) => s.id === screenId)

  // Update tab title
  React.useEffect(() => {
    if (feature && screen) {
      document.title = `${screen.name} — ${feature.name}`
    }
  }, [feature, screen])

  if (!feature || !screen) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 16,
          fontFamily: "'Zoho Puvi', sans-serif",
          color: "var(--cds-huegrey-text-default)",
        }}
      >
        <div style={{ fontSize: 48 }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
          Screen not found
        </div>
        <div style={{ fontSize: 14 }}>
          feature: <code>{featureId ?? "—"}</code> · screen:{" "}
          <code>{screenId ?? "—"}</code>
        </div>
        <a
          href="/features.html"
          style={{ color: "var(--cds-primary-text-default)", fontSize: 14 }}
        >
          ← Back to Feature Dashboard
        </a>
      </div>
    )
  }

  const screenMap = Object.fromEntries(
    feature.screens.map((s) => [s.id, s.factory])
  )

  return (
    <NavigationProvider
      initialScreenId={screen.id}
      screenMap={screenMap}
    />
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreviewApp />
  </StrictMode>
)
