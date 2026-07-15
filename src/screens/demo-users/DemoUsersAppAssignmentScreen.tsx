/**
 * DemoUsersAppAssignmentScreen.tsx
 *
 * Manage → Demo Users → App Assignment
 * Assign org-pool demo users to a specific app in Dev or Stage.
 *
 * PRD: Demo User in Environments — Phase 1
 * - User (shared): requires Role + Permission
 * - Portal User: requires Permission only — no role
 * - Same identity assignable to multiple apps with different roles/permissions
 * - Remove assignment → confirm modal → identity stays in org pool
 * - Admin: cross-app visibility. Developer: own app only.
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Notes } from "@/components/ui/notes"
import { ContentSwitcher } from "@/components/ui/content-switcher"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Plus, Trash2, ChevronLeft, MoreHorizontal } from "lucide-react"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type Environment = "Development" | "Stage"
type DemoUserType = "User" | "Portal User"

interface OrgPoolIdentity {
  id: string
  email: string
  displayName: string
  username: string
  type: DemoUserType
}

interface AppAssignment {
  id: string
  userId: string
  email: string
  displayName: string
  username: string
  type: DemoUserType
  environment: Environment
  role?: string       // User only
  permission: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ORG_POOL: OrgPoolIdentity[] = [
  { id: "u1", email: "sarah.gh@demo.zohocreator.com",    displayName: "Sarah Green",    username: "sarah.gh",    type: "User" },
  { id: "u2", email: "james.lw@demo.zohocreator.com",    displayName: "James Lawrence", username: "james.lw",    type: "User" },
  { id: "u3", email: "priya.sm@demo.zohocreator.com",    displayName: "Priya Sharma",   username: "priya.sm",    type: "User" },
  { id: "u5", email: "mia.wl@demo.zohocreator.com",      displayName: "Mia Wallace",    username: "mia.wl",      type: "User" },
  { id: "u6", email: "liam.ch@demo.zohocreator.com",     displayName: "Liam Chen",      username: "liam.ch",     type: "User" },
  { id: "p1", email: "sara.gh@demoportaluser.zohocreator.com",  displayName: "Sara (Portal)",  username: "sara.gh.portal",  type: "Portal User" },
  { id: "p2", email: "james.lw@demoportaluser.zohocreator.com", displayName: "James (Portal)", username: "james.lw.portal", type: "Portal User" },
  { id: "p4", email: "client.b@demoportaluser.zohocreator.com", displayName: "Client B",       username: "client.b.portal", type: "Portal User" },
]

const MOCK_ROLES = ["Admin", "Manager", "Executive", "Viewer", "Developer"]
const MOCK_PERMISSIONS = ["Full Access", "Read Only", "Edit Access", "Export Access", "CRM Access"]
const MOCK_PORTAL_PERMISSIONS = ["Applicant View", "Customer Portal", "Vendor Access", "Public View"]

const SEED_ASSIGNMENTS: AppAssignment[] = [
  {
    id: "a1", userId: "u1", email: "sarah.gh@demo.zohocreator.com",
    displayName: "Sarah Green", username: "sarah.gh", type: "User",
    environment: "Development", role: "Manager", permission: "Full Access",
  },
  {
    id: "a2", userId: "p1", email: "sara.gh@demoportaluser.zohocreator.com",
    displayName: "Sara (Portal)", username: "sara.gh.portal", type: "Portal User",
    environment: "Development", permission: "Applicant View",
  },
  {
    id: "a3", userId: "u2", email: "james.lw@demo.zohocreator.com",
    displayName: "James Lawrence", username: "james.lw", type: "User",
    environment: "Stage", role: "Executive", permission: "CRM Access",
  },
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

// ─── Assign Sheet ─────────────────────────────────────────────────────────────

interface AssignSheetProps {
  open: boolean
  onClose: () => void
  environment: Environment
  existingUserIds: string[]
  onAssign: (assignment: Omit<AppAssignment, "id">) => void
}

function AssignSheet({ open, onClose, environment, existingUserIds, onAssign }: AssignSheetProps) {
  const [userId, setUserId] = React.useState("")
  const [role, setRole] = React.useState("")
  const [permission, setPermission] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const availableUsers = MOCK_ORG_POOL.filter((u) => !existingUserIds.includes(u.id))
  const selectedUser = MOCK_ORG_POOL.find((u) => u.id === userId)
  const isPortal = selectedUser?.type === "Portal User"
  const permissionOptions = isPortal ? MOCK_PORTAL_PERMISSIONS : MOCK_PERMISSIONS

  // Reset permission when user/type changes
  React.useEffect(() => {
    setPermission("")
    setRole("")
  }, [userId])

  function handleSubmit() {
    setSubmitted(true)
    if (!userId || !permission || (!isPortal && !role)) return
    if (!selectedUser) return
    onAssign({
      userId: selectedUser.id,
      email: selectedUser.email,
      displayName: selectedUser.displayName,
      username: selectedUser.username,
      type: selectedUser.type,
      environment,
      role: isPortal ? undefined : role,
      permission,
    })
    handleClose()
  }

  function handleClose() {
    setUserId("")
    setRole("")
    setPermission("")
    setSubmitted(false)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" style={{ width: "min(480px, 95vw)", display: "flex", flexDirection: "column" }}>
        <SheetHeader>
          <SheetTitle>Assign Demo User</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-8) var(--cds-space-24) var(--cds-space-12)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Assign a demo user from the org pool to this app in <strong>{environment}</strong>.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>

          {/* User selector */}
          <div>
            <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
              Demo User <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
            </Label>
            <Select value={userId} onValueChange={(v) => v && setUserId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a demo user from pool" />
              </SelectTrigger>
              <SelectContent searchable searchPlaceholder="Search by name or email…">
                {availableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.displayName} — {u.username} ({u.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {submitted && !userId && (
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>
                Please select a demo user.
              </p>
            )}
            {availableUsers.length === 0 && (
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
                All available demo users are already assigned to this environment.
              </p>
            )}
          </div>

          {/* Selected user preview */}
          {selectedUser && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-surface-subtle, #F5F5F5)" }}>
              <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
                <AvatarFallback style={{ background: userTypeColor(selectedUser.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>
                  {initials(selectedUser.displayName)}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{selectedUser.displayName}</div>
                <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{selectedUser.email}</div>
              </div>
              <Badge variant="subtle" colour={selectedUser.type === "User" ? "primary" : "success"}>
                {selectedUser.type}
              </Badge>
            </div>
          )}

          {/* Role (User only) */}
          {selectedUser && !isPortal && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Role <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
              </Label>
              <Select value={role} onValueChange={(v) => v && setRole(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {submitted && !role && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>
                  Role is required for User type.
                </p>
              )}
            </div>
          )}

          {/* Permission */}
          {selectedUser && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Permission <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
                {isPortal && (
                  <span style={{ fontSize: "var(--cds-text-p3)", fontWeight: 400, color: "var(--cds-huegrey-text-default)", marginLeft: "var(--cds-gap-small)" }}>
                    (Portal-configured permissions only)
                  </span>
                )}
              </Label>
              <Select value={permission} onValueChange={(v) => v && setPermission(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissionOptions.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {submitted && !permission && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>
                  Permission is required.
                </p>
              )}
            </div>
          )}

          {/* Portal info note */}
          {selectedUser && isPortal && (
            <Notes variant="info" title="Portal User — no role required">
              Portal users are assigned a permission only. No role is applicable. The user will be active immediately with no invite flow.
            </Notes>
          )}

        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", gap: "var(--cds-gap-small)", justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={availableUsers.length === 0}>Assign</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Remove Assignment Dialog ─────────────────────────────────────────────────

interface RemoveDialogProps {
  assignment: AppAssignment | null
  onClose: () => void
  onConfirm: (id: string) => void
}

function RemoveDialog({ assignment, onClose, onConfirm }: RemoveDialogProps) {
  if (!assignment) return null
  return (
    <AlertDialog open={!!assignment} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {assignment.displayName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the demo user from this app and environment. The identity remains in the org pool and can be reassigned. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>No, Keep</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(assignment.id); onClose() }}
            style={{ background: "var(--cds-error-surface-default)" }}
          >
            Yes, Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DemoUsersAppAssignmentScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()
  const [environment, setEnvironment] = React.useState<Environment>("Development")
  const [assignments, setAssignments] = React.useState<AppAssignment[]>(SEED_ASSIGNMENTS)
  const [assignSheetOpen, setAssignSheetOpen] = React.useState(false)
  const [removeTarget, setRemoveTarget] = React.useState<AppAssignment | null>(null)

  const filtered = assignments.filter((a) => a.environment === environment)
  const existingUserIds = filtered.map((a) => a.userId)

  function handleAssign(assignment: Omit<AppAssignment, "id">) {
    const id = `a${Date.now()}`
    setAssignments((prev) => [...prev, { ...assignment, id }])
    toast.success(`${assignment.displayName} assigned to ${environment}.`)
  }

  function handleRemove(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast.success("Demo user removed from this app.")
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <LeftNav activeId="environments" />
          <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

            {/* Breadcrumb / Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canGoBack ? goBack() : navigate("demo-users-org-pool")}
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-huegrey-text-default)", marginBottom: "var(--cds-space-16)", paddingLeft: 0 }}
            >
              <ChevronLeft size={14} />
              Demo Users
            </Button>

            {/* Page header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--cds-space-24)" }}>
              <div>
                <h1 style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                  App Assignment
                </h1>
                <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
                  Assign demo users from the org pool to this app. Configure role and permission per environment.
                </p>
              </div>
              <Button
                onClick={() => setAssignSheetOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", flexShrink: 0 }}
              >
                <Plus size={14} />
                Assign Demo User
              </Button>
            </div>

            {/* Environment switcher */}
            <div style={{ marginBottom: "var(--cds-space-20)" }}>
              <ContentSwitcher
                items={["Development", "Stage"]}
                value={environment}
                onValueChange={(v) => setEnvironment(v as Environment)}
                size="sm"
              />
            </div>

            {/* Assignment table */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--cds-radius-l)", overflow: "hidden", background: "var(--cds-white)" }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ background: "var(--cds-surface-subtle, #F5F5F5)" }}>
                    <TableHead style={{ width: 48 }}></TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead style={{ width: 56 }}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)" }}>
                        {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                        No demo users assigned to {environment} yet. Click "Assign Demo User" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <Avatar style={{ width: 32, height: 32 }}>
                            <AvatarFallback style={{ background: userTypeColor(a.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p4)", fontWeight: 700 }}>
                              {initials(a.displayName)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{a.displayName}</div>
                          <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{a.email}</div>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{a.username}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="subtle" colour={a.type === "User" ? "primary" : "success"}>
                            {a.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: a.role ? "var(--cds-huegrey-text-dark)" : "var(--cds-huegrey-text-default)" }}>
                            {a.role ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>{a.permission}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button size="sm" variant="ghost" style={{ padding: "4px 8px" }}>
                                <MoreHorizontal size={15} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setRemoveTarget(a)}
                                style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", color: "var(--cds-error-text-default)" }}
                              >
                                <Trash2 size={13} /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Info note */}
            <div style={{ marginTop: "var(--cds-space-16)" }}>
              <Notes variant="info" title="About app assignments">
                The same demo user can be assigned to multiple apps with different roles and permissions. Assignments are independent per environment — Development and Stage are not linked.
              </Notes>
            </div>

          </main>
        </div>
      </div>

      {/* Overlays */}
      <AssignSheet
        open={assignSheetOpen}
        onClose={() => setAssignSheetOpen(false)}
        environment={environment}
        existingUserIds={existingUserIds}
        onAssign={handleAssign}
      />
      <RemoveDialog
        assignment={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
      />
    </>
  )
}
