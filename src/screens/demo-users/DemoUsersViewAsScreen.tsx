/**
 * DemoUsersViewAsScreen.tsx
 *
 * App Live View / Preview Mode — "View As" switcher
 * Persistent in the app top bar during live/preview mode.
 *
 * PRD: Demo User in Environments — Phase 1
 * - Grouped: User / Portal User
 * - Shows display name, username, role, permission per entry
 * - Search/filter available
 * - "Myself" always present — only Myself has edit access
 * - Switching re-renders app with new user's role + permission context
 * - Demo user view is read-only — edit attempts show permission-denied
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ContentSwitcher } from "@/components/ui/content-switcher"
import { Notes } from "@/components/ui/notes"
import { Separator } from "@/components/ui/separator"
import { Search, Eye, Lock } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type DemoUserType = "User" | "Portal User"

interface ViewAsEntry {
  id: string
  displayName: string
  username: string
  type: DemoUserType
  role?: string
  permission: string
  isMyself?: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SEED_ENTRIES: ViewAsEntry[] = [
  // Myself always first
  {
    id: "myself",
    displayName: "rajendra.prasad",
    username: "rajendra.prasad",
    type: "User",
    role: "Admin",
    permission: "Full Access",
    isMyself: true,
  },
  // Shared users
  {
    id: "u1",
    displayName: "Sarah Green",
    username: "sarah.gh",
    type: "User",
    role: "Manager",
    permission: "Full Access",
  },
  {
    id: "u2",
    displayName: "James Lawrence",
    username: "james.lw",
    type: "User",
    role: "Executive",
    permission: "CRM Access",
  },
  {
    id: "u3",
    displayName: "Priya Sharma",
    username: "priya.sm",
    type: "User",
    role: "Viewer",
    permission: "Read Only",
  },
  // Portal users
  {
    id: "p1",
    displayName: "Sara (Portal)",
    username: "sara.gh.portal",
    type: "Portal User",
    permission: "Applicant View",
  },
  {
    id: "p2",
    displayName: "James (Portal)",
    username: "james.lw.portal",
    type: "Portal User",
    permission: "Customer Portal",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

// ─── View As Entry Card ───────────────────────────────────────────────────────

interface EntryCardProps {
  entry: ViewAsEntry
  isActive: boolean
  onSelect: (id: string) => void
}

function EntryCard({ entry, isActive, onSelect }: EntryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--cds-gap-default)",
        width: "100%",
        padding: "var(--cds-space-12) var(--cds-space-16)",
        borderRadius: "var(--cds-radius-r)",
        border: isActive
          ? "1.5px solid var(--cds-primary-border-default)"
          : "1px solid var(--border)",
        background: isActive
          ? "var(--cds-primary-surface-subtle)"
          : "var(--cds-white)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Avatar */}
      <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
        <AvatarFallback
          style={{
            background: entry.isMyself
              ? "var(--cds-huegrey-surface-subtle-hover)"
              : entry.type === "User"
              ? "var(--cds-primary-surface-default)"
              : "var(--cds-success-surface-default)",
            color: entry.isMyself ? "var(--cds-huegrey-text-dark)" : "var(--cds-white)",
            fontSize: "var(--cds-text-p3)",
            fontWeight: 700,
          }}
        >
          {initials(entry.displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)", marginBottom: 2 }}>
          <span style={{ fontSize: "var(--cds-text-p2)", fontWeight: 600, color: "var(--cds-huegrey-text-dark)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.displayName}
          </span>
          {entry.isMyself && (
            <Badge variant="subtle" colour="primary" size="xs">You</Badge>
          )}
          {isActive && !entry.isMyself && (
            <Badge variant="subtle" colour="success" size="xs">Viewing</Badge>
          )}
        </div>
        <div style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
          {entry.username}
          {entry.role && <> · {entry.role}</>}
          {" · "}{entry.permission}
        </div>
      </div>

      {/* Lock for non-myself */}
      {entry.isMyself ? (
        <Eye size={14} style={{ color: "var(--cds-primary-text-default)", flexShrink: 0 }} />
      ) : (
        <Lock size={14} style={{ color: "var(--cds-huegrey-text-default)", flexShrink: 0 }} />
      )}
    </button>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DemoUsersViewAsScreen() {
  const [activeId, setActiveId] = React.useState("myself")
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("All")

  const activeEntry = SEED_ENTRIES.find((e) => e.id === activeId)

  const filtered = SEED_ENTRIES.filter((e) => {
    const matchSearch =
      !search ||
      e.displayName.toLowerCase().includes(search.toLowerCase()) ||
      e.username.toLowerCase().includes(search.toLowerCase())
    const matchType =
      typeFilter === "All" ||
      (typeFilter === "User" && (e.isMyself || e.type === "User")) ||
      (typeFilter === "Portal User" && e.type === "Portal User")
    return matchSearch && matchType
  })

  const myselfEntries = filtered.filter((e) => e.isMyself)
  const userEntries = filtered.filter((e) => !e.isMyself && e.type === "User")
  const portalEntries = filtered.filter((e) => !e.isMyself && e.type === "Portal User")

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

          {/* Page header */}
          <div style={{ marginBottom: "var(--cds-space-24)" }}>
            <h1 style={{ fontSize: "var(--cds-text-h2)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
              View As
            </h1>
            <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
              Switch demo user context to preview app behaviour. Only <strong>Myself</strong> has edit access.
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--cds-space-24)", alignItems: "flex-start" }}>

            {/* Left panel — switcher */}
            <div style={{ width: 340, flexShrink: 0 }}>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: "var(--cds-space-12)" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--cds-huegrey-text-default)", pointerEvents: "none" }} />
                <Input
                  placeholder="Search by name or username…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 32 }}
                />
              </div>

              {/* Type filter */}
              <div style={{ marginBottom: "var(--cds-space-16)" }}>
                <ContentSwitcher
                  items={["All", "User", "Portal User"]}
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                  size="xs"
                />
              </div>

              {/* Myself */}
              {myselfEntries.length > 0 && (
                <div style={{ marginBottom: "var(--cds-space-16)" }}>
                  <p style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 var(--cds-space-8)" }}>
                    You
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                    {myselfEntries.map((e) => (
                      <EntryCard key={e.id} entry={e} isActive={activeId === e.id} onSelect={setActiveId} />
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {userEntries.length > 0 && (
                <div style={{ marginBottom: "var(--cds-space-16)" }}>
                  <Separator style={{ marginBottom: "var(--cds-space-12)" }} />
                  <p style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 var(--cds-space-8)" }}>
                    Users ({userEntries.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                    {userEntries.map((e) => (
                      <EntryCard key={e.id} entry={e} isActive={activeId === e.id} onSelect={setActiveId} />
                    ))}
                  </div>
                </div>
              )}

              {/* Portal Users */}
              {portalEntries.length > 0 && (
                <div>
                  <Separator style={{ marginBottom: "var(--cds-space-12)" }} />
                  <p style={{ fontSize: "var(--cds-text-p3)", fontWeight: 600, color: "var(--cds-huegrey-text-default)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 var(--cds-space-8)" }}>
                    Portal Users ({portalEntries.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-small)" }}>
                    {portalEntries.map((e) => (
                      <EntryCard key={e.id} entry={e} isActive={activeId === e.id} onSelect={setActiveId} />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "var(--cds-space-24)", color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p3)" }}>
                  {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                  No users match your search.
                </div>
              )}
            </div>

            {/* Right panel — active user context */}
            {activeEntry && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ padding: "var(--cds-padding-card)", borderRadius: "var(--cds-radius-l)", border: "1px solid var(--border)", background: "var(--cds-white)", marginBottom: "var(--cds-space-16)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)", marginBottom: "var(--cds-space-16)" }}>
                    <Avatar style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <AvatarFallback
                        style={{
                          background: activeEntry.isMyself
                            ? "var(--cds-huegrey-surface-subtle-hover)"
                            : activeEntry.type === "User"
                            ? "var(--cds-primary-surface-default)"
                            : "var(--cds-success-surface-default)",
                          color: activeEntry.isMyself ? "var(--cds-huegrey-text-dark)" : "var(--cds-white)",
                          fontSize: "var(--cds-text-p1)",
                          fontWeight: 700,
                        }}
                      >
                        {initials(activeEntry.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div style={{ fontSize: "var(--cds-text-h3)", fontWeight: 700, color: "var(--cds-huegrey-text-dark)", marginBottom: "var(--cds-space-4)" }}>
                        {activeEntry.displayName}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-small)" }}>
                        <span style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>{activeEntry.username}</span>
                        <Badge variant="subtle" colour={activeEntry.isMyself ? "primary" : activeEntry.type === "User" ? "primary" : "success"}>
                          {activeEntry.isMyself ? "Myself" : activeEntry.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator style={{ marginBottom: "var(--cds-space-16)" }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--cds-gap-default)" }}>
                    {activeEntry.role && (
                      <div>
                        <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</p>
                        <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", margin: 0 }}>{activeEntry.role}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Permission</p>
                      <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)", margin: 0 }}>{activeEntry.permission}</p>
                    </div>
                  </div>
                </div>

                {/* Access notice */}
                {activeEntry.isMyself ? (
                  <Notes variant="success" title="Full edit access">
                    You are viewing the app as yourself. All edit permissions are active.
                  </Notes>
                ) : (
                  <Notes variant="warning" title="Read-only view">
                    You are viewing as a demo user. Edit actions will show a permission-denied state — this is intentional and matches production behaviour.
                  </Notes>
                )}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
