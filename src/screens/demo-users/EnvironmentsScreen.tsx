/**
 * EnvironmentsScreen.tsx
 *
 * Environments page — app listing with Stage + Production columns.
 * Clicking the ··· menu on any app in the Development column shows:
 *   Development group: Edit, Access, Settings, Logs, Export
 *
 * Clicking "Settings" opens the Environment Settings Sheet (slide-in panel)
 * with tabs: Demo Users | Notifications | AI Models | Variables | Workflow Schedules
 *
 * Uses: SplitPanelTemplate (AGENTS.md §6)
 *
 * Help doc: https://help.zoho.com/.../managing-applications-in-the-environments
 */

import * as React from "react"
import SplitPanelTemplate from "@/templates/SplitPanelTemplate"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import { Notes } from "@/components/ui/notes"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Plus, Trash2, Users } from "lucide-react"
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

// ─── Mock apps ────────────────────────────────────────────────────────────────

const MOCK_APPS = [
  { id: "auto-supplies",    label: "Auto Supplies",   status: "Changes available",    color: "#0D4EF2" },
  { id: "auto-dealership",  label: "Auto Dealership", status: "Changes available",    color: "#D25704" },
  { id: "expenses",         label: "Expenses",        status: "No changes available", color: "#078841" },
  { id: "procurement",      label: "Procurement V1",  status: "No changes available", color: "#CC1914" },
]

// ─── Add Demo User Sheet ──────────────────────────────────────────────────────

interface AddDemoUserSheetProps {
  open: boolean
  onClose: () => void
  environment: Environment
  existingUserIds: string[]
  appName: string
  onAdd: (assignment: Omit<AppAssignment, "id">) => void
}

