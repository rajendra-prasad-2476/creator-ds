/**
 * DeployWizardFirebaseScreen (S-04)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.4 Firebase App Distribution, §9.4 Screen S-04
 *
 * Step 2 of the deploy wizard (Firebase path):
 *   - Tester email TagInput (comma/enter to add)
 *   - Release notes textarea
 *   - Selected Firebase credential display
 *   - Confirm / Deploy button → navigates to deploy-in-progress
 *
 * Error states:
 *   - No testers added
 *   - Invalid service account warning
 */

import * as React from "react"
import {
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import { Separator } from "@/components/ui/separator"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

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
          backgroundColor: "var(--cds-warning-surface-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Flame size={20} style={{ color: "var(--cds-warning-text-default)" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
          Zylker CRM — Android
        </p>
        <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
          v2.4.1 · Build 241 · APK · Firebase – Zylker Beta
        </p>
      </div>
      <Badge variant="subtle" colour="warning">Firebase Beta</Badge>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeployWizardFirebaseScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  const [testers, setTesters]         = React.useState<string[]>(["qa-team@zylker.com"])
  const [releaseNotes, setReleaseNotes] = React.useState("")
  const [errors, setErrors]           = React.useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (testers.length === 0) {
      newErrors.testers = "Add at least one tester email or group alias."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleDeploy() {
    if (!validate()) return
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
              Deploy to Firebase App Distribution
            </h1>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              Distribute this build to beta testers. Credentials: <strong>Firebase – Zylker Beta</strong>
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
            Step 2 of 3 — Configure distribution
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-24)", maxWidth: 560 }}>

            {/* Tester emails */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
              <Label>
                Testers
                <span style={{ color: "var(--cds-error-text-default)", marginLeft: "var(--cds-space-4)" }}>*</span>
              </Label>
              <TagInput
                value={testers}
                onChange={(tags) => {
                  setTesters(tags)
                  if (errors.testers && tags.length > 0) {
                    setErrors((prev) => ({ ...prev, testers: "" }))
                  }
                }}
                placeholder="Add email or group alias…"
              />
              {errors.testers ? (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)", flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>
                    {errors.testers}
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                  Enter individual email addresses or Firebase tester group aliases. Press Enter or comma to add each.
                  Testers will receive an email invitation to install the build.
                </p>
              )}
              {/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}
            </div>

            {/* Release notes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
              <Label>Release notes (optional)</Label>
              <Textarea
                rows={4}
                placeholder="Describe what testers should focus on in this build…"
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
              />
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                These notes appear in the Firebase App Distribution tester invitation email.
              </p>
            </div>

            {/* Summary box */}
            <div
              style={{
                backgroundColor: "var(--cds-huegrey-surface-low)",
                border: "1px solid var(--border)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-16)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--cds-space-8)",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
                Summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
                <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 120 }}>Build</span>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>Zylker CRM v2.4.1 (Build 241) · APK</span>
                </div>
                <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 120 }}>Project</span>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>zylker-beta (Firebase)</span>
                </div>
                <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 120 }}>Testers</span>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>
                    {testers.length > 0 ? `${testers.length} recipient${testers.length !== 1 ? "s" : ""}` : "None added"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <Separator style={{ maxWidth: 560, margin: "var(--cds-space-32) 0 var(--cds-space-24)" }} />

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
            <Button
              onClick={handleDeploy}
              style={{ gap: "var(--cds-gap-tight)" }}
            >
              Deploy
              <ChevronRight size={14} />
            </Button>
            <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-channel")}>
              Cancel
            </Button>
          </div>

        </main>
      </div>
    </div>
  )
}
