/**
 * PortalPasswordPolicyScreen
 *
 * Feature: 002 — Portal Security Policies
 * PRD section: FR-2 (Password Policy)
 *
 * Three sub-sections:
 *   1. Password Strength — predefined (Strong / Good / Fair) or Custom
 *   2. Password Complexity — min length, mixed case, special chars, numeric digits
 *   3. Password Age — max age, min age, restrict reuse
 *
 * Custom strength reveals the Complexity + Age configuration fields.
 */

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigation } from "@/screens/navigation"
import { PortalSecurityShell } from "./_PortalSecurityShell"

// ─── Types ─────────────────────────────────────────────────────────────────────

type StrengthOption = "strong" | "good" | "fair" | "custom"

const STRENGTH_OPTIONS: { id: StrengthOption; label: string; description: string }[] = [
  { id: "strong", label: "Strong",  description: "Min 12 chars · Upper + lower · 2 special · 2 numeric" },
  { id: "good",   label: "Good",    description: "Min 8 chars · Upper + lower · 1 special · 1 numeric"  },
  { id: "fair",   label: "Fair",    description: "Min 6 chars · Mixed case"                               },
  { id: "custom", label: "Custom",  description: "Configure your own requirements"                        },
]

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "var(--cds-text-p1)",
        lineHeight: "var(--cds-leading-p1)",
        fontWeight: 600,
        color: "var(--cds-huegrey-text-dark)",
        margin: "0 0 var(--cds-space-16)",
      }}
    >
      {children}
    </h3>
  )
}

// ─── Field row (label + description on left, control on right) ────────────────

function FieldRow({
  label,
  description,
  isLast = false,
  children,
}: {
  label: string
  description?: string
  /** Suppresses the bottom divider on the last row to avoid double-border with the card */
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--cds-gap-large)",
        padding: "var(--cds-space-16)",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "var(--cds-text-p2)",
            lineHeight: "var(--cds-leading-p2)",
            fontWeight: 500,
            color: "var(--cds-huegrey-text-dark)",
            marginBottom: description ? "var(--cds-space-4)" : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: "var(--cds-text-p3)",
              lineHeight: "var(--cds-leading-p3)",
              color: "var(--cds-huegrey-text-default)",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, minWidth: 180 }}>{children}</div>
    </div>
  )
}

// ─── Small number input ────────────────────────────────────────────────────────

function NumberInput({ defaultValue, min = 0 }: { defaultValue?: number; min?: number }) {
  return (
    <Input
      type="number"
      defaultValue={defaultValue}
      min={min}
      style={{ width: 180, textAlign: "right" }}
    />
  )
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function PortalPasswordPolicyScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()
  const [strength, setStrength] = React.useState<StrengthOption>("strong")
  const isCustom = strength === "custom"

  return (
    <PortalSecurityShell activeNavId="password-policy">
      <div style={{ maxWidth: 700 }}>

        {/* Page title */}
        <h2
          style={{
            fontSize: "var(--cds-text-h3)",
            lineHeight: "var(--cds-leading-h3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-dark)",
            margin: "0 0 var(--cds-space-24)",
          }}
        >
          Password Policy
        </h2>

        {/* ── 1. Password Strength ── */}
        <SectionHeading>Password Strength</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--cds-gap-small)",
            marginBottom: "var(--cds-space-32)",
          }}
        >
          {STRENGTH_OPTIONS.map((opt) => {
            const isActive = strength === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStrength(opt.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--cds-space-4)",
                  padding: "var(--cds-space-12)",
                  borderRadius: "var(--cds-radius-r)",
                  border: isActive
                    ? "1.5px solid var(--cds-primary-border-default)"
                    : "1px solid var(--border)",
                  backgroundColor: isActive
                    ? "var(--cds-primary-surface-subtle)"
                    : "var(--cds-white)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {/* Radio indicator + label */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "var(--cds-radius-full)",
                      border: isActive
                        ? "4px solid var(--cds-primary-surface-default)"
                        : "1.5px solid var(--cds-huegrey-border-default)",
                      flexShrink: 0,
                      backgroundColor: "var(--cds-white)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "var(--cds-text-p2)",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "var(--cds-primary-text-default)"
                        : "var(--cds-huegrey-text-dark)",
                    }}
                  >
                    {opt.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "var(--cds-text-p3)",
                    lineHeight: "var(--cds-leading-p3)",
                    color: "var(--cds-huegrey-text-default)",
                  }}
                >
                  {opt.description}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── 2. Password Complexity (shown always; editable only when Custom) ── */}
        <SectionHeading>Password Complexity</SectionHeading>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--cds-radius-r)",
            marginBottom: "var(--cds-space-32)",
            opacity: isCustom ? 1 : 0.6,
            pointerEvents: isCustom ? "auto" : "none",
          }}
        >
          <FieldRow label="Minimum Password Length">
            <NumberInput defaultValue={strength === "strong" ? 12 : strength === "good" ? 8 : 6} min={6} />
          </FieldRow>
          <FieldRow label="Mixed Password" description="Require both uppercase and lowercase characters.">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
              <Checkbox defaultChecked={strength !== "fair"} id="mixed-case" />
              <Label htmlFor="mixed-case" style={{ fontSize: "var(--cds-text-p2)" }}>Enabled</Label>
            </div>
          </FieldRow>
          <FieldRow label="Minimum Special Characters">
            <NumberInput defaultValue={strength === "strong" ? 2 : strength === "good" ? 1 : 0} min={0} />
          </FieldRow>
          <FieldRow label="Minimum Numeric Digits" description="Minimum number of digits required." isLast>
            <NumberInput defaultValue={strength === "strong" ? 2 : strength === "good" ? 1 : 0} min={0} />
          </FieldRow>
        </div>

        {/* ── 3. Password Age ── */}
        <SectionHeading>Password Age</SectionHeading>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--cds-radius-r)",
            marginBottom: "var(--cds-space-32)",
            opacity: isCustom ? 1 : 0.6,
            pointerEvents: isCustom ? "auto" : "none",
          }}
        >
          <FieldRow label="Maximum Password Age" description="Force users to reset their password after this period.">
            <Select defaultValue="never">
              <SelectTrigger style={{ width: 180 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Minimum Password Age" description="Prevent users from changing their password too soon.">
            <Select defaultValue="never">
              <SelectTrigger style={{ width: 180 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Restrict Previously Used Passwords" description="Number of previous passwords to block reuse." isLast>
            <Select defaultValue="0">
              <SelectTrigger style={{ width: 180 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No restriction</SelectItem>
                <SelectItem value="3">Last 3 passwords</SelectItem>
                <SelectItem value="5">Last 5 passwords</SelectItem>
                <SelectItem value="10">Last 10 passwords</SelectItem>
                <SelectItem value="24">Last 24 passwords</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
          <Button>Update Policy</Button>
          <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("portal-security-landing")}>
            Cancel
          </Button>
        </div>

      </div>
    </PortalSecurityShell>
  )
}
