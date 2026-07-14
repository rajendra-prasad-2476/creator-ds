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
import { ChevronDown, ChevronRight, GitBranch, Clock, ExternalLink } from "lucide-react"

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

function FeatureCard({ feature }: { feature: FeatureEntry }) {
  const [expanded, setExpanded] = React.useState(false)
  const [pushOpen, setPushOpen] = React.useState(false)

  function openPreview(screenId: string) {
    window.open(`/preview.html?feature=${feature.id}&screen=${screenId}`, "_blank", "noopener")
  }

  return (
    <>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-l)", background: "var(--cds-white)", overflow: "hidden", marginBottom: "var(--cds-space-12)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "var(--cds-padding-card)", gap: "var(--cds-gap-default)", cursor: "pointer" }} onClick={() => setExpanded((v) => !v)}>
          <div style={{ color: "var(--cds-huegrey-text-default)", flexShrink: 0 }}>
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>
          <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", background: "var(--cds-surface-subtle, #F5F5F5)", padding: "2px 8px", borderRadius: "var(--cds-radius-xs)", fontFamily: "monospace", flexShrink: 0 }}>{feature.prdRef}</span>
          <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{feature.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}><Clock size={11} /> {feature.lastUpdated}</span>
            <Badge variant="subtle" style={{ borderRadius: "var(--cds-radius-full)", fontSize: "var(--cds-text-p3)" }}>{feature.version}</Badge>
            <StatusBadge status={feature.status} />
            <Button size="sm" variant="outline" style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }} onClick={() => setPushOpen(true)}>
              <GitBranch size={12} /> Push
            </Button>
          </div>
        </div>

        {expanded && (
          <>
            <Separator />
            <div style={{ padding: "var(--cds-padding-card)" }}>
              <Tabs defaultValue="screens">
                <TabsList style={{ marginBottom: "var(--cds-space-16)", background: "transparent", padding: 0, borderBottom: "1px solid var(--border)" }}>
                  <TabsTrigger value="screens">Screens ({feature.screens.length})</TabsTrigger>
                  <TabsTrigger value="history">Version History</TabsTrigger>
                </TabsList>
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

function PMGroup({ owner, features }: { owner: string; features: FeatureEntry[] }) {
  return (
    <div style={{ marginBottom: "var(--cds-space-32)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-12)" }}>
        <PMAvatar name={owner} />
        <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{owner}</span>
        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>· {features.length} feature{features.length !== 1 ? "s" : ""}</span>
      </div>
      {features.map((f) => <FeatureCard key={f.id} feature={f} />)}
    </div>
  )
}

export function FeatureDashboardSection() {
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const allOwners = Array.from(new Set(FEATURE_REGISTRY.map((f) => f.owner)))
  const totalScreens = FEATURE_REGISTRY.reduce((sum, f) => sum + f.screens.length, 0)
  const filtered = ownerFilter === "all" ? FEATURE_REGISTRY : FEATURE_REGISTRY.filter((f) => f.owner === ownerFilter)
  const grouped = filtered.reduce<Record<string, FeatureEntry[]>>((acc, f) => { if (!acc[f.owner]) acc[f.owner] = []; acc[f.owner].push(f); return acc }, {})

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
        Object.entries(grouped).map(([owner, features]) => <PMGroup key={owner} owner={owner} features={features} />)
      ) : (
        filtered.map((f) => <FeatureCard key={f.id} feature={f} />)
      )}
    </div>
  )
}
