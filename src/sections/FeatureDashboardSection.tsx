import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FEATURE_REGISTRY,
  type FeatureEntry,
  type FeatureStatus,
} from "@/screens/feature-registry"
import { NavigationProvider } from "@/screens/navigation"
import { ChevronDown, ChevronRight, GitBranch, Eye, Clock, User } from "lucide-react"

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  FeatureStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  draft: {
    label: "Draft",
    color: "var(--cds-huegrey-text-default)",
    bg: "var(--cds-surface-subtle, #F5F5F5)",
    border: "var(--border)",
  },
  "in-review": {
    label: "In Review",
    color: "var(--cds-warning-text-default, #D25704)",
    bg: "var(--cds-warning-surface-subtle, #FFF8F0)",
    border: "var(--cds-warning-border-default, #D25704)",
  },
  approved: {
    label: "Approved",
    color: "var(--cds-success-text-default, #078841)",
    bg: "var(--cds-success-surface-subtle, #F0FAF4)",
    border: "var(--cds-success-border-default, #078841)",
  },
  pushed: {
    label: "Pushed",
    color: "var(--cds-primary-text-default)",
    bg: "var(--cds-primary-surface-subtle, #EEF2FE)",
    border: "var(--cds-primary-border-default, #0D4EF2)",
  },
}

function StatusBadge({ status }: { status: FeatureStatus }) {
  const s = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "var(--cds-radius-full)",
        fontSize: "var(--cds-text-p3)",
        fontWeight: 500,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  )
}

// ─── Push Sheet ────────────────────────────────────────────────────────────────

function PushSheet({
  feature,
  open,
  onClose,
}: {
  feature: FeatureEntry
  open: boolean
  onClose: () => void
}) {
  const copyCommands = feature.screens
    .map(
      (s) =>
        `cp "${s.sourcePath}" \\\n   "../creator-features/${s.destPath}"`
    )
    .join("\n\n")

  const fullScript = `#!/bin/bash
# Push ${feature.name} (${feature.version}) to creator-features
# Run this from the creator-ds-react root directory

echo "Copying screens to creator-features..."
${copyCommands}

echo "Committing to creator-features..."
cd ../creator-features
git add ${feature.screens.map((s) => s.destPath).join(" ")}
git commit -m "feat(${feature.id}): ${feature.name} — ${feature.version} approved"
git push origin main

echo "Done! Screens are live in creator-features."`

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        style={{ width: "min(560px, 95vw)", overflowY: "auto" }}
      >
        <SheetHeader style={{ marginBottom: "var(--cds-space-24)" }}>
          <SheetTitle>Push to creator-features</SheetTitle>
          <SheetDescription>
            Copy approved screens from your local workspace into the{" "}
            <code>creator-features</code> repo so the whole team can reference
            them.
          </SheetDescription>
        </SheetHeader>

        {/* Screens being pushed */}
        <div style={{ marginBottom: "var(--cds-space-24)" }}>
          <div
            style={{
              fontSize: "var(--cds-text-p3)",
              fontWeight: 600,
              color: "var(--cds-huegrey-text-default)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "var(--cds-space-8)",
            }}
          >
            Screens ({feature.screens.length})
          </div>
          {feature.screens.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "var(--cds-space-8) var(--cds-padding-card)",
                borderRadius: "var(--cds-radius-s)",
                background: "var(--cds-surface-subtle, #F5F5F5)",
                marginBottom: "var(--cds-space-4)",
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-dark)",
                fontFamily: "monospace",
              }}
            >
              {s.destPath}
            </div>
          ))}
        </div>

        <Separator style={{ marginBottom: "var(--cds-space-24)" }} />

        {/* Push script */}
        <div style={{ marginBottom: "var(--cds-space-16)" }}>
          <div
            style={{
              fontSize: "var(--cds-text-p3)",
              fontWeight: 600,
              color: "var(--cds-huegrey-text-default)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "var(--cds-space-8)",
            }}
          >
            Run in terminal (from creator-ds-react root)
          </div>
          <pre
            style={{
              background: "#1E1E2E",
              color: "#CDD6F4",
              padding: "var(--cds-padding-card)",
              borderRadius: "var(--cds-radius-r)",
              fontSize: 12,
              lineHeight: 1.6,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              margin: 0,
            }}
          >
            {fullScript}
          </pre>
        </div>

        <Button
          style={{ width: "100%" }}
          onClick={() => {
            navigator.clipboard.writeText(fullScript)
          }}
        >
          Copy Script
        </Button>

        <p
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginTop: "var(--cds-space-12)",
            textAlign: "center",
          }}
        >
          After pushing, the sync workflow in <code>creator-ds</code> will NOT
          run (screens live in creator-features directly). The team can pull to
          get the latest screens.
        </p>
      </SheetContent>
    </Sheet>
  )
}

