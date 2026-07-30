/**
 * MobileAppListScreen (Entry Point)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §9.1 Surface & Entry Points, §9.4
 *
 * UX pattern (Option B — Full-page Dialog):
 *   - Mobile hub app list with Mobile App / SDK tabs
 *   - Clicking a row → code-sign detail Sheet (existing behaviour, preserved)
 *   - "Deploy" in the Sheet → opens full-page Deploy Wizard Dialog
 *   - "Manage credentials" link → opens Store Credentials Dialog
 *   - "View history" → opens Deployment History Dialog
 *   - All wizard steps live inside the Dialog — no page navigation away
 */

import * as React from "react"
import {
  RotateCcw,
  Download,
  Smartphone,
  History,
  Info,
  Plus,
  SlidersHorizontal,
  Search,
  Settings,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { TagInput } from "@/components/ui/tag-input"
import { StatusBadge } from "@/components/ui/status-badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioCard } from "@/components/ui/radio-card"
import { InputPrefix } from "@/components/ui/input-prefix"
import { InputSuffix } from "@/components/ui/input-suffix"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

type Platform = "iOS" | "Android"
type UserType = "For User" | "For Customer"
type CodesignStatus = "signed" | "not-signed"
type CredentialType = "google-play" | "app-store-connect" | "firebase"
type CredentialStatus = "connected" | "expired" | "error" | "validating"
type PlayTrack = "internal" | "alpha" | "beta" | "production"
type DeployChannel = "google-play" | "firebase" | "mdm" | "adhoc"
type StepStatus = "pending" | "running" | "success" | "failed"
type DeployOutcome = "running" | "success" | "failed"
type DeployStatus = "success" | "failed" | "running" | "queued" | "cancelled"
type HistoryChannel = "Google Play" | "Firebase" | "Zoho MDM" | "Ad-hoc"

interface MobileApp {
  id: string; name: string; initials: string; avatarColor: string
  userType: UserType; platform: Platform; codesignStatus: CodesignStatus
  version?: string; bundleId?: string; provisioningProfile?: string; certificate?: string; hasUpdate?: boolean
}

interface Credential {
  id: string; label: string; type: CredentialType; status: CredentialStatus; lastValidated: string; packageHint?: string
}

interface DeployStep {
  id: string; label: string; description: string; status: StepStatus
}

interface DeploymentRecord {
  id: string; channel: HistoryChannel; track: string; version: string; buildNumber: string
  status: DeployStatus; initiatedBy: string; createdAt: string; completedAt?: string; storeLink?: string; errorMessage?: string
}

// ═══════════════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════════════

const MOBILE_APPS: MobileApp[] = [
  { id: "app-1", name: "Auto Dealership", initials: "AD", avatarColor: "var(--cds-primary-surface-default)", userType: "For User", platform: "iOS", codesignStatus: "signed", version: "1.0.0", bundleId: "com.riyaz.creatorappstoretest", provisioningProfile: "Creator Appstore test", certificate: "Apple Distribution: Riyaz Mohammed (2F85DDBGQQ)", hasUpdate: true },
  { id: "app-2", name: "Servolife Insurances", initials: "SI", avatarColor: "var(--cds-huegrey-surface-bold)", userType: "For Customer", platform: "Android", codesignStatus: "signed", version: "2.1.0", bundleId: "com.servolife.insurance", provisioningProfile: "Play Distribution", certificate: "Servolife Distribution Key" },
  { id: "app-3", name: "Servolife Insurances", initials: "SI", avatarColor: "var(--cds-huegrey-surface-bold)", userType: "For Customer", platform: "iOS", codesignStatus: "signed", version: "2.1.0", bundleId: "com.servolife.insurance.ios", provisioningProfile: "Creator Appstore test", certificate: "Apple Distribution: Servolife (ABC123XYZ)" },
  { id: "app-4", name: "Fleet Management", initials: "FM", avatarColor: "var(--cds-primary-surface-default)", userType: "For Customer", platform: "iOS", codesignStatus: "not-signed", bundleId: "com.fleet.management" },
]

const SDK_APPS: MobileApp[] = [
  { id: "sdk-1", name: "Claim Request", initials: "CR", avatarColor: "var(--cds-primary-surface-default)", userType: "For Customer", platform: "iOS", codesignStatus: "not-signed" },
  { id: "sdk-2", name: "Auto Supplies", initials: "AS", avatarColor: "var(--cds-success-surface-default)", userType: "For User", platform: "iOS", codesignStatus: "not-signed" },
  { id: "sdk-3", name: "Custom Procurement Management", initials: "CPM", avatarColor: "var(--cds-error-surface-default)", userType: "For User", platform: "iOS", codesignStatus: "not-signed" },
]

const SEED_CREDENTIALS: Credential[] = [
  { id: "cred-1", label: "Zylker Play Service Account", type: "google-play", status: "connected", lastValidated: "Today, 9:41 AM", packageHint: "com.zylker.app" },
  { id: "cred-2", label: "Firebase – Zylker Beta", type: "firebase", status: "connected", lastValidated: "Yesterday, 6:12 PM" },
  { id: "cred-3", label: "App Store Connect (Phase 2)", type: "app-store-connect", status: "error", lastValidated: "3 days ago" },
]

const SEED_HISTORY: DeploymentRecord[] = [
  { id: "dep-1", channel: "Google Play", track: "Internal testing", version: "v2.4.1", buildNumber: "241", status: "running", initiatedBy: "rajan.sharma", createdAt: "Today, 11:05 AM" },
  { id: "dep-2", channel: "Firebase", track: "Beta group", version: "v2.4.1", buildNumber: "241", status: "success", initiatedBy: "rajan.sharma", createdAt: "Today, 10:52 AM", completedAt: "Today, 10:54 AM", storeLink: "#" },
  { id: "dep-3", channel: "Google Play", track: "Internal testing", version: "v2.4.0", buildNumber: "240", status: "failed", initiatedBy: "admin@zylker.com", createdAt: "Yesterday, 6:30 PM", completedAt: "Yesterday, 6:31 PM", errorMessage: "Package name mismatch" },
  { id: "dep-4", channel: "Google Play", track: "Internal testing", version: "v2.3.9", buildNumber: "239", status: "success", initiatedBy: "admin@zylker.com", createdAt: "2 days ago", completedAt: "2 days ago", storeLink: "#" },
]

const CHANNEL_OPTIONS = [
  { id: "google-play" as DeployChannel, label: "Google Play", description: "Upload AAB to Internal, Alpha, Beta, or Production tracks.", badge: "Android", badgeColour: "success" as const, credConfigured: true },
  { id: "firebase" as DeployChannel, label: "Firebase App Distribution", description: "Distribute APK/AAB to beta testers via Firebase.", badge: "Beta", badgeColour: "primary" as const, credConfigured: true },
  { id: "mdm" as DeployChannel, label: "Zoho MDM", description: "Push to enrolled devices managed by Zoho MDM.", badge: "Enterprise", badgeColour: "indigo" as const, credConfigured: true },
  { id: "adhoc" as DeployChannel, label: "Ad-hoc Link", description: "Share a download link via email.", credConfigured: true },
]

const TRACK_LABELS: Record<PlayTrack, string> = { internal: "Internal testing", alpha: "Closed testing (Alpha)", beta: "Open testing (Beta)", production: "Production" }
const TYPE_LABELS: Record<CredentialType, string> = { "google-play": "Google Play", "app-store-connect": "App Store Connect", "firebase": "Firebase App Distribution" }

const INITIAL_STEPS: DeployStep[] = [
  { id: "queue", label: "Queued", description: "Deploy job added to queue.", status: "success" },
  { id: "upload", label: "Uploading", description: "Uploading AAB to Google Play…", status: "running" },
  { id: "process", label: "Processing", description: "Google Play is processing the upload.", status: "pending" },
  { id: "confirm", label: "Confirming", description: "Release confirmed on Internal track.", status: "pending" },
]

// ═══════════════════════════════════════════════════════════════════════
// SMALL HELPERS
// ═══════════════════════════════════════════════════════════════════════

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
      {platform === "iOS"
        ? <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><path d="M11.2 7.35c-.02-1.9 1.55-2.8 1.62-2.84-.88-1.3-2.25-1.47-2.74-1.49-1.17-.12-2.28.69-2.87.69-.59 0-1.5-.67-2.47-.65-1.27.02-2.44.74-3.09 1.88C.2 7.2.98 10.1 2.42 11.7c.71.82 1.55 1.73 2.65 1.69 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.77.67 1.14-.02 1.86-.83 2.56-1.66.81-.95 1.14-1.87 1.16-1.92-.03-.01-2.2-.85-2.22-3.24zM9.21 2.06c.59-.72.99-1.71.88-2.71-.85.04-1.88.57-2.49 1.28-.54.63-1.02 1.64-.89 2.6.94.07 1.9-.48 2.5-1.17z"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17.523 15.341l-.9 1.56a.75.75 0 01-1.295-.75l.895-1.55A9.4 9.4 0 0112 15a9.4 9.4 0 01-4.223-.399l.895 1.55a.75.75 0 01-1.295.75l-.9-1.56A9.013 9.013 0 013 7.5h18a9.013 9.013 0 01-3.477 7.841zM8.5 11a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM8.421 4.5l-1.5-2.598a.75.75 0 111.299-.75L9.78 3.75c.7-.162 1.428-.25 2.22-.25s1.52.088 2.22.25l1.56-2.598a.75.75 0 111.298.75L15.58 4.5H8.421z" fill="#3DDC84"/></svg>
      }
      <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{platform}</span>
    </div>
  )
}

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case "success": return <CheckCircle2 size={18} style={{ color: "var(--cds-success-text-default)", flexShrink: 0 }} />
    case "failed":  return <XCircle size={18} style={{ color: "var(--cds-error-text-default)", flexShrink: 0 }} />
    case "running": return <Loader2 size={18} style={{ color: "var(--cds-primary-text-default)", flexShrink: 0, animation: "spin 1s linear infinite" }} />
    case "pending": return <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--border)", flexShrink: 0 }} />
  }
}

function historyStatusBadge(status: DeployStatus) {
  const map: Record<DeployStatus, { colour: "success"|"error"|"primary"|"indigo"; label: string }> = {
    success: { colour: "success", label: "Success" },
    failed:  { colour: "error",   label: "Failed"  },
    running: { colour: "primary", label: "Running" },
    queued:  { colour: "indigo",  label: "Queued"  },
    cancelled: { colour: "indigo", label: "Cancelled" },
  }
  const { colour, label } = map[status]
  return <Badge variant="subtle" colour={colour} size="sm">{label}</Badge>
}

function credStatusBadge(status: CredentialStatus) {
  switch (status) {
    case "connected":  return <StatusBadge status="configured" />
    case "expired":    return <StatusBadge status="not-configured" />
    case "error":      return <StatusBadge status="error" />
    case "validating": return <StatusBadge status="pending" />
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DEPLOY WIZARD DIALOG
// Manages all wizard steps internally: Channel → Play/Firebase Config → In Progress → Result
// ═══════════════════════════════════════════════════════════════════════

type WizardStep = "channel" | "play" | "firebase" | "progress" | "done"

interface DeployWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appName: string
  onOpenCredentials: () => void
  onOpenHistory: () => void
}

function DeployWizardDialog({ open, onOpenChange, appName, onOpenCredentials, onOpenHistory }: DeployWizardDialogProps) {
  const [step, setStep]                 = React.useState<WizardStep>("channel")
  const [channel, setChannel]           = React.useState<DeployChannel>("google-play")
  const [track, setTrack]               = React.useState<PlayTrack>("internal")
  const [rollout, setRollout]           = React.useState<number[]>([100])
  const [releaseNotes, setReleaseNotes] = React.useState("")
  const [submitAsDraft, setSubmitAsDraft] = React.useState(false)
  const [testers, setTesters]           = React.useState<string[]>(["qa-team@zylker.com"])
  const [errors, setErrors]             = React.useState<Record<string, string>>({})
  const [progressSteps, setProgressSteps] = React.useState<DeployStep[]>(INITIAL_STEPS)
  const [outcome, setOutcome]           = React.useState<DeployOutcome>("running")
  const [progress, setProgress]         = React.useState(35)
  const [showProdConfirm, setShowProdConfirm] = React.useState(false)

  function reset() {
    setStep("channel"); setChannel("google-play"); setTrack("internal")
    setRollout([100]); setReleaseNotes(""); setSubmitAsDraft(false)
    setTesters(["qa-team@zylker.com"]); setErrors({})
    setProgressSteps(INITIAL_STEPS); setOutcome("running"); setProgress(35)
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function handleChannelNext() {
    if (channel === "google-play") setStep("play")
    else if (channel === "firebase") setStep("firebase")
    else { setStep("progress"); startProgress() }
  }

  function handlePlayDeploy() {
    const errs: Record<string, string> = {}
    if (track === "production" && !releaseNotes.trim()) errs.releaseNotes = "Release notes required for Production."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (track === "production") { setShowProdConfirm(true); return }
    setStep("progress"); startProgress()
  }

  function handleFirebaseDeploy() {
    const errs: Record<string, string> = {}
    if (testers.length === 0) errs.testers = "Add at least one tester email."
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setStep("progress"); startProgress()
  }

  function startProgress() {
    setProgressSteps(INITIAL_STEPS); setOutcome("running"); setProgress(35)
    setTimeout(() => {
      setProgressSteps(p => p.map(s => s.id === "upload" ? { ...s, status: "success" } : s.id === "process" ? { ...s, status: "running" } : s))
      setProgress(65)
    }, 1800)
    setTimeout(() => {
      setProgressSteps(p => p.map(s => s.id === "process" ? { ...s, status: "success" } : s.id === "confirm" ? { ...s, status: "running" } : s))
      setProgress(85)
    }, 3500)
    setTimeout(() => {
      setProgressSteps(p => p.map(s => s.id === "confirm" ? { ...s, status: "success" } : s))
      setProgress(100); setOutcome("success")
    }, 5000)
  }

  const titleMap: Record<WizardStep, string> = {
    channel: "Deploy App",
    play: "Deploy to Google Play",
    firebase: "Deploy to Firebase App Distribution",
    progress: outcome === "success" ? "Deployment Successful" : outcome === "failed" ? "Deployment Failed" : "Deploying…",
    done: "Done",
  }

  const runningStep = progressSteps.find(s => s.status === "running")

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          style={{
            maxWidth: 680,
            width: "calc(100vw - 48px)",
            maxHeight: "calc(100vh - 64px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          {/* Dialog header */}
          <div style={{ padding: "var(--cds-space-20) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {step !== "channel" && step !== "progress" && (
              <button type="button" onClick={() => setStep(step === "play" || step === "firebase" ? "channel" : "channel")}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p3)", padding: "0 0 var(--cds-space-12)" }}>
                <ArrowLeft size={13} />
                Back
              </button>
            )}
            <DialogHeader>
              <DialogTitle style={{ fontSize: "var(--cds-text-h3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
                {titleMap[step]}
              </DialogTitle>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                {appName} · {step === "channel" ? "Choose a distribution channel" : step === "progress" ? `Google Play · Internal track` : step === "play" ? "Configure Google Play release" : "Configure Firebase distribution"}
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-24)" }}>

            {/* ── STEP: Channel Select ── */}
            {step === "channel" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-default)" }}>
                <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Select channel
                </p>
                <RadioGroup value={channel} onValueChange={(v) => setChannel(v as DeployChannel)}
                  style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-default)" }}>
                  {CHANNEL_OPTIONS.map((ch) => (
                    <div key={ch.id} style={{ position: "relative" }}>
                      <RadioCard value={ch.id} label={ch.label} description={ch.description} />
                      {ch.badge && (
                        <div style={{ position: "absolute", top: "50%", right: "var(--cds-space-16)", transform: "translateY(-50%)", pointerEvents: "none" }}>
                          <Badge variant="subtle" colour={ch.badgeColour ?? "indigo"}>{ch.badge}</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                <button type="button" onClick={onOpenCredentials}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p3)", padding: "var(--cds-space-8) 0 0" }}>
                  <Settings size={12} />
                  Manage store credentials
                </button>
              </div>
            )}

            {/* ── STEP: Play Config ── */}
            {step === "play" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                  <Label>Track</Label>
                  <Select value={track} onValueChange={(v) => setTrack(v as PlayTrack)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(TRACK_LABELS) as PlayTrack[]).map(t => (
                        <SelectItem key={t} value={t}>{TRACK_LABELS[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {track === "production" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Label>Staged rollout</Label>
                      <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-primary-text-default)" }}>{rollout[0]}%</span>
                    </div>
                    <Slider min={1} max={100} step={1} value={rollout}
                      onValueChange={(v) => setRollout(Array.isArray(v) ? [...v] : [v as number])} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                  <Label>Release notes {track === "production" && <span style={{ color: "var(--cds-error-text-default)" }}>*</span>}</Label>
                  <Textarea rows={3} placeholder="What's new in this release?" value={releaseNotes}
                    onChange={(e) => { setReleaseNotes(e.target.value); setErrors(p => ({ ...p, releaseNotes: "" })) }}
                    style={errors.releaseNotes ? { border: "1px solid var(--cds-error-border-default)" } : undefined} />
                  {errors.releaseNotes && (
                    <div style={{ display: "flex", gap: "var(--cds-gap-tight)", alignItems: "center" }}>
                      <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)" }} />
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>{errors.releaseNotes}</p>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-default)", backgroundColor: "var(--cds-huegrey-surface-low)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-12) var(--cds-space-16)", border: "1px solid var(--border)" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>Submit as draft</p>
                    <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Enable if your Play app has never been published before.</p>
                  </div>
                  <Switch checked={submitAsDraft} onCheckedChange={setSubmitAsDraft} />
                </div>
              </div>
            )}

            {/* ── STEP: Firebase Config ── */}
            {step === "firebase" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                  <Label>Testers <span style={{ color: "var(--cds-error-text-default)" }}>*</span></Label>
                  <TagInput value={testers} onChange={(t) => { setTesters(t); if (t.length > 0) setErrors(p => ({ ...p, testers: "" })) }} placeholder="Add email or group alias…" />
                  {errors.testers && (
                    <div style={{ display: "flex", gap: "var(--cds-gap-tight)", alignItems: "center" }}>
                      <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)" }} />
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>{errors.testers}</p>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                  <Label>Release notes (optional)</Label>
                  <Textarea rows={3} placeholder="Describe what testers should focus on…" value={releaseNotes} onChange={(e) => setReleaseNotes(e.target.value)} />
                </div>
                <div style={{ backgroundColor: "var(--cds-huegrey-surface-low)", border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-12) var(--cds-space-16)", display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Summary</p>
                  <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                    <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 100 }}>Testers</span>
                    <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{testers.length > 0 ? `${testers.length} recipient${testers.length !== 1 ? "s" : ""}` : "None added"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP: In Progress ── */}
            {step === "progress" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--cds-space-8)" }}>
                    <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                      {outcome === "running" && runningStep ? runningStep.description : outcome === "success" ? "All steps completed." : "Stopped due to error."}
                    </span>
                    <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: outcome === "success" ? "var(--cds-success-text-default)" : outcome === "failed" ? "var(--cds-error-text-default)" : "var(--cds-primary-text-default)" }}>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
                  {progressSteps.map((s, i) => (
                    <div key={s.id} style={{ display: "flex", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-space-16)", backgroundColor: s.status === "running" ? "var(--cds-primary-surface-subtle)" : s.status === "failed" ? "var(--cds-error-surface-subtle)" : "var(--cds-white)", borderBottom: i < progressSteps.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <StepIcon status={s.status} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 2px", fontSize: "var(--cds-text-p2)", fontWeight: s.status === "running" ? 600 : 400, color: s.status === "pending" ? "var(--cds-huegrey-text-default)" : "var(--cds-huegrey-text-dark)" }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: s.status === "failed" ? "var(--cds-error-text-default)" : "var(--cds-huegrey-text-default)" }}>{s.description}</p>
                      </div>
                      {s.status === "success" && <Badge variant="subtle" colour="success" size="sm">Done</Badge>}
                    </div>
                  ))}
                </div>
                {outcome === "success" && (
                  <div style={{ backgroundColor: "var(--cds-success-surface-subtle)", border: "1px solid var(--cds-success-border-minimal)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-16)", display: "flex", flexDirection: "column", gap: "var(--cds-space-8)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                      <CheckCircle2 size={14} style={{ color: "var(--cds-success-text-default)" }} />
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-success-text-default)" }}>Published to Google Play Internal Testing</p>
                    </div>
                    <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>Release is now live. Testers will receive the update automatically.</p>
                  </div>
                )}
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div style={{ padding: "var(--cds-space-16) var(--cds-space-24)", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", gap: "var(--cds-gap-small)" }}>
            {step === "channel" && (
              <>
                <Button onClick={handleChannelNext} style={{ gap: "var(--cds-gap-tight)" }}>Next <ChevronRight size={14} /></Button>
                <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              </>
            )}
            {step === "play" && (
              <>
                <Button onClick={handlePlayDeploy} style={{ gap: "var(--cds-gap-tight)" }}>Deploy <ChevronRight size={14} /></Button>
                <Button variant="outline" onClick={() => setStep("channel")}>Back</Button>
              </>
            )}
            {step === "firebase" && (
              <>
                <Button onClick={handleFirebaseDeploy} style={{ gap: "var(--cds-gap-tight)" }}>Deploy <ChevronRight size={14} /></Button>
                <Button variant="outline" onClick={() => setStep("channel")}>Back</Button>
              </>
            )}
            {step === "progress" && outcome === "running" && (
              <Button variant="outline" disabled>Cancel (available when queued)</Button>
            )}
            {step === "progress" && outcome === "success" && (
              <>
                <Button onClick={() => { handleClose(false); onOpenHistory() }} style={{ gap: "var(--cds-gap-tight)" }}>
                  <History size={14} /> View history
                </Button>
                <Button variant="outline" onClick={() => handleClose(false)}>Close</Button>
              </>
            )}
            {step === "progress" && outcome === "failed" && (
              <>
                <Button onClick={() => { setStep("progress"); startProgress() }} style={{ gap: "var(--cds-gap-tight)" }}>
                  <RotateCcw size={14} /> Retry
                </Button>
                <Button variant="outline" onClick={() => setStep("channel")}>Edit configuration</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Production confirm */}
      <AlertDialog open={showProdConfirm} onOpenChange={setShowProdConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Deploy to Production?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish <strong>{appName}</strong> to {rollout[0] < 100 ? `${rollout[0]}%` : "all"} users on the Google Play Store. Use Play Console to halt or revert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowProdConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowProdConfirm(false); setStep("progress"); startProgress() }}>Confirm Deploy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// STORE CREDENTIALS DIALOG
// ═══════════════════════════════════════════════════════════════════════

interface CredentialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBackToDeploy?: () => void
}

function CredentialsDialog({ open, onOpenChange, onBackToDeploy }: CredentialsDialogProps) {
  const [credentials, setCredentials] = React.useState<Credential[]>(SEED_CREDENTIALS)
  const [addOpen, setAddOpen]         = React.useState(false)
  const [deleteId, setDeleteId]       = React.useState<string | null>(null)
  const [addStep, setAddStep]         = React.useState<1|2|3>(1)
  const [addType, setAddType]         = React.useState<CredentialType>("google-play")
  const [addLabel, setAddLabel]       = React.useState("")
  const [addJson, setAddJson]         = React.useState("")
  const [validating, setValidating]   = React.useState(false)

  function handleValidate() {
    setValidating(true)
    setTimeout(() => { setValidating(false); setAddStep(3) }, 1800)
  }

  function handleSave() {
    setCredentials(p => [...p, { id: Date.now().toString(), label: addLabel || `${TYPE_LABELS[addType]} credential`, type: addType, status: "connected", lastValidated: "Just now" }])
    setAddOpen(false); setAddStep(1); setAddLabel(""); setAddJson("")
  }

  function handleRevalidate(id: string) {
    setCredentials(p => p.map(c => c.id === id ? { ...c, status: "validating", lastValidated: "Validating…" } : c))
    setTimeout(() => setCredentials(p => p.map(c => c.id === id ? { ...c, status: "connected", lastValidated: "Just now" } : c)), 1800)
  }

  const credToDelete = credentials.find(c => c.id === deleteId)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ maxWidth: 680, width: "calc(100vw - 48px)", maxHeight: "calc(100vh - 64px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}>
          <div style={{ padding: "var(--cds-space-20) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: "var(--cds-text-h3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Store Credentials</DialogTitle>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Connect Google Play, App Store Connect, and Firebase accounts.</p>
            </DialogHeader>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-20) var(--cds-space-24)" }}>
            {/* Permission notice */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-small)", backgroundColor: "var(--cds-warning-surface-subtle)", border: "1px solid var(--cds-warning-border-minimal)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-8) var(--cds-space-12)", marginBottom: "var(--cds-space-16)" }}>
              <ShieldAlert size={13} style={{ color: "var(--cds-warning-text-default)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-warning-text-default)" }}>Only <strong>Super Admin</strong> and <strong>Admin</strong> roles can manage credentials.</p>
            </div>
            {/* Credentials table */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ minWidth: 180 }}>Label</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead style={{ minWidth: 120 }}>Last validated</TableHead>
                    <TableHead style={{ width: 48 }} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map(cred => (
                    <TableRow key={cred.id}>
                      <TableCell>
                        <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>{cred.label}</p>
                        {cred.packageHint && <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-muted)" }}>{cred.packageHint}</p>}
                      </TableCell>
                      <TableCell><Badge variant="subtle" colour="indigo">{TYPE_LABELS[cred.type]}</Badge></TableCell>
                      <TableCell>{credStatusBadge(cred.status)}</TableCell>
                      <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{cred.lastValidated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" aria-label="Actions"><MoreHorizontal size={13} /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRevalidate(cred.id)}>
                              <RefreshCw size={12} /> Re-validate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(cred.id)} style={{ color: "var(--cds-error-text-default)" }}>
                              <Trash2 size={12} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div style={{ padding: "var(--cds-space-16) var(--cds-space-24)", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", gap: "var(--cds-gap-small)", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
              <Button onClick={() => setAddOpen(true)} style={{ gap: "var(--cds-gap-tight)" }}><Plus size={13} /> Add credential</Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
            {onBackToDeploy && (
              <button type="button" onClick={() => { onOpenChange(false); onBackToDeploy() }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p3)", padding: 0 }}>
                <ArrowLeft size={12} />
                Back to Deploy wizard
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add credential sheet */}
      <Sheet open={addOpen} onOpenChange={(o) => { if (!o) { setAddStep(1); setAddLabel(""); setAddJson("") } setAddOpen(o) }}>
        <SheetContent side="right" style={{ width: 440, maxWidth: "100vw", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "var(--cds-space-20) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Add store credential</p>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-20) var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
            {/* Step indicator */}
            <div style={{ display: "flex", gap: "var(--cds-gap-small)", alignItems: "center" }}>
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div style={{ width: 24, height: 24, borderRadius: "var(--cds-radius-full)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--cds-text-p3)", fontWeight: 700, flexShrink: 0, backgroundColor: addStep >= s ? "var(--cds-primary-surface-default)" : "var(--cds-white)", color: addStep >= s ? "var(--cds-white)" : "var(--cds-huegrey-text-dark)", border: addStep >= s ? "none" : "1px solid var(--cds-huegrey-border-minimal)" }}>{s}</div>
                  {s < 3 && <div style={{ flex: 1, height: 1, backgroundColor: addStep > s ? "var(--cds-primary-border-default)" : "var(--border)" }} />}
                </React.Fragment>
              ))}
            </div>
            {addStep === 1 && (
              <>
                <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Select credential type</p>
                {(["google-play", "firebase", "app-store-connect"] as CredentialType[]).map(type => {
                  const CRED_DESCRIPTIONS: Record<CredentialType, string> = {
                    "google-play": "Service account JSON with Release Manager role",
                    "firebase": "Service account JSON for Firebase project",
                    "app-store-connect": "API key (.p8) with App Manager role — Phase 2",
                  }
                  return (
                    <button key={type} type="button" onClick={() => type !== "app-store-connect" && setAddType(type)}
                      style={{ border: `1px solid ${addType === type ? "var(--cds-primary-border-default)" : "var(--border)"}`, borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-12) var(--cds-space-16)", background: addType === type ? "var(--cds-primary-surface-subtle)" : "var(--cds-white)", cursor: type === "app-store-connect" ? "not-allowed" : "pointer", opacity: type === "app-store-connect" ? 0.5 : 1, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--cds-gap-small)" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 var(--cds-space-4)", fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>{TYPE_LABELS[type]}</p>
                        <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{CRED_DESCRIPTIONS[type]}</p>
                      </div>
                      {type === "app-store-connect" && <Badge variant="subtle" colour="indigo" size="sm">Phase 2</Badge>}
                    </button>
                  )
                })}
                <Button onClick={() => setAddStep(2)} style={{ width: "100%" }}>Next</Button>
              </>
            )}
            {addStep === 2 && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                  <Label>Label</Label>
                  <Input placeholder={`e.g. ${TYPE_LABELS[addType]} – Production`} value={addLabel} onChange={e => setAddLabel(e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                  <Label>Service account JSON</Label>
                  {/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}
                  <Textarea rows={6} placeholder={'{\n  "type": "service_account",\n  ...\n}'} value={addJson} onChange={e => setAddJson(e.target.value)} style={{ fontFamily: "monospace", fontSize: "var(--cds-text-p3)" }} />
                </div>
                <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
                  <Button onClick={handleValidate} disabled={!addJson.trim() || validating}>{validating ? "Validating…" : "Validate connection"}</Button>
                  <Button variant="outline" onClick={() => setAddStep(1)}>Back</Button>
                </div>
              </>
            )}
            {addStep === 3 && (
              <>
                <div style={{ backgroundColor: "var(--cds-success-surface-subtle)", border: "1px solid var(--cds-success-border-minimal)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-12)" }}>
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-success-text-default)" }}>Connection validated</p>
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>Successfully connected to {TYPE_LABELS[addType]}.</p>
                </div>
                <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
                  <Button onClick={handleSave}>Save credential</Button>
                  <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Delete credential?</AlertDialogTitle>
            <AlertDialogDescription><strong>{credToDelete?.label}</strong> will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setCredentials(p => p.filter(c => c.id !== deleteId)); setDeleteId(null) }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// DEPLOYMENT HISTORY DIALOG
// ═══════════════════════════════════════════════════════════════════════

interface HistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewDeploy: () => void
}

function HistoryDialog({ open, onOpenChange, onNewDeploy }: HistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 860, width: "calc(100vw - 48px)", maxHeight: "calc(100vh - 64px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}>
        <div style={{ padding: "var(--cds-space-20) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <DialogHeader>
              <DialogTitle style={{ fontSize: "var(--cds-text-h3)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Deployment History</DialogTitle>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>All deployment attempts, newest first</p>
            </DialogHeader>
          </div>
          <Button onClick={() => { onOpenChange(false); onNewDeploy() }} style={{ gap: "var(--cds-gap-tight)" }}>
            <Plus size={13} /> New deployment
          </Button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-20) var(--cds-space-24)" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated by</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead style={{ width: 80 }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SEED_HISTORY.map(record => (
                  <TableRow key={record.id}
                    style={record.status === "failed" ? { backgroundColor: "var(--cds-error-surface-subtle)" } : record.status === "running" ? { backgroundColor: "var(--cds-primary-surface-subtle)" } : undefined}>
                    <TableCell>
                      <Badge variant="subtle" colour={record.channel === "Google Play" ? "primary" : record.channel === "Firebase" ? "warning" : "indigo"}>
                        {record.channel}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{record.track}</TableCell>
                    <TableCell>
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)" }}>{record.version}</p>
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Build {record.buildNumber}</p>
                    </TableCell>
                    <TableCell>
                      {historyStatusBadge(record.status)}
                      {record.errorMessage && <p style={{ margin: "2px 0 0", fontSize: "var(--cds-text-p4)", color: "var(--cds-error-text-default)", maxWidth: 180 }}>{record.errorMessage}</p>}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{record.initiatedBy}</TableCell>
                    <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                      <p style={{ margin: 0 }}>{record.createdAt}</p>
                      {record.completedAt && record.completedAt !== record.createdAt && <p style={{ margin: 0, color: "var(--cds-huegrey-text-muted)" }}>Done: {record.completedAt}</p>}
                    </TableCell>
                    <TableCell>
                      {record.storeLink && <Button size="sm" variant="ghost" style={{ gap: "var(--cds-gap-tight)", padding: "4px 8px" }}><ExternalLink size={11} />Console</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div style={{ padding: "var(--cds-space-16) var(--cds-space-24)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// APP TABLE
// ═══════════════════════════════════════════════════════════════════════

function AppTable({ apps, isMobileTab, onRowClick }: { apps: MobileApp[]; isMobileTab: boolean; onRowClick: (a: MobileApp) => void }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>App Name</TableHead>
            <TableHead>User Type</TableHead>
            {isMobileTab && <TableHead>Mobile</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map(app => (
            <TableRow key={app.id} style={{ cursor: "pointer" }} onClick={() => onRowClick(app)}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "var(--cds-radius-s)", backgroundColor: app.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700, flexShrink: 0 }}>{app.initials}</div>
                  <span style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)" }}>{app.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--cds-huegrey-text-default)" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
                  <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{app.userType}</span>
                </div>
              </TableCell>
              {isMobileTab && <TableCell><PlatformBadge platform={app.platform} /></TableCell>}
            </TableRow>
          ))}
          {apps.length === 0 && (
            <TableRow><TableCell colSpan={isMobileTab ? 3 : 2} style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p3)" }}>
              No apps match your search.{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════

export default function MobileAppListScreen() {
  useNavigation()
  const [activeTab, setActiveTab]         = React.useState("mobile-app")
  const [selectedApp, setSelectedApp]     = React.useState<MobileApp | null>(null)
  const [sheetOpen, setSheetOpen]         = React.useState(false)
  const [deployOpen, setDeployOpen]       = React.useState(false)
  const [credentialsOpen, setCredentialsOpen] = React.useState(false)
  const [historyOpen, setHistoryOpen]     = React.useState(false)
  const [search, setSearch]               = React.useState("")

  const currentApps = activeTab === "mobile-app" ? MOBILE_APPS : SDK_APPS
  const filtered = currentApps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

  function openDeploy(app: MobileApp) {
    setSelectedApp(app)
    setSheetOpen(false)
    setDeployOpen(true)
  }

  function openHistory(app: MobileApp) {
    setSelectedApp(app)
    setSheetOpen(false)
    setHistoryOpen(true)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId="mobile" />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--cds-space-20)" }}>
            <div>
              <h1 style={{ fontSize: "var(--cds-text-p1)", lineHeight: "var(--cds-leading-p1)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>Mobile</h1>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
                Download Creator application as a native mobile app or build a custom app using SDKs.{" "}
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p2)", padding: 0 }}>Learn more</button>
              </p>
            </div>
            <Button style={{ gap: "var(--cds-gap-tight)" }}><Plus size={14} /> Create New</Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList style={{ marginBottom: "var(--cds-space-20)", borderBottom: "1px solid var(--border)", width: "100%" }}>
              <TabsTrigger value="mobile-app">Mobile App</TabsTrigger>
              <TabsTrigger value="sdk">SDK</TabsTrigger>
            </TabsList>

            {/* Search + Filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--cds-space-16)" }}>
              <div style={{ width: 280 }}>
                <InputPrefix
                  prefixIcon={<Search size={13} />}
                  placeholder="Search"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" style={{ gap: "var(--cds-gap-tight)" }}><SlidersHorizontal size={13} /> Filter</Button>
            </div>

            <TabsContent value="mobile-app">
              <AppTable apps={filtered} isMobileTab={true} onRowClick={app => { setSelectedApp(app); setSheetOpen(true) }} />
            </TabsContent>
            <TabsContent value="sdk">
              <AppTable apps={filtered} isMobileTab={false} onRowClick={app => { setSelectedApp(app); setSheetOpen(true) }} />
            </TabsContent>
          </Tabs>

        </main>
      </div>

      {/* ── Code-sign detail Sheet (existing + Deploy section) ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" style={{ width: 520, maxWidth: "100vw", padding: 0, overflowY: "auto" }}>
          {selectedApp && (() => {
            const app = selectedApp
            const isSigned = app.codesignStatus === "signed"
            return (
              <>
                {/* Header */}
                <div style={{ padding: "var(--cds-space-20) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-16)" }}>
                    {app.platform === "iOS" && <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor" style={{ color: "var(--cds-huegrey-text-dark)" }}><path d="M11.2 7.35c-.02-1.9 1.55-2.8 1.62-2.84-.88-1.3-2.25-1.47-2.74-1.49-1.17-.12-2.28.69-2.87.69-.59 0-1.5-.67-2.47-.65-1.27.02-2.44.74-3.09 1.88C.2 7.2.98 10.1 2.42 11.7c.71.82 1.55 1.73 2.65 1.69 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.77.67 1.14-.02 1.86-.83 2.56-1.66.81-.95 1.14-1.87 1.16-1.92-.03-.01-2.2-.85-2.22-3.24zM9.21 2.06c.59-.72.99-1.71.88-2.71-.85.04-1.88.57-2.49 1.28-.54.63-1.02 1.64-.89 2.6.94.07 1.9-.48 2.5-1.17z"/></svg>}
                    <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{app.userType} - Code Sign</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "var(--cds-radius-s)", backgroundColor: app.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700, flexShrink: 0 }}>{app.initials}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                          <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{app.name}</p>
                          {isSigned && <button type="button" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p3)", padding: 0 }}><RotateCcw size={11} /> Re-code Sign</button>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                          {app.version && <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Version {app.version}</span>}
                          {app.hasUpdate && <Badge variant="subtle" colour="warning" size="sm">Update available</Badge>}
                        </div>
                      </div>
                    </div>
                    {isSigned && <Button size="sm" variant="outline" style={{ gap: "var(--cds-gap-tight)" }}><Download size={11} />{app.platform === "iOS" ? "Download IPA" : "Download APK"}</Button>}
                  </div>
                </div>

                {/* Code sign details */}
                {isSigned ? (
                  <div style={{ padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-12)" }}>
                    {[
                      { label: "App Name", value: app.name },
                      { label: "Push Notification", value: "Enable", link: true },
                      { label: "App Metrics", value: "Enable", link: true },
                      { label: "Provisioning Profile", value: app.provisioningProfile || "—" },
                      { label: "Bundle Identifier", value: app.bundleId || "—" },
                      { label: "Code Sign Certificate", value: app.certificate || "—" },
                    ].map(({ label, value, link }) => (
                      <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "var(--cds-gap-default)" }}>
                        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", minWidth: 160, flexShrink: 0 }}>{label}</span>
                        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>:</span>
                        {link ? <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p3)", padding: 0 }}>{value}</button>
                          : <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{value}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "var(--cds-space-16) var(--cds-space-24)" }}>
                    <div style={{ backgroundColor: "var(--cds-huegrey-surface-low)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-12) var(--cds-space-16)", display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-small)" }}>
                      <Info size={13} style={{ color: "var(--cds-huegrey-text-default)", flexShrink: 0, marginTop: 2 }} />
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>This app has not been code-signed yet. Complete code signing first to enable distribution.</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Share */}
                <div style={{ padding: "var(--cds-space-12) var(--cds-space-24)" }}>
                  <p style={{ margin: "0 0 var(--cds-space-8)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Share the app installation link with users</p>
                  <InputSuffix
                    placeholder="Please enter user's email address"
                    suffixLabel="Share"
                    onSuffixClick={() => {/* share handler */}}
                  />
                </div>

                <Separator />

                {/* MDM */}
                <div style={{ padding: "var(--cds-space-12) var(--cds-space-24)" }}>
                  <p style={{ margin: "0 0 var(--cds-space-8)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Distribute the app with employees through MDM</p>
                  <div style={{ backgroundColor: "var(--cds-primary-surface-subtle)", borderRadius: "var(--cds-radius-r)", padding: "var(--cds-space-8) var(--cds-space-12)", display: "flex", alignItems: "flex-start", gap: "var(--cds-gap-tight)" }}>
                    <Info size={12} style={{ color: "var(--cds-primary-text-default)", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-primary-text-default)" }}>Distribution through MDM has been restricted for this account.</p>
                  </div>
                </div>

                <Separator />

                {/* ── NEW: Deploy section ── */}
                <div style={{ padding: "var(--cds-space-12) var(--cds-space-24)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--cds-space-8)" }}>
                    <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Publish to app stores or distribute to beta testers</p>
                    {isSigned && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openHistory(app)}
                        style={{ gap: "var(--cds-gap-tight)", padding: 0, height: "auto", color: "var(--cds-primary-text-default)", fontSize: "var(--cds-text-p3)" }}
                      >
                        <History size={12} /> View history
                      </Button>
                    )}
                  </div>
                  {isSigned
                    ? <Button onClick={() => openDeploy(app)} style={{ gap: "var(--cds-gap-tight)", width: "100%" }}>
                        <Smartphone size={14} /> Deploy <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                      </Button>
                    : <div>
                        <Button disabled style={{ gap: "var(--cds-gap-tight)", width: "100%", opacity: 0.5 }}><Smartphone size={14} /> Deploy</Button>
                        <p style={{ margin: "var(--cds-space-6) 0 0", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", textAlign: "center" }}>Code sign this app first.</p>
                      </div>
                  }
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* ── Deploy Wizard Dialog ── */}
      {selectedApp && (
        <DeployWizardDialog
          open={deployOpen}
          onOpenChange={setDeployOpen}
          appName={selectedApp.name}
          onOpenCredentials={() => { setDeployOpen(false); setCredentialsOpen(true) }}
          onOpenHistory={() => { setDeployOpen(false); setHistoryOpen(true) }}
        />
      )}

      {/* ── Store Credentials Dialog ── */}
      <CredentialsDialog
        open={credentialsOpen}
        onOpenChange={setCredentialsOpen}
        onBackToDeploy={() => setDeployOpen(true)}
      />

      {/* ── Deployment History Dialog ── */}
      {selectedApp && (
        <HistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          onNewDeploy={() => setDeployOpen(true)}
        />
      )}
    </div>
  )
}
