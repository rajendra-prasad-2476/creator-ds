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
 * "Add Demo User" renders as an inline panel inside the same sheet — no nested sheets.
 *
 * Uses: SplitPanelTemplate (AGENTS.md §6)
 *
 * Help doc: https://help.zoho.com/.../managing-applications-in-the-environments
 */

import * as React from "react"
import { createPortal } from "react-dom"
import SplitPanelTemplate from "@/templates/SplitPanelTemplate"
import { useNavigation } from "@/screens/navigation"
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
import { ArrowLeft, ChevronDown, Plus, Search, Trash2, Users, X } from "lucide-react"
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

// ─── User Search Combobox ─────────────────────────────────────────────────────
// Inline searchable combobox that avoids nesting a Base UI Select (with its own
// FloatingFocusManager) inside the Sheet's FloatingFocusManager. Both managers
// would fight over keyboard events, making the search input un-typeable.
// This component renders a plain <input> + an absolutely-positioned list so that
// all key events flow directly to the input without any focus-trap interference.

type PoolUser = typeof SEED_ORG_POOL[number]

interface UserSearchComboboxProps {
  available: PoolUser[]
  value: string
  onChange: (id: string) => void
  submitted: boolean
}

function UserSearchCombobox({ available, value, onChange, submitted }: UserSearchComboboxProps) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)
  const [bodyEl, setBodyEl] = React.useState<HTMLElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // Safely capture document.body after mount (avoids SSR/pre-render errors)
  React.useEffect(() => { setBodyEl(document.body) }, [])

  const selectedUser = available.find(u => u.id === value) ??
    SEED_ORG_POOL.find(u => u.id === value) // keep label even if filtered out

  const filtered = query
    ? available.filter(u =>
        `${u.displayName} ${u.username} ${u.email}`.toLowerCase().includes(query.toLowerCase())
      )
    : available

  // Close when clicking outside (checks both the trigger wrapper and the portal list)
  React.useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      const insideWrapper = wrapperRef.current?.contains(target)
      const insideList = listRef.current?.contains(target)
      if (!insideWrapper && !insideList) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  function openDropdown() {
    setQuery("")
    // Capture the trigger's viewport rect so the portal can position itself
    if (wrapperRef.current) {
      const btn = wrapperRef.current.querySelector("button")
      setTriggerRect(btn ? btn.getBoundingClientRect() : wrapperRef.current.getBoundingClientRect())
    }
    setOpen(true)
    // Focus the input on next tick after dropdown renders
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function selectUser(u: PoolUser) {
    onChange(u.id)
    setOpen(false)
    setQuery("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false)
    } else if (e.key === "Enter" && filtered.length > 0) {
      selectUser(filtered[0])
    }
    // Stop propagation so Sheet's focus-trap never sees these keystrokes
    e.stopPropagation()
  }

  const displayLabel = selectedUser
    ? `${selectedUser.displayName} (${selectedUser.username})`
    : ""

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
        Name <span style={{ color: "var(--cds-error-text-default)" }}>*</span>
      </Label>

      {/* Trigger — mimics SelectTrigger visually */}
      <button
        type="button"
        onClick={openDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: 36,
          padding: "0 11px",
          border: `1px solid ${submitted && !value ? "var(--cds-error-border-default)" : open ? "var(--cds-primary-border-default)" : "var(--cds-huegrey-border-fairish)"}`,
          borderRadius: "var(--cds-radius-r)",
          background: "var(--cds-white)",
          cursor: "pointer",
          fontSize: "var(--cds-text-p2)",
          color: value ? "var(--cds-huegrey-text-dark)" : "var(--cds-huegrey-text-fairish)",
          textAlign: "left",
          gap: 8,
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayLabel || "Select a demo user from pool"}
        </span>
        <ChevronDown size={14} style={{ flexShrink: 0, color: "var(--cds-huegrey-text-default)", transform: open ? "rotate(180deg)" : "none", transition: "transform 100ms" }} />
      </button>

      {/* Dropdown — rendered into document.body to escape overflow:auto (Sheet scroll area) */}
      {open && triggerRect && bodyEl instanceof HTMLElement && createPortal(
        <div
          ref={listRef}
          style={{
            position: "fixed",
            top: triggerRect.bottom + 4,
            left: triggerRect.left,
            width: triggerRect.width,
            border: "1px solid var(--cds-huegrey-border-minimal)",
            borderRadius: "var(--cds-radius-r)",
            background: "var(--cds-white)",
            boxShadow: "var(--cds-shadow-base)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Search input */}
          <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid var(--cds-huegrey-border-minimal)" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 8, color: "var(--cds-huegrey-text-default)", pointerEvents: "none", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search demo users…"
                style={{
                  width: "100%",
                  height: 30,
                  paddingLeft: 28,
                  paddingRight: query ? 28 : 8,
                  border: "1px solid var(--cds-huegrey-border-fairish)",
                  borderRadius: "var(--cds-radius-s)",
                  fontSize: "var(--cds-text-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                  outline: "none",
                  background: "var(--cds-white)",
                }}
              />
              {query && (
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setQuery("")}
                  style={{ position: "absolute", right: 8, background: "transparent", border: "none", cursor: "pointer", color: "var(--cds-huegrey-text-default)", display: "flex", alignItems: "center" }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div style={{ maxHeight: 220, overflowY: "auto", padding: "6px 0" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                No users match your search.
              </div>
            ) : (
              filtered.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => selectUser(u)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "8px 12px",
                    background: u.id === value ? "var(--cds-secondary-surface-subtle)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "var(--cds-text-p2)",
                    color: "var(--cds-huegrey-text-dark)",
                    textAlign: "left",
                    gap: 8,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cds-secondary-surface-subtle-hover)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = u.id === value ? "var(--cds-secondary-surface-subtle)" : "transparent" }}
                >
                  <Avatar style={{ width: 24, height: 24, flexShrink: 0 }}>
                    <AvatarFallback style={{ background: userTypeColor(u.type), color: "var(--cds-white)", fontSize: "var(--cds-text-p4)", fontWeight: 700 }}>{initials(u.displayName)}</AvatarFallback>
                  </Avatar>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.displayName} <span style={{ color: "var(--cds-huegrey-text-default)" }}>({u.username})</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>,
        bodyEl
      )}

      {submitted && !value && (
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
  )
}

// ─── Inline Select ────────────────────────────────────────────────────────────
// Plain inline dropdown that avoids the FloatingFocusManager conflict.
// Used for Role and Permission fields inside the Sheet.

interface InlineSelectProps {
  label: string
  required?: boolean
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
}

function InlineSelect({ label, required, placeholder, options, value, onChange, error, hint }: InlineSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)
  const [bodyEl, setBodyEl] = React.useState<HTMLElement | null>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => { setBodyEl(document.body) }, [])

  React.useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      const insideWrapper = wrapperRef.current?.contains(target)
      const insideList = listRef.current?.contains(target)
      if (!insideWrapper && !insideList) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  function openDropdown() {
    if (wrapperRef.current) {
      const btn = wrapperRef.current.querySelector("button")
      setTriggerRect(btn ? btn.getBoundingClientRect() : wrapperRef.current.getBoundingClientRect())
    }
    setOpen(o => !o)
  }

  const selectedLabel = options.find(o => o.value === value)?.label

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {label && (
        <Label style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, marginBottom: "var(--cds-space-8)", display: "block" }}>
          {label} {required && <span style={{ color: "var(--cds-error-text-default)" }}>*</span>}
        </Label>
      )}
      <button
        type="button"
        onClick={openDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: 36,
          padding: "0 11px",
          border: `1px solid ${error ? "var(--cds-error-border-default)" : open ? "var(--cds-primary-border-default)" : "var(--cds-huegrey-border-fairish)"}`,
          borderRadius: "var(--cds-radius-r)",
          background: "var(--cds-white)",
          cursor: "pointer",
          fontSize: "var(--cds-text-p2)",
          color: value ? "var(--cds-huegrey-text-dark)" : "var(--cds-huegrey-text-fairish)",
          textAlign: "left",
          gap: 8,
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={14} style={{ flexShrink: 0, color: "var(--cds-huegrey-text-default)", transform: open ? "rotate(180deg)" : "none", transition: "transform 100ms" }} />
      </button>

      {/* Dropdown — portalled to document.body so it escapes overflow:auto containers */}
      {open && triggerRect && bodyEl instanceof HTMLElement && createPortal(
        <div
          ref={listRef}
          style={{
            position: "fixed",
            top: triggerRect.bottom + 4,
            left: triggerRect.left,
            width: triggerRect.width,
            border: "1px solid var(--cds-huegrey-border-minimal)",
            borderRadius: "var(--cds-radius-r)",
            background: "var(--cds-white)",
            boxShadow: "var(--cds-shadow-base)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div style={{ maxHeight: 220, overflowY: "auto", padding: "6px 0" }}>
            {options.map(o => (
              <button
                key={o.value}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(o.value); setOpen(false) }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "9px 12px",
                  background: o.value === value ? "var(--cds-secondary-surface-subtle)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "var(--cds-text-p2)",
                  color: "var(--cds-huegrey-text-dark)",
                  textAlign: "left",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--cds-secondary-surface-subtle-hover)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = o.value === value ? "var(--cds-secondary-surface-subtle)" : "transparent" }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>,
        bodyEl
      )}

      {error && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)", marginTop: "var(--cds-space-4)" }}>{error}</p>}
      {hint && <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", marginTop: "var(--cds-space-4)" }}>{hint}</p>}
    </div>
  )
}

// ─── Add Demo User Inline Panel ───────────────────────────────────────────────
// Renders as an inline form (no nested Sheet), called inside DemoUsersTab

interface AddDemoUserPanelProps {
  environment: Environment
  existingUserIds: string[]
  appName: string
  onAdd: (assignment: Omit<AppAssignment, "id">) => void
  onCancel: () => void
}

function AddDemoUserPanel({ environment, existingUserIds, appName, onAdd, onCancel }: AddDemoUserPanelProps) {
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
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sub-header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", padding: "var(--cds-space-12) 0 var(--cds-space-16)", borderBottom: "1px solid var(--border)", marginBottom: "var(--cds-space-20)" }}>
        <button
          onClick={onCancel}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: "4px", borderRadius: "var(--cds-radius-s)", color: "var(--cds-huegrey-text-default)" }}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)" }}>Add Demo User</div>
          <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
            Select from the org pool — <strong>{appName}</strong> · <strong>{environment}</strong>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--cds-space-16)" }}>
        {/* Name — inline searchable combobox (avoids FloatingFocusManager conflict with Sheet) */}
        <UserSearchCombobox
          available={available}
          value={userId}
          onChange={setUserId}
          submitted={submitted}
        />

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
          <InlineSelect
            label="Role"
            required
            placeholder="Select a role"
            options={MOCK_ROLES.map(r => ({ value: r, label: r }))}
            value={role}
            onChange={setRole}
            error={submitted && !role ? "Role is required." : undefined}
          />
        )}

        {selected && (
          <InlineSelect
            label="Permission"
            required
            placeholder="Select a permission"
            options={permOptions.map(p => ({ value: p, label: p }))}
            value={permission}
            onChange={setPermission}
            error={submitted && !permission ? "Permission is required." : undefined}
            hint="Only permissions configured in Application Settings are listed."
          />
        )}

        {selected && isPortal && (
          <Notes variant="info" title="Portal User — no role required">
            Portal users are assigned portal permissions only. No role is applicable.
          </Notes>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--cds-space-16)", marginTop: "var(--cds-space-16)", display: "flex", gap: "var(--cds-gap-small)", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleAdd} disabled={available.length === 0}>Add</Button>
      </div>
    </div>
  )
}

