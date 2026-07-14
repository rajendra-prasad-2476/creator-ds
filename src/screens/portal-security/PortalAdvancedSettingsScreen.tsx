/**
 * PortalAdvancedSettingsScreen
 *
 * Feature: 002 — Portal Security Policies
 * PRD section: FR-5 (Advanced Settings)
 *
 * Reference: screenshot image 2 (Zoho Directory Advanced Settings tab)
 *
 * Two sub-sections:
 *   Web Session Management — Session Lifetime, Idle Timeout, Concurrent Sessions
 *   Account Lock Settings  — Monitoring Period, Max Invalid Sign-ins, Lock Duration
 */

import * as React from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigation } from "@/screens/navigation"
import { PortalSecurityShell } from "./_PortalSecurityShell"

// ─── Sub-section heading ───────────────────────────────────────────────────────

function SubHeading({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--cds-gap-tight)",
        marginBottom: "var(--cds-space-4)",
      }}
    >
      <h3
        style={{
          fontSize: "var(--cds-text-p1)",
          lineHeight: "var(--cds-leading-p1)",
          fontWeight: 600,
          color: "var(--cds-primary-text-default)",
          margin: 0,
        }}
      >
        {children}
      </h3>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "var(--cds-huegrey-text-default)", padding: 0 }}>
              <Info size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" style={{ maxWidth: 260 }}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

// ─── Setting row ──────────────────────────────────────────────────────────────

function SettingRow({
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

export default function PortalAdvancedSettingsScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  return (
    <PortalSecurityShell activeNavId="advanced">
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
          Advanced Settings
        </h2>

        {/* ── Web Session Management ── */}
        <SubHeading>Web Session Management</SubHeading>
        <Separator style={{ marginBottom: "var(--cds-space-4)" }} />

        <SettingRow
          label="Session Lifetime"
          description="Users will automatically be signed out of their accounts after the chosen period."
        >
          <Select defaultValue="default">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="2h">2 hours</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="8h">8 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="1w">1 week</SelectItem>
              <SelectItem value="2w">2 weeks</SelectItem>
              <SelectItem value="1mo">1 month</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="Idle Session Timeout"
          description="Users will automatically be signed out of their accounts if they stay inactive over the chosen period."
        >
          <Select defaultValue="never">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="10m">10 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="2h">2 hours</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="Concurrent Sessions"
          description="Users will be allowed only the chosen number of active sessions at a time."
        >
          <Select defaultValue="3">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="unlimited">No limit</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <div style={{ marginBottom: "var(--cds-space-32)" }} />

        {/* ── Account Lock Settings ── */}
        <SubHeading
          tooltip="Account lock settings apply only to password-based authentication. Users locked out can be unlocked manually from the Portal Users list."
        >
          Lock Period Settings
        </SubHeading>
        <Separator style={{ marginBottom: "var(--cds-space-4)" }} />

        <SettingRow
          label="Monitoring Period"
          description="The number of sign-in attempts made by users during this timeframe is noted."
        >
          <Select defaultValue="never">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="10m">10 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="Max Number of Invalid Sign-ins"
          description="This is the maximum number of invalid sign-in attempts allowed for users within the monitoring period."
        >
          <Select defaultValue="no-limit">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-limit">No limit</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <Separator />

        <SettingRow
          label="Lock Period"
          description="After the allotted limit of invalid sign-in attempts is reached, users will be locked out and prevented from signing in for the selected duration."
        >
          <Select defaultValue="never">
            <SelectTrigger style={{ width: 180 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="10m">10 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <div style={{ marginBottom: "var(--cds-space-32)" }} />

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
