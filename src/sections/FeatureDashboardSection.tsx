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
  type FeatureOverview,
} from "@/screens/feature-registry"
import { ChevronDown, ChevronRight, GitBranch, Clock, ExternalLink, AlertTriangle, Lightbulb, ArrowRight, Link2 } from "lucide-react"

const STATUS_CONFIG: Record<FeatureStatus, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: "Draft", color: "var(--cds-huegrey-text-default)", bg: "var(--cds-surface-subtle, #F5F5F5)", border: "var(--border)" },
  "in-review": { label: "In Review", color: "var(--cds-warning-text-default, #D25704)", bg: "var(--cds-warning-surface-subtle, #FFF8F0)", border: "var(--cds-warning-border-default, #D25704)" },
  approved: { label: "Approved", color: "var(--cds-success-text-default, #078841)", bg: "var(--cds-success-surface-subtle, #F0FAF4)", border: "var(--cds-success-border-default, #078841)" },
  pushed: { label: "Pushed", color: "var(--cds-primary-text-default)", bg: "var(--cds-primary-surface-subtle, #EEF2FE)", border: "var(--cds-primary-border-default, #0D4EF2)" },
}

function StatusBadge({ status }: { status: FeatureStatus }) {
  const s = STATUS_CONFIG[status]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: "var(--cds-radius-full)", fontSize: "var(--cds-text-p3)", fontWeight: 500, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  )
}