// ─── Demo Users Tab ───────────────────────────────────────────────────────────

function DemoUsersTab({ environment, appName }: { environment: Environment; appName: string }) {
  const [assignments, setAssignments] = React.useState<AppAssignment[]>(
    SEED_ASSIGNMENTS.filter(a => a.environment === environment)
  )
  const [showAddPanel, setShowAddPanel] = React.useState(false)
  const [removeTarget, setRemoveTarget] = React.useState<AppAssignment | null>(null)
  const [bodyEl, setBodyEl] = React.useState<HTMLElement | null>(null)
  const existingIds = assignments.map(a => a.userId)

  // Safely capture document.body after mount (avoids SSR/pre-render portal errors)
  React.useEffect(() => { setBodyEl(document.body) }, [])
  React.useEffect(() => { setShowAddPanel(false) }, [environment])

  function handleAdd(assignment: Omit<AppAssignment, "id">) {
    setAssignments(prev => [...prev, { ...assignment, id: `a${Date.now()}` }])
    toast.success(`${assignment.displayName} added to ${appName} (${environment}).`)
    setShowAddPanel(false)
  }

  function handleRemove(id: string) {
    setAssignments(prev => prev.filter(a => a.id !== id))
    toast.success("Demo user removed.")
  }

  // ── Show Add form inline ──────────────────────────────────────────────────
  if (showAddPanel) {
    return (
      <AddDemoUserPanel
        environment={environment}
        existingUserIds={existingIds}
        appName={appName}
        onAdd={handleAdd}
        onCancel={() => setShowAddPanel(false)}
      />
    )
  }

  // ── User list ─────────────────────────────────────────────────────────────
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
          <Button onClick={() => setShowAddPanel(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
            <Plus size={14} /> Add Demo User
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--cds-space-12)" }}>
            <Button size="sm" onClick={() => setShowAddPanel(true)} style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)" }}>
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

      {/* Render the confirm dialog via a portal at document.body so it escapes the Sheet stacking context */}
      {removeTarget && bodyEl instanceof HTMLElement && createPortal(
        <AlertDialog open={!!removeTarget} onOpenChange={o => !o && setRemoveTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove {removeTarget.displayName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the demo user from <strong>{appName}</strong> in this environment.
                The identity stays in the org pool and can be re-assigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRemoveTarget(null)}>No, Keep</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => { handleRemove(removeTarget.id); setRemoveTarget(null) }}
                style={{ background: "var(--cds-error-surface-default)" }}
              >
                Yes, Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
        bodyEl
      )}
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

  // Reset env when sheet closes
  React.useEffect(() => { if (!open) setEnv("Development") }, [open])

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent
        side="right"
        style={{ width: "min(900px, 95vw)", display: "flex", flexDirection: "column" }}
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
          <Tabs defaultValue="demo-users" style={{ flex: 1 }}>
            {/* Tabs + dropdowns on the same row, tabs left / dropdowns right, bottom-border underline */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "1px solid var(--border)", marginBottom: "var(--cds-space-20)" }}>
              <TabsList style={{ background: "transparent", padding: 0, alignSelf: "flex-end" }}>
                <TabsTrigger value="demo-users">Demo Users</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="ai-models">AI Models</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="schedules">Workflow Schedules</TabsTrigger>
              </TabsList>

              {/* Env + App selectors — inline dropdowns to avoid FloatingFocusManager conflict */}
              <div style={{ display: "flex", gap: "var(--cds-gap-small)", paddingBottom: "var(--cds-space-8)", flexShrink: 0 }}>
                <InlineSelect
                  label=""
                  placeholder="Development"
                  options={[
                    { value: "Development", label: "Development" },
                    { value: "Stage", label: "Stage" },
                  ]}
                  value={env}
                  onChange={v => setEnv(v as Environment)}
                />
                <InlineSelect
                  label=""
                  placeholder="Select app"
                  options={MOCK_APPS.map(a => ({ value: a.id, label: a.label }))}
                  value="expenses"
                  onChange={() => {}}
                />
              </div>
            </div>

            <TabsContent value="demo-users">
              {/* DemoUsersTab now manages its own inline add panel — no second Sheet */}
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

        <div style={{ borderTop: "1px solid var(--border)", padding: "var(--cds-space-16) var(--cds-space-24)", display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EnvironmentsScreen() {
  const { navigate } = useNavigation()
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
          {
            label: "Manage",
            variant: "default",
            dropdownItems: [
              { label: "Demo Users", onSelect: () => setTimeout(() => navigate("demo-users-org-pool"), 0), onClick: () => setTimeout(() => navigate("demo-users-org-pool"), 0) },
              { label: "Settings" },
              { label: "Variables" },
              { label: "Schedules" },
            ],
          },
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
