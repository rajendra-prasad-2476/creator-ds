/**
 * PortalMFAScreen
 *
 * Feature: 002 — Portal Security Policies
 * PRD section: FR-3 (Multi-Factor Authentication)
 *
 * Reference: screenshot image 1 (Zoho Directory MFA tab)
 *
 * Structure:
 *   Authentication Methods — checkboxes with nested toggles for OneAuth sub-options
 *   Additional Settings    — MFA lifetime dropdown + backup recovery codes toggle
 *   Footer note + actions
 */

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigation } from "@/screens/navigation"
import { PortalSecurityShell } from "./_PortalSecurityShell"

// ─── Toggle row (label + description on left, switch on right) ────────────────

function ToggleRow({
  id,
  label,
  description,
  defaultChecked = false,
  indent = false,
}: {
  id: string
  label: string
  description?: string
  defaultChecked?: boolean
  indent?: boolean
}) {
  const [checked, setChecked] = React.useState(defaultChecked)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--cds-gap-large)",
        padding: "var(--cds-space-12) 0",
        paddingLeft: indent ? "var(--cds-space-24)" : 0,
      }}
    >
      <div>
        <Label
          htmlFor={id}
          style={{
            fontSize: "var(--cds-text-p2)",
            fontWeight: 400,
            color: "var(--cds-huegrey-text-dark)",
            cursor: "pointer",
          }}
        >
          {label}
        </Label>
        {description && (
          <p
            style={{
              fontSize: "var(--cds-text-p3)",
              lineHeight: "var(--cds-leading-p3)",
              color: "var(--cds-huegrey-text-default)",
              margin: "var(--cds-space-2) 0 0",
            }}
          >
            {description}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </div>
  )
}

// ─── Method item (checkbox + label + optional nested content) ─────────────────

function MethodItem({
  id,
  label,
  defaultChecked = false,
  children,
}: {
  id: string
  label: string
  defaultChecked?: boolean
  children?: React.ReactNode
}) {
  const [checked, setChecked] = React.useState(defaultChecked)
  return (
    <div style={{ padding: "var(--cds-space-12) 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => setChecked(!!v)}
        />
        <Label
          htmlFor={id}
          style={{
            fontSize: "var(--cds-text-p2)",
            fontWeight: checked ? 500 : 400,
            color: "var(--cds-huegrey-text-dark)",
            cursor: "pointer",
          }}
        >
          {label}
        </Label>
      </div>
      {checked && children && (
        <div style={{ marginTop: "var(--cds-space-4)" }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── DropdownRow ──────────────────────────────────────────────────────────────

function DropdownRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--cds-gap-large)",
        padding: "var(--cds-space-16) 0",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "var(--cds-text-p2)",
            fontWeight: 500,
            color: "var(--cds-huegrey-text-dark)",
            marginBottom: description ? "var(--cds-space-4)" : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <p
            style={{
              fontSize: "var(--cds-text-p3)",
              lineHeight: "var(--cds-leading-p3)",
              color: "var(--cds-huegrey-text-default)",
              margin: 0,
              maxWidth: 360,
            }}
          >
            {description}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function PortalMFAScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  return (
    <PortalSecurityShell activeNavId="mfa">
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
          Multi-Factor Authentication
        </h2>

        {/* ── Authentication Methods ── */}
        <div style={{ marginBottom: "var(--cds-space-32)" }}>
          <div
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "var(--cds-space-4)",
              marginBottom: "var(--cds-space-4)",
            }}
          >
            <MethodItem id="oneauth" label="OneAuth" defaultChecked>
              <ToggleRow
                id="face-id"
                label="Enforce Face ID / Touch ID"
                description="Enforce users to configure Face ID/Touch ID in OneAuth during their next sign-in."
                indent
              />
              <ToggleRow
                id="passwordless"
                label="Allow Passwordless Sign-in"
                description="Allow users to set up passwordless authentication."
                defaultChecked
                indent
              />
            </MethodItem>
            <Separator />
            <MethodItem id="otp-auth" label="OTP Authenticator" defaultChecked />
            <Separator />
            <MethodItem id="yubikey"  label="YubiKey"           defaultChecked />
            <Separator />
            <MethodItem id="sms-otp"  label="SMS-based OTP" />
          </div>
        </div>

        <Separator style={{ marginBottom: "var(--cds-space-24)" }} />

        {/* ── Additional Settings ── */}
        <DropdownRow
          label="MFA Lifetime"
          description="After signing in from a trusted browser, users will not be challenged with MFA for the chosen period of time."
        >
          <Select defaultValue="180">
            <SelectTrigger style={{ width: 160 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Every sign-in</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </DropdownRow>

        <Separator />

        <DropdownRow
          label="Allow backup recovery codes"
          description="Users will be able to generate and use backup recovery codes when they have trouble signing in."
        >
          <Switch defaultChecked />
        </DropdownRow>

        <Separator style={{ marginBottom: "var(--cds-space-24)" }} />

        {/* Footer note */}
        <p
          style={{
            fontSize: "var(--cds-text-p3)",
            lineHeight: "var(--cds-leading-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginBottom: "var(--cds-space-24)",
          }}
        >
          Changes to the policy will be applied during the user&apos;s next sign-in.{" "}
          <a
            href="#"
            style={{
              color: "var(--cds-primary-text-default)",
              textDecoration: "none",
            }}
          >
            Learn more about configuring MFA.
          </a>
        </p>

        {/* Actions */}
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