function AddDemoUserSheet({ open, onClose, environment, existingUserIds, appName, onAdd }: AddDemoUserSheetProps) {
  const [userId, setUserId] = React.useState("")
  const [role, setRole] = React.useState("")
  const [permission, setPermission] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const available = SEED_ORG_POOL.filter(u => u.status === "Active" && !existingUserIds.includes(u.id))
  const selected = SEED_ORG_POOL.find(u => u.id === userId)
  const isPortal = selected?.type === "Portal User"
  const permOptions = isPortal ? MOCK_PORTAL_PERMISSIONS : MOCK_PERMISSIONS

  React.useEffect(() => { setRole(""); setPermission("") }, [userId])

  function handleAdd() {
    setSubmitted(true)
    if (!userId || !permission || (!isPortal && !role)) return
    if (!selected) return
    onAdd({ userId: selected.id, email: selected.email, displayName: selected.displayName, username: selected.username, type: selected.type, environment, role: isPortal ? undefined : role, permission })
    handleClose()
  }

  function handleClose() {
    setUserId(""); setRole(""); setPermission(""); setSubmitted(false); onClose()
  }

  return (
    <Sheet open={open} onOpenChange={o => !o && handleClose()}>
      <SheetContent side="right" style={{ width: "min(460px, 95vw)", display: "flex", flexDirection: "column" }}>
        <SheetHeader>
          <SheetTitle>Add Demo User</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-8) var(--cds-space-24) var(--cds-space-12)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Select a demo user from the org pool and assign role and permission for <strong>{appName}</strong> in <strong>{environment}</strong>.
          </p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-24)", display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
          <div>
            <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
              Name <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
            </Label>
            <Select value={userId} onValueChange={v => v && setUserId(v)}>
              <SelectTrigger><SelectValue placeholder="Select a demo user from pool" /></SelectTrigger>
              <SelectContent searchable searchPlaceholder="Search demo users…">
                {available.map(u => <SelectItem key={u.id} value={u.id}>{u.displayName} ({u.username})</SelectItem>)}
              </SelectContent>
            </Select>
            {submitted && !userId && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>Please select a demo user.</p>}
            {available.length === 0 && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>All active demo users are already assigned to this app.</p>}
          </div>

          {selected && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-surface-subtle, #F5F5F5)" }}>
              <Avatar style={{ width: 32, height: 32, flexShrink: 0 }}>
                <AvatarFallback style={{ background: userTypeColor(selected.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>{initials(selected.displayName)}</AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{selected.displayName}</div>
                <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{selected.email}</div>
              </div>
              <Badge variant="subtle" colour={selected.type === "User" ? "primary" : "success"}>{selected.type}</Badge>
            </div>
          )}

          {selected && !isPortal && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>Role <span style={{ color: "var(--cds-error-text-default)" }}>*</span></Label>
              <Select value={role} onValueChange={v => v && setRole(v)}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>{MOCK_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
              {submitted && !role && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>Role is required.</p>}
            </div>
          )}

          {selected && (
            <div>
              <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
                Permission <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
              </Label>
              <Select value={permission} onValueChange={v => v && setPermission(v)}>
                <SelectTrigger><SelectValue placeholder="Select a permission" /></SelectTrigger>
                <SelectContent>{permOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
              {submitted && !permission && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>Permission is required.</p>}
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>Only permissions configured in Application Settings are listed.</p>
            </div>
          )}

          {selected && isPortal && (
            <Notes variant="info" title="Portal User — no role required">
              Portal users are assigned portal permissions only. No role is applicable.
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

function RemoveDialog({ assignment, appName, onClose, onConfirm }: { assignment: AppAssignment | null; appName: string; onClose: () => void; onConfirm: (id: string) => void }) {
  if (!assignment) return null
  return (
    <AlertDialog open={!!assignment} onOpenChange={o => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {assignment.displayName}?</AlertDialogTitle>
          <AlertDialogDescription>This removes the demo user from <strong>{appName}</strong> in this environment. The identity stays in the org pool and can be re-assigned.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>No, Keep</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onConfirm(assignment.id); onClose() }} style={{ background: "var(--cds-error-surface-default)" }}>Yes, Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Demo Users Tab ───────────────────────────────────────────────────────────

function DemoUsersTab({ environment, appName }: { environment: Environment; appName: string }) {
  const [assignments, setAssignments] = React.useState<AppAssignment[]>(
    SEED_ASSIGNMENTS.filter(a => a.environment === environment)
  )
  const [addOpen, setAddOpen] = React.useState(false)
  const [removeTarget, setRemoveTarget] = React.useState<AppAssignment | null>(null)
  const existingIds = assignments.map(a => a.userId)

  function handleAdd(assignment: Omit<AppAssignment, "id">) {
    setAssignments(prev => [...prev, { ...assignment, id: `a${Date.now()}` }])
    toast.success(`${assignment.displayName} added to ${appName} (${environment}).`)
  }

  function handleRemove(id: string) {
    setAssignments(prev => prev.filter(a => a.id !== id))
    toast.success("Demo user removed.")
  }

  return (
    <>
      {assignments.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--cds-space-32)", gap: "var(--cds-space-16)", minHeight: 260 }}>
          {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
          <div style={{ width: 64, height: 64, borderRadius: "var(--cds-radius-full)", background: "var(--cds-primary-surface-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={28} style={{ color: "var(--cds-primary-text-default)" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>No demo users found</p>
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>Add demo users to test this app as different roles and permissions.</p>
          </div>
          <Button onClick={() => setAddOpen(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
            <Plus size={14} /> Add Demo User
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--cds-space-12)" }}>
            <Button size="sm" onClick={() => setAddOpen(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
              <Plus size={13} /> Add Demo User
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
            {assignments.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", padding: "var(--cds-space-12)", borderRadius: "var(--cds-radius-r)", border: "1px solid var(--border)", background: "var(--cds-white)" }}>
                <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
                  <AvatarFallback style={{ background: userTypeColor(a.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p3)", fontWeight: 700 }}>{initials(a.displayName)}</AvatarFallback>
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: 2 }}>
                    <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>{a.displayName}</span>
                    <Badge variant="subtle" colour={a.type === "User" ? "primary" : "success"} size="xs">{a.type}</Badge>
                  </div>
                  <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                    {a.username}{a.role ? ` · ${a.role}` : ""} · {a.permission}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setRemoveTarget(a)} style={{ color: "var(--cds-error-text-default)", padding: "4px 8px", flexShrink: 0 }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "var(--cds-space-12)" }}>
            <Notes variant="info" title="Demo users use existing app permissions">
              Permissions assigned to demo users are the existing application permissions configured in Application Settings — not separate permissions exclusive to testing.
            </Notes>
          </div>
        </>
      )}
      <AddDemoUserSheet open={addOpen} onClose={() => setAddOpen(false)} environment={environment} existingUserIds={existingIds} appName={appName} onAdd={handleAdd} />
      <RemoveDialog assignment={removeTarget} appName={appName} onClose={() => setRemoveTarget(null)} onConfirm={handleRemove} />
    </>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [mail, setMail] = React.useState("application-specific")
  const [sms, setSms] = React.useState("application-specific")
  const [push, setPush] = React.useState("application-specific")
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-20)" }}>
      <div>
        <Label style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, marginBottom: "var(--cds-space-4)", display: "block" }}>Mail Notifications</Label>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-8)" }}>Control who receives email notifications in this environment.</p>
        <Select value={mail} onValueChange={v => v && setMail(v)}>
          <SelectTrigger style={{ maxWidth: 300 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable Emails</SelectItem>
            <SelectItem value="login-user">Login User</SelectItem>
            <SelectItem value="selected-user">Selected User</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, marginBottom: "var(--cds-space-4)", display: "block" }}>SMS Notifications</Label>
        <Select value={sms} onValueChange={v => v && setSms(v)}>
          <SelectTrigger style={{ maxWidth: 300 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, marginBottom: "var(--cds-space-4)", display: "block" }}>Push Notifications</Label>
        <Select value={push} onValueChange={v => v && setPush(v)}>
          <SelectTrigger style={{ maxWidth: 300 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="disable">Disable Push Notifications</SelectItem>
            <SelectItem value="login-user">Login User</SelectItem>
            <SelectItem value="selected-user">Selected User</SelectItem>
            <SelectItem value="application-specific">Application Specific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button style={{ alignSelf: "flex-start" }}>Done</Button>
    </div>
  )
}

// ─── Variables Tab ────────────────────────────────────────────────────────────

const MOCK_VARIABLES = [
  { name: "API_KEY", defined: "prod-key-xyz", current: "dev-key-abc" },
  { name: "MAX_RETRIES", defined: "3", current: "5" },
  { name: "DEBUG_MODE", defined: "false", current: "true" },
]

function VariablesTab() {
  return (
    <div>
      <Notes variant="neutral" title="Read-only — create variables in Application Settings">
        Variables can only be created and managed from Application Settings in the Development environment.
      </Notes>
      <div style={{ marginTop: "var(--cds-space-16)", border: "1px solid var(--border)", borderRadius: "var(--cds-radius-r)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--cds-surface-subtle, #F5F5F5)", padding: "var(--cds-space-8) var(--cds-padding-card)", fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)" }}>
          <span>Variable</span><span>Defined Value</span><span>Current Value</span>
        </div>
        {MOCK_VARIABLES.map((v, i) => (
          <div key={v.name} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "var(--cds-space-12) var(--cds-padding-card)", borderTop: i === 0 ? "none" : "1px solid var(--border)", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-dark)" }}>
            <span style={{ fontWeight: 500 }}>{v.name}</span>
            <span style={{ color: "var(--cds-huegrey-text-default)" }}>{v.defined}</span>
            <span>{v.current}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Workflow Schedules Tab ───────────────────────────────────────────────────

function SchedulesTab() {
  const [mode, setMode] = React.useState("application-specific")
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
      <Notes variant="warning" title="Schedules run continuously in testing environments">
        Suspend schedules to conserve your shared schedule limit (Dev + Stage share 20% of your plan's total limit).
      </Notes>
      <div>
        <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>Schedule Execution Mode</Label>
        <Select value={mode} onValueChange={v => v && setMode(v)}>
          <SelectTrigger style={{ maxWidth: 300 }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="suspend-all">Suspend All Schedules</SelectItem>
            <SelectItem value="application-specific">Application-Specific</SelectItem>
          </SelectContent>
        </Select>
        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-8)" }}>
          {mode === "suspend-all" ? "All schedule workflows will be suspended in this environment." : "Only schedules with an enabled status will be executed."}
        </p>
      </div>
      <Button style={{ alignSelf: "flex-start" }}>Done</Button>
    </div>
  )
}

// ─── Environment Settings Sheet ───────────────────────────────────────────────

interface EnvSettingsSheetProps {
  open: boolean
  onClose: () => void
  appName: string
}

function EnvironmentSettingsSheet({ open, onClose, appName }: EnvSettingsSheetProps) {
  const [env, setEnv] = React.useState<Environment>("Development")

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent
        side="right"
        style={{ width: "min(780px, 95vw)", display: "flex", flexDirection: "column" }}
      >
        <SheetHeader>
          <SheetTitle>Environment Settings</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "var(--cds-space-4) var(--cds-space-24) var(--cds-space-12)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Manage environment-specific tasks associated with each application.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "var(--cds-space-16) var(--cds-space-24)" }}>
          {/* Tabs row with env + app dropdowns on the right */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", marginBottom: "var(--cds-space-24)" }}>
            <Tabs defaultValue="demo-users" style={{ flex: 1 }}>
              <TabsList style={{ background: "transparent", padding: 0 }}>
                <TabsTrigger value="demo-users">Demo Users</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="ai-models">AI Models</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="schedules">Workflow Schedules</TabsTrigger>
              </TabsList>

              {/* Environment + App selectors — inline right of tabs */}
              <div style={{ display: "flex", gap: "var(--cds-gap-small)", marginBottom: "var(--cds-space-16)", marginTop: "var(--cds-space-16)" }}>
                <Select value={env} onValueChange={v => v && setEnv(v as Environment)}>
                  <SelectTrigger style={{ width: 160 }}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="expenses">
                  <SelectTrigger style={{ width: 160 }}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MOCK_APPS.map(a => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="demo-users">
                <DemoUsersTab environment={env} appName={appName} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
              <TabsContent value="ai-models">
                <div style={{ textAlign: "center", padding: "var(--cds-space-32)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p2)" }}>
                  {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                  No AI models configured for this environment.
                </div>
              </TabsContent>
              <TabsContent value="variables">
                <VariablesTab />
              </TabsContent>
              <TabsContent value="schedules">
                <SchedulesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EnvironmentsScreen() {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [selectedApp, setSelectedApp] = React.useState("Expenses")

  function handleSettingsClick(appName: string) {
    setSelectedApp(appName)
    setSettingsOpen(true)
  }

  return (
    <>
      <Toaster richColors position="top-right" />

      <SplitPanelTemplate
        title="Environments"
        description="Multi-stage deployment space to test and publish your application without affecting the production."
        learnMoreHref="#"
        activeNavId="environments"
        headerActions={[
          { label: "Version History", variant: "outline" },
          { label: "Manage", variant: "default", dropdownItems: [{ label: "Settings" }, { label: "Variables" }, { label: "Schedules" }] },
          { label: "Publish", variant: "default", dropdownItems: [{ label: "Publish to Stage" }, { label: "Publish to Production" }] },
        ]}
        listItems={MOCK_APPS.map(a => ({
          id: a.id,
          label: a.label,
          sublabel: a.status,
          sublabelColor: a.status === "Changes available" ? "var(--cds-primary-text-default)" : "var(--cds-huegrey-text-default)",
          accentColor: a.color,
          onMenuAction: (action: string) => {
            if (action === "Settings") handleSettingsClick(a.label)
          },
          menuGroups: [
            {
              label: "Development",
              items: [
                { label: "Edit" },
                { label: "Access" },
                { label: "Settings" },
                { label: "Logs" },
                { label: "Export" },
              ],
            },
          ],
        }))}
        panels={[
          {
            label: "Stage",
            accentColor: "var(--cds-primary-surface-default)",
            items: [
              { id: "s1", label: "1.2", sublabel: "May 28, 2025" },
              { id: "s2", label: "1.5", sublabel: "Oct 03, 2023" },
            ],
          },
          {
            label: "Production",
            accentColor: "var(--cds-success-surface-default)",
            items: [
              { id: "p1", label: "1.2", sublabel: "May 28, 2025" },
              { id: "p2", label: "1.5", sublabel: "Oct 03, 2023" },
              { id: "p3", label: "1.0", sublabel: "Jan 04, 2024" },
            ],
          },
        ]}
      />

      <EnvironmentSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        appName={selectedApp}
      />
    </>
  )
}
