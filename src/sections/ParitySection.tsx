import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContentSwitcher } from "@/components/ui/content-switcher"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertCircle, Clock, MinusCircle, Search, ExternalLink } from "lucide-react"

// ─── Parity Data (sourced from docs/ds-parity.csv) ───────────────────────────

type ParityStatus = "Done" | "Missing" | "Partial" | "Proposed" | "Approved" | "Deprecated"
type ParityCategory = "Atom" | "Molecule" | "Organism"
type ParityPriority = "P1" | "P2" | "P3"

interface ParityRow {
  component: string
  category: ParityCategory
  status: ParityStatus
  figmaNodeId?: string
  requiredBy: string
  priority: ParityPriority
  notes: string
}

const PARITY_DATA: ParityRow[] = [
  {
    component: "RadioCard",
    category: "Atom",
    status: "Done",
    figmaNodeId: "2352:2858",
    requiredBy: "Forms with card-style radio options",
    priority: "P1",
    notes: "Selectable card with radio indicator + label + description. Works inside RadioGroup via value prop. States: Default / Hover / Checked / Disabled Before / Disabled After.",
  },
  {
    component: "Tag",
    category: "Atom",
    status: "Done",
    figmaNodeId: "3121:14484",
    requiredBy: "All tagging and categorisation UIs",
    priority: "P2",
    notes: "Dismissible chip: 4 variants (default/bold/outlined/ghost) × 2 sizes (base 26px / small 18px). Use closeable+onClose for interactive tags.",
  },
  {
    component: "TagInput",
    category: "Molecule",
    status: "Done",
    figmaNodeId: "3121:14485",
    requiredBy: "All multi-value tag entry forms",
    priority: "P2",
    notes: "Multi-tag input field: type + Enter/comma to add, × to dismiss, Backspace removes last tag. Supports error / disabled / maxTags.",
  },
  {
    component: "InputSuffix",
    category: "Molecule",
    status: "Done",
    figmaNodeId: "3007:320",
    requiredBy: "All forms needing trailing action (copy/search/clear)",
    priority: "P1",
    notes: "Text field with trailing CTA (icon + label) or clear (×) button. Supports default/error/success/disabled states.",
  },
  {
    component: "InputPrefix",
    category: "Molecule",
    status: "Done",
    figmaNodeId: "3037:1040",
    requiredBy: "All forms needing a leading context (URL scheme / currency / country code)",
    priority: "P1",
    notes: "Text field with leading CTA (icon + label) and optional trailing icon or clear (×) button. Mirrors InputSuffix. Supports default/error/success/disabled.",
  },
  {
    component: "InputAffixed",
    category: "Molecule",
    status: "Done",
    figmaNodeId: "3079:8161",
    requiredBy: "Forms needing context on both sides (currency + unit / country code + extension)",
    priority: "P1",
    notes: "Text field with leading AND trailing CTAs. Status (error/success) applies to prefix + input only; right CTA stays default grey.",
  },
  {
    component: "Blanket",
    category: "Atom",
    status: "Done",
    figmaNodeId: "6670:16098",
    requiredBy: "Overlay backdrops (Sheet/Dialog/Slider)",
    priority: "P2",
    notes: "Scrim overlay — uses --cds-blanket-overlay (primary-surface-bold-alpha10) rgba(1,3,10,0.1); no backdrop blur per Figma.",
  },
  {
    component: "StatusBadge",
    category: "Atom",
    status: "Done",
    figmaNodeId: undefined,
    requiredBy: "Zia Settings (configured/not-configured pills)",
    priority: "P2",
    notes: "Semantic status pill mapping status→colour+icon+label (configured/not-configured/error/pending). Built on Badge. Approved 2026-07-08.",
  },
  {
    component: "Toggle",
    category: "Atom",
    status: "Done",
    figmaNodeId: "2435:645",
    requiredBy: "Any feature needing on/off settings with semantic colour",
    priority: "P1",
    notes: "Sliding on/off switch: 2 sizes (sm 14px / default 16px) × 3 variants (fill/border/subtle) × 6 colour states (primary/success/info/warning/error/huegrey). Fully accessible: role=switch aria-checked.",
  },
  {
    component: "Spinner",
    category: "Atom",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "All async states",
    priority: "P1",
    notes: "Inline loading indicator — animating circle.",
  },
  {
    component: "Skeleton",
    category: "Atom",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "All list and detail views",
    priority: "P1",
    notes: "Content placeholder during data fetch.",
  },
  {
    component: "EmptyState",
    category: "Atom",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "All list views",
    priority: "P1",
    notes: "Illustration + heading + CTA when no records exist.",
  },
  {
    component: "InlineAlert",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "All form screens",
    priority: "P1",
    notes: "Inline banner for errors / warnings / success — NOT a dialog.",
  },
  {
    component: "FormField",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "All forms",
    priority: "P1",
    notes: "Label + Input + HelperText + Error state composed into one unit.",
  },
  {
    component: "Pagination",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "List views",
    priority: "P1",
    notes: "Page numbers + prev/next controls.",
  },
  {
    component: "DataTable",
    category: "Organism",
    status: "Partial",
    figmaNodeId: undefined,
    requiredBy: "All list views",
    priority: "P1",
    notes: "Existing table.tsx needs sort headers + filter row + pagination slot.",
  },
  {
    component: "StatCard",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Dashboard screens",
    priority: "P2",
    notes: "Metric value + label + optional trend indicator.",
  },
  {
    component: "DatePicker",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Scheduling features",
    priority: "P2",
    notes: "Calendar overlay + text input trigger.",
  },
  {
    component: "Accordion",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Settings pages",
    priority: "P2",
    notes: "Expand/collapse single section with animated chevron.",
  },
  {
    component: "FileUpload",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Document features",
    priority: "P2",
    notes: "Drag-and-drop zone + file list preview.",
  },
  {
    component: "Stepper",
    category: "Molecule",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Onboarding wizard",
    priority: "P3",
    notes: "Multi-step progress indicator — horizontal and vertical.",
  },
  {
    component: "CommandPalette",
    category: "Organism",
    status: "Missing",
    figmaNodeId: undefined,
    requiredBy: "Global search",
    priority: "P3",
    notes: "⌘K overlay with fuzzy search and keyboard navigation.",
  },
]

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ParityStatus, {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
  badgeColour: "success" | "error" | "warning" | "primary" | "huegrey"
}> = {
  Done: {
    label: "Done",
    color: "var(--cds-success-text-default, #078841)",
    bg: "var(--cds-success-surface-subtle, #F0FAF4)",
    border: "var(--cds-success-border-low-hover, #9FCFB8)",
    icon: <CheckCircle2 size={13} />,
    badgeColour: "success",
  },
  Missing: {
    label: "Missing",
    color: "var(--cds-error-text-default, #CC1914)",
    bg: "var(--cds-error-surface-subtle, #FFF5F5)",
    border: "var(--cds-error-border-low-hover, #F5ABAA)",
    icon: <AlertCircle size={13} />,
    badgeColour: "error",
  },
  Partial: {
    label: "Partial",
    color: "var(--cds-warning-text-default, #D25704)",
    bg: "var(--cds-warning-surface-subtle, #FFF8F0)",
    border: "var(--cds-warning-border-low-hover, #F5C99E)",
    icon: <MinusCircle size={13} />,
    badgeColour: "warning",
  },
  Proposed: {
    label: "Proposed",
    color: "var(--cds-primary-text-default, #0D4EF2)",
    bg: "var(--cds-primary-surface-subtle, #EEF2FE)",
    border: "var(--cds-primary-border-minimal, #A8C0FA)",
    icon: <Clock size={13} />,
    badgeColour: "primary",
  },
  Approved: {
    label: "Approved",
    color: "var(--cds-success-text-default, #078841)",
    bg: "var(--cds-success-surface-subtle, #F0FAF4)",
    border: "var(--cds-success-border-low-hover, #9FCFB8)",
    icon: <CheckCircle2 size={13} />,
    badgeColour: "success",
  },
  Deprecated: {
    label: "Deprecated",
    color: "var(--cds-huegrey-text-default, #696C74)",
    bg: "var(--cds-surface-subtle, #F5F5F5)",
    border: "var(--border, #E5E5E7)",
    icon: <MinusCircle size={13} />,
    badgeColour: "huegrey",
  },
}

