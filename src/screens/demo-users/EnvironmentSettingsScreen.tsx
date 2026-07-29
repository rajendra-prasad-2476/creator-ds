/**
 * EnvironmentSettingsScreen.tsx
 *
 * Environments → Application ellipsis → Settings
 * Side-pane style settings for a specific app in a specific environment.
 *
 * Tabs:
 *   - Demo Users     (Dev + Stage only)
 *   - Notifications  (Dev + Stage only)
 *   - Variables      (All environments)
 *   - Workflow Schedules (Dev + Stage only)
 *
 * PRD: Demo User in Environments — Phase 1
 * Help doc: https://help.zoho.com/.../managing-applications-in-the-environments
 *
 * Entry point: Environments → App ellipsis → Settings → Demo Users tab
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ContentSwitcher } from "@/components/ui/content-switcher"
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
  AlertDialogIcon,
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
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Plus, Trash2, ChevronLeft, Users, Settings } from "lucide-react"
import { useNavigation } from "@/screens/navigation"
import {
  SEED_ORG_POOL,
  SEED_ASSIGNMENTS,
  MOCK_ROLES,
  MOCK_PERMISSIONS,
  MOCK_PORTAL_PERMISSIONS,
  initials,
  userTypeColor,
  type Environment,
  type AppAssignment,
} from "./demo-users-mock-data"

// ─── Mock app context ─────────────────────────────────────────────────────────

const MOCK_APP = {
  name: "Task Zone",
  id: "task-zone",
}

// ─── Add Demo User Sheet ──────────────────────────────────────────────────────

interface AddDemoUserSheetProps {
  open: boolean
  onClose: () => void
  environment: Environment
  existingUserIds: string[]
  onAdd: (assignment: Omit<AppAssignment, "id">) => void
}

function AddDemoUserSheet({ open, onClose, environment, existingUserIds, onAdd }: AddDemoUserSheetProps) {
  const [userId, setUserId] = React.useState("")
  const [role, setRole] = React.useState("")
  const [permission, setPermission] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const available = SEED_ORG_POOL.filter(
    (u) => u.status === "Active" && !existingUserIds.includes(u.id)
  )
  const selected = SEED_ORG_POOL.find((u) => u.id === userId)
  const isPortal = selected?.type === "Portal User"
  const permOptions = isPortal ? MOCK_PORTAL_PERMISSIONS : MOCK_PERMISSIONS

  React.useEffect(() => { setRole(""); setPermission("") }, [userId])

  function handleAdd() {
    setSubmitted(true)
    if (!userId || !permission || (!isPortal && !role)) return
    if (!selected) return
    onAdd({
      userId: selected.id,
      email: selected.email,
      displayName: selected.displayName,
      username: selected.username,
      type: selected.type,
      environment,
      role: isPortal ? undefined : role,
      permission,
    })
    handleClose()
  }

  function handleClose() {
    setUserId(""); setRole(""); setPermission(""); setSubmitted(false); onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" style={{ width: "min(460px, 95vw)", display: "flex", flexDirection: "column" }}>
        <SheetHeader>
          <SheetTitle>Add Demo User</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-8) var(--cds-space-24) var(--cds-space-12)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Select a demo user from the org pool and assign role and permission for <strong>{MOCK_APP.name}</strong> in <strong>{environment}</strong>.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>

          {/* Name — pool dropdown */}
          <div>
            <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
              Name <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
            </Label>
            <Select value={userId} onValueChange={(v) => v && setUserId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a demo user from pool" />
              </SelectTrigger>
              <SelectContent searchable searchPlaceholder="Search demo users…">
                {available.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.displayName} ({u.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {submitted && !userId && (
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>
                Please select a demo user.
              </p>
            )}
            {available.length === 0 && (
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
                All active demo users are already assigned to this app.
              </p>
            )}
          </div>

          {/* Selected user preview */}
          {selected && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-surface-subtle, #F5F5F5)" }}>
              <Avatar style={{ width: 32, height: 32, flexShrink: 0 }}>
                <AvatarFallback style={{ background: userTypeColor(selected.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>
                  {initials(selected.displayName)}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{selected.displayName}</div>
                <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{selected.email}</div>
              </div>
              <Badge variant="subtle" colour={selected.type === "User" ? "primary" : "success"}>
                {selected.type}
              </Badge>
            </div>
          )}

          {/* Type label (auto-detected from pool identity) */}
          {selected && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, display: "block", marginBottom: "var(--cds-space-4)" }}>Type</Label>
              <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
                {selected.type} — {selected.type === "User" ? "requires role + permission" : "requires permission only"}
              </p>
            </div>
          )}

          {/* Role — User only */}
          {selected && !isPortal && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Role <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
              </Label>
              <Select value={role} onValueChange={(v) => v && setRole(v)}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {MOCK_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              {submitted && !role && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>Role is required.</p>
              )}
            </div>
          )}

          {/* Permission */}
          {selected && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Permission <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
              </Label>
              <Select value={permission} onValueChange={(v) => v && setPermission(v)}>
                <SelectTrigger><SelectValue placeholder="Select a permission" /></SelectTrigger>
                <SelectContent>
                  {permOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {submitted && !permission && (
                <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>Permission is required.</p>
              )}
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>
                Only permissions configured in Application Settings are listed.
              </p>
            </div>
          )}

          {/* Portal note */}
          {selected && isPortal && (
            <Notes variant="info" title="Portal User — no role required">
              Portal users are assigned portal permissions only. No role is applicable. Active immediately with no invite flow.
            </Notes>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", gap: "var(--cds-gap-small)", justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={available.length === 0}>Add</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Remove Confirm Dialog ────────────────────────────────────────────────────

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
          <AlertDialogIcon />
          <AlertDialogTitle>Remove {assignment.displayName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the demo user from <strong>{MOCK_APP.name}</strong> in this environment. The identity stays in the org pool and can be re-assigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>No, Keep</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(assignment.id); onClose() }}
          >
            Yes, Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Demo Users Tab ───────────────────────────────────────────────────────────

function DemoUsersTab({ environment }: { environment: Environment }) {
  const [assignments, setAssignments] = React.useState<AppAssignment[]>(
    SEED_ASSIGNMENTS.filter((a) => a.environment === environment)
  )
  const [addOpen, setAddOpen] = React.useState(false)
  const [removeTarget, setRemoveTarget] = React.useState<AppAssignment | null>(null)
  const existingIds = assignments.map((a) => a.userId)

  function handleAdd(assignment: Omit<AppAssignment, "id">) {
    setAssignments((prev) => [...prev, { ...assignment, id: `a${Date.now()}` }])
    toast.success(`${assignment.displayName} added to ${MOCK_APP.name} (${environment}).`)
  }

  function handleRemove(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast.success("Demo user removed from this app.")
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--cds-space-16)" }}>
        <div>
          <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
            Add demo users to test how your app behaves for different roles and permissions in <strong>{environment}</strong>.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)", flexShrink: 0 }}
        >
          <Plus size={14} /> Add Demo User
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--cds-space-32)", border: "1px dashed var(--border)", borderRadius: "var(--cds-radius-r)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)" }}>
          {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
          No demo users added yet. Click "Add Demo User" to select from the org pool.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
          {assignments.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
              <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
                <AvatarFallback style={{ background: userTypeColor(a.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>
                  {initials(a.displayName)}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: 2 }}>
                  <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{a.displayName}</span>
                  <Badge variant="subtle" colour={a.type === "User" ? "primary" : "success"} size="xs">
                    {a.type}
                  </Badge>
                </div>
                <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                  {a.username}
                  {a.role ? ` · ${a.role}` : ""}
                  {" · "}{a.permission}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRemoveTarget(a)}
                style={{ color: "var(--cds-error-text-default)", padding: "4px 8px", flexShrink: 0 }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "var(--cds-space-16)" }}>
        <Notes variant="info" title="Demo users use existing app permissions">
          The permissions assigned to demo users are the existing application permissions configured in Application Settings — not separate permissions exclusive to testing.
        </Notes>
      </div>

      <AddDemoUserSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        environment={environment}
        existingUserIds={existingIds}
        onAdd={handleAdd}
      />
      <RemoveDialog
        assignment={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
      />
    </>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [mailSetting, setMailSetting] = React.useState("application-specific")
  const [smsSetting, setSmsSetting] = React.useState("application-specific")
  const [pushSetting, setPushSetting] = React.useState("application-specific")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-24)" }}>
      {/* Mail */}
      <div>
        <h3 style={{ fontSize: "var(--cds-text-p1)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>Mail Notifications</h3>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-12)" }}>
          Control who receives email notifications triggered in this environment.
        </p>
        <Select value={mailSetting} onValueChange={(v) => v && setMailSetting(v)}>
          <SelectTrigger style={{ maxWidth: 320 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable Emails</SelectItem>
            <SelectItem value="login-user">Login User</SelectItem>
            <SelectItem value="selected-user">Selected User</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      {/* SMS */}
      <div>
        <h3 style={{ fontSize: "var(--cds-text-p1)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>SMS Notifications</h3>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-12)" }}>
          Control SMS notifications in this environment.
        </p>
        <Select value={smsSetting} onValueChange={(v) => v && setSmsSetting(v)}>
          <SelectTrigger style={{ maxWidth: 320 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      {/* Push */}
      <div>
        <h3 style={{ fontSize: "var(--cds-text-p1)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>Push Notifications</h3>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-12)" }}>
          Control push notifications in this environment.
        </p>
        <Select value={pushSetting} onValueChange={(v) => v && setPushSetting(v)}>
          <SelectTrigger style={{ maxWidth: 320 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable Push Notifications</SelectItem>
            <SelectItem value="login-user">Login User</SelectItem>
            <SelectItem value="selected-user">Selected User</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div style={{ marginTop: "var(--cds-space-8)" }}>
        <Button>Done</Button>
      </div>
    </div>
  )
}

// ─── Variables Tab ────────────────────────────────────────────────────────────

const MOCK_VARIABLES = [
  { name: "API_KEY", definedValue: "prod-key-xyz", currentValue: "dev-key-abc" },
  { name: "MAX_RETRIES", definedValue: "3", currentValue: "5" },
  { name: "DEBUG_MODE", definedValue: "false", currentValue: "true" },
]

function VariablesTab({ environment }: { environment: Environment }) {
  return (
    <div>
      <Notes variant="neutral" title="Read-only view">
        Variables are created and managed in Application Settings (Development environment only). This view shows defined and current values for {environment}.
      </Notes>
      <div style={{ marginTop: "var(--cds-space-16)", border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--cds-surface-subtle, #F5F5F5)", padding: "var(--cds-space-8) var(--cds-padding-card)", fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)" }}>
          <span>Variable</span><span>Defined Value</span><span>Current Value</span>
        </div>
        {MOCK_VARIABLES.map((v, i) => (
          <div key={v.name} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "var(--cds-space-12) var(--cds-padding-card)", borderTop: i === 0 ? "none" : "1px solid var(--border)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>
            <span style={{ fontWeight: 500 }}>{v.name}</span>
            <span style={{ color: "var(--cds-huegrey-text-default)" }}>{v.definedValue}</span>
            <span>{v.currentValue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Workflow Schedules Tab ───────────────────────────────────────────────────

function WorkflowSchedulesTab() {
  const [setting, setSetting] = React.useState("application-specific")
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
      <Notes variant="warning" title="Schedules run continuously in testing environments">
        Once tested, schedules may no longer need to run continuously. Suspend them to conserve your schedule limits.
      </Notes>
      <div>
        <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
          Schedule Execution Mode
        </Label>
        <Select value={setting} onValueChange={(v) => v && setSetting(v)}>
          <SelectTrigger style={{ maxWidth: 320 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="suspend-all">Suspend All Schedules</SelectItem>
            <SelectItem value="application-specific">Application-Specific</SelectItem>
          </SelectContent>
        </Select>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-8)" }}>
          {setting === "suspend-all"
            ? "All schedule workflows will be suspended in this environment, regardless of their enabled/disabled status."
            : "Only schedules with an enabled status in the application will be executed."}
        </p>
      </div>
      <Button style={{ alignSelf: "flex-start" }}>Done</Button>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EnvironmentSettingsScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()
  const [environment, setEnvironment] = React.useState<Environment>("Development")

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <LeftNav activeId="environments" />
          <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

            {/* Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canGoBack ? goBack() : navigate("demo-users-org-pool")}
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--cds-gap-tight)", color: "var(--cds-huegrey-text-default)", marginBottom: "var(--cds-space-16)", paddingLeft: 0 }}
            >
              <ChevronLeft size={14} />
              Environments
            </Button>

            {/* App context header */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-24)", padding: "var(--cds-space-12) var(--cds-padding-card)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "var(--cds-radius-s)", background: "var(--cds-primary-surface-default)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700, flexShrink: 0 }}>TZ</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{MOCK_APP.name}</div>
                <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <Settings size={11} /> Settings
                </div>
              </div>
              {/* Environment switcher in header */}
              <ContentSwitcher
                items={["Development", "Stage"]}
                value={environment}
                onValueChange={(v) => setEnvironment(v as Environment)}
                size="xs"
              />
            </div>

            {/* Tabs — Demo Users / Notifications / Variables / Workflow Schedules */}
            <Tabs defaultValue="demo-users">
              <TabsList style={{ marginBottom: "var(--cds-space-24)", background: "transparent", padding: 0, borderBottom: "1px solid var(--border)" }}>
                <TabsTrigger value="demo-users" style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
                  <Users size={13} /> Demo Users
                </TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="schedules">Workflow Schedules</TabsTrigger>
              </TabsList>

              <TabsContent value="demo-users">
                <DemoUsersTab environment={environment} />
              </TabsContent>

              <TabsContent value="notifications">
                {environment === "Development" || environment === "Stage" ? (
                  <NotificationsTab />
                ) : (
                  <Notes variant="neutral" title="Not available in Production">
                    Notifications can only be configured in Development and Stage environments.
                  </Notes>
                )}
              </TabsContent>

              <TabsContent value="variables">
                <VariablesTab environment={environment} />
              </TabsContent>

              <TabsContent value="schedules">
                {environment === "Development" || environment === "Stage" ? (
                  <WorkflowSchedulesTab />
                ) : (
                  <Notes variant="neutral" title="Not available in Production">
                    Workflow schedule settings are only configurable in Development and Stage environments.
                  </Notes>
                )}
              </TabsContent>
            </Tabs>

          </main>
        </div>
      </div>
    </>
  )
}
