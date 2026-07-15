/**
 * DemoUsersOrgPoolScreen.tsx
 *
 * Manage → Demo Users (Org Pool)
 * Admin-only screen. Shows the org-level demo user identity pool (max 50: 40 User + 10 Portal User).
 * Includes:
 *   - Pool capacity banner
 *   - Filterable/searchable table with status, type, email, display name
 *   - Deactivate / Reactivate actions
 *   - Add Manually sheet (Screen 2)
 *   - AI Generate dialog (Screen 3)
 *
 * PRD: Demo User in Environments — Phase 1
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioCard } from "@/components/ui/radio-card"
import { InputSuffix } from "@/components/ui/input-suffix"
import { Notes } from "@/components/ui/notes"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { MoreHorizontal, Search, Plus, Sparkles, Users, UserCircle, RefreshCw, Pencil, Link2, PowerOff, RotateCcw } from "lucide-react"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type DemoUserType = "User" | "Portal User"
type DemoUserStatus = "Active" | "Inactive"

interface DemoUserIdentity {
  id: string
  email: string
  displayName: string
  type: DemoUserType
  status: DemoUserStatus
  username: string
  createdOn: string
  assignedApps: number
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS: DemoUserIdentity[] = [
  // Pre-provisioned shared users (locale-detected)
  { id: "u1",  email: "sarah.gh@demo.zohocreator.com",    username: "sarah.gh",    displayName: "Sarah Green",      type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 2 },
  { id: "u2",  email: "james.lw@demo.zohocreator.com",    username: "james.lw",    displayName: "James Lawrence",   type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  { id: "u3",  email: "priya.sm@demo.zohocreator.com",    username: "priya.sm",    displayName: "Priya Sharma",     type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 3 },
  { id: "u4",  email: "alex.tn@demo.zohocreator.com",     username: "alex.tn",     displayName: "Alex Turner",      type: "User",        status: "Inactive", createdOn: "2026-06-01", assignedApps: 0 },
  { id: "u5",  email: "mia.wl@demo.zohocreator.com",      username: "mia.wl",      displayName: "Mia Wallace",      type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  // Additional users
  { id: "u6",  email: "liam.ch@demo.zohocreator.com",     username: "liam.ch",     displayName: "Liam Chen",        type: "User",        status: "Active",   createdOn: "2026-07-02", assignedApps: 0 },
  { id: "u7",  email: "elena.vk@demo.zohocreator.com",    username: "elena.vk",    displayName: "Elena Volkova",    type: "User",        status: "Active",   createdOn: "2026-07-03", assignedApps: 1 },
  // Pre-provisioned portal users
  { id: "p1",  email: "sara.gh@demoportaluser.zohocreator.com",  username: "sara.gh.portal",  displayName: "Sara (Portal)",  type: "Portal User", status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  { id: "p2",  email: "james.lw@demoportaluser.zohocreator.com", username: "james.lw.portal", displayName: "James (Portal)", type: "Portal User", status: "Active",   createdOn: "2026-06-01", assignedApps: 2 },
  { id: "p3",  email: "vendor.x@demoportaluser.zohocreator.com", username: "vendor.x.portal", displayName: "Vendor X",       type: "Portal User", status: "Inactive", createdOn: "2026-06-01", assignedApps: 0 },
  { id: "p4",  email: "client.b@demoportaluser.zohocreator.com", username: "client.b.portal", displayName: "Client B",       type: "Portal User", status: "Active",   createdOn: "2026-07-01", assignedApps: 1 },
  { id: "p5",  email: "guest.z@demoportaluser.zohocreator.com",  username: "guest.z.portal",  displayName: "Guest Z",        type: "Portal User", status: "Active",   createdOn: "2026-07-01", assignedApps: 0 },
]

// ─── AI-generated name pool (preview) ─────────────────────────────────────────

const AI_NAME_POOL = [
  { local: "oliver.mb", display: "Oliver Muller-Berg" },
  { local: "fatima.al", display: "Fatima Al-Hassan" },
  { local: "noah.pj",   display: "Noah Petersen-Johansen" },
  { local: "yuki.tk",   display: "Yuki Takahashi" },
  { local: "amara.db",  display: "Amara Diallo-Bah" },
  { local: "lucas.fr",  display: "Lucas Fernández-Ruiz" },
  { local: "mei.xw",    display: "Mei Xiao-Wei" },
  { local: "thomas.hk", display: "Thomas Hoffmann-Klein" },
  { local: "aisha.nk",  display: "Aisha Nkosi" },
  { local: "ethan.gr",  display: "Ethan Greenfield-Roberts" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

function userTypeColor(type: DemoUserType) {
  return type === "User"
    ? "var(--cds-primary-surface-default)"
    : "var(--cds-success-surface-default)"
}

// ─── Add Manually Sheet ───────────────────────────────────────────────────────

interface AddManuallySheetProps {
  open: boolean
  onClose: () => void
  existingEmails: string[]
  onAdd: (user: Omit<DemoUserIdentity, "id" | "username" | "createdOn" | "assignedApps">) => void
}

function AddManuallySheet({ open, onClose, existingEmails, onAdd }: AddManuallySheetProps) {
  const [type, setType] = React.useState<DemoUserType>("User")
  const [localPart, setLocalPart] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [localError, setLocalError] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const domain = type === "User" ? "@demo.zohocreator.com" : "@demoportaluser.zohocreator.com"
  const fullEmail = localPart ? `${localPart}${domain}` : ""

  React.useEffect(() => {
    if (!localPart) { setLocalError(""); return }
    if (!/^[a-z0-9._-]+$/i.test(localPart)) {
      setLocalError("Only letters, numbers, dots, underscores, hyphens allowed.")
      return
    }
    if (existingEmails.includes(fullEmail)) {
      setLocalError("This email already exists in the pool (active or inactive).")
      return
    }
    setLocalError("")
  }, [localPart, type, existingEmails, fullEmail])

  // Suggest display name from local part
  React.useEffect(() => {
    if (localPart && !displayName) {
      const suggested = localPart
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
      setDisplayName(suggested)
    }
  }, [localPart])

  function handleSubmit() {
    setSubmitted(true)
    if (!localPart || localError || !displayName) return
    onAdd({ email: fullEmail, displayName, type, status: "Active" })
    handleClose()
  }

  function handleClose() {
    setLocalPart("")
    setDisplayName("")
    setType("User")
    setLocalError("")
    setSubmitted(false)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" style={{ width: "min(520px, 95vw)", display: "flex", flexDirection: "column" }}>
        <SheetHeader>
          <SheetTitle>Add Demo User</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-12) var(--cds-space-24) var(--cds-space-16)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Creates a new identity in the org pool. Email is locked after creation.
          </p>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "var(--cds-space-24)" }}>
          <ScrollArea style={{ flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-24)" }}>

            {/* Type */}
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Type <span style={{ color: "var(--cds-error-text-default, #CC1914)" }}>*</span>
              </Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as DemoUserType)} style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
                <RadioCard
                  value="User"
                  label="User"
                  description="Account-level · Role + Permission"
                  style={{ flex: 1 }}
                />
                <RadioCard
                  value="Portal User"
                  label="Portal User"
                  description="App-level · Permission only"
                  style={{ flex: 1 }}
                />
              </RadioGroup>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="emailLocal" style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Email <span style={{ color: "var(--cds-error-text-default, #CC1914)" }}>*</span>
              </Label>
              <InputSuffix
                id="emailLocal"
                placeholder="e.g. sarah.gh"
                value={localPart}
                onChange={(e) => setLocalPart(e.target.value.toLowerCase())}
                suffixLabel={domain}
                status={localError ? "error" : "default"}
              />
              {localError && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default, #CC1914)", marginTop: "var(--cds-space-4)" }}>{localError}</p>
              )}
              {submitted && !localPart && !localError && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default, #CC1914)", marginTop: "var(--cds-space-4)" }}>Email is required.</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Display Name <span style={{ color: "var(--cds-error-text-default, #CC1914)" }}>*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="e.g. Sarah Green"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {submitted && !displayName && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default, #CC1914)", marginTop: "var(--cds-space-4)" }}>Display name is required.</p>
              )}
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
                Editable anytime. Propagates to all app assignments immediately.
              </p>
            </div>

              <Notes variant="warning" title="Username is auto-derived">
                Username is derived from the email local part and locked after creation. It will not be shown here.
              </Notes>
            </div>
          </ScrollArea>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--cds-space-16)", display: "flex", gap: "var(--cds-gap-small)", justifyContent: "flex-end", flexShrink: 0 }}>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Add to Pool</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── AI Generate Dialog ───────────────────────────────────────────────────────

