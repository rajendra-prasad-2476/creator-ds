/**
 * DeployWizardChannelScreen (S-02)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §9.4 Screen S-02
 *
 * Step 1 of the deploy wizard — user picks the distribution channel:
 *   - Google Play (Android)
 *   - Firebase App Distribution (Beta)
 *   - Zoho MDM (Enterprise)
 *   - Ad-hoc Link (existing)
 *
 * Shows the signed app context (name, version, platform) at the top.
 * Channels without configured credentials are disabled with a "Configure" link.
 *
 * Navigation:
 *   Google Play → deploy-wizard-play
 *   Firebase    → deploy-wizard-firebase
 *   MDM / Ad-hoc → (existing flows, not part of this wizard)
 *   "Manage Credentials" → deployment-credentials
 */

import * as React from "react"
import {
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioCard } from "@/components/ui/radio-card"
import { Separator } from "@/components/ui/separator"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "google-play" | "firebase" | "mdm" | "adhoc"

interface ChannelOption {
  id: Channel
  label: string
  description: string
  badge?: string
  badgeColour?: "primary" | "success" | "indigo"
  credConfigured: boolean
  phase2?: boolean
  navigatesTo?: string
}

// ─── Channel config ───────────────────────────────────────────────────────────

const CHANNELS: ChannelOption[] = [
  {
    id: "google-play",
    label: "Google Play",
    description: "Upload AAB to Internal, Alpha, Beta, or Production tracks on Google Play Store.",
    badge: "Android",
    badgeColour: "success",
    credConfigured: true,
    navigatesTo: "deploy-wizard-play",
  },
  {
    id: "firebase",
    label: "Firebase App Distribution",
    description: "Distribute APK/AAB to beta testers via Firebase. Testers receive an email invitation.",
    badge: "Beta",
    badgeColour: "primary",
    credConfigured: true,
    navigatesTo: "deploy-wizard-firebase",
  },
  {
    id: "mdm",
    label: "Zoho MDM",
    description: "Push the signed app to enrolled devices managed by Zoho MDM.",
    badge: "Enterprise",
    badgeColour: "indigo",
    credConfigured: true,
    navigatesTo: undefined, // Existing MDM flow
  },
  {
    id: "adhoc",
    label: "Ad-hoc Link",
    description: "Share a download link via email. Recipients install directly from the link.",
    credConfigured: true,
    navigatesTo: undefined, // Existing ad-hoc flow
  },
]

// ─── Signed app context bar ───────────────────────────────────────────────────

function SignedAppContextBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--cds-gap-default)",
        backgroundColor: "var(--cds-huegrey-surface-low)",
        border: "1px solid var(--border)",
        borderRadius: "var(--cds-radius-r)",
        padding: "var(--cds-space-12) var(--cds-space-16)",
        marginBottom: "var(--cds-space-24)",
        maxWidth: 680,
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: "var(--cds-radius-s)",
          backgroundColor: "var(--cds-primary-surface-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Smartphone size={20} style={{ color: "var(--cds-primary-text-default)" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
          Zylker CRM — Android
        </p>
        <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
          v2.4.1 · Build 241 · AAB · Signed 2 hours ago
        </p>
      </div>
      <Badge variant="subtle" colour="success">Signed</Badge>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeployWizardChannelScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()
  const [selected, setSelected] = React.useState<Channel>("google-play")

  const selectedChannel = CHANNELS.find((c) => c.id === selected)

  function handleNext() {
    if (!selectedChannel) return
    if (selectedChannel.navigatesTo) {
      navigate(selectedChannel.navigatesTo)
    }
    // MDM and ad-hoc would trigger existing flows (no navigation in this prototype)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

          {/* Back + breadcrumb */}
          <button
            type="button"
            onClick={() => canGoBack ? goBack() : undefined}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)",
              color: "var(--cds-huegrey-text-default)",
              fontSize: "var(--cds-text-p3)",
              padding: 0,
              marginBottom: "var(--cds-space-16)",
            }}
          >
            <ArrowLeft size={13} />
            Back to Mobile
          </button>

          {/* Page header */}
          <div style={{ marginBottom: "var(--cds-space-24)" }}>
            <h1
              style={{
                fontSize: "var(--cds-text-p1)",
                lineHeight: "var(--cds-leading-p1)",
                fontWeight: 600,
                color: "var(--cds-huegrey-text-dark)",
                margin: "0 0 var(--cds-space-4)",
              }}
            >
              Deploy App
            </h1>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              Choose where to deploy this signed build. You can deploy to multiple channels after completing this wizard.
            </p>
          </div>

          {/* Signed app context */}
          <SignedAppContextBar />

          {/* Step label */}
          <p style={{
            margin: "0 0 var(--cds-space-12)",
            fontSize: "var(--cds-text-p3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-default)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Step 1 of 3 — Select channel
          </p>

          {/* Channel cards */}
          <RadioGroup
            value={selected}
            onValueChange={(v) => setSelected(v as Channel)}
            style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-default)", maxWidth: 680 }}
          >
            {CHANNELS.map((channel) => (
              <div key={channel.id} style={{ position: "relative" }}>
                <RadioCard
                  value={channel.id}
                  label={channel.label}
                  description={channel.description}
                  disabled={!channel.credConfigured}
                />
                {/* Badge overlay on the card */}
                {channel.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "var(--cds-space-16)",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      display: "flex",
                      gap: "var(--cds-gap-tight)",
                      alignItems: "center",
                    }}
                  >
                    <Badge variant="subtle" colour={channel.badgeColour ?? "indigo"}>
                      {channel.badge}
                    </Badge>
                  </div>
                )}
                {/* No-credential notice */}
                {!channel.credConfigured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "var(--cds-space-16)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => navigate("deployment-credentials")}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "var(--cds-text-p3)",
                        color: "var(--cds-primary-text-default)",
                        display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)",
                        padding: 0,
                      }}
                    >
                      <Settings size={12} />
                      Configure
                    </button>
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>

          {/* Manage credentials link */}
          <div style={{ marginTop: "var(--cds-space-16)", marginBottom: "var(--cds-space-32)" }}>
            <button
              type="button"
              onClick={() => navigate("deployment-credentials")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-primary-text-default)",
                display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)",
                padding: 0,
              }}
            >
              <Settings size={12} />
              Manage store credentials
            </button>
          </div>

          <Separator style={{ maxWidth: 680, marginBottom: "var(--cds-space-24)" }} />

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
            <Button
              onClick={handleNext}
              disabled={!selectedChannel?.credConfigured}
              style={{ gap: "var(--cds-gap-tight)" }}
            >
              Next
              <ChevronRight size={14} />
            </Button>
            <Button variant="outline" onClick={() => canGoBack ? goBack() : undefined}>
              Cancel
            </Button>
          </div>

        </main>
      </div>
    </div>
  )
}