const PRIORITY_CONFIG: Record<ParityPriority, { color: string; bg: string }> = {
  P1: { color: "var(--cds-error-text-default, #CC1914)", bg: "var(--cds-error-surface-subtle, #FFF5F5)" },
  P2: { color: "var(--cds-warning-text-default, #D25704)", bg: "var(--cds-warning-surface-subtle, #FFF8F0)" },
  P3: { color: "var(--cds-huegrey-text-default, #696C74)", bg: "var(--cds-surface-subtle, #F5F5F5)" },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: ParityStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 10px",
      borderRadius: "var(--cds-radius-full)",
      fontSize: "var(--cds-text-p3)",
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      whiteSpace: "nowrap",
    }}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function PriorityTag({ priority }: { priority: ParityPriority }) {
  const cfg = PRIORITY_CONFIG[priority]
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "1px 7px",
      borderRadius: "var(--cds-radius-xs)",
      fontSize: "var(--cds-text-p4)",
      fontWeight: 700,
      color: cfg.color,
      background: cfg.bg,
      whiteSpace: "nowrap",
    }}>
      {priority}
    </span>
  )
}

function CategoryTag({ category }: { category: ParityCategory }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "1px 7px",
      borderRadius: "var(--cds-radius-xs)",
      fontSize: "var(--cds-text-p4)",
      fontWeight: 500,
      color: "var(--cds-huegrey-text-default)",
      background: "var(--cds-surface-subtle, #F5F5F5)",
      border: "1px solid var(--border)",
      whiteSpace: "nowrap",
    }}>
      {category}
    </span>
  )
}