interface AiGenerateDialogProps {
  open: boolean
  onClose: () => void
  existingEmails: string[]
  availableUserSlots: number
  availablePortalSlots: number
  onConfirm: (users: Omit<DemoUserIdentity, "id" | "username" | "createdOn" | "assignedApps">[]) => void
}

function AiGenerateDialog({ open, onClose, existingEmails, availableUserSlots, availablePortalSlots, onConfirm }: AiGenerateDialogProps) {
  const [count, setCount] = React.useState("3")
  const [type, setType] = React.useState<DemoUserType>("User")
  const [preview, setPreview] = React.useState<{ local: string; display: string }[]>([])
  const [generated, setGenerated] = React.useState(false)
  const [generating, setGenerating] = React.useState(false)

  const maxAvailable = type === "User" ? availableUserSlots : availablePortalSlots
  const countNum = Math.min(Math.max(1, parseInt(count) || 1), Math.min(maxAvailable, 10))

  function generate() {
    setGenerating(true)
    setTimeout(() => {
      // Pick random names from pool, excluding already-existing local parts
      const existingLocals = existingEmails.map((e) => e.split("@")[0])
      const available = AI_NAME_POOL.filter((n) => !existingLocals.includes(n.local))
      const shuffled = [...available].sort(() => Math.random() - 0.5)
      setPreview(shuffled.slice(0, countNum))
      setGenerated(true)
      setGenerating(false)
    }, 900)
  }

  function handleConfirm() {
    const domain = type === "User" ? "@demo.zohocreator.com" : "@demoportaluser.zohocreator.com"
    const newUsers = preview.map((p) => ({
      email: `${p.local}${domain}`,
      displayName: p.display,
      type,
      status: "Active" as DemoUserStatus,
    }))
    onConfirm(newUsers)
    handleClose()
  }

  function handleClose() {
    setCount("3")
    setType("User")
    setPreview([])
    setGenerated(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent style={{ maxWidth: 540, width: "95vw" }}>
        <DialogHeader>
          <DialogTitle style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
            <Sparkles size={18} style={{ color: "var(--cds-primary-text-default)" }} />
            AI Generate Demo Users
          </DialogTitle>
          <DialogDescription>
            AI generates realistic persona names for your org pool. Email and username are locked on confirm. Display name is editable after.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-16)", margin: "var(--cds-space-8) 0" }}>
          <div style={{ display: "flex", gap: "var(--cds-gap-default)" }}>
            {/* Count */}
            <div style={{ flex: 1 }}>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>Count</Label>
              <Select value={count} onValueChange={(v) => v && setCount(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(maxAvailable, 10) }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
                {maxAvailable} slot{maxAvailable !== 1 ? "s" : ""} remaining
              </p>
            </div>
            {/* Type */}
            <div style={{ flex: 1 }}>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>Type</Label>
              <Select value={type} onValueChange={(v) => { setType(v as DemoUserType); setGenerated(false); setPreview([]) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Portal User">Portal User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!generated ? (
            <Button onClick={generate} disabled={generating || maxAvailable === 0} style={{ alignSelf: "flex-start" }}>
              {generating ? "Generating…" : <><Sparkles size={14} /> Generate Preview</>}
            </Button>
          ) : (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--cds-space-8)" }}>
                  <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Preview ({preview.length})
                  </span>
                  <Button size="sm" variant="outline" onClick={generate} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                    <RefreshCw size={12} /> Regenerate
                  </Button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                  {preview.map((p) => {
                    const domain = type === "User" ? "@demo.zohocreator.com" : "@demoportaluser.zohocreator.com"
                    return (
                      <div key={p.local} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "10px 12px", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                        <Avatar style={{ width: 32, height: 32, flexShrink: 0 }}>
                          <AvatarFallback style={{ background: userTypeColor(type), color: "#fff", fontSize: "var(--cds-text-p4)", fontWeight: 700 }}>
                            {initials(p.display)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{p.display}</div>
                          <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{p.local}{domain}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "var(--cds-radius-r)", background: "var(--cds-warning-surface-subtle, #FFF8F0)", border: "1px solid var(--cds-warning-border-default, #D25704)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>
                Email and username will be <strong>locked on confirm</strong>. Display name can be edited after.
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!generated || preview.length === 0}>
            Confirm & Add to Pool
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit Demo User Sheet ─────────────────────────────────────────────────────

interface EditUserSheetProps {
  user: DemoUserIdentity | null
  onClose: () => void
  onSave: (userId: string, displayName: string) => void
}

function EditUserSheet({ user, onClose, onSave }: EditUserSheetProps) {
  const [displayName, setDisplayName] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  React.useEffect(() => {
    if (user) setDisplayName(user.displayName)
  }, [user])

  function handleSave() {
    setSubmitted(true)
    if (!displayName.trim()) return
    onSave(user!.id, displayName.trim())
    handleClose()
  }

  function handleClose() {
    setDisplayName("")
    setSubmitted(false)
    onClose()
  }

  if (!user) return null

  return (
    <Sheet open={!!user} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" style={{ width: "min(480px, 95vw)", display: "flex", flexDirection: "column" }}>
        <SheetHeader>
          <SheetTitle>Edit Demo User</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-8) var(--cds-space-24) var(--cds-space-12)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Update the display name for this demo user. Email, username, and type are locked after creation.
          </p>
        </div>

        <div style={{ flex: 1, padding: "var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>

          {/* Identity preview — read-only */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", background: "var(--cds-surface-subtle, #F5F5F5)", border: "1px solid var(--border)" }}>
            <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
              <AvatarFallback style={{ background: userTypeColor(user.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>
                {initials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{user.email}</div>
              <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>Username: {user.username}</div>
            </div>
            <Badge variant="subtle" colour={user.type === "User" ? "primary" : "success"} size="sm">
              {user.type}
            </Badge>
          </div>

          {/* Display Name — editable */}
          <div>
            <Label htmlFor="editDisplayName" style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
              Display Name <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
            </Label>
            <Input
              id="editDisplayName"
              placeholder="e.g. Sarah Green"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {submitted && !displayName.trim() && (
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>
                Display name is required.
              </p>
            )}
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
              Editing propagates to all app assignments immediately.
            </p>
          </div>

          {/* Read-only info */}
          <Notes variant="info" title="Email and type are locked">
            Email and type cannot be changed after creation. To change type, deactivate this identity and create a new one.
          </Notes>

        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", gap: "var(--cds-gap-small)", justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Deactivate Confirm Dialog ─────────────────────────────────────────────────

interface DeactivateDialogProps {
  user: DemoUserIdentity | null
  onClose: () => void
  onConfirm: (userId: string) => void
}

function DeactivateDialog({ user, onClose, onConfirm }: DeactivateDialogProps) {
  if (!user) return null
  return (
    <AlertDialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate {user.displayName}?</AlertDialogTitle>
          <AlertDialogDescription>
            {user.assignedApps > 0
              ? `This user is assigned to ${user.assignedApps} app${user.assignedApps !== 1 ? "s" : ""}. All app assignments will be removed. The identity record is preserved and can be reactivated. App assignments must be redone manually after reactivation.`
              : "The identity record is preserved and freed from the 50-user cap. You can reactivate this user at any time."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Keep Active</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onConfirm(user.id); onClose() }} style={{ background: "var(--cds-error-surface-default, #CC1914)" }}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DemoUsersOrgPoolScreen() {
  const [users, setUsers] = React.useState<DemoUserIdentity[]>(SEED_USERS)
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState<"All" | DemoUserType>("All")
  const [filterStatus, setFilterStatus] = React.useState<"All" | DemoUserStatus>("All")

  const [addSheetOpen, setAddSheetOpen] = React.useState(false)
  const [aiDialogOpen, setAiDialogOpen] = React.useState(false)
  const [deactivateUser, setDeactivateUser] = React.useState<DemoUserIdentity | null>(null)
  const [editUser, setEditUser] = React.useState<DemoUserIdentity | null>(null)
  const { navigate } = useNavigation()

  const activeUsers = users.filter((u) => u.status === "Active" && u.type === "User").length
  const activePortal = users.filter((u) => u.status === "Active" && u.type === "Portal User").length
  const inactiveCount = users.filter((u) => u.status === "Inactive").length

  const availableUserSlots = 40 - activeUsers
  const availablePortalSlots = 10 - activePortal

  const allEmails = users.map((u) => u.email)

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "All" || u.type === filterType
    const matchStatus = filterStatus === "All" || u.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  function handleAddManual(newUser: Omit<DemoUserIdentity, "id" | "username" | "createdOn" | "assignedApps">) {
    const local = newUser.email.split("@")[0]
    const id = `u${Date.now()}`
    const username = local
    setUsers((prev) => [
      { ...newUser, id, username, createdOn: new Date().toISOString().slice(0, 10), assignedApps: 0 },
      ...prev,
    ])
    toast.success(`${newUser.displayName} added to the org pool.`)
  }

  function handleAiConfirm(newUsers: Omit<DemoUserIdentity, "id" | "username" | "createdOn" | "assignedApps">[]) {
    const added = newUsers.map((u, i) => ({
      ...u,
      id: `ai${Date.now()}${i}`,
      username: u.email.split("@")[0],
      createdOn: new Date().toISOString().slice(0, 10),
      assignedApps: 0,
    }))
    setUsers((prev) => [...added, ...prev])
    toast.success(`${added.length} demo user${added.length !== 1 ? "s" : ""} added to the org pool.`)
  }

  function handleDeactivate(userId: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "Inactive", assignedApps: 0 } : u))
    )
    toast.success("Demo user deactivated. App assignments removed.")
  }

  function handleReactivate(userId: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "Active" } : u))
    )
    toast.success("Demo user reactivated and is now available for assignment.")
  }

  function handleEditSave(userId: string, displayName: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, displayName } : u))
    )
    toast.success("Display name updated and propagated to all assignments.")
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <LeftNav />
          <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

            {/* Page header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--cds-space-24)" }}>
              <div>
                <h1 style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                  Demo Users
                </h1>
                <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
                  Org-level identity pool. Assign demo personas to apps in Dev or Stage environments.
                </p>
              </div>
              <div style={{ display: "flex", gap: "var(--cds-gap-small)", flexShrink: 0 }}>
                <Button variant="outline" onClick={() => setAiDialogOpen(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <Sparkles size={14} /> AI Generate
                </Button>
                <Button onClick={() => setAddSheetOpen(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <Plus size={14} /> Add Manually
                </Button>
              </div>
            </div>

            {/* Capacity banner */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-24)" }}>
              {/* User capacity */}
              <div style={{ padding: "var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-8)" }}>
                  <Users size={16} style={{ color: "var(--cds-primary-text-default)" }} />
                  <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)" }}>Users (Shared)</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--cds-gap-tight)" }}>
                  <span style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)" }}>{activeUsers}</span>
                  <span style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>/ 40 active</span>
                </div>
                <div style={{ marginTop: "var(--cds-space-8)", height: 4, borderRadius: "var(--cds-radius-full)", background: "var(--cds-surface-subtle, #F5F5F5)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(activeUsers / 40) * 100}%`, background: "var(--cds-primary-surface-default)", borderRadius: "var(--cds-radius-full)", transition: "width 0.3s" }} />
                </div>
              </div>
              {/* Portal User capacity */}
              <div style={{ padding: "var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-8)" }}>
                  <UserCircle size={16} style={{ color: "var(--cds-success-text-default, #078841)" }} />
                  <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)" }}>Portal Users</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--cds-gap-tight)" }}>
                  <span style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)" }}>{activePortal}</span>
                  <span style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>/ 10 active</span>
                </div>
                <div style={{ marginTop: "var(--cds-space-8)", height: 4, borderRadius: "var(--cds-radius-full)", background: "var(--cds-surface-subtle, #F5F5F5)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(activePortal / 10) * 100}%`, background: "var(--cds-success-surface-default, #078841)", borderRadius: "var(--cds-radius-full)", transition: "width 0.3s" }} />
                </div>
              </div>
              {/* Inactive */}
              <div style={{ padding: "var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-8)" }}>
                  <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)" }}>Inactive (freed from cap)</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--cds-gap-tight)" }}>
                  <span style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)" }}>{inactiveCount}</span>
                  <span style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>identities preserved</span>
                </div>
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "var(--cds-space-8) 0 0" }}>
                  Records retained. No hard delete.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-16)", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--cds-huegrey-text-default)", pointerEvents: "none" }} />
                <Input
                  placeholder="Search by name, email, username…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 32 }}
                />
              </div>
              <Select value={filterType} onValueChange={(v) => v && setFilterType(v as typeof filterType)}>
                <SelectTrigger style={{ width: 150 }}><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Portal User">Portal User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v as typeof filterStatus)}>
                <SelectTrigger style={{ width: 140 }}><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginLeft: "auto" }}>
                {filtered.length} of {users.length}
              </span>
            </div>

            {/* Table */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-l)", overflow: "hidden", background: "var(--cds-white)" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ background: "var(--cds-surface-subtle, #F5F5F5)" }}>
                    <TableHead style={{ width: 48 }}></TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Apps Assigned</TableHead>
                    <TableHead style={{ width: 48 }}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)" }}>
                        {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                        No demo users match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((user) => (
                      <TableRow key={user.id} style={{ opacity: user.status === "Inactive" ? 0.6 : 1 }}>
                        <TableCell>
                          <Avatar style={{ width: 32, height: 32 }}>
                            <AvatarFallback style={{ background: userTypeColor(user.type), color: "#fff", fontSize: "var(--cds-text-p4)", fontWeight: 700 }}>
                              {initials(user.displayName)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>
                            {user.displayName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                            {user.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                            {user.username}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="subtle"
                            style={{
                              borderRadius: "var(--cds-radius-full)",
                              background: user.type === "User" ? "var(--cds-primary-surface-subtle, #EEF2FE)" : "var(--cds-success-surface-subtle, #F0FAF4)",
                              color: user.type === "User" ? "var(--cds-primary-text-default)" : "var(--cds-success-text-default, #078841)",
                              border: "none",
                            }}
                          >
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: "var(--cds-text-p3)", fontWeight: 500,
                            color: user.status === "Active" ? "var(--cds-success-text-default, #078841)" : "var(--cds-huegrey-text-default)",
                          }}>
                            <span style={{ width: 7, height: 7, borderRadius: "var(--cds-radius-full)", background: user.status === "Active" ? "var(--cds-success-surface-default, #078841)" : "var(--cds-huegrey-border-default, #C8CAD0)", flexShrink: 0 }} />
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)" }}>
                            {user.assignedApps > 0 ? user.assignedApps : <span style={{ color: "var(--cds-huegrey-text-default)" }}>—</span>}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button size="sm" variant="ghost" style={{ padding: "4px 8px" }}>
                                <MoreHorizontal size={15} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditUser(user)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                                <Pencil size={13} /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate("demo-users-app-assignment")} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                                <Link2 size={13} /> Assign to App
                              </DropdownMenuItem>
                              {user.status === "Active" ? (
                                <DropdownMenuItem
                                  onClick={() => setDeactivateUser(user)}
                                  style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", color: "var(--cds-error-text-default, #CC1914)" }}
                                >
                                  <PowerOff size={13} /> Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleReactivate(user.id)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                                  <RotateCcw size={13} /> Reactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination placeholder */}
            {/* TODO: replace with <Pagination /> once built — ds-parity P1 */}
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-12)", textAlign: "center" }}>
              Showing all {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>

          </main>
        </div>
      </div>

      {/* Overlays */}
      <AddManuallySheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        existingEmails={allEmails}
        onAdd={handleAddManual}
      />
      <AiGenerateDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        existingEmails={allEmails}
        availableUserSlots={availableUserSlots}
        availablePortalSlots={availablePortalSlots}
        onConfirm={handleAiConfirm}
      />
      <DeactivateDialog
        user={deactivateUser}
        onClose={() => setDeactivateUser(null)}
        onConfirm={handleDeactivate}
      />
      <EditUserSheet
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEditSave}
      />
    </>
  )
}
