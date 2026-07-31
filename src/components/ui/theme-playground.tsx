import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Check, Copy, Sun, Moon, Zap, Calendar, Layers } from "lucide-react"

// ─── Preset themes ──────────────────────────────────────────────────────────

interface Preset {
  id: string
  label: string
  primaryColor: string
  primaryColorBold: string
  primaryColorSubtle: string
}

const PRESETS: Preset[] = [
  {
    id: "creator",
    label: "Creator",
    primaryColor: "#0D4EF2",
    primaryColorBold: "#0A3BBF",
    primaryColorSubtle: "#EEF2FF",
  },
  {
    id: "qengine",
    label: "QEngine",
    primaryColor: "#089949",
    primaryColorBold: "#044D24",
    primaryColorSubtle: "#E8F5ED",
  },
  {
    id: "bookings",
    label: "Bookings",
    primaryColor: "#5646A5",
    primaryColorBold: "#2A2260",
    primaryColorSubtle: "#F0EEFF",
  },
]

// ─── Radius options ──────────────────────────────────────────────────────────

const RADIUS_OPTIONS = [
  { label: "Sharp", value: "2px" },
  { label: "Default", value: "6px" },
  { label: "Rounded", value: "10px" },
]

// ─── Density options ─────────────────────────────────────────────────────────

const DENSITY_OPTIONS = [
  { label: "Compact", padding: "10px", gap: "8px" },
  { label: "Default", padding: "16px", gap: "12px" },
  { label: "Spacious", padding: "24px", gap: "16px" },
]

// ─── Font options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { label: "Zoho Puvi", value: "'Zoho Puvi', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "System", value: "system-ui, sans-serif" },
]

// ─── Auto-derive helpers ──────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function deriveVariants(primary: string): { bold: string; subtle: string } {
  try {
    const [h, s] = hexToHsl(primary)
    return {
      bold: hslToHex(h, Math.min(s + 10, 100), 25),
      subtle: hslToHex(h, Math.max(s - 30, 20), 96),
    }
  } catch {
    return { bold: primary, subtle: primary }
  }
}

// ─── Swatch picker ───────────────────────────────────────────────────────────

