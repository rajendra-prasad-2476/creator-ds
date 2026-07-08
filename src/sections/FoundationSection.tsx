import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function FoundationSection() {
  return (
    <div className="space-y-8">
      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Semantic color tokens from the CDS Design System (Creator theme).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Primary</p>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[
                { label: "Subtle", color: "var(--cds-primary-surface-subtle)" },
                { label: "Low", color: "var(--cds-primary-surface-low)" },
                { label: "Minimal", color: "var(--cds-primary-surface-minimal)" },
                { label: "Default", color: "var(--cds-primary-surface-default)" },
                { label: "Bold", color: "var(--cds-primary-surface-bold)" },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="h-10 rounded-[var(--cds-radius-s)]" style={{ backgroundColor: c.color }} />
                  <p className="text-[10px] text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Semantic Colors</p>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {[
                { label: "Primary", color: "#0D4EF2" },
                { label: "Secondary", color: "#1E2E59" },
                { label: "Success", color: "var(--cds-success-surface-default)" },
                { label: "Warning", color: "var(--cds-warning-surface-default)" },
                { label: "Error", color: "var(--cds-error-surface-default)" },
                { label: "Info", color: "var(--cds-info-surface-default)" },
                { label: "Neutral", color: "var(--cds-neutral-surface-bold)" },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="h-12 rounded-[var(--cds-radius-r)]" style={{ backgroundColor: c.color }} />
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Grey Scales</p>
            <div className="grid grid-cols-9 gap-1">
              {["#FAFAFA", "#F5F5F5", "#F0F0F0", "#E5E5E7", "#C5C5C7", "#8F9193", "#6C6D71", "#36393D", "#25272C"].map((c, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 rounded-sm" style={{ backgroundColor: c }} />
                  <p className="text-[9px] text-muted-foreground mt-0.5">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scale</CardTitle>
          <CardDescription>Font sizes and line heights from the CDS type system. Font: Zoho Puvi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[80px_1fr_100px_100px] gap-2 text-xs text-muted-foreground border-b pb-2">
            <span>Token</span><span>Preview</span><span>Size</span><span>Line Height</span>
          </div>
          {[
            { token: "H1", size: "29px", lh: "38px", weight: "font-semibold" },
            { token: "H2", size: "26px", lh: "34px", weight: "font-semibold" },
            { token: "H3", size: "23px", lh: "30px", weight: "font-semibold" },
            { token: "H4", size: "22px", lh: "29px", weight: "font-medium" },
            { token: "H5", size: "20px", lh: "26px", weight: "font-medium" },
            { token: "H6", size: "18px", lh: "24px", weight: "font-medium" },
            { token: "P1", size: "16px", lh: "21px", weight: "" },
            { token: "P2", size: "14px", lh: "18px", weight: "" },
            { token: "P3", size: "12px", lh: "15px", weight: "" },
            { token: "P4", size: "11px", lh: "14px", weight: "" },
            { token: "P5", size: "10px", lh: "13px", weight: "" },
            { token: "P6", size: "9px", lh: "12px", weight: "" },
          ].map((t) => (
            <div key={t.token} className="grid grid-cols-[80px_1fr_100px_100px] gap-2 items-baseline py-1">
              <span className="text-xs text-muted-foreground font-mono">{t.token}</span>
              <span className={t.weight} style={{ fontSize: t.size, lineHeight: t.lh }}>
                The quick brown fox jumps
              </span>
              <span className="text-xs text-muted-foreground">{t.size}</span>
              <span className="text-xs text-muted-foreground">{t.lh}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>Primitive tokens (space-*) and semantic aliases. Always prefer semantic aliases in components.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Primitive scale */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--cds-neutral-text-dark)" }}>Primitive tokens</p>
            <p className="text-xs mb-4" style={{ color: "var(--cds-neutral-text-default)" }}>
              Raw scale — space-0 to space-80. Use semantic aliases wherever possible.
            </p>
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_52px] gap-x-4 pb-2 mb-1 border-b text-xs font-medium" style={{ color: "var(--cds-neutral-text-default)" }}>
              <span>Token</span>
              <span>Visual</span>
              <span>px</span>
            </div>
            <div className="divide-y">
              {([0,1,2,4,6,8,12,16,20,24,32,40,48,64,80] as const).map((s) => (
                <div key={s} className="grid grid-cols-[80px_1fr_52px] gap-x-4 items-center py-2">
                  <span className="text-xs font-mono" style={{ color: "var(--cds-neutral-text-dark)" }}>space-{s}</span>
                  <div>
                    <div
                      className="h-4 rounded-sm"
                      style={{
                        width: `${Math.max(s, 2)}px`,
                        backgroundColor: "var(--cds-primary-surface-default)",
                        opacity: 0.25 + Math.min(s / 80, 0.75),
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono tabular-nums" style={{ color: "var(--cds-neutral-text-default)" }}>{s}px</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Semantic aliases */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--cds-neutral-text-dark)" }}>Semantic aliases — use these first</p>
            <p className="text-xs mb-4" style={{ color: "var(--cds-neutral-text-default)" }}>
              Named tokens with intent. Updating the alias here cascades to every component bound to it.
            </p>
            {/* Table header */}
            <div
              className="grid gap-x-4 pb-2 mb-1 border-b text-xs font-medium"
              style={{ gridTemplateColumns: "48px 96px 44px 1px 120px 130px 1fr", color: "var(--cds-neutral-text-default)" }}
            >
              <span>Visual</span>
              <span>Primitive token</span>
              <span>px</span>
              <span />
              <span>Semantic alias</span>
              <span>→ Primitive</span>
              <span>Usage</span>
            </div>
            <div className="divide-y">
              {[
                { prim: "space-4",  px: 4,  alias: "gap-tight",          token: "--cds-gap-tight",          usage: "Icon ↔ label, chip internals" },
                { prim: "space-8",  px: 8,  alias: "gap-small",          token: "--cds-gap-small",          usage: "Between related form elements" },
                { prim: "space-12", px: 12, alias: "gap-default",        token: "--cds-gap-default",        usage: "Between items in a list / row" },
                { prim: "space-16", px: 16, alias: "gap-medium",         token: "--cds-gap-medium",         usage: "Between sections within a card" },
                { prim: "space-24", px: 24, alias: "gap-large",          token: "--cds-gap-large",          usage: "Between cards, major sections" },
                { prim: "space-16", px: 16, alias: "padding-card",       token: "--cds-padding-card",       usage: "Card internal padding (all sides)" },
                { prim: "space-24", px: 24, alias: "padding-section-h",  token: "--cds-padding-section-h",  usage: "Content area horizontal padding" },
                { prim: "space-16", px: 16, alias: "padding-section-v",  token: "--cds-padding-section-v",  usage: "Content area vertical padding" },
                { prim: "space-16", px: 16, alias: "padding-row-v",      token: "--cds-padding-row-v",      usage: "Row vertical padding" },
                { prim: "space-24", px: 24, alias: "padding-row-h",      token: "--cds-padding-row-h",      usage: "Row horizontal padding" },
              ].map((row) => (
                <div
                  key={row.alias}
                  className="grid gap-x-4 items-center py-2.5"
                  style={{ gridTemplateColumns: "48px 96px 44px 1px 120px 130px 1fr" }}
                >
                  {/* Visual */}
                  <div>
                    <div
                      className="rounded-[3px]"
                      style={{
                        width: `${row.px}px`,
                        height: `${row.px}px`,
                        backgroundColor: "var(--cds-primary-surface-default)",
                      }}
                    />
                  </div>
                  {/* Primitive token */}
                  <span className="text-xs font-mono" style={{ color: "var(--cds-neutral-text-dark)" }}>{row.prim}</span>
                  {/* px */}
                  <span className="text-xs font-mono tabular-nums" style={{ color: "var(--cds-neutral-text-default)" }}>{row.px}px</span>
                  {/* Separator */}
                  <div className="self-stretch w-px" style={{ backgroundColor: "var(--cds-neutral-border-low, #F0F0F0)" }} />
                  {/* Semantic alias */}
                  <span className="text-xs font-mono font-medium" style={{ color: "var(--cds-primary-text-default)" }}>{row.alias}</span>
                  {/* → Primitive */}
                  <span className="text-xs" style={{ color: "var(--cds-neutral-text-default)" }}>→ {row.prim} ({row.px}px)</span>
                  {/* Usage */}
                  <span className="text-xs" style={{ color: "var(--cds-neutral-text-default)" }}>{row.usage}</span>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
          <CardDescription>Radius tokens from none to full.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "null", value: "0px" },
              { label: "xs", value: "2px" },
              { label: "s", value: "4px" },
              { label: "r", value: "6px" },
              { label: "rl", value: "8px" },
              { label: "l", value: "10px" },
              { label: "xl", value: "14px" },
              { label: "2xl", value: "18px" },
              { label: "3xl", value: "20px" },
              { label: "full", value: "999px" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div
                  className="h-16 w-16 bg-primary/10 border-2 border-primary"
                  style={{ borderRadius: r.value }}
                />
                <p className="text-xs text-muted-foreground mt-1">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Elevation */}
      <Card>
        <CardHeader>
          <CardTitle>Elevation / Shadows</CardTitle>
          <CardDescription>
            5 elevation levels × 6 semantic colour variants. Each card uses two layers: a subtle base + the level shadow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {([
            {
              level: "Subtle",
              desc: "0 2 2 0",
              colours: [
                { label: "Default",  token: "--cds-shadow-subtle",          shadow: "var(--cds-shadow-subtle)" },
                { label: "Primary",  token: "--cds-shadow-primary-subtle",   shadow: "var(--cds-shadow-primary-subtle)" },
                { label: "Success",  token: "--cds-shadow-success-subtle",   shadow: "var(--cds-shadow-success-subtle)" },
                { label: "Warning",  token: "--cds-shadow-warning-subtle",   shadow: "var(--cds-shadow-warning-subtle)" },
                { label: "Error",    token: "--cds-shadow-error-subtle",     shadow: "var(--cds-shadow-error-subtle)" },
              ],
            },
            {
              level: "Minimal",
              desc: "0 2 4 0",
              colours: [
                { label: "Default",  token: "--cds-shadow-minimal",          shadow: "var(--cds-shadow-minimal)" },
                { label: "Primary",  token: "--cds-shadow-primary-minimal",  shadow: "var(--cds-shadow-primary-minimal)" },
                { label: "Success",  token: "--cds-shadow-success-minimal",  shadow: "var(--cds-shadow-success-minimal)" },
                { label: "Warning",  token: "--cds-shadow-warning-minimal",  shadow: "var(--cds-shadow-warning-minimal)" },
                { label: "Error",    token: "--cds-shadow-error-minimal",    shadow: "var(--cds-shadow-error-minimal)" },
              ],
            },
            {
              level: "Low",
              desc: "0 4 8 0",
              colours: [
                { label: "Default",  token: "--cds-shadow-low",              shadow: "var(--cds-shadow-low)" },
                { label: "Primary",  token: "--cds-shadow-primary-low",      shadow: "var(--cds-shadow-primary-low)" },
                { label: "Success",  token: "--cds-shadow-success-low",      shadow: "var(--cds-shadow-success-low)" },
                { label: "Warning",  token: "--cds-shadow-warning-low",      shadow: "var(--cds-shadow-warning-low)" },
                { label: "Error",    token: "--cds-shadow-error-low",        shadow: "var(--cds-shadow-error-low)" },
              ],
            },
            {
              level: "Base",
              desc: "0 12 16 −4",
              colours: [
                { label: "Default",  token: "--cds-shadow-base",             shadow: "var(--cds-shadow-base)" },
                { label: "Primary",  token: "--cds-shadow-primary-base",     shadow: "var(--cds-shadow-primary-base)" },
                { label: "Success",  token: "--cds-shadow-success-base",     shadow: "var(--cds-shadow-success-base)" },
                { label: "Warning",  token: "--cds-shadow-warning-base",     shadow: "var(--cds-shadow-warning-base)" },
                { label: "Error",    token: "--cds-shadow-error-base",       shadow: "var(--cds-shadow-error-base)" },
              ],
            },
            {
              level: "Bold",
              desc: "0 20 24 −4",
              colours: [
                { label: "Default",  token: "--cds-shadow-bold",             shadow: "var(--cds-shadow-bold)" },
                { label: "Primary",  token: "--cds-shadow-primary-bold",     shadow: "var(--cds-shadow-primary-bold)" },
                { label: "Success",  token: "--cds-shadow-success-bold",     shadow: "var(--cds-shadow-success-bold)" },
                { label: "Warning",  token: "--cds-shadow-warning-bold",     shadow: "var(--cds-shadow-warning-bold)" },
                { label: "Error",    token: "--cds-shadow-error-bold",       shadow: "var(--cds-shadow-error-bold)" },
              ],
            },
          ] as const).map((row) => (
            <div key={row.level}>
              {/* Row header */}
              <div className="flex items-baseline gap-2 mb-4">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--cds-neutral-text-dark)" }}
                >
                  {row.level}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--cds-neutral-text-default)" }}
                >
                  y · blur · spread: {row.desc}
                </span>
              </div>
              {/* Cards row */}
              <div className="grid grid-cols-5 gap-5">
                {row.colours.map((c) => (
                  <div key={c.label} className="flex flex-col items-center gap-3">
                    <div
                      className="w-full aspect-square rounded-[20px] bg-white border border-[#f4f5f6]"
                      style={{ boxShadow: c.shadow }}
                    />
                    <div className="text-center space-y-0.5">
                      <p className="text-xs font-medium" style={{ color: "var(--cds-neutral-text-dark)" }}>
                        {c.label}
                      </p>
                      <p
                        className="text-[10px] font-mono leading-tight break-all"
                        style={{ color: "var(--cds-neutral-text-default)" }}
                      >
                        {c.token}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {row.level !== "Bold" && <Separator className="mt-8" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}