/**
 * DeploymentCredentialsScreen (S-01)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.1 Credential Management, §9.4 Screen S-01
 *
 * Allows Super Admin / Admin to add and manage store credentials:
 *   - Google Play service account JSON
 *   - App Store Connect API key (.p8)  [Phase 2]
 *   - Firebase service account JSON
 *
 * States: empty, has credentials, add-wizard Sheet open
 */

import * as React from "react"
import {
  Plus,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Separator } from "@/components/ui/separator"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type CredentialType = "google-play" | "app-store-connect" | "firebase"
type CredentialStatus = "connected" | "expired" | "error" | "validating"

interface Credential {
  id: string
  label: string
  type: CredentialType
  status: CredentialStatus
  lastValidated: string
  packageHint?: string
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_CREDENTIALS: Credential[] = [
  {
    id: "cred-1",
    label: "Zylker Play Service Account",
    type: "google-play",
    status: "connected",
    lastValidated: "Today, 9:41 AM",
    packageHint: "com.zylker.app",
  },
  {
    id: "cred-2",
    label: "Firebase – Zylker Beta",
    type: "firebase",
    status: "connected",
    lastValidated: "Yesterday, 6:12 PM",
  },
  {
    id: "cred-3",
    label: "App Store Connect (Phase 2)",
    type: "app-store-connect",
    status: "error",
    lastValidated: "3 days ago",
  },
]

const TYPE_LABELS: Record<CredentialType, string> = {
  "google-play": "Google Play",
  "app-store-connect": "App Store Connect",
  "firebase": "Firebase App Distribution",
}

const TYPE_DESCRIPTIONS: Record<CredentialType, string> = {
  "google-play": "Service account JSON with Release Manager role",
  "app-store-connect": "API key (.p8) with App Manager role — Phase 2",
  "firebase": "Service account JSON for Firebase project",
}

function statusToBadge(status: CredentialStatus) {
  switch (status) {
    case "connected":  return <StatusBadge status="configured" />
    case "expired":    return <StatusBadge status="not-configured" />
    case "error":      return <StatusBadge status="error" />
    case "validating": return <StatusBadge status="pending" />
  }
}

// ─── Add Credential Sheet ─────────────────────────────────────────────────────

interface AddCredentialSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (cred: Omit<Credential, "id" | "lastValidated">) => void
}

function AddCredentialSheet({ open, onOpenChange, onAdd }: AddCredentialSheetProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [credType, setCredType] = React.useState<CredentialType>("google-play")
  const [label, setLabel] = React.useState("")
  const [jsonContent, setJsonContent] = React.useState("")
  const [keyId, setKeyId] = React.useState("")
  const [issuerId, setIssuerId] = React.useState("")
  const [validating, setValidating] = React.useState(false)

  function reset() {
    setStep(1)
    setCredType("google-play")
    setLabel("")
    setJsonContent("")
    setKeyId("")
    setIssuerId("")
    setValidating(false)
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function handleValidate() {
    setValidating(true)
    // Simulate async validation
    setTimeout(() => {
      setValidating(false)
      setStep(3)
    }, 1800)
  }

  function handleSave() {
    onAdd({
      label: label || `${TYPE_LABELS[credType]} credential`,
      type: credType,
      status: "connected",
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" style={{ width: 480, maxWidth: "100vw" }}>
        <SheetHeader>
          <SheetTitle>Add store credential</SheetTitle>
        </SheetHeader>
        <div style={{ borderBottom: "1px solid var(--border)", margin: "0 -24px", marginTop: "var(--cds-space-16)" }} />

        <div style={{ padding: "var(--cds-space-24) 0", display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: "var(--cds-gap-small)", alignItems: "center" }}>
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div style={{
                  width: 24, height: 24, borderRadius: "var(--cds-radius-full)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "var(--cds-text-p3)", fontWeight: 700, flexShrink: 0,
                  backgroundColor: step >= s ? "var(--cds-primary-surface-default)" : "var(--cds-white)",
                  color: step >= s ? "var(--cds-white)" : "var(--cds-huegrey-text-dark)",
                  border: step >= s ? "none" : "1px solid var(--cds-huegrey-border-minimal)",
                }}>
                  {s}
                </div>
                {s < 3 && (
                  <div style={{ flex: 1, height: 1, backgroundColor: step > s ? "var(--cds-primary-border-default)" : "var(--border)" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1 — Select type */}
          {step === 1 && (
            <>
              <div>
                <p style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                  Select credential type
                </p>
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
                  Choose the store or distribution platform you want to connect.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-default)" }}>
                {(["google-play", "firebase", "app-store-connect"] as CredentialType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => type !== "app-store-connect" && setCredType(type)}
                    style={{
                      border: `1px solid ${credType === type ? "var(--cds-primary-border-default)" : "var(--border)"}`,
                      borderRadius: "var(--cds-radius-r)",
                      padding: "var(--cds-space-12) var(--cds-space-16)",
                      background: credType === type ? "var(--cds-primary-surface-subtle)" : "var(--cds-white)",
                      cursor: type === "app-store-connect" ? "not-allowed" : "pointer",
                      textAlign: "left",
                      opacity: type === "app-store-connect" ? 0.5 : 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>
                        {TYPE_LABELS[type]}
                      </p>
                      <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                        {TYPE_DESCRIPTIONS[type]}
                      </p>
                    </div>
                    {type === "app-store-connect" && (
                      <Badge variant="subtle" colour="indigo">Phase 2</Badge>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
                <Button onClick={() => setStep(2)}>Next</Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              </div>
            </>
          )}

          {/* Step 2 — Upload credential */}
          {step === 2 && (
            <>
              <div>
                <p style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                  Upload {TYPE_LABELS[credType]} credentials
                </p>
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
                  {credType === "app-store-connect"
                    ? "Enter your Key ID, Issuer ID, and paste the .p8 key content."
                    : "Paste the service account JSON content below."}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                <Label>Label</Label>
                <Input
                  placeholder={`e.g. ${TYPE_LABELS[credType]} – Production`}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              {credType === "app-store-connect" ? (
                <>
                  <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                      <Label>Key ID</Label>
                      <Input placeholder="e.g. ABCDEF1234" value={keyId} onChange={(e) => setKeyId(e.target.value)} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                      <Label>Issuer ID</Label>
                      <Input placeholder="e.g. 69a6de79-..." value={issuerId} onChange={(e) => setIssuerId(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                    <Label>.p8 private key content</Label>
                    <Textarea
                      rows={6}
                      placeholder={"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"}
                      value={jsonContent}
                      onChange={(e) => setJsonContent(e.target.value)}
                      style={{ fontFamily: "monospace", fontSize: "var(--cds-text-p3)" }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)" }}>
                  <Label>Service account JSON</Label>
                  {/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}
                  <Textarea
                    rows={8}
                    placeholder={'{\n  "type": "service_account",\n  "project_id": "...",\n  ...\n}'}
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    style={{ fontFamily: "monospace", fontSize: "var(--cds-text-p3)" }}
                  />
                  <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-muted)" }}>
                    Credentials are encrypted at rest and never returned in API responses.
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
                <Button onClick={handleValidate} disabled={!jsonContent.trim() || validating}>
                  {validating ? "Validating…" : "Validate connection"}
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              </div>
            </>
          )}

          {/* Step 3 — Validated */}
          {step === 3 && (
            <>
              <div
                style={{
                  backgroundColor: "var(--cds-success-surface-subtle)",
                  border: "1px solid var(--cds-success-border-minimal)",
                  borderRadius: "var(--cds-radius-r)",
                  padding: "var(--cds-space-16)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--cds-space-8)",
                }}
              >
                <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-success-text-default)" }}>
                  Connection validated
                </p>
                <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>
                  Successfully connected to {TYPE_LABELS[credType]}. Click Save to store this credential.
                </p>
              </div>

              <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
                <Button onClick={handleSave}>Save credential</Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeploymentCredentialsScreen() {
  const { navigate } = useNavigation()
  const [credentials, setCredentials] = React.useState<Credential[]>(SEED_CREDENTIALS)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  function handleAdd(cred: Omit<Credential, "id" | "lastValidated">) {
    setCredentials((prev) => [
      ...prev,
      { ...cred, id: Date.now().toString(), lastValidated: "Just now" },
    ])
  }

  function handleDelete(id: string) {
    setCredentials((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  function handleRevalidate(id: string) {
    setCredentials((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: "validating", lastValidated: "Validating…" } : c)
    )
    setTimeout(() => {
      setCredentials((prev) =>
        prev.map((c) => c.id === id ? { ...c, status: "connected", lastValidated: "Just now" } : c)
      )
    }, 1800)
  }

  const credToDelete = credentials.find((c) => c.id === deleteId)

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
              Store Credentials
            </h1>
            <p
              style={{
                fontSize: "var(--cds-text-p2)",
                lineHeight: "var(--cds-leading-p2)",
                color: "var(--cds-huegrey-text-default)",
                margin: 0,
              }}
            >
              Connect your Google Play, App Store Connect, and Firebase accounts to enable in-platform deployment.
              Credentials are encrypted at rest and only accessible to Super Admin and Admin roles.
            </p>
          </div>

          {/* Permission notice */}
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
              maxWidth: 720,
            }}
          >
            <ShieldAlert size={14} style={{ color: "var(--cds-warning-text-default)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-warning-text-default)" }}>
              Only <strong>Super Admin</strong> and <strong>Admin</strong> roles can add or modify store credentials.
              App Admins can deploy apps using configured credentials.
            </p>
          </div>

          {/* Action bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--cds-space-16)" }}>
            <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
              {credentials.length} credential{credentials.length !== 1 ? "s" : ""} configured
            </p>
            <Button onClick={() => setSheetOpen(true)} style={{ gap: "var(--cds-gap-tight)" }}>
              <Plus size={14} />
              Add credential
            </Button>
          </div>

          {/* Credentials table */}
          {credentials.length > 0 ? (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--cds-radius-r)",
                overflow: "hidden",
                maxWidth: 900,
              }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last validated</TableHead>
                    <TableHead style={{ width: 48 }} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell>
                        <div>
                          <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)" }}>
                            {cred.label}
                          </p>
                          {cred.packageHint && (
                            <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-muted)", fontFamily: "monospace" }}>
                              {cred.packageHint}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="subtle" colour="indigo">{TYPE_LABELS[cred.type]}</Badge>
                      </TableCell>
                      <TableCell>
                        {statusToBadge(cred.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                        {cred.lastValidated}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" aria-label="Actions">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRevalidate(cred.id)}>
                              <RefreshCw size={13} />
                              Re-validate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(cred.id)}
                              style={{ color: "var(--cds-error-text-default)" }}
                            >
                              <Trash2 size={13} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Empty state */
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-32)",
                textAlign: "center",
                maxWidth: 900,
              }}
            >
              <Upload size={32} style={{ color: "var(--cds-huegrey-border-default)", margin: "0 auto var(--cds-space-12)" }} />
              <p style={{ fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                No store credentials yet
              </p>
              <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-16)" }}>
                Add a Google Play or Firebase credential to start deploying signed apps.
              </p>
              <Button onClick={() => setSheetOpen(true)} style={{ gap: "var(--cds-gap-tight)" }}>
                <Plus size={14} />
                Add credential
              </Button>
              {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
            </div>
          )}

          {/* Navigation to Deploy Wizard */}
          {credentials.some((c) => c.status === "connected") && (
            <div style={{ marginTop: "var(--cds-space-32)" }}>
              <Separator style={{ marginBottom: "var(--cds-space-24)" }} />
              <Button variant="outline" onClick={() => navigate("deploy-wizard-channel")}>
                ← Back to Deploy
              </Button>
            </div>
          )}

        </main>
      </div>

      {/* Add Credential Sheet */}
      <AddCredentialSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAdd={handleAdd}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Delete credential?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{credToDelete?.label}</strong> will be permanently deleted.
              Any apps currently using this credential for deployment will fail until a new credential is added.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