function PMAvatar({ name }: { name: string }) {
  const initials = name.split(".").map((p) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2)
  const colors = ["#0D4EF2", "#078841", "#D25704", "#CC1914", "#7C3AED", "#0891B2", "#BE185D", "#B45309"]
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ width: 28, height: 28, borderRadius: "var(--cds-radius-full)", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "var(--cds-text-p4)", fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function PushSheet({ feature, open, onClose }: { feature: FeatureEntry; open: boolean; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false)
  const copyCommands = feature.screens.map((s) => `cp "${s.sourcePath}" \\\n   "../creator-features/${s.destPath}"`).join("\n\n")
  const fullScript = `#!/bin/bash
# Push ${feature.name} (${feature.version}) to creator-features
# Run from the creator-ds root directory

echo "Copying screens..."
${copyCommands}

echo "Committing..."
cd ../creator-features
git add ${feature.screens.map((s) => s.destPath).join(" \\\n     ")}
git commit -m "feat(${feature.id}): ${feature.name} — ${feature.version} approved"
git push origin main

echo "Done"`

  function handleCopy() {
    navigator.clipboard.writeText(fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" style={{ width: "min(540px, 95vw)", overflowY: "auto" }}>
        <SheetHeader style={{ marginBottom: "var(--cds-space-24)" }}>
          <SheetTitle>Push to creator-features</SheetTitle>
          <SheetDescription>
            Run this script from <code>creator-ds</code> root to copy approved screens into <code>creator-features</code> and commit them.
          </SheetDescription>
        </SheetHeader>
        <div style={{ marginBottom: "var(--cds-space-16)" }}>
          <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--cds-space-8)" }}>Screens ({feature.screens.length})</div>
          {feature.screens.map((s) => (
            <div key={s.id} style={{ padding: "6px 12px", borderRadius: "var(--cds-radius-s)", background: "var(--cds-surface-subtle, #F5F5F5)", marginBottom: 4, fontSize: "var(--cds-text-p3)", fontFamily: "monospace", color: "var(--cds-huegrey-text-dark)" }}>{s.destPath}</div>
          ))}
        </div>
        <Separator style={{ marginBottom: "var(--cds-space-16)" }} />
        <pre style={{ background: "#1E1E2E", color: "#CDD6F4", padding: "var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", fontSize: 11, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: "0 0 var(--cds-space-12)" }}>{fullScript}</pre>
        <Button style={{ width: "100%" }} onClick={handleCopy}>{copied ? "Copied!" : "Copy Script"}</Button>
      </SheetContent>
    </Sheet>
  )
}

function VersionHistory({ feature }: { feature: FeatureEntry }) {
  if (feature.versionHistory.length === 0) return <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>No version history yet.</p>
  return (
    <div>
      {feature.versionHistory.map((v, i) => (
        <div key={v.version} style={{ display: "flex", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-16)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "var(--cds-radius-full)", background: "var(--cds-primary-surface-default)", marginTop: 4, flexShrink: 0 }} />
            {i < feature.versionHistory.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 4 }} />}
          </div>
          <div style={{ paddingBottom: "var(--cds-space-16)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-4)" }}>
              <Badge variant="subtle" style={{ borderRadius: "var(--cds-radius-full)" }}>{v.version}</Badge>
              <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{v.date}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: "var(--cds-space-16)", fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", lineHeight: "var(--cds-leading-p2)" }}>
              {v.notes.map((note, j) => <li key={j}>{note}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Overview Tab Components ──────────────────────────────────────────────────

function ProblemSolutionHero({ overview }: { overview: FeatureOverview }) {
  return (
    <div style={{ marginBottom: "var(--cds-space-24)" }}>
      {/* Tagline */}
      <div style={{
        textAlign: "center",
        padding: "var(--cds-space-16) var(--cds-padding-section-h)",
        marginBottom: "var(--cds-space-16)",
        background: "var(--cds-primary-surface-subtle, #EEF2FE)",
        borderRadius: "var(--cds-radius-l)",
        border: "1px solid var(--cds-primary-border-minimal, #A8C0FA)",
      }}>
        <p style={{ margin: 0, fontSize: "var(--cds-text-p1)", fontWeight: 600, color: "var(--cds-primary-text-default)", lineHeight: "var(--cds-leading-p1)" }}>
          {overview.tagline}
        </p>
      </div>

      {/* Before / After split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--cds-gap-default)", alignItems: "stretch" }}>
        {/* Before — Problem */}
        <div style={{
          padding: "var(--cds-padding-card)",
          borderRadius: "var(--cds-radius-l)",
          background: "var(--cds-error-surface-subtle, #FFF5F5)",
          border: "1px solid var(--cds-error-border-low-hover, #F5ABAA)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", marginBottom: "var(--cds-space-8)" }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-error-text-default, #CC1914)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</span>
          </div>
          <p style={{ margin: "0 0 var(--cds-space-12)", fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", lineHeight: "var(--cds-leading-p2)", fontWeight: 500 }}>
            {overview.problemStatement}
          </p>
          <ul style={{ margin: 0, padding: "0 0 0 var(--cds-space-16)", listStyle: "none" }}>
            {overview.painPoints.map((pt, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-tight)", marginBottom: "var(--cds-space-4)", fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", lineHeight: "var(--cds-leading-p2)" }}>
                <span style={{ color: "var(--cds-error-text-default, #CC1914)", marginTop: 2, flexShrink: 0 }}>✗</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Arrow connector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
            <ArrowRight size={20} style={{ color: "var(--cds-huegrey-text-default)" }} />
          </div>
        </div>

        {/* After — Solution */}
        <div style={{
          padding: "var(--cds-padding-card)",
          borderRadius: "var(--cds-radius-l)",
          background: "var(--cds-success-surface-subtle, #F0FAF4)",
          border: "1px solid var(--cds-success-border-low-hover, #9FCFB8)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", marginBottom: "var(--cds-space-8)" }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-success-text-default, #078841)", textTransform: "uppercase", letterSpacing: "0.06em" }}>After</span>
          </div>
          <p style={{ margin: "0 0 var(--cds-space-12)", fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", lineHeight: "var(--cds-leading-p2)", fontWeight: 500 }}>
            {overview.solutionStatement}
          </p>
          <ul style={{ margin: 0, padding: "0 0 0 var(--cds-space-16)", listStyle: "none" }}>
            {overview.improvements.map((imp, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-tight)", marginBottom: "var(--cds-space-4)", fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", lineHeight: "var(--cds-leading-p2)" }}>
                <span style={{ color: "var(--cds-success-text-default, #078841)", marginTop: 2, flexShrink: 0 }}>✓</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ScreenFlowMap({ overview, featureId, onPreview }: { overview: FeatureOverview; featureId: string; onPreview: (screenId: string) => void }) {
  if (!overview.screenFlow?.length) return null

  const NODE_TYPE_STYLE: Record<string, { bg: string; border: string; color: string; label: string }> = {
    entry:  { bg: "var(--cds-primary-surface-subtle, #EEF2FE)", border: "var(--cds-primary-border-default, #0D4EF2)", color: "var(--cds-primary-text-default)", label: "Entry" },
    sheet:  { bg: "var(--cds-warning-surface-subtle, #FFF8F0)", border: "var(--cds-warning-border-default, #D25704)", color: "var(--cds-warning-text-default, #D25704)", label: "Sheet" },
    dialog: { bg: "var(--cds-huegrey-surface-subtle, #F5F5F5)", border: "var(--border)", color: "var(--cds-huegrey-text-default)", label: "Dialog" },
    detail: { bg: "var(--cds-success-surface-subtle, #F0FAF4)", border: "var(--cds-success-border-low-hover, #9FCFB8)", color: "var(--cds-success-text-default, #078841)", label: "Detail" },
  }

  return (
    <div style={{ marginBottom: "var(--cds-space-16)" }}>
      <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--cds-space-12)" }}>
        Screen Flow Map
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-16)", flexWrap: "wrap" }}>
        {Object.entries(NODE_TYPE_STYLE).map(([type, s]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "var(--cds-radius-xs)", background: s.bg, border: `1px solid ${s.border}` }} />
            {s.label}
          </div>
        ))}
      </div>

      {/* Flow nodes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--cds-space-8)", alignItems: "center" }}>
        {overview.screenFlow.map((node, idx) => {
          const style = NODE_TYPE_STYLE[node.type ?? "detail"] ?? NODE_TYPE_STYLE.detail
          const hasArrow = (node.leadsTo?.length ?? 0) > 0

          return (
            <React.Fragment key={node.id}>
              {/* Node */}
              <div
                onClick={() => onPreview(node.id)}
                title={`Preview: ${node.label}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "var(--cds-space-8) var(--cds-space-12)",
                  borderRadius: "var(--cds-radius-r)",
                  background: style.bg,
                  border: `1.5px solid ${style.border}`,
                  cursor: "pointer",
                  minWidth: 110,
                  maxWidth: 160,
                  transition: "box-shadow 0.12s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 3px 10px rgba(0,0,0,0.12)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <span style={{ fontSize: "var(--cds-text-p4)", fontWeight: 600, color: style.color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
                  {style.label}
                </span>
                <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", lineHeight: 1.3 }}>
                  {node.label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4 }}>
                  <ExternalLink size={9} style={{ color: "var(--cds-huegrey-text-default)" }} />
                  <span style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)" }}>Preview</span>
                </div>
              </div>

              {/* Arrow if this node leads to next(s) */}
              {hasArrow && (
                <div style={{ display: "flex", alignItems: "center", color: "var(--cds-huegrey-text-default)", flexShrink: 0 }}>
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Navigation flow text tree */}
      {overview.navigationFlow && (
        <div style={{ marginTop: "var(--cds-space-16)", padding: "var(--cds-space-12) var(--cds-padding-card)", background: "var(--cds-surface-subtle, #F5F5F5)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "var(--cds-text-p4)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--cds-space-8)" }}>Navigation Flow</div>
          <pre style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)", fontFamily: "monospace", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{overview.navigationFlow}</pre>
        </div>
      )}
    </div>
  )
}

function OverviewTab({ feature, onPreview }: { feature: FeatureEntry; onPreview: (screenId: string) => void }) {
  const ov = feature.overview
  if (!ov) {
    return (
      <div style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)", border: "1px dashed var(--border)", borderRadius: "var(--cds-radius-l)" }}>
        No overview yet. Add an <code>overview</code> field to this feature in <code>feature-registry.tsx</code>.
      </div>
    )
  }
  return (
    <div>
      <ProblemSolutionHero overview={ov} />
      <ScreenFlowMap overview={ov} featureId={feature.id} onPreview={onPreview} />
    </div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature, defaultExpanded }: { feature: FeatureEntry; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded ?? false)
  const [pushOpen, setPushOpen] = React.useState(false)
  function openPreview(screenId: string) {
    window.open(`/preview.html?feature=${feature.id}&screen=${screenId}`, "_blank", "noopener")
  }

  return (
    <>
      <div id={`feature-${feature.id}`} style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-l)", background: "var(--cds-white)", overflow: "hidden", marginBottom: "var(--cds-space-12)", scrollMarginTop: 72 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "var(--cds-padding-card)", gap: "var(--cds-gap-default)", cursor: "pointer" }} onClick={() => setExpanded((v) => !v)}>
          <div style={{ color: "var(--cds-huegrey-text-default)", flexShrink: 0 }}>
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>
          <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", background: "var(--cds-surface-subtle, #F5F5F5)", padding: "2px 8px", borderRadius: "var(--cds-radius-xs)", fontFamily: "monospace", flexShrink: 0 }}>{feature.prdRef}</span>
          <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{feature.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}><Clock size={11} /> {feature.lastUpdated}</span>
            <Badge variant="subtle" style={{ borderRadius: "var(--cds-radius-full)", fontSize: "var(--cds-text-p3)" }}>{feature.version}</Badge>
            <CopyLinkButton featureId={feature.id} />
          </div>
        </div>

        {expanded && (
          <>
            <Separator />
            <div style={{ padding: "var(--cds-padding-card)" }}>
              {(() => {
                const totalGaps = feature.screens.reduce((sum, s) => sum + (s.customComponents?.length ?? 0), 0)
                const oversightCount = feature.screens.reduce((sum, s) => sum + (s.customComponents?.filter((c) => c.reason === "oversight").length ?? 0), 0)
                return (
                  <Tabs defaultValue={feature.overview ? "overview" : "screens"}>
                    <TabsList style={{ marginBottom: "var(--cds-space-16)", background: "transparent", padding: 0, borderBottom: "1px solid var(--border)" }}>
                      {feature.overview && <TabsTrigger value="overview">Overview</TabsTrigger>}
                      <TabsTrigger value="screens">Screens ({feature.screens.length})</TabsTrigger>
                      <TabsTrigger value="ds-gaps">
                        DS Gaps {totalGaps > 0 && (
                          <span style={{ marginLeft: "var(--cds-gap-tight)", padding: "0 6px", borderRadius: "var(--cds-radius-full)", fontSize: "var(--cds-text-p4)", fontWeight: 700, background: oversightCount > 0 ? "var(--cds-error-surface-default)" : "var(--cds-warning-surface-default)", color: "var(--cds-white)", display: "inline-flex", alignItems: "center" }}>
                            {totalGaps}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="history">Version History</TabsTrigger>
                      <TabsTrigger value="engineering" style={{ marginLeft: "auto", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p3)" }}>⚙ Engineering</TabsTrigger>
                    </TabsList>

                    {feature.overview && (
                      <TabsContent value="overview">
                        <OverviewTab feature={feature} onPreview={openPreview} />
                      </TabsContent>
                    )}

                    <TabsContent value="screens">
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                        {feature.screens.map((screen) => (
                          <div key={screen.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                            <div>
                              <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-4)" }}>{screen.name}</div>
                              <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", fontFamily: "monospace" }}>{screen.sourcePath}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", flexShrink: 0 }}>
                              <Button size="sm" onClick={() => openPreview(screen.id)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", flexShrink: 0 }}>
                                <ExternalLink size={12} /> Preview
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="ds-gaps">
                      {totalGaps === 0 ? (
                        <div style={{ textAlign: "center", padding: "var(--cds-space-24)", color: "var(--cds-success-text-default, #078841)", fontSize: "var(--cds-text-p2)", border: "1px solid var(--cds-success-border-low-hover, #9FCFB8)", borderRadius: "var(--cds-radius-r)", background: "var(--cds-success-surface-subtle)" }}>
                          ✓ No DS gaps detected — all UI uses DS components.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
                          {feature.screens.map((screen) => {
                            if (!screen.customComponents?.length) return null
                            return (
                              <div key={screen.id}>
                                <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-8)" }}>
                                  {screen.name}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                                  {screen.customComponents.map((gap, i) => {
                                    const isOversight = gap.reason === "oversight"
                                    const isNotAvailable = gap.reason === "DS component not available"
                                    const bgColor = isOversight
                                      ? "var(--cds-error-surface-subtle)"
                                      : isNotAvailable
                                      ? "var(--cds-warning-surface-subtle)"
                                      : "var(--cds-primary-surface-subtle)"
                                    const borderColor = isOversight
                                      ? "var(--cds-error-border-low-hover, #F5ABAA)"
                                      : isNotAvailable
                                      ? "var(--cds-warning-border-low-hover, #F5C99E)"
                                      : "var(--cds-primary-border-minimal, #A8C0FA)"
                                    const iconColor = isOversight
                                      ? "var(--cds-error-text-default)"
                                      : isNotAvailable
                                      ? "var(--cds-warning-text-default, #BE4E04)"
                                      : "var(--cds-primary-text-default)"
                                    return (
                                      <div key={i} style={{ padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", border: `1px solid ${borderColor}`, background: bgColor, display: "flex", gap: "var(--cds-gap-default)", alignItems: "flex-start" }}>
                                        <div style={{ flexShrink: 0, marginTop: 1 }}>
                                          {isOversight
                                            ? <AlertTriangle size={14} style={{ color: iconColor }} />
                                            : <Lightbulb size={14} style={{ color: iconColor }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", marginBottom: 2 }}>{gap.element}</div>
                                          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "var(--cds-text-p4)", padding: "1px 6px", borderRadius: "var(--cds-radius-xs)", background: isOversight ? "var(--cds-error-surface-default)" : "var(--cds-huegrey-surface-subtle)", color: isOversight ? "var(--cds-white)" : "var(--cds-huegrey-text-default)", fontWeight: 500 }}>
                                              {isOversight ? "Oversight — fixable now" : isNotAvailable ? "DS Missing" : "Doesn't fit"}
                                            </span>
                                            {gap.parity && (
                                              <span style={{ fontSize: "var(--cds-text-p4)", padding: "1px 6px", borderRadius: "var(--cds-radius-xs)", background: "var(--cds-surface-subtle, #F5F5F5)", color: "var(--cds-huegrey-text-default)", fontWeight: 500 }}>
                                                ds-parity {gap.parity}
                                              </span>
                                            )}
                                            {gap.dsAlternative && (
                                              <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                                                → Use <code style={{ fontSize: "var(--cds-text-p4)", background: "var(--cds-surface-subtle)", padding: "1px 4px", borderRadius: 3 }}>{gap.dsAlternative}</code>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="history">
                      <VersionHistory feature={feature} />
                    </TabsContent>

                    <TabsContent value="engineering">
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
                        {/* Status */}
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 80 }}>Status</span>
                          <StatusBadge status={feature.status} />
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginLeft: "auto" }}>
                            {feature.status === "draft" && "Work in progress — not ready for review"}
                            {feature.status === "in-review" && "Shared with designers & PM — awaiting sign-off"}
                            {feature.status === "approved" && "Design + PM approved — ready to push"}
                            {feature.status === "pushed" && "Screens committed to creator-features"}
                          </span>
                        </div>

                        {/* Owner */}
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 80 }}>Owner</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                            <PMAvatar name={feature.owner} />
                            <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>{feature.owner}</span>
                          </div>
                        </div>

                        {/* PRD Ref */}
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 80 }}>PRD Ref</span>
                          <code style={{ fontSize: "var(--cds-text-p3)", background: "var(--cds-surface-subtle, #F5F5F5)", padding: "2px 8px", borderRadius: "var(--cds-radius-xs)" }}>{feature.prdRef}</code>
                        </div>

                        {/* Dest paths */}
                        <div style={{ padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                          <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginBottom: "var(--cds-space-8)" }}>Destination paths (creator-features)</div>
                          {feature.screens.map((s) => (
                            <div key={s.id} style={{ padding: "4px 8px", borderRadius: "var(--cds-radius-xs)", background: "var(--cds-surface-subtle, #F5F5F5)", marginBottom: 4, fontSize: "var(--cds-text-p3)", fontFamily: "monospace", color: "var(--cds-huegrey-text-dark)" }}>{s.destPath}</div>
                          ))}
                        </div>

                        {/* Push button */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            variant={feature.status === "approved" ? "default" : "outline"}
                            style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}
                            onClick={() => setPushOpen(true)}
                            title={feature.status !== "approved" ? "Feature must be Approved before pushing" : undefined}
                          >
                            <GitBranch size={14} />
                            Push to creator-features
                            {feature.status !== "approved" && (
                              <span style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)", marginLeft: "var(--cds-gap-tight)" }}>(requires Approved status)</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )
              })()}
            </div>
          </>
        )}
      </div>
      <PushSheet feature={feature} open={pushOpen} onClose={() => setPushOpen(false)} />
    </>
  )
}

function PMGroup({ owner, features, deepLinkId }: { owner: string; features: FeatureEntry[]; deepLinkId?: string }) {
  return (
    <div style={{ marginBottom: "var(--cds-space-32)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-12)" }}>
        <PMAvatar name={owner} />
        <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{owner}</span>
        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>· {features.length} feature{features.length !== 1 ? "s" : ""}</span>
      </div>
      {features.map((f) => <FeatureCard key={f.id} feature={f} defaultExpanded={f.id === deepLinkId} />)}
    </div>
  )
}

// ─── Deep-link routing ────────────────────────────────────────────────────────
// URL format: /features.html?feature=001  (auto-expands that feature card)

function useDeepLink() {
  return React.useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("feature") ?? undefined
  }, [])
}

function CopyLinkButton({ featureId }: { featureId: string }) {
  const [copied, setCopied] = React.useState(false)
  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}?feature=${featureId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button
      size="sm"
      variant="ghost"
      title="Copy shareable link to this feature"
      style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: copied ? "var(--cds-success-text-default, #078841)" : "var(--cds-huegrey-text-default)" }}
      onClick={handleCopy}
    >
      <Link2 size={12} />
      {copied ? "Copied!" : "Share"}
    </Button>
  )
}

export function FeatureDashboardSection() {
  const deepLinkId = useDeepLink()
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const allOwners = Array.from(new Set(FEATURE_REGISTRY.map((f) => f.owner)))
  const totalScreens = FEATURE_REGISTRY.reduce((sum, f) => sum + f.screens.length, 0)
  const sorted = [...FEATURE_REGISTRY].sort((a, b) => a.id.localeCompare(b.id))
  const filtered = ownerFilter === "all" ? sorted : sorted.filter((f) => f.owner === ownerFilter)
  const grouped = filtered.reduce<Record<string, FeatureEntry[]>>((acc, f) => { if (!acc[f.owner]) acc[f.owner] = []; acc[f.owner].push(f); return acc }, {})

  // Auto-scroll to deep-linked feature on mount
  React.useEffect(() => {
    if (!deepLinkId) return
    setTimeout(() => {
      const el = document.getElementById(`feature-${deepLinkId}`)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 150)
  }, [deepLinkId])

  return (
    <div>
      <div style={{ marginBottom: "var(--cds-space-24)" }}>
        <h2 style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>Feature Previews</h2>
        <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-16)" }}>
          {FEATURE_REGISTRY.length} feature{FEATURE_REGISTRY.length !== 1 ? "s" : ""} · {totalScreens} screens · Preview opens in a new tab with full navigation
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", background: "var(--cds-primary-surface-subtle, #EEF2FE)", border: "1px solid var(--cds-primary-border-default, #0D4EF2)", marginBottom: "var(--cds-space-24)", fontSize: "var(--cds-text-p3)", flexWrap: "wrap" }}>
          {["1. AI generates screens", "→", "2. Preview in new tab", "→", "3. Iterate with AI", "→", "4. Designer + PM approve", "→", "5. Push"].map((step, i) => (
            <span key={i} style={{ fontWeight: step.startsWith("→") ? 400 : 500, color: step.startsWith("→") ? "var(--cds-huegrey-text-default)" : "var(--cds-huegrey-text-dark)" }}>{step}</span>
          ))}
        </div>
      </div>

      {allOwners.length > 1 && (
        <div style={{ display: "flex", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-24)", flexWrap: "wrap" }}>
          {["all", ...allOwners].map((owner) => (
            <button key={owner} onClick={() => setOwnerFilter(owner)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", padding: "4px 14px", borderRadius: "var(--cds-radius-full)", border: "1px solid var(--border)", background: ownerFilter === owner ? "var(--cds-primary-surface-default)" : "var(--cds-white)", color: ownerFilter === owner ? "var(--cds-white)" : "var(--cds-huegrey-text-dark)", fontSize: "var(--cds-text-p3)", cursor: "pointer", fontFamily: "inherit" }}>
              {owner !== "all" && <PMAvatar name={owner} />}
              {owner === "all" ? "All PMs" : owner}
            </button>
          ))}
        </div>
      )}

      {FEATURE_REGISTRY.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)", border: "1px dashed var(--border)", borderRadius: "var(--cds-radius-l)" }}>
          {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
          No features yet. Add an entry to <code>src/screens/feature-registry.tsx</code>.
        </div>
      ) : ownerFilter === "all" ? (
        Object.entries(grouped).map(([owner, features]) => <PMGroup key={owner} owner={owner} features={features} deepLinkId={deepLinkId} />)
      ) : (
        filtered.map((f) => <FeatureCard key={f.id} feature={f} defaultExpanded={f.id === deepLinkId} />)
      )}
    </div>
  )
}
