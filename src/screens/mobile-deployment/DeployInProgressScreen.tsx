/**
 * DeployInProgressScreen (S-05)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.7 State Machine, §9.4 Screen S-05
 *
 * Shows real-time async job progress:
 *   Queued → Uploading → Processing → Success / Failed
 *
 * States:
 *   - running: step-by-step progress with cancel available in Queued
 *   - success: green confirmation with store link
 *   - failed: red error message with retry guidance
 *
 * On success → navigate to deployment-history
 * On failure → show error + Retry button
 */

import * as React from "react"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  RotateCcw,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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

type StepStatus = "pending" | "running" | "success" | "failed"

interface DeployStep {
  id: string
  label: string
  description: string
  status: StepStatus
}

type DeployOutcome = "running" | "success" | "failed"

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case "success":
      return <CheckCircle2 size={20} style={{ color: "var(--cds-success-text-default)", flexShrink: 0 }} />
    case "failed":
      return <XCircle size={20} style={{ color: "var(--cds-error-text-default)", flexShrink: 0 }} />
    case "running":
      return (
        <Loader2
          size={20}
          className="cds-spin"
          style={{ color: "var(--cds-primary-text-default)", flexShrink: 0 }}
        />
      )
    case "pending":
      return (
        <div
          style={{
            width: 20, height: 20,
            borderRadius: "var(--cds-radius-full)",
            border: "2px solid var(--cds-huegrey-border-default)",
            flexShrink: 0,
          }}
        />
      )
  }
}

// ─── Simulate deploy progress ─────────────────────────────────────────────────

