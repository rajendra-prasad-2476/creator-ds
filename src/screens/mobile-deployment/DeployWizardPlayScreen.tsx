/**
 * DeployWizardPlayScreen (S-03)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.2 Google Play Deployment, §9.4 Screen S-03
 *
 * Step 2 of the deploy wizard (Google Play path):
 *   - Track selector: Internal / Alpha / Beta / Production
 *   - Staged rollout % slider (Production only)
 *   - Release notes textarea
 *   - "Submit as Draft" toggle (for new Play apps)
 *   - Confirm / Deploy button → navigates to deploy-in-progress
 *
 * Error states:
 *   - Missing release notes on Production
 *   - Package name mismatch warning
 *   - Draft app → navigate to play-setup-guide
 */

import * as React from "react"
import {
  Smartphone,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayTrack = "internal" | "alpha" | "beta" | "production"

const TRACK_LABELS: Record<PlayTrack, string> = {
  internal:   "Internal testing",
  alpha:      "Closed testing (Alpha)",
  beta:       "Open testing (Beta)",
  production: "Production",
}

const TRACK_DESCRIPTIONS: Record<PlayTrack, string> = {
  internal:   "Up to 100 testers. Fastest review — available within minutes.",
  alpha:      "Closed group of testers you invite. Requires Google review.",
  beta:       "Open to anyone who opts in. Requires Google review.",
  production: "Available to all users on the Play Store. Requires Google review.",
}

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
          v2.4.1 · Build 241 · AAB · com.zylker.app
        </p>
      </div>
      <Badge variant="subtle" colour="success">Google Play</Badge>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeployWizardPlayScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  const [track, setTrack]             = React.useState<PlayTrack>("internal")
  const [rollout, setRollout]         = React.useState<number[]>([100])
  const [releaseNotes, setReleaseNotes] = React.useState("")
  const [submitAsDraft, setSubmitAsDraft] = React.useState(false)
  const [showProductionConfirm, setShowProductionConfirm] = React.useState(false)
  const [errors, setErrors]           = React.useState<Record<string, string>>({})

  const isProduction = track === "production"

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (isProduction && !releaseNotes.trim()) {
      newErrors.releaseNotes = "Release notes are required for Production releases."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleDeploy() {
    if (!validate()) return
    if (isProduction) {
      setShowProductionConfirm(true)
    } else {
      navigate("deploy-in-progress")
    }
  }

  function handleConfirmProduction() {
    setShowProductionConfirm(false)
    navigate("deploy-in-progress")
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

          {/* Back */}
          <button
            type="button"
            onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-channel")}
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
            Back to channel select
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
              Deploy to Google Play
            </h1>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              Configure your Google Play release. Credentials: <strong>Zylker Play Service Account</strong>
            </p>
          </div>

          {/* Signed app context */}
          <SignedAppContextBar />

          {/* Step label */}
          <p style={{
            margin: "0 0 var(--cds-space-20)",
            fontSize: "var(--cds-text-p3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-default)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Step 2 of 3 — Configure release
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-24)", maxWidth: 560 }}>

            {/* Track selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
              <Label>Track</Label>
              <Select value={track} onValueChange={(v) => setTrack(v as PlayTrack)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TRACK_LABELS) as PlayTrack[]).map((t) => (
                    <SelectItem key={t} value={t}>{TRACK_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                {TRACK_DESCRIPTIONS[track]}
              </p>
            </div>

            {/* Staged rollout — Production only */}
            {isProduction && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Label>Staged rollout</Label>
                  <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-primary-text-default)" }}>
                    {rollout[0]}%
                  </span>
                </div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={rollout}
                  onValueChange={(v) => setRollout(Array.isArray(v) ? [...v] : [v as number])}
                />
                <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                  {rollout[0] < 100
                    ? `${rollout[0]}% of users will receive this update. You can increase the rollout from Play Console later.`
                    : "Release to all users immediately."}
                </p>
              </div>
            )}

            {/* Release notes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
              <Label>
                Release notes
                {isProduction && (
                  <span style={{ color: "var(--cds-error-text-default)", marginLeft: "var(--cds-space-4)" }}>*</span>
                )}
              </Label>
              <Textarea
                rows={4}
                placeholder="What's new in this release? (shown to users on the Play Store)"
                value={releaseNotes}
                onChange={(e) => {
                  setReleaseNotes(e.target.value)
                  if (errors.releaseNotes) setErrors((prev) => ({ ...prev, releaseNotes: "" }))
                }}
                style={errors.releaseNotes ? { border: "1px solid var(--cds-error-border-default)" } : undefined}
              />
              {errors.releaseNotes && (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)", flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>
                    {errors.releaseNotes}
                  </p>
                </div>
              )}
              {/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}
            </div>

            {/* Submit as draft toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--cds-gap-default)",
                backgroundColor: "var(--cds-huegrey-surface-low)",
                border: "1px solid var(--border)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-16)",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>
                  Submit as draft
                </p>
                <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                  Enable if your Play app is still in draft state (no prior release).
                  The upload will be submitted as a draft for you to complete in Play Console.
                </p>
              </div>
              <Switch
                checked={submitAsDraft}
                onCheckedChange={setSubmitAsDraft}
                aria-label="Submit as draft"
              />
            </div>

            {/* Info notice for first-time apps */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--cds-gap-small)",
                backgroundColor: "var(--cds-primary-surface-subtle)",
                border: "1px solid var(--cds-primary-border-minimal)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-12) var(--cds-space-16)",
              }}
            >
              <Info size={14} style={{ color: "var(--cds-primary-text-default)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p3)", fontWeight: 500, color: "var(--cds-primary-text-default)" }}>
                  First-time Play release?
                </p>
                <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-primary-text-default)" }}>
                  Google Play requires a manual upload for the very first release of a new app.
                  If this is your first release, enable "Submit as draft" or{" "}
                  <button
                    type="button"
                    onClick={() => navigate("play-setup-guide")}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--cds-primary-text-default)",
                      fontWeight: 600, fontSize: "var(--cds-text-p3)",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    follow the setup guide
                  </button>.
                </p>
              </div>
            </div>

          </div>

          <Separator style={{ maxWidth: 560, margin: "var(--cds-space-32) 0 var(--cds-space-24)" }} />

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
            <Button onClick={handleDeploy} style={{ gap: "var(--cds-gap-tight)" }}>
              Deploy
              <ChevronRight size={14} />
            </Button>
            <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-channel")}>
              Cancel
            </Button>
          </div>

        </main>
      </div>

      {/* Production confirmation dialog */}
      <AlertDialog open={showProductionConfirm} onOpenChange={setShowProductionConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Deploy to Production?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish <strong>Zylker CRM v2.4.1</strong> to{" "}
              {rollout[0] < 100
                ? `${rollout[0]}% of users on the Google Play Store.`
                : "all users on the Google Play Store."}
              {" "}This action cannot be undone from Creator — use Play Console to halt or revert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmProduction}>
              Confirm Deploy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