function ColorSwatch({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-[var(--cds-gap-tight)]", disabled && "opacity-40 pointer-events-none")}>
      <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">{label}</span>
      <label className="flex items-center gap-[var(--cds-gap-small)] cursor-pointer">
        <span
          className="h-7 w-7 rounded-[var(--cds-radius-s)] border border-[var(--border)] shrink-0 overflow-hidden"
          style={{ background: value }}
        >
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-full w-full opacity-0 cursor-pointer"
          />
        </span>
        <span className="text-[length:var(--cds-text-p3)] font-mono text-[color:var(--cds-huegrey-text-dark)]">{value.toUpperCase()}</span>
      </label>
    </div>
  )
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function LivePreview() {
  const [toggleOn, setToggleOn] = useState(true)
  const [switchOn, setSwitchOn] = useState(false)
  const [progress] = useState(65)

  return (
    <div className="flex flex-col gap-[var(--cds-gap-default)]">
      {/* Mini TopBar strip */}
      <div
        className="h-9 rounded-t-[var(--cds-radius-r)] flex items-center gap-[var(--cds-gap-small)] px-[var(--cds-padding-card)]"
        style={{ background: "var(--cds-primary-surface-bold)" }}
      >
        <div className="h-4 w-4 rounded-sm bg-white/30" />
        <span className="text-[length:var(--cds-text-p3)] text-white font-medium flex-1">My App</span>
        <div className="h-5 w-5 rounded-full bg-white/30" />
      </div>

      {/* Content area */}
      <div className="flex gap-[var(--cds-gap-default)] px-[var(--cds-padding-card)]">
        {/* Mini LeftNav */}
        <div
          className="w-28 rounded-[var(--cds-radius-r)] flex flex-col gap-1 p-2 shrink-0"
          style={{ background: "var(--cds-primary-surface-subtle)" }}
        >
          {["Dashboard", "Records", "Reports", "Settings"].map((item, i) => (
            <div
              key={item}
              className={cn(
                "rounded-[var(--cds-radius-s)] px-2 py-1 text-[length:var(--cds-text-p3)]",
                i === 0
                  ? "font-semibold text-[color:var(--cds-primary-text-default)]"
                  : "text-[color:var(--cds-huegrey-text-default)]"
              )}
              style={i === 0 ? { background: "var(--cds-primary-surface-default)", color: "white" } : undefined}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-[var(--cds-gap-default)]">
          {/* Buttons row */}
          <div className="flex gap-[var(--cds-gap-small)] flex-wrap">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
          </div>

          {/* Badges */}
          <div className="flex gap-[var(--cds-gap-tight)] flex-wrap items-center">
            <Badge colour="primary" size="sm">Primary</Badge>
            <Badge colour="primary" variant="subtle" size="sm">Subtle</Badge>
            <Badge colour="success" size="sm">Active</Badge>
            <Badge colour="error" size="sm">Error</Badge>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">Completion</span>
              <span className="text-[length:var(--cds-text-p3)] font-medium text-[color:var(--cds-primary-text-default)]">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Input */}
          <Input placeholder="Search records…" className="h-7 text-xs" />

          {/* Toggle + Switch row */}
          <div className="flex items-center gap-[var(--cds-gap-default)]">
            <Toggle
              checked={toggleOn}
              onCheckedChange={setToggleOn}
              size="sm"
              color="primary"
            />
            <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">
              Toggle {toggleOn ? "ON" : "OFF"}
            </span>
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">
              Switch {switchOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Snippet generator ────────────────────────────────────────────────────────

function buildSnippet(
  primaryColor: string,
  primaryColorBold: string,
  primaryColorSubtle: string,
  autoDerive: boolean,
  font: string,
  radius: string,
  density: { label: string; padding: string; gap: string },
  mode: "light" | "dark",
): string {
  const lines: string[] = [`<ThemeProvider`]
  lines.push(`  primaryColor="${primaryColor}"`)
  if (!autoDerive) {
    lines.push(`  primaryColorBold="${primaryColorBold}"`)
    lines.push(`  primaryColorSubtle="${primaryColorSubtle}"`)
  }
  if (font !== "'Zoho Puvi', sans-serif") lines.push(`  font="${font}"`)
  if (mode !== "light") lines.push(`  mode="dark"`)

  const tokenOverrides: Record<string, string> = {}
  if (radius !== "6px") tokenOverrides["--cds-radius-r"] = radius
  if (density.label !== "Default") {
    tokenOverrides["--cds-padding-card"] = density.padding
    tokenOverrides["--cds-gap-default"] = density.gap
  }
  if (Object.keys(tokenOverrides).length > 0) {
    const entries = Object.entries(tokenOverrides)
      .map(([k, v]) => `    "${k}": "${v}"`)
      .join(",\n")
    lines.push(`  tokens={{\n${entries}\n  }}`)
  }

  lines.push(`>`)
  lines.push(`  <App />`)
  lines.push(`</ThemeProvider>`)
  return lines.join("\n")
}

// ─── ThemePlayground (exported) ───────────────────────────────────────────────

export function ThemePlayground() {
  const [activePreset, setActivePreset] = useState<string>("creator")
  const [primaryColor, setPrimaryColor] = useState(PRESETS[0].primaryColor)
  const [primaryColorBold, setPrimaryColorBold] = useState(PRESETS[0].primaryColorBold)
  const [primaryColorSubtle, setPrimaryColorSubtle] = useState(PRESETS[0].primaryColorSubtle)
  const [autoDerive, setAutoDerive] = useState(false)
  const [radius, setRadius] = useState("6px")
  const [densityLabel, setDensityLabel] = useState("Default")
  const [fontValue, setFontValue] = useState("'Zoho Puvi', sans-serif")
  const [mode, setMode] = useState<"light" | "dark">("light")
  const [copied, setCopied] = useState(false)

  const density = DENSITY_OPTIONS.find(d => d.label === densityLabel)!

  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.id)
    setPrimaryColor(preset.primaryColor)
    if (!autoDerive) {
      setPrimaryColorBold(preset.primaryColorBold)
      setPrimaryColorSubtle(preset.primaryColorSubtle)
    }
  }, [autoDerive])

  const handlePrimaryChange = (val: string) => {
    setPrimaryColor(val)
    setActivePreset("custom")
    if (autoDerive) {
      const { bold, subtle } = deriveVariants(val)
      setPrimaryColorBold(bold)
      setPrimaryColorSubtle(subtle)
    }
  }

  const handleAutoDeriveToggle = (checked: boolean) => {
    setAutoDerive(checked)
    if (checked) {
      const { bold, subtle } = deriveVariants(primaryColor)
      setPrimaryColorBold(bold)
      setPrimaryColorSubtle(subtle)
    }
  }

  // Build token overrides for live preview
  const extraTokens: Record<string, string> = {}
  if (radius !== "6px") extraTokens["--cds-radius-r"] = radius
  if (density.label !== "Default") {
    extraTokens["--cds-padding-card"] = density.padding
    extraTokens["--cds-gap-default"] = density.gap
  }

  const snippet = buildSnippet(
    primaryColor, primaryColorBold, primaryColorSubtle,
    autoDerive, fontValue, radius, density, mode
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-[var(--cds-gap-default)] lg:flex-row lg:gap-[var(--cds-space-24)]">

      {/* ── Controls panel ── */}
      <div className="flex flex-col gap-[var(--cds-gap-default)] lg:w-72 shrink-0">

        {/* Presets */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Presets</span>
          <div className="flex gap-[var(--cds-gap-small)]">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={cn(
                  "flex items-center gap-[var(--cds-gap-tight)] rounded-[var(--cds-radius-r)] border px-3 py-1.5 text-[length:var(--cds-text-p3)] font-medium transition-colors",
                  activePreset === p.id
                    ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                    : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: p.primaryColor }}
                />
                {p.id === "creator" && <Layers size={11} />}
                {p.id === "qengine" && <Zap size={11} />}
                {p.id === "bookings" && <Calendar size={11} />}
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setActivePreset("custom")}
              className={cn(
                "rounded-[var(--cds-radius-r)] border px-3 py-1.5 text-[length:var(--cds-text-p3)] font-medium transition-colors",
                activePreset === "custom"
                  ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                  : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
              )}
            >
              Custom
            </button>
          </div>
        </div>

        <Separator />

        {/* Brand Colors */}
        <div className="flex flex-col gap-[var(--cds-gap-small)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Brand Colors</span>
          <ColorSwatch label="Primary" value={primaryColor} onChange={handlePrimaryChange} />
          <ColorSwatch label="Bold (TopBar)" value={primaryColorBold} onChange={v => { setPrimaryColorBold(v); setAutoDerive(false) }} disabled={autoDerive} />
          <ColorSwatch label="Subtle (LeftNav)" value={primaryColorSubtle} onChange={v => { setPrimaryColorSubtle(v); setAutoDerive(false) }} disabled={autoDerive} />
          <label className="flex items-center gap-[var(--cds-gap-small)] cursor-pointer mt-1">
            <Switch checked={autoDerive} onCheckedChange={handleAutoDeriveToggle} />
            <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">Auto-derive bold & subtle</span>
          </label>
        </div>

        <Separator />

        {/* Shape */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Corner Radius</span>
          <div className="flex gap-[var(--cds-gap-tight)]">
            {RADIUS_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setRadius(opt.value)}
                className={cn(
                  "flex-1 border py-1 text-[length:var(--cds-text-p3)] transition-colors",
                  radius === opt.value
                    ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                    : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]",
                )}
                style={{ borderRadius: opt.value }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Density */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Density</span>
          <div className="flex gap-[var(--cds-gap-tight)]">
            {DENSITY_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setDensityLabel(opt.label)}
                className={cn(
                  "flex-1 rounded-[var(--cds-radius-r)] border py-1 text-[length:var(--cds-text-p3)] transition-colors",
                  densityLabel === opt.label
                    ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                    : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Font Family</span>
          <div className="flex flex-col gap-1">
            {FONT_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setFontValue(opt.value)}
                className={cn(
                  "rounded-[var(--cds-radius-r)] border px-3 py-1.5 text-left text-[length:var(--cds-text-p3)] transition-colors",
                  fontValue === opt.value
                    ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                    : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
                )}
                style={{ fontFamily: opt.value }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Mode */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Mode</span>
          <div className="flex gap-[var(--cds-gap-tight)]">
            <button
              onClick={() => setMode("light")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--cds-radius-r)] border py-1.5 text-[length:var(--cds-text-p3)] transition-colors",
                mode === "light"
                  ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                  : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
              )}
            >
              <Sun size={12} /> Light
            </button>
            <button
              onClick={() => setMode("dark")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--cds-radius-r)] border py-1.5 text-[length:var(--cds-text-p3)] transition-colors",
                mode === "dark"
                  ? "border-[var(--cds-primary-border-default)] bg-[var(--cds-primary-surface-subtle)] text-[color:var(--cds-primary-text-default)]"
                  : "border-[var(--border)] text-[color:var(--cds-huegrey-text-dark)] hover:border-[var(--cds-primary-border-default)]"
              )}
            >
              <Moon size={12} /> Dark
            </button>
          </div>
        </div>
      </div>

      {/* ── Right side: Live preview + Snippet ── */}
      <div className="flex flex-1 flex-col gap-[var(--cds-gap-default)]">

        {/* Live preview */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <div className="flex items-center justify-between">
            <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Live Preview</span>
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border border-[var(--border)]"
                style={{ background: primaryColor }}
              />
              <span
                className="h-3 w-3 rounded-full border border-[var(--border)]"
                style={{ background: primaryColorBold }}
              />
              <span
                className="h-3 w-3 rounded-full border border-[var(--border)]"
                style={{ background: primaryColorSubtle }}
              />
            </div>
          </div>
          <ThemeProvider
            primaryColor={primaryColor}
            primaryColorBold={primaryColorBold}
            primaryColorSubtle={primaryColorSubtle}
            font={fontValue}
            mode={mode}
            tokens={Object.keys(extraTokens).length > 0 ? extraTokens : undefined}
            className={cn(
              "rounded-[var(--cds-radius-l)] border border-[var(--border)] p-[var(--cds-padding-card)] overflow-hidden",
              mode === "dark" && "bg-[#1A1B1E]"
            )}
          >
            <LivePreview />
          </ThemeProvider>
        </div>

        {/* Generated snippet */}
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <div className="flex items-center justify-between">
            <span className="text-[length:var(--cds-text-p3)] font-semibold uppercase tracking-wide text-[color:var(--cds-huegrey-text-default)]">Generated Snippet</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-1.5 h-7 text-xs"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className={cn(
            "rounded-[var(--cds-radius-r)] border border-[var(--border)] p-[var(--cds-padding-card)]",
            "bg-[var(--cds-huegrey-surface-subtle)] text-[length:var(--cds-text-p3)]",
            "text-[color:var(--cds-huegrey-text-dark)] overflow-x-auto whitespace-pre leading-relaxed font-mono"
          )}>
            {snippet}
          </pre>
        </div>
      </div>
    </div>
  )
}
