/**
 * PlaySetupGuideScreen (S-07)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.2 Google Play Deployment (draft app edge case), §9.4 Screen S-07
 *
 * Informational screen shown when Google Play rejects the upload because
 * the app is still in Draft state (never had a manual first release).
 *
 * Google Play requires the FIRST ever release to be uploaded manually
 * via the Play Console web UI. This guide walks users through those steps
 * so they can complete the manual upload, then return and retry from Creator.
 *
 * Error pattern: API returns "Only releases with status draft may be created on draft app"
 *
 * Actions:
 *   - Download AAB (to use in the manual Console upload)
 *   - Open Play Console (external link)
 *   - Retry Deploy (back to deploy-wizard-play with submit_as_draft=true)
 *   - Back to Deploy Wizard
 */

import * as React from "react"
import {
  CheckCircle2,
  ExternalLink,
  Download,
  RotateCcw,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

// ─── Setup step ───────────────────────────────────────────────────────────────

interface SetupStep {
  id: number
  label: string
  detail: string
  done: boolean
  externalAction?: {
    label: string
    url?: string
    onClick?: () => void
  }
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PlaySetupGuideScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  const [checkedSteps, setCheckedSteps] = React.useState<Set<number>>(new Set())

  const steps: SetupStep[] = [
    {
      id: 1,
      label: "Download the signed AAB",
      detail: "Download the signed AAB file from Creator — you'll need it for the manual Play Console upload.",
      done: checkedSteps.has(1),
      externalAction: {
        label: "Download AAB",
        onClick: () => setCheckedSteps((prev) => new Set([...prev, 1])),
      },
    },
    {
      id: 2,
      label: "Open Google Play Console",
      detail: "Go to play.google.com/console, select your app, then navigate to Production → Releases.",
      done: checkedSteps.has(2),
      externalAction: {
        label: "Open Play Console",
        url: "https://play.google.com/console",
      },
    },
    {
      id: 3,
      label: "Create a new release",
      detail: "Click 'Create new release' on the Production track (or Internal testing if you prefer to test first).",
      done: checkedSteps.has(3),
    },
    {
      id: 4,
      label: "Upload the AAB",
      detail: "Upload the AAB file you downloaded in Step 1. Google will process it and assign a version code.",
      done: checkedSteps.has(4),
    },
    {
      id: 5,
      label: "Complete and submit the release",
      detail: "Fill in the release notes, complete any review questionnaires, and click 'Save and publish' (or 'Send for review').",
      done: checkedSteps.has(5),
    },
    {
      id: 6,
      label: "Return here and retry",
      detail: "Once the first release is live (or in review), come back to Creator and click Retry. Future deployments will work automatically via the API.",
      done: false,
    },
  ]

  const allStepsCompleted = [1, 2, 3, 4, 5].every((id) => checkedSteps.has(id))

  function markStep(id: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
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
            onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-play")}
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
            Back to deploy wizard
          </button>

          {/* Error context banner */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--cds-gap-small)",
              backgroundColor: "var(--cds-warning-surface-subtle)",
              border: "1px solid var(--cds-warning-border-minimal)",
              borderRadius: "var(--cds-radius-r)",
              padding: "var(--cds-space-12) var(--cds-space-16)",
              marginBottom: "var(--cds-space-24)",
              maxWidth: 680,
            }}
          >
            <AlertTriangle size={14} style={{ color: "var(--cds-warning-text-default)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-warning-text-default)" }}>
                First-time release required
              </p>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-warning-text-default)" }}>
                Google Play returned: <em>"Only releases with status draft may be created on draft app."</em>{" "}
                This means your app has never been published before and requires a manual first upload via Play Console.
              </p>
            </div>
          </div>

          {/* Page header */}
          <div style={{ marginBottom: "var(--cds-space-8)" }}>
            <h1
              style={{
                fontSize: "var(--cds-text-p1)",
                lineHeight: "var(--cds-leading-p1)",
                fontWeight: 600,
                color: "var(--cds-huegrey-text-dark)",
                margin: "0 0 var(--cds-space-4)",
              }}
            >
              First-Time Play Setup Guide
            </h1>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              Complete these one-time steps in Play Console. After this, all future deployments from Creator will work automatically.
            </p>
          </div>

          {/* App context */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-32)" }}>
            <Badge variant="subtle" colour="indigo">Zylker CRM</Badge>
            <Badge variant="subtle" colour="indigo">com.zylker.app</Badge>
            <Badge variant="subtle" colour="indigo">v2.4.1 · Build 241</Badge>
          </div>

          {/* Checklist */}
          <div
            style={{
              maxWidth: 640,
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: "1px solid var(--border)",
              borderRadius: "var(--cds-radius-r)",
              overflow: "hidden",
              marginBottom: "var(--cds-space-32)",
            }}
          >
            {steps.map((step, index) => {
              const isLast = step.id === 6
              return (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    gap: "var(--cds-gap-default)",
                    padding: "var(--cds-space-16)",
                    backgroundColor: step.done ? "var(--cds-success-surface-subtle)" : "var(--cds-white)",
                    borderBottom: index < steps.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {/* Step indicator */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, flexShrink: 0 }}>
                    {isLast ? (
                      <div
                        style={{
                          width: 24, height: 24, borderRadius: "var(--cds-radius-full)",
                          backgroundColor: allStepsCompleted ? "var(--cds-success-surface-default)" : "var(--cds-huegrey-surface-default)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "var(--cds-text-p3)", fontWeight: 700,
                          color: allStepsCompleted ? "var(--cds-white)" : "var(--cds-huegrey-text-default)",
                        }}
                      >
                        {step.id}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => !isLast && markStep(step.id)}
                        aria-label={step.done ? `Unmark step ${step.id}` : `Mark step ${step.id} done`}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {step.done
                          ? <CheckCircle2 size={24} style={{ color: "var(--cds-success-text-default)" }} />
                          : (
                            <div style={{
                              width: 24, height: 24, borderRadius: "var(--cds-radius-full)",
                              border: "2px solid var(--border)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "var(--cds-text-p3)", fontWeight: 700,
                              color: "var(--cds-huegrey-text-default)",
                              backgroundColor: "var(--cds-white)",
                            }}>
                              {step.id}
                            </div>
                          )
                        }
                      </button>
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: "0 0 var(--cds-space-4)",
                      fontSize: "var(--cds-text-p2)",
                      fontWeight: 600,
                      color: step.done ? "var(--cds-success-text-default)" : "var(--cds-huegrey-text-dark)",
                      textDecoration: step.done ? "line-through" : "none",
                    }}>
                      {step.label}
                    </p>
                    <p style={{
                      margin: "0 0 " + (step.externalAction ? "var(--cds-space-12)" : "0"),
                      fontSize: "var(--cds-text-p3)",
                      color: step.done ? "var(--cds-success-text-default)" : "var(--cds-huegrey-text-default)",
                    }}>
                      {step.detail}
                    </p>
                    {step.externalAction && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={step.externalAction.onClick ?? (() => markStep(step.id))}
                        style={{ gap: "var(--cds-gap-tight)" }}
                      >
                        {step.id === 1 ? <Download size={12} /> : <ExternalLink size={12} />}
                        {step.externalAction.label}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress summary */}
          {checkedSteps.size > 0 && (
            <div
              style={{
                maxWidth: 640,
                backgroundColor: allStepsCompleted ? "var(--cds-success-surface-subtle)" : "var(--cds-huegrey-surface-low)",
                border: `1px solid ${allStepsCompleted ? "var(--cds-success-border-minimal)" : "var(--border)"}`,
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-12) var(--cds-space-16)",
                marginBottom: "var(--cds-space-24)",
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-gap-small)",
              }}
            >
              {allStepsCompleted
                ? <CheckCircle2 size={14} style={{ color: "var(--cds-success-text-default)" }} />
                : null
              }
              <p style={{
                margin: 0, fontSize: "var(--cds-text-p3)",
                color: allStepsCompleted ? "var(--cds-success-text-default)" : "var(--cds-huegrey-text-default)",
                fontWeight: allStepsCompleted ? 600 : 400,
              }}>
                {allStepsCompleted
                  ? "All steps completed — you're ready to retry the deployment."
                  : `${checkedSteps.size} of 5 steps completed`
                }
              </p>
            </div>
          )}

          <Separator style={{ maxWidth: 640, marginBottom: "var(--cds-space-24)" }} />

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)", flexWrap: "wrap" }}>
            <Button
              onClick={() => navigate("deploy-wizard-play")}
              disabled={!allStepsCompleted}
              style={{ gap: "var(--cds-gap-tight)" }}
            >
              <RotateCcw size={14} />
              Retry deployment
            </Button>
            <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-play")}>
              Back to wizard
            </Button>
          </div>

          {!allStepsCompleted && (
            <p style={{ marginTop: "var(--cds-space-8)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
              Complete all steps above before retrying.
            </p>
          )}

        </main>
      </div>
    </div>
  )
}