// ─── Coverage Bar ─────────────────────────────────────────────────────────────

function CoverageBar({ data }: { data: ParityRow[] }) {
  const total = data.length
  const done = data.filter((r) => r.status === "Done" || r.status === "Approved").length
  const partial = data.filter((r) => r.status === "Partial").length
  const missing = data.filter((r) => r.status === "Missing" || r.status === "Proposed").length
  const pct = Math.round((done / total) * 100)

  const doneW = (done / total) * 100
  const partialW = (partial / total) * 100
  const missingW = (missing / total) * 100

  return (
    <div style={{ marginBottom: "var(--cds-space-24)" }}>
      {/* Stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-space-24)", marginBottom: "var(--cds-space-12)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: 2 }}>DS Coverage</span>
        </div>
        <div style={{ display: "flex", gap: "var(--cds-space-16)", flexWrap: "wrap" }}>
          <StatChip count={done} label="Done" color="var(--cds-success-text-default, #078841)" bg="var(--cds-success-surface-subtle)" border="var(--cds-success-border-low-hover, #9FCFB8)" />
          <StatChip count={partial} label="Partial" color="var(--cds-warning-text-default, #D25704)" bg="var(--cds-warning-surface-subtle)" border="var(--cds-warning-border-low-hover, #F5C99E)" />
          <StatChip count={missing} label="Missing" color="var(--cds-error-text-default, #CC1914)" bg="var(--cds-error-surface-subtle)" border="var(--cds-error-border-low-hover, #F5ABAA)" />
          <StatChip count={total} label="Total" color="var(--cds-huegrey-text-default)" bg="var(--cds-surface-subtle, #F5F5F5)" border="var(--border)" />
        </div>
      </div>

      {/* Segmented bar */}
      <div style={{ display: "flex", height: 10, borderRadius: "var(--cds-radius-full)", overflow: "hidden", gap: 2, background: "var(--cds-surface-subtle)" }}>
        {doneW > 0 && (
          <div style={{ width: `${doneW}%`, background: "var(--cds-success-surface-default, #078841)", borderRadius: "var(--cds-radius-full) 0 0 var(--cds-radius-full)", transition: "width 0.5s ease" }} title={`Done: ${done}`} />
        )}
        {partialW > 0 && (
          <div style={{ width: `${partialW}%`, background: "var(--cds-warning-surface-default, #D25704)", transition: "width 0.5s ease" }} title={`Partial: ${partial}`} />
        )}
        {missingW > 0 && (
          <div style={{ width: `${missingW}%`, background: "var(--cds-error-surface-subtle, #FEE2E2)", borderRadius: "0 var(--cds-radius-full) var(--cds-radius-full) 0", transition: "width 0.5s ease" }} title={`Missing: ${missing}`} />
        )}
      </div>

      {/* Priority breakdown */}
      <div style={{ display: "flex", gap: "var(--cds-space-16)", marginTop: "var(--cds-space-8)", flexWrap: "wrap" }}>
        {(["P1", "P2", "P3"] as ParityPriority[]).map((p) => {
          const total_p = data.filter((r) => r.priority === p).length
          const done_p = data.filter((r) => r.priority === p && (r.status === "Done" || r.status === "Approved")).length
          const missing_p = total_p - done_p
          return (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
              <PriorityTag priority={p} />
              <span style={{ color: "var(--cds-huegrey-text-dark)", fontWeight: 500 }}>{done_p}/{total_p} done</span>
              {missing_p > 0 && (
                <span style={{ color: "var(--cds-error-text-default, #CC1914)" }}>· {missing_p} missing</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatChip({ count, label, color, bg, border }: { count: number; label: string; color: string; bg: string; border: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 16px", borderRadius: "var(--cds-radius-r)", background: bg, border: `1px solid ${border}`, minWidth: 60 }}>
      <span style={{ fontSize: "var(--cds-text-p1)", fontWeight: 700, color, lineHeight: 1.2 }}>{count}</span>
      <span style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)", marginTop: 1 }}>{label}</span>
    </div>
  )
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function ParityTableRow({ row, isLast }: { row: ParityRow; isLast: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "180px 90px 110px 60px 1fr",
      alignItems: "start",
      gap: "var(--cds-space-12)",
      padding: "var(--cds-space-12) var(--cds-padding-card)",
      borderBottom: isLast ? "none" : "1px solid var(--border)",
      transition: "background 0.1s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--cds-surface-subtle, #FAFAFA)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
    >
      {/* Component name + Figma link */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
          {row.component}
        </span>
        {row.figmaNodeId && (
          <a
            href={`https://www.figma.com/file/...?node-id=${encodeURIComponent(row.figmaNodeId)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "var(--cds-text-p4)", color: "var(--cds-primary-text-default)", textDecoration: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={10} /> {row.figmaNodeId}
          </a>
        )}
      </div>

      {/* Category */}
      <div><CategoryTag category={row.category} /></div>

      {/* Status */}
      <div><StatusPill status={row.status} /></div>

      {/* Priority */}
      <div><PriorityTag priority={row.priority} /></div>

      {/* Notes */}
      <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", lineHeight: "var(--cds-leading-p3)" }}>
        <div style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)", marginBottom: 2 }}>{row.requiredBy}</div>
        <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{row.notes}</div>
      </div>
    </div>
  )
}

// ─── Card View ────────────────────────────────────────────────────────────────

function ParityCard({ row }: { row: ParityRow }) {
  const statusCfg = STATUS_CONFIG[row.status]
  return (
    <div style={{
      padding: "var(--cds-padding-card)",
      borderRadius: "var(--cds-radius-l)",
      border: `1px solid ${statusCfg.border}`,
      background: "var(--cds-white)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--cds-space-8)",
      transition: "box-shadow 0.15s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--cds-gap-small)" }}>
        <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)" }}>
          {row.component}
        </span>
        <StatusPill status={row.status} />
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: "var(--cds-gap-small)", flexWrap: "wrap" }}>
        <CategoryTag category={row.category} />
        <PriorityTag priority={row.priority} />
        {row.figmaNodeId && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "var(--cds-text-p4)", color: "var(--cds-primary-text-default)", padding: "1px 7px", borderRadius: "var(--cds-radius-xs)", background: "var(--cds-primary-surface-subtle, #EEF2FE)" }}>
            <ExternalLink size={9} /> Figma
          </span>
        )}
      </div>

      {/* Required by */}
      <div style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)" }}>
        Used by: {row.requiredBy}
      </div>

      {/* Notes */}
      <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)", lineHeight: "var(--cds-leading-p3)", borderTop: "1px solid var(--border)", paddingTop: "var(--cds-space-8)" }}>
        {row.notes}
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

type ViewMode = "table" | "board"
type FilterStatus = "all" | ParityStatus
type FilterCategory = "all" | ParityCategory

export function ParitySection() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("table")
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all")
  const [filterCategory, setFilterCategory] = React.useState<FilterCategory>("all")
  const [search, setSearch] = React.useState("")

  const filtered = PARITY_DATA.filter((row) => {
    const matchStatus = filterStatus === "all" || row.status === filterStatus
    const matchCategory = filterCategory === "all" || row.category === filterCategory
    const q = search.toLowerCase()
    const matchSearch = !q || row.component.toLowerCase().includes(q) || row.notes.toLowerCase().includes(q) || row.requiredBy.toLowerCase().includes(q)
    return matchStatus && matchCategory && matchSearch
  })

  // Group by status for board view
  const boardColumns: { status: ParityStatus; label: string }[] = [
    { status: "Missing", label: "Missing" },
    { status: "Partial", label: "Partial" },
    { status: "Proposed", label: "Proposed" },
    { status: "Approved", label: "Approved" },
    { status: "Done", label: "Done" },
  ]

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>DS Parity</CardTitle>
            <Badge colour="primary" size="xs" style={{ borderRadius: "var(--cds-radius-full)" }}>
              Component Backlog
            </Badge>
          </div>
          <CardDescription>
            Tracks the gap between what exists in <code>src/components/ui/</code> and what product screens need.
            Source of truth: <code>docs/ds-parity.csv</code> · Follow the Proposed → Approved → Done lifecycle before building any missing component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoverageBar data={PARITY_DATA} />
          <Separator style={{ marginBottom: "var(--cds-space-16)" }} />

          {/* Status lifecycle legend */}
          <div>
            <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--cds-space-8)" }}>
              Status Lifecycle
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-space-8)", flexWrap: "wrap" }}>
              {[
                { status: "Missing" as ParityStatus, note: "Known gap — use placeholder comment" },
                { status: "Proposed" as ParityStatus, note: "Logged in ds-parity.csv, awaiting review" },
                { status: "Approved" as ParityStatus, note: "Designer signed off — safe to build" },
                { status: "Done" as ParityStatus, note: "Built, showcased, changelog updated" },
              ].map((item, i, arr) => (
                <React.Fragment key={item.status}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <StatusPill status={item.status} />
                    <span style={{ fontSize: "var(--cds-text-p4)", color: "var(--cds-huegrey-text-default)", textAlign: "center", maxWidth: 120 }}>{item.note}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: "var(--cds-huegrey-text-default)", fontSize: 18, marginBottom: 14 }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-space-12)", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 180, maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--cds-huegrey-text-default)", pointerEvents: "none" }} />
          <Input
            placeholder="Search components…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 32, height: 36 }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: "flex", gap: "var(--cds-gap-small)", flexWrap: "wrap" }}>
          {(["all", "Done", "Partial", "Missing"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "4px 12px",
                borderRadius: "var(--cds-radius-full)",
                fontSize: "var(--cds-text-p3)",
                fontWeight: 500,
                border: filterStatus === s ? "1.5px solid var(--cds-primary-border-default, #0D4EF2)" : "1px solid var(--border)",
                background: filterStatus === s ? "var(--cds-primary-surface-subtle, #EEF2FE)" : "var(--cds-white)",
                color: filterStatus === s ? "var(--cds-primary-text-default)" : "var(--cds-huegrey-text-default)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
          {(["all", "Atom", "Molecule", "Organism"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              style={{
                padding: "4px 10px",
                borderRadius: "var(--cds-radius-full)",
                fontSize: "var(--cds-text-p3)",
                fontWeight: 500,
                border: filterCategory === c ? "1.5px solid var(--cds-huegrey-border-fairish, #B0B3BB)" : "1px solid var(--border)",
                background: filterCategory === c ? "var(--cds-surface-subtle, #F5F5F5)" : "var(--cds-white)",
                color: filterCategory === c ? "var(--cds-huegrey-text-dark)" : "var(--cds-huegrey-text-default)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ marginLeft: "auto" }}>
          <ContentSwitcher
            items={["Table", "Board"]}
            value={viewMode === "table" ? "Table" : "Board"}
            onValueChange={(v) => setViewMode(v === "Table" ? "table" : "board")}
            size="sm"
          />
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
        Showing {filtered.length} of {PARITY_DATA.length} components
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "180px 90px 110px 60px 1fr",
            gap: "var(--cds-space-12)",
            padding: "var(--cds-space-8) var(--cds-padding-card)",
            background: "var(--cds-surface-subtle, #F5F5F5)",
            borderBottom: "1px solid var(--border)",
            borderRadius: "var(--cds-radius-l) var(--cds-radius-l) 0 0",
          }}>
            {["Component", "Category", "Status", "Priority", "Notes / Required By"].map((h) => (
              <span key={h} style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)" }}>
              {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
              No components match your filters.
            </div>
          ) : (
            filtered.map((row, i) => (
              <ParityTableRow key={row.component} row={row} isLast={i === filtered.length - 1} />
            ))
          )}
        </Card>
      )}

      {/* Board View — grouped by status */}
      {viewMode === "board" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--cds-space-16)" }}>
          {boardColumns.map((col) => {
            const colRows = filtered.filter((r) => r.status === col.status)
            if (colRows.length === 0) return null
            const cfg = STATUS_CONFIG[col.status]
            return (
              <div key={col.status}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-8)" }}>
                  <StatusPill status={col.status} />
                  <span style={{ fontSize: "var(--cds-text-p4)", fontWeight: 700, color: "var(--cds-huegrey-text-default)", background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: "var(--cds-radius-full)", padding: "0 7px", lineHeight: "20px" }}>
                    {colRows.length}
                  </span>
                </div>
                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                  {colRows.map((row) => (
                    <ParityCard key={row.component} row={row} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer legend */}
      <Card>
        <CardContent style={{ paddingTop: "var(--cds-space-16)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--cds-space-16)" }}>
            <div>
              <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-8)" }}>How to propose a new component</div>
              <ol style={{ margin: 0, paddingLeft: "var(--cds-space-16)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", lineHeight: "var(--cds-leading-p2)" }}>
                <li>Add a <code>Proposed</code> row to <code>docs/ds-parity.csv</code></li>
                <li>Use a <code>{`{/* TODO: ds-parity */}`}</code> placeholder in screens — do NOT build yet</li>
                <li>Designer/DS-owner reviews and flips status to <code>Approved</code></li>
                <li>Only then create <code>src/components/ui/&lt;name&gt;.tsx</code> and run the §13 audit checklist</li>
              </ol>
            </div>
            <div>
              <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-8)" }}>Placeholder pattern for Missing components</div>
              <pre style={{ margin: 0, background: "var(--cds-surface-subtle, #F5F5F5)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", fontSize: 11, lineHeight: 1.6, overflowX: "auto" }}>
{`{/* TODO: replace with <Spinner /> once built
     — ds-parity P1 */}`}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: "var(--cds-text-p3)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-8)" }}>Semver bump guide</div>
              <ul style={{ margin: 0, paddingLeft: "var(--cds-space-16)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", lineHeight: "var(--cds-leading-p2)" }}>
                <li><strong>Minor</strong> — new component or variant</li>
                <li><strong>Patch</strong> — bug fix or token correction</li>
                <li><strong>Major</strong> — breaking API change</li>
              </ul>
              <div style={{ marginTop: "var(--cds-space-8)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                After bumping, run: <code>npm run ds:changelog</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