// ─── Version History ──────────────────────────────────────────────────────────

function VersionHistory({ feature }: { feature: FeatureEntry }) {
  return (
    <div>
      {feature.versionHistory.length === 0 ? (
        <p
          style={{
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-huegrey-text-default)",
          }}
        >
          No version history yet.
        </p>
      ) : (
        feature.versionHistory.map((v) => (
          <div
            key={v.version}
            style={{
              display: "flex",
              gap: "var(--cds-gap-default)",
              marginBottom: "var(--cds-space-16)",
            }}
          >
            {/* Timeline dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "var(--cds-radius-full)",
                  background: "var(--cds-primary-surface-default)",
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  width: 1,
                  flex: 1,
                  background: "var(--border)",
                  marginTop: 4,
                }}
              />
            </div>

            <div style={{ paddingBottom: "var(--cds-space-16)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--cds-gap-small)",
                  marginBottom: "var(--cds-space-4)",
                }}
              >
                <Badge variant="subtle" style={{ borderRadius: "var(--cds-radius-full)" }}>
                  {v.version}
                </Badge>
                <span
                  style={{
                    fontSize: "var(--cds-text-p3)",
                    color: "var(--cds-huegrey-text-default)",
                  }}
                >
                  {v.date}
                </span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "var(--cds-space-16)",
                  fontSize: "var(--cds-text-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                  lineHeight: "var(--cds-leading-p2)",
                }}
              >
                {v.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: FeatureEntry }) {
  const [expanded, setExpanded] = React.useState(false)
  const [activeScreen, setActiveScreen] = React.useState(feature.screens[0]?.id ?? "")
  const [pushOpen, setPushOpen] = React.useState(false)

  const activeScreenEntry = feature.screens.find((s) => s.id === activeScreen)

  return (
    <>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--cds-radius-l)",
          background: "var(--cds-white)",
          overflow: "hidden",
          marginBottom: "var(--cds-space-16)",
        }}
      >
        {/* Card header — always visible */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "var(--cds-padding-card)",
            gap: "var(--cds-gap-default)",
            cursor: "pointer",
          }}
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Expand chevron */}
          <div style={{ color: "var(--cds-huegrey-text-default)", flexShrink: 0 }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Feature number */}
          <span
            style={{
              fontSize: "var(--cds-text-p3)",
              fontWeight: 700,
              color: "var(--cds-huegrey-text-default)",
              background: "var(--cds-surface-subtle, #F5F5F5)",
              padding: "2px 8px",
              borderRadius: "var(--cds-radius-xs)",
              flexShrink: 0,
              fontFamily: "monospace",
            }}
          >
            {feature.prdRef}
          </span>

          {/* Feature name */}
          <span
            style={{
              fontSize: "var(--cds-text-p1)",
              fontWeight: 600,
              color: "var(--cds-huegrey-text-dark)",
              flex: 1,
            }}
          >
            {feature.name}
          </span>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-gap-default)",
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-tight)",
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-default)",
              }}
            >
              <User size={12} /> {feature.owner}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-tight)",
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-default)",
              }}
            >
              <Clock size={12} /> {feature.lastUpdated}
            </span>
            <Badge style={{ borderRadius: "var(--cds-radius-full)", fontSize: "var(--cds-text-p3)" }}>
              {feature.version}
            </Badge>
            <StatusBadge status={feature.status} />
            <Button
              size="sm"
              variant="outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-tight)",
              }}
              onClick={() => setPushOpen(true)}
            >
              <GitBranch size={13} /> Push
            </Button>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <>
            <Separator />
            <div style={{ padding: "var(--cds-padding-card)" }}>
              <Tabs defaultValue="preview">
                <TabsList style={{ marginBottom: "var(--cds-space-16)", background: "transparent", padding: 0, borderBottom: "1px solid var(--border)" }}>
                  <TabsTrigger value="preview">
                    <Eye size={13} style={{ marginRight: "var(--cds-gap-tight)" }} />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <Clock size={13} style={{ marginRight: "var(--cds-gap-tight)" }} />
                    Version History
                  </TabsTrigger>
                </TabsList>

                {/* Preview tab */}
                <TabsContent value="preview">
                  {/* Screen switcher */}
                  <div style={{ display: "flex", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-12)", flexWrap: "wrap" }}>
                    {feature.screens.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveScreen(s.id)}
                        style={{
                          padding: "4px 14px",
                          borderRadius: "var(--cds-radius-r)",
                          border: "1px solid var(--border)",
                          background: activeScreen === s.id
                            ? "var(--cds-primary-surface-default)"
                            : "var(--cds-white)",
                          color: activeScreen === s.id
                            ? "var(--cds-white)"
                            : "var(--cds-huegrey-text-dark)",
                          fontSize: "var(--cds-text-p2)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>

                  {/* Screen preview — wrapped in NavigationProvider so clicks work */}
                  {activeScreenEntry && (
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--cds-radius-r)",
                        overflow: "hidden",
                        height: "75vh",
                      }}
                    >
                      <div style={{ height: "100%", overflow: "auto" }}>
                        <NavigationProvider
                          initialScreenId={activeScreen}
                          screenMap={Object.fromEntries(
                            feature.screens.map((s) => [s.id, s.factory])
                          )}
                          onActiveScreenChange={setActiveScreen}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Version history tab */}
                <TabsContent value="history">
                  <VersionHistory feature={feature} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>

      <PushSheet feature={feature} open={pushOpen} onClose={() => setPushOpen(false)} />
    </>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function FeatureDashboardSection() {
  const totalScreens = FEATURE_REGISTRY.reduce((sum, f) => sum + f.screens.length, 0)
  const byStatus = FEATURE_REGISTRY.reduce(
    (acc, f) => { acc[f.status] = (acc[f.status] ?? 0) + 1; return acc },
    {} as Record<string, number>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "var(--cds-space-24)" }}>
        <h2
          style={{
            fontSize: "var(--cds-text-h3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-dark)",
            margin: "0 0 var(--cds-space-4)",
          }}
        >
          Feature Previews
        </h2>
        <p
          style={{
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-huegrey-text-default)",
            margin: "0 0 var(--cds-space-16)",
          }}
        >
          Preview generated screens, track iterations, and push approved screens to creator-features.
        </p>

        {/* Summary stats */}
        <div style={{ display: "flex", gap: "var(--cds-gap-default)", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "var(--cds-radius-full)",
              border: "1px solid var(--border)",
              fontSize: "var(--cds-text-p3)",
              color: "var(--cds-huegrey-text-dark)",
              background: "var(--cds-white)",
            }}
          >
            {FEATURE_REGISTRY.length} feature{FEATURE_REGISTRY.length !== 1 ? "s" : ""} · {totalScreens} screens
          </span>
          {Object.entries(byStatus).map(([status]) => (
            <StatusBadge key={status} status={status as any} />
          ))}
        </div>
      </div>

      {/* Workflow guide */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--cds-gap-default)",
          padding: "var(--cds-space-12) var(--cds-padding-card)",
          borderRadius: "var(--cds-radius-r)",
          background: "var(--cds-primary-surface-subtle, #EEF2FE)",
          border: "1px solid var(--cds-primary-border-default, #0D4EF2)",
          marginBottom: "var(--cds-space-24)",
          fontSize: "var(--cds-text-p3)",
          color: "var(--cds-huegrey-text-dark)",
          flexWrap: "wrap",
        }}
      >
        {["1. AI generates screens", "→", "2. Preview here", "→", "3. Iterate with AI", "→", "4. Approve (Designer + PM)", "→", "5. Push to creator-features"].map(
          (step, i) => (
            <span
              key={i}
              style={{
                fontWeight: step.startsWith("→") ? 400 : 500,
                color: step.startsWith("→") ? "var(--cds-huegrey-text-default)" : undefined,
              }}
            >
              {step}
            </span>
          )
        )}
      </div>

      {/* Feature cards */}
      {FEATURE_REGISTRY.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--cds-space-32)",
            color: "var(--cds-huegrey-text-default)",
            fontSize: "var(--cds-text-p2)",
            border: "1px dashed var(--border)",
            borderRadius: "var(--cds-radius-l)",
          }}
        >
          {/* TODO: replace with &lt;EmptyState /&gt; once built — ds-parity P1 */}
          No features yet. Generate screens from a PRD and register them in{" "}
          <code>src/screens/feature-registry.tsx</code>.
        </div>
      ) : (
        FEATURE_REGISTRY.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))
      )}
    </div>
  )
}
