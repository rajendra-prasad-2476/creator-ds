/**
 * SlidesApp.tsx
 *
 * Presentation deck: "PRD → DS-Compliant Screen Generation"
 * Use keyboard ← → or on-screen arrows to navigate slides.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Server,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  Code2,
  Cpu,
  FileText,
  MonitorPlay,
  Shield,
  Zap,
  AlertTriangle,
  CircleCheck,
} from "lucide-react"

// ─── Slide animation keyframes (injected once) ───────────────────────────────
const SLIDE_ANIM_CSS = `
@keyframes cds-slide-in {
  from { opacity: 0; transform: translateY(10px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
.cds-slide-in { animation: cds-slide-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
`

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDE_COUNT = 6

const ACCENT_COLOR: Record<string, string> = {
  blue:   "var(--cds-primary-surface-default)",
  green:  "var(--cds-success-surface-default)",
  yellow: "var(--cds-warning-surface-default)",
  purple: "#7C3AED",
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function SlideShell({
  children,
  accent = "blue",
}: {
  children: React.ReactNode
  accent?: "blue" | "green" | "yellow" | "red" | "purple"
}) {
  const accentMap = {
    blue: "var(--cds-primary-surface-default)",
    green: "var(--cds-success-surface-default)",
    yellow: "var(--cds-warning-surface-default)",
    red: "var(--cds-error-surface-default)",
    purple: "#7C3AED",
  }
  const a = accentMap[accent]
  // per-slide mesh blobs
  const meshStyle: React.CSSProperties = {
    backgroundImage: [
      `radial-gradient(ellipse 55% 45% at 10% 15%, color-mix(in srgb, ${a} 14%, transparent) 0%, transparent 70%)`,
      `radial-gradient(ellipse 40% 50% at 90% 85%, color-mix(in srgb, ${a} 10%, transparent) 0%, transparent 65%)`,
      `radial-gradient(ellipse 30% 30% at 80% 10%, color-mix(in srgb, ${a} 8%, transparent) 0%, transparent 60%)`,
    ].join(", "),
  }
  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden" style={meshStyle}>
      {/* gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${a} 0%, color-mix(in srgb, ${a} 60%, #fff) 60%, transparent 100%)` }}
      />
      <div className="flex flex-col flex-1 p-[var(--cds-padding-section-h)] pt-8 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

function SlideTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] font-semibold tracking-widest uppercase mb-4"
      style={{ color: "var(--cds-huegrey-text-default)" }}
    >
      {children}
    </span>
  )
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-[length:var(--cds-text-h1)] leading-[var(--cds-leading-h1)] font-bold mb-2"
      style={{ color: "var(--cds-huegrey-text-dark)" }}
    >
      {children}
    </h1>
  )
}

function SlideSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] mb-8"
      style={{ color: "var(--cds-huegrey-text-default)" }}
    >
      {children}
    </p>
  )
}

function StatPill({
  value,
  label,
  color = "blue",
}: {
  value: string
  label: string
  color?: "blue" | "green" | "yellow" | "purple"
}) {
  const bgMap = {
    blue: "var(--cds-primary-surface-subtle, #EEF3FE)",
    green: "var(--cds-success-surface-subtle, #E8F5EE)",
    yellow: "var(--cds-warning-surface-subtle, #FEF3E8)",
    purple: "#F3F0FF",
  }
  const textMap = {
    blue: "var(--cds-primary-text-default)",
    green: "var(--cds-success-surface-default)",
    yellow: "var(--cds-warning-surface-default)",
    purple: "#7C3AED",
  }
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[var(--cds-radius-l)] p-[var(--cds-padding-card)]"
      style={{ background: bgMap[color] }}
    >
      <span
        className="text-[length:var(--cds-text-h2)] leading-[var(--cds-leading-h2)] font-bold"
        style={{ color: textMap[color] }}
      >
        {value}
      </span>
      <span
        className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] text-center mt-1"
        style={{ color: "var(--cds-huegrey-text-default)" }}
      >
        {label}
      </span>
    </div>
  )
}

function RuleRow({
  icon: Icon,
  rule,
  description,
  bad,
  good,
}: {
  icon: React.ElementType
  rule: string
  description: string
  bad: string
  good: string
}) {
  return (
    <div
      className="flex flex-col gap-[var(--cds-gap-small)] p-[var(--cds-padding-card)] rounded-[var(--cds-radius-r)] border"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-[var(--cds-gap-small)]">
        <Icon size={15} style={{ color: "var(--cds-primary-text-default)" }} />
        <span
          className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
          style={{ color: "var(--cds-huegrey-text-dark)" }}
        >
          {rule}
        </span>
        <span
          className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
          style={{ color: "var(--cds-huegrey-text-default)" }}
        >
          — {description}
        </span>
      </div>
      <div className="flex gap-[var(--cds-gap-default)]">
        <div
          className="flex-1 rounded-[var(--cds-radius-s)] px-3 py-2 text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] font-mono"
          style={{
            background: "var(--cds-error-surface-subtle, #FEF0EF)",
            color: "var(--cds-error-surface-default)",
          }}
        >
          ✕ {bad}
        </div>
        <div
          className="flex-1 rounded-[var(--cds-radius-s)] px-3 py-2 text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] font-mono"
          style={{
            background: "var(--cds-success-surface-subtle, #E8F5EE)",
            color: "var(--cds-success-surface-default)",
          }}
        >
          ✓ {good}
        </div>
      </div>
    </div>
  )
}

function FlowStep({
  number,
  title,
  points,
  isLast = false,
}: {
  number: number
  title: string
  points: string[]
  isLast?: boolean
}) {
  return (
    <div className="flex gap-[var(--cds-gap-default)]">
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-[length:var(--cds-text-p3)] font-bold shrink-0"
          style={{ background: "var(--cds-primary-surface-default)" }}
        >
          {number}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ background: "var(--border)" }}
          />
        )}
      </div>
      <div className={cn("pb-4", isLast && "pb-0")}>
        <p
          className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] mb-1"
          style={{ color: "var(--cds-huegrey-text-dark)" }}
        >
          {title}
        </p>
        <ul className="list-none space-y-0.5">
          {points.map((pt, i) => (
            <li
              key={i}
              className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
              style={{ color: "var(--cds-huegrey-text-default)" }}
            >
              └ {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Individual slides ────────────────────────────────────────────────────────

function Slide1() {
  return (
    <SlideShell accent="blue">
      <SlideTag>Creator DS · AI Screen Generation System</SlideTag>
      <SlideTitle>A design system that teaches AI how to build Creator screens</SlideTitle>
      <SlideSubtitle>
        From PRD to production-ready, DS-compliant screen — without a single hardcoded colour.
      </SlideSubtitle>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Before */}
        <div
          className="rounded-[var(--cds-radius-l)] border p-[var(--cds-padding-card)]"
          style={{ borderColor: "var(--cds-error-surface-default)", background: "var(--cds-error-surface-subtle, #FEF0EF)" }}
        >
          <div className="flex items-center gap-[var(--cds-gap-small)] mb-3">
            <AlertTriangle size={16} style={{ color: "var(--cds-error-surface-default)" }} />
            <span
              className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
              style={{ color: "var(--cds-error-surface-default)" }}
            >
              Before — AI without context
            </span>
          </div>
          <ul className="space-y-1.5">
            {[
              "Raw <div>, <button>, <input> — no DS components",
              "Hardcoded #0D4EF2, #CC1914 everywhere",
              "Wrong fonts — Inter, system-ui, Roboto",
              "No TopBar · No LeftNav · No page shell",
              "Every screen looks completely different",
            ].map((item, i) => (
              <li
                key={i}
                className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
                style={{ color: "var(--cds-error-surface-default)" }}
              >
                ✕ {item}
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div
          className="rounded-[var(--cds-radius-l)] border p-[var(--cds-padding-card)]"
          style={{ borderColor: "var(--cds-success-surface-default)", background: "var(--cds-success-surface-subtle, #E8F5EE)" }}
        >
          <div className="flex items-center gap-[var(--cds-gap-small)] mb-3">
            <CircleCheck size={16} style={{ color: "var(--cds-success-surface-default)" }} />
            <span
              className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
              style={{ color: "var(--cds-success-surface-default)" }}
            >
              After — AI with Creator DS context
            </span>
          </div>
          <ul className="space-y-1.5">
            {[
              "42 DS components — Button, Card, Table, Sheet…",
              "var(--cds-*) tokens — zero hardcoded values",
              "Zoho Puvi — the only permitted font",
              "TopBar + LeftNav on every full-page screen",
              "Consistent, reviewable, production-ready",
            ].map((item, i) => (
              <li
                key={i}
                className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
                style={{ color: "var(--cds-success-surface-default)" }}
              >
                ✓ {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatPill value="42" label="DS components" color="blue" />
        <StatPill value="6" label="Page templates" color="green" />
        <StatPill value="400+" label="Design tokens" color="yellow" />
        <StatPill value="7" label="MCP tools" color="purple" />
      </div>
    </SlideShell>
  )
}

function Slide2() {
  const layers = [
    {
      icon: Layers,
      color: "blue" as const,
      title: "Layer 1 — React Component Library",
      subtitle: "creator-ds-react · src/components/ui/",
      items: [
        "42 components across Atoms · Molecules · Organisms",
        "6 page templates — CardGrid, TabbedSections, SplitPanel, LinkCategory, BreadcrumbDetail, Billing",
        "400+ --cds-* design tokens for colour, spacing, radius, typography",
        "Storybook-style showcase at localhost:5173 (DS Docs tab)",
      ],
    },
    {
      icon: Server,
      color: "green" as const,
      title: "Layer 2 — MCP Server",
      subtitle: "mcp/src/server.ts · Model Context Protocol",
      items: [
        "list_components — all 42 components with import paths",
        "get_component — full props, variants, anti-patterns for one component",
        "find_tokens — search --cds-* tokens by keyword or group",
        "validate_component_usage — static lint before commit",
        "creator_coding_guidelines — AGENTS.md rules as structured data",
      ],
    },
    {
      icon: LayoutGrid,
      color: "yellow" as const,
      title: "Layer 3 — Feature Registry + Screen Navigation",
      subtitle: "src/screens/feature-registry.tsx",
      items: [
        "Every generated screen registered with a unique ID",
        "Feature Dashboard at /features.html — live preview of all screens",
        "useNavigation() — lightweight navigation context (no href, no window.location)",
        "4 features · 20+ screens currently live",
      ],
    },
  ]

  const colorMap = {
    blue: { bg: "var(--cds-primary-surface-subtle, #EEF3FE)", icon: "var(--cds-primary-text-default)" },
    green: { bg: "var(--cds-success-surface-subtle, #E8F5EE)", icon: "var(--cds-success-surface-default)" },
    yellow: { bg: "var(--cds-warning-surface-subtle, #FEF3E8)", icon: "var(--cds-warning-surface-default)" },
  }

  return (
    <SlideShell accent="blue">
      <SlideTag>System Architecture</SlideTag>
      <SlideTitle>Three layers — Library · MCP Server · Feature Registry</SlideTitle>
      <SlideSubtitle>
        Each layer teaches AI tools a different aspect of how Creator screens are built.
      </SlideSubtitle>

      <div className="flex flex-col gap-4">
        {layers.map((layer) => {
          const Icon = layer.icon
          const colors = colorMap[layer.color]
          return (
            <div
              key={layer.title}
              className="rounded-[var(--cds-radius-l)] border p-[var(--cds-padding-card)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-start gap-[var(--cds-gap-default)]">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-[var(--cds-radius-r)] shrink-0"
                  style={{ background: colors.bg }}
                >
                  <Icon size={18} style={{ color: colors.icon }} />
                </div>
                <div className="flex-1">
                  <p
                    className="font-semibold text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]"
                    style={{ color: "var(--cds-huegrey-text-dark)" }}
                  >
                    {layer.title}
                  </p>
                  <p
                    className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] mb-2 font-mono"
                    style={{ color: "var(--cds-huegrey-text-default)" }}
                  >
                    {layer.subtitle}
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {layer.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1 text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
                        style={{ color: "var(--cds-huegrey-text-default)" }}
                      >
                        <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: colors.icon }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SlideShell>
  )
}

function Slide3() {
  return (
    <SlideShell accent="green">
      <SlideTag>End-to-End Workflow</SlideTag>
      <SlideTitle>PRD → DS-Compliant Screen in 6 steps</SlideTitle>
      <SlideSubtitle>
        Any AI tool connected to the MCP server follows this pipeline automatically.
      </SlideSubtitle>

      <div className="flex flex-col gap-0">
        <FlowStep
          number={1}
          title="PM writes a structured PRD"
          points={[
            "docs/prd-template.md — standardised markdown template",
            "Includes: objective, functional requirements, screen inventory, DS component hints",
          ]}
        />
        <FlowStep
          number={2}
          title="Creator Parity Check (AGENTS.md §0)"
          points={[
            "Agent queries http://zcem-u24-vm37:8001/api/ask for each feature area",
            "Identifies gaps vs existing Creator behaviour — avoids reimplementing what already exists",
          ]}
        />
        <FlowStep
          number={3}
          title="AI calls MCP server tools"
          points={[
            "list_components → knows all 42 components before writing a line",
            "list_templates → picks the right page template from 6 options",
            "find_tokens → correct --cds-* token for every colour & spacing value",
            "creator_coding_guidelines → enforces hard rules (shell, font, no raw HTML)",
          ]}
        />
        <FlowStep
          number={4}
          title="AI generates screen file"
          points={[
            "Saved to src/screens/<feature-slug>/<ScreenName>.tsx",
            "DS components only · Zoho Puvi · --cds-* tokens · TopBar + LeftNav shell",
            "useNavigation() for all screen transitions — no href, no window.location",
          ]}
        />
        <FlowStep
          number={5}
          title="Screen registered + validated"
          points={[
            "Added to src/screens/feature-registry.tsx — immediately previewable",
            "MCP validate_component_usage → static lint before commit",
            "Ghost token guard: grep for undefined --cds-space-* tokens",
          ]}
        />
        <FlowStep
          number={6}
          title="✅ Approved → promoted to creator-features"
          points={[
            "Designer + PM review via Feature Dashboard live preview (/features.html)",
            "GitHub Actions auto-syncs component library on every merge to main",
          ]}
          isLast
        />
      </div>
    </SlideShell>
  )
}

function Slide4() {
  const rules = [
    {
      icon: Code2,
      rule: "Components only",
      description: "use @/components/ui/ — never raw HTML",
      bad: "<div className='flex…'>",
      good: "<Card><CardContent>",
    },
    {
      icon: Cpu,
      rule: "Font",
      description: "Zoho Puvi only — never Inter or system-ui",
      bad: "fontFamily: 'Inter'",
      good: "--cds-font-family-default (global)",
    },
    {
      icon: Shield,
      rule: "Colours",
      description: "var(--cds-*) tokens — never hex or rgb()",
      bad: "color: '#0D4EF2'",
      good: "var(--cds-primary-text-default)",
    },
    {
      icon: Layers,
      rule: "Layout",
      description: "className with Tailwind — never style={{}}",
      bad: "style={{ display: 'flex', gap: '8px' }}",
      good: "className='flex gap-[var(--cds-gap-small)]'",
    },
    {
      icon: Zap,
      rule: "Spacing",
      description: "only valid --cds-space-* tokens (0–80px set)",
      bad: "--cds-space-10, --cds-space-14 (ghost tokens)",
      good: "--cds-space-8 or --cds-space-12",
    },
    {
      icon: FileText,
      rule: "Page shell",
      description: "TopBar + LeftNav always present on full-page screens",
      bad: "<main> with no global nav",
      good: "<div> > <TopBar/> + <LeftNav/> + <main>",
    },
  ]

  return (
    <SlideShell accent="yellow">
      <SlideTag>AGENTS.md — Hard Constraints</SlideTag>
      <SlideTitle>Non-negotiable rules enforced on every generated screen</SlideTitle>
      <SlideSubtitle>
        Violating any of these rules produces output that must be rejected. The MCP validator catches them automatically.
      </SlideSubtitle>

      <div className="grid grid-cols-2 gap-3">
        {rules.map((r) => (
          <RuleRow key={r.rule} {...r} />
        ))}
      </div>
    </SlideShell>
  )
}

function Slide5() {
  const features = [
    {
      name: "Demo Users in Environments",
      prd: "#001",
      screens: 5,
      status: "approved",
      screenList: ["Org Pool", "App Assignment", "View As", "Environments", "Environment Settings"],
    },
    {
      name: "Mobile App Deployment",
      prd: "#002",
      screens: 8,
      status: "approved",
      screenList: ["App List", "Credentials", "Channel Wizard", "Play Store", "Firebase", "In Progress", "History", "Setup Guide"],
    },
    {
      name: "Portal Security",
      prd: "#003",
      screens: 5,
      status: "in-review",
      screenList: ["Landing", "Password Policy", "MFA", "Allowed IPs", "Advanced Settings"],
    },
    {
      name: "Zia Configuration",
      prd: "#004",
      screens: 3,
      status: "draft",
      screenList: ["Operations", "Zia Settings", "Provider Detail"],
    },
  ]

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: "var(--cds-success-surface-subtle, #E8F5EE)", text: "var(--cds-success-surface-default)", label: "Approved" },
    "in-review": { bg: "var(--cds-warning-surface-subtle, #FEF3E8)", text: "var(--cds-warning-surface-default)", label: "In Review" },
    draft: { bg: "var(--cds-primary-surface-subtle, #EEF3FE)", text: "var(--cds-primary-text-default)", label: "Draft" },
  }

  return (
    <SlideShell accent="purple">
      <SlideTag>Feature Registry</SlideTag>
      <SlideTitle>4 features · 21 screens — live and previewable</SlideTitle>
      <SlideSubtitle>
        Every screen is registered, versioned, and reviewable in the Feature Dashboard at <span className="font-mono">/features.html</span>.
      </SlideSubtitle>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {features.map((f) => {
          const s = statusColors[f.status]
          return (
            <div
              key={f.name}
              className="rounded-[var(--cds-radius-l)] border p-[var(--cds-padding-card)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
                  style={{ color: "var(--cds-huegrey-text-dark)" }}
                >
                  {f.name}
                </span>
                <span
                  className="text-[length:var(--cds-text-p4)] leading-[var(--cds-leading-p4)] px-2 py-0.5 rounded-[var(--cds-radius-full)] font-medium"
                  style={{ background: s.bg, color: s.text }}
                >
                  {s.label}
                </span>
              </div>
              <p
                className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] mb-3"
                style={{ color: "var(--cds-huegrey-text-default)" }}
              >
                PRD {f.prd} · {f.screens} screens
              </p>
              <div className="flex flex-wrap gap-1">
                {f.screenList.map((scr) => (
                  <span
                    key={scr}
                    className="text-[length:var(--cds-text-p4)] leading-[var(--cds-leading-p4)] px-2 py-0.5 rounded-[var(--cds-radius-s)] border"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--cds-huegrey-text-default)",
                      background: "var(--cds-surface-subtle, #F5F5F5)",
                    }}
                  >
                    {scr}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-[var(--cds-radius-r)] border p-3 flex items-center gap-3"
        style={{ borderColor: "var(--border)", background: "var(--cds-surface-subtle, #F5F5F5)" }}
      >
        <MonitorPlay size={18} style={{ color: "var(--cds-primary-text-default)" }} />
        <span
          className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
          style={{ color: "var(--cds-huegrey-text-default)" }}
        >
          Live preview available at{" "}
          <span className="font-mono" style={{ color: "var(--cds-primary-text-default)" }}>
            localhost:5173/features.html
          </span>{" "}
          — click any screen to navigate through the full flow with working navigation.
        </span>
      </div>
    </SlideShell>
  )
}

function Slide6() {
  return (
    <SlideShell accent="blue">
      <SlideTag>Summary</SlideTag>
      <SlideTitle>What the system guarantees — every time</SlideTitle>
      <SlideSubtitle>
        One MCP server connection transforms any AI coding tool into a DS-aware Creator screen generator.
      </SlideSubtitle>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: CheckCircle2,
            color: "var(--cds-success-surface-default)",
            title: "Consistency",
            desc: "Every screen uses the same 42 components, the same Zoho Puvi font, and the same --cds-* tokens. No drift.",
          },
          {
            icon: Zap,
            color: "var(--cds-primary-text-default)",
            title: "Speed",
            desc: "AI generates a complete, navigable, live-previewable screen from a PRD in minutes — not days.",
          },
          {
            icon: Shield,
            color: "var(--cds-warning-surface-default)",
            title: "Compliance",
            desc: "AGENTS.md hard rules + MCP validate_component_usage catch violations before code is committed.",
          },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-[var(--cds-gap-default)] p-[var(--cds-padding-card)] rounded-[var(--cds-radius-l)] border"
            style={{ borderColor: "var(--border)" }}
          >
            <Icon size={24} style={{ color }} />
            <p
              className="font-semibold text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]"
              style={{ color: "var(--cds-huegrey-text-dark)" }}
            >
              {title}
            </p>
            <p
              className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
              style={{ color: "var(--cds-huegrey-text-default)" }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col gap-3">
        <p
          className="font-semibold text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
          style={{ color: "var(--cds-huegrey-text-dark)" }}
        >
          Run the MCP server:
        </p>
        <div
          className="rounded-[var(--cds-radius-r)] p-3 font-mono text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
          style={{ background: "#1E1E2E", color: "#CDD6F4" }}
        >
          <span style={{ color: "#89DCEB" }}>cd</span>{" "}
          <span style={{ color: "#A6E3A1" }}>mcp</span>{" "}
          <span style={{ color: "#CDD6F4" }}>&amp;&amp;</span>{" "}
          <span style={{ color: "#89DCEB" }}>npm run build</span>{" "}
          <span style={{ color: "#CDD6F4" }}>&amp;&amp;</span>{" "}
          <span style={{ color: "#89DCEB" }}>node</span>{" "}
          <span style={{ color: "#A6E3A1" }}>dist/server.js</span>
          <br />
          <span style={{ color: "#6C7086" }}># or for development:</span>
          <br />
          <span style={{ color: "#89DCEB" }}>npx tsx</span>{" "}
          <span style={{ color: "#A6E3A1" }}>mcp/src/server.ts</span>
        </div>
        <p
          className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
          style={{ color: "var(--cds-huegrey-text-default)" }}
        >
          Connect any MCP-compatible AI tool (Cursor · Copilot · Claude · Sahaa) and it instantly becomes
          a DS-aware Creator screen generator with access to all 42 components, 6 templates, and 400+ tokens.
        </p>
      </div>
    </SlideShell>
  )
}

const SLIDES = [
  { label: "Overview", component: Slide1 },
  { label: "3 Layers", component: Slide2 },
  { label: "Workflow", component: Slide3 },
  { label: "Hard Rules", component: Slide4 },
  { label: "Live Screens", component: Slide5 },
  { label: "Summary", component: Slide6 },
]

// ─── Main app ─────────────────────────────────────────────────────────────────

export function SlidesApp() {
  const [current, setCurrent] = useState(0)
  // inject animation keyframes once
  useEffect(() => {
    if (!document.getElementById("cds-slide-anim")) {
      const s = document.createElement("style")
      s.id = "cds-slide-anim"
      s.textContent = SLIDE_ANIM_CSS
      document.head.appendChild(s)
    }
  }, [])

  const go = useCallback(
    (dir: -1 | 1) => {
      setCurrent((c) => Math.max(0, Math.min(SLIDE_COUNT - 1, c + dir)))
    },
    []
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1)
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  const SlideComponent = SLIDES[current].component
  const slideAccents = ["blue", "blue", "green", "yellow", "purple", "blue"] as const
  const currentAccent = slideAccents[current]
  const shadowColor = ACCENT_COLOR[currentAccent] ?? ACCENT_COLOR.blue

  return (
    <div
      className="cds-mesh-bg flex flex-col h-screen overflow-hidden"
      style={{
        fontFamily: "'Zoho Puvi', sans-serif",
      }}
    >
      {/* Header nav — glassmorphism */}
      <header
        className="flex items-center justify-between px-[var(--cds-padding-section-h)] border-b"
        style={{
          height: 52,
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-[var(--cds-gap-default)]">
          <a
            href="/"
            className="flex items-center gap-[var(--cds-gap-small)] hover:opacity-80 transition-opacity"
            title="DS Component Docs"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="var(--cds-primary-surface-default)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="font-bold text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)]"
              style={{ color: "var(--cds-huegrey-text-dark)" }}
            >
              Creator DS
            </span>
          </a>
          <Separator orientation="vertical" className="h-4" />
          <span
            className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]"
            style={{ color: "var(--cds-huegrey-text-default)" }}
          >
            PRD → Screen Generation
          </span>
        </div>

        {/* Slide pills */}
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)] px-3 py-1 rounded-[var(--cds-radius-full)] transition-colors",
                i === current
                  ? "font-semibold"
                  : "hover:opacity-70"
              )}
              style={
                i === current
                  ? {
                      background: "var(--cds-primary-surface-default)",
                      color: "var(--cds-white)",
                    }
                  : {
                      background: "var(--cds-surface-subtle, #F5F5F5)",
                      color: "var(--cds-huegrey-text-default)",
                    }
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        <span
          className="text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
          style={{ color: "var(--cds-huegrey-text-default)" }}
        >
          {current + 1} / {SLIDE_COUNT}
        </span>
      </header>

      {/* Slide area */}
      <main className="flex-1 flex flex-col mx-auto w-full max-w-5xl px-8 py-6 min-h-0">
        <div
          key={current}
          className="cds-slide-in flex-1 rounded-[var(--cds-radius-l)] border overflow-hidden"
          style={{
            borderColor: "var(--border)",
            background: "var(--cds-white)",
            boxShadow: `0 8px 48px color-mix(in srgb, ${shadowColor} 16%, transparent), 0 2px 8px color-mix(in srgb, var(--cds-huegrey-text-dark) 5%, transparent)`,
          }}
        >
          <SlideComponent />
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => go(-1)}
            disabled={current === 0}
            className="gap-1"
          >
            <ChevronLeft size={14} /> Previous
          </Button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? 20 : 8,
                  height: 8,
                  background:
                    i === current
                      ? "var(--cds-primary-surface-default)"
                      : "var(--border)",
                }}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => go(1)}
            disabled={current === SLIDE_COUNT - 1}
            className="gap-1"
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      </main>
    </div>
  )
}