const INITIAL_STEPS: DeployStep[] = [
  {
    id: "queue",
    label: "Queued",
    description: "Deploy job added to processing queue.",
    status: "success",
  },
  {
    id: "upload",
    label: "Uploading",
    description: "Uploading AAB to Google Play servers…",
    status: "running",
  },
  {
    id: "process",
    label: "Processing",
    description: "Google Play is processing the upload. This may take a few minutes.",
    status: "pending",
  },
  {
    id: "confirm",
    label: "Confirming",
    description: "Release confirmed on Internal testing track.",
    status: "pending",
  },
]

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeployInProgressScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()

  const [steps, setSteps] = React.useState<DeployStep[]>(INITIAL_STEPS)
  const [outcome, setOutcome] = React.useState<DeployOutcome>("running")
  const [progress, setProgress] = React.useState(35)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false)

  // Simulate async deployment progression
  React.useEffect(() => {
    if (outcome !== "running") return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Step 2 complete (upload)
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => s.id === "upload" ? { ...s, status: "success" } : s))
      setSteps((prev) => prev.map((s) => s.id === "process" ? { ...s, status: "running" } : s))
      setProgress(65)
    }, 2000))

    // Step 3 complete (processing)
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => s.id === "process" ? { ...s, status: "success" } : s))
      setSteps((prev) => prev.map((s) => s.id === "confirm" ? { ...s, status: "running" } : s))
      setProgress(85)
    }, 4000))

    // Step 4 complete → success
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => s.id === "confirm" ? { ...s, status: "success" } : s))
      setProgress(100)
      setOutcome("success")
    }, 6000))

    return () => timers.forEach(clearTimeout)
  }, [outcome])

  function handleRetry() {
    setSteps(INITIAL_STEPS)
    setOutcome("running")
    setProgress(35)
    setErrorMessage("")
  }

  function handleCancelConfirmed() {
    setShowCancelConfirm(false)
    navigate("mobile-app-list")
  }

  const runningStep = steps.find((s) => s.status === "running")

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

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
              {outcome === "success" ? "Deployment Successful" :
               outcome === "failed"  ? "Deployment Failed" :
               "Deploying…"}
            </h1>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              Zylker CRM v2.4.1 · Google Play · Internal testing track
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ maxWidth: 560, marginBottom: "var(--cds-space-32)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--cds-space-8)" }}>
              <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                {outcome === "running" && runningStep ? runningStep.description : ""}
                {outcome === "success" ? "All steps completed successfully." : ""}
                {outcome === "failed" ? "Deployment stopped due to an error." : ""}
              </span>
              <span style={{
                fontSize: "var(--cds-text-p3)", fontWeight: 600,
                color: outcome === "success" ? "var(--cds-success-text-default)"
                     : outcome === "failed" ? "var(--cds-error-text-default)"
                     : "var(--cds-primary-text-default)",
              }}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Step list */}
          <div
            aria-live="polite"
            aria-label="Deployment progress"
            style={{
              maxWidth: 560,
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: "1px solid var(--border)",
              borderRadius: "var(--cds-radius-r)",
              overflow: "hidden",
              marginBottom: "var(--cds-space-32)",
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  gap: "var(--cds-gap-default)",
                  padding: "var(--cds-space-16)",
                  backgroundColor: step.status === "running" ? "var(--cds-primary-surface-subtle)"
                                 : step.status === "failed"  ? "var(--cds-error-surface-subtle)"
                                 : "var(--cds-white)",
                  borderBottom: index < steps.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <StepIcon status={step.status} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: "0 0 var(--cds-space-4)",
                    fontSize: "var(--cds-text-p2)",
                    fontWeight: step.status === "running" ? 600 : 400,
                    color: step.status === "pending"
                      ? "var(--cds-huegrey-text-default)"
                      : "var(--cds-huegrey-text-dark)",
                  }}>
                    {step.label}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "var(--cds-text-p3)",
                    color: step.status === "failed" ? "var(--cds-error-text-default)"
                         : "var(--cds-huegrey-text-default)",
                  }}>
                    {step.status === "failed" && errorMessage ? errorMessage : step.description}
                  </p>
                </div>
                {step.status === "success" && (
                  <Badge variant="subtle" colour="success">Done</Badge>
                )}
                {step.status === "running" && (
                  <Badge variant="subtle" colour="primary">Running</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Success state */}
          {outcome === "success" && (
            <div
              style={{
                maxWidth: 560,
                backgroundColor: "var(--cds-success-surface-subtle)",
                border: "1px solid var(--cds-success-border-minimal)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-16)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--cds-space-12)",
                marginBottom: "var(--cds-space-24)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                <CheckCircle2 size={16} style={{ color: "var(--cds-success-text-default)" }} />
                <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-success-text-default)" }}>
                  Published to Google Play Internal Testing
                </p>
              </div>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>
                Release <strong>v2.4.1 (Build 241)</strong> is now live on the Internal testing track.
                Testers will receive the update automatically.
              </p>
              <div style={{ display: "flex", gap: "var(--cds-gap-small)", flexWrap: "wrap" }}>
                <Button size="sm" variant="outline" style={{ gap: "var(--cds-gap-tight)" }}>
                  <ExternalLink size={12} />
                  Open in Play Console
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("deployment-history")}
                  style={{ gap: "var(--cds-gap-tight)" }}
                >
                  <History size={12} />
                  View history
                </Button>
              </div>
            </div>
          )}

          {/* Failed state */}
          {outcome === "failed" && (
            <div
              style={{
                maxWidth: 560,
                backgroundColor: "var(--cds-error-surface-subtle)",
                border: "1px solid var(--cds-error-border-minimal)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-16)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--cds-space-12)",
                marginBottom: "var(--cds-space-24)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                <XCircle size={16} style={{ color: "var(--cds-error-text-default)" }} />
                <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-error-text-default)" }}>
                  Deployment failed
                </p>
              </div>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>
                {errorMessage || "An unexpected error occurred during upload. Check your credentials and try again."}
              </p>
            </div>
          )}

          <Separator style={{ maxWidth: 560, marginBottom: "var(--cds-space-24)" }} />

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
            {outcome === "running" && (
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel deployment
              </Button>
            )}
            {outcome === "success" && (
              <>
                <Button onClick={() => navigate("deployment-history")} style={{ gap: "var(--cds-gap-tight)" }}>
                  <History size={14} />
                  View deployment history
                </Button>
                <Button variant="outline" onClick={() => navigate("deploy-wizard-channel")}>
                  Deploy another channel
                </Button>
              </>
            )}
            {outcome === "failed" && (
              <>
                <Button onClick={handleRetry} style={{ gap: "var(--cds-gap-tight)" }}>
                  <RotateCcw size={14} />
                  Retry
                </Button>
                <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("deploy-wizard-play")}>
                  Edit configuration
                </Button>
              </>
            )}
          </div>

        </main>
      </div>
      {/* Cancel deployment confirmation */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Cancel this deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              The signed build will not be uploaded. You can start a new deployment from the Mobile screen at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep deploying</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirmed}>Cancel deployment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
