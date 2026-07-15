/**
 * demo-users-mock-data.ts
 *
 * Shared seed data and types for all Demo Users screens.
 * Single source of truth — import from here instead of duplicating in each screen.
 *
 * Used by:
 *   - DemoUsersOrgPoolScreen.tsx
 *   - DemoUsersAppAssignmentScreen.tsx
 *   - DemoUsersViewAsScreen.tsx
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DemoUserType = "User" | "Portal User"
export type DemoUserStatus = "Active" | "Inactive"
export type Environment = "Development" | "Stage"

export interface DemoUserIdentity {
  id: string
  email: string
  displayName: string
  type: DemoUserType
  status: DemoUserStatus
  username: string
  createdOn: string
  assignedApps: number
}

export interface AppAssignment {
  id: string
  userId: string
  email: string
  displayName: string
  username: string
  type: DemoUserType
  environment: Environment
  role?: string       // User only — Portal User has no role
  permission: string
}

// ─── Org Pool — seed data ─────────────────────────────────────────────────────

/**
 * 50-user org pool (40 User + 10 Portal User cap).
 * 10 are pre-provisioned on org creation using platform-detected locale.
 */
export const SEED_ORG_POOL: DemoUserIdentity[] = [
  // Pre-provisioned shared users (locale-detected)
  { id: "u1", email: "sarah.gh@demo.zohocreator.com",    username: "sarah.gh",    displayName: "Sarah Green",    type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 2 },
  { id: "u2", email: "james.lw@demo.zohocreator.com",    username: "james.lw",    displayName: "James Lawrence", type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  { id: "u3", email: "priya.sm@demo.zohocreator.com",    username: "priya.sm",    displayName: "Priya Sharma",   type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 3 },
  { id: "u4", email: "alex.tn@demo.zohocreator.com",     username: "alex.tn",     displayName: "Alex Turner",    type: "User",        status: "Inactive", createdOn: "2026-06-01", assignedApps: 0 },
  { id: "u5", email: "mia.wl@demo.zohocreator.com",      username: "mia.wl",      displayName: "Mia Wallace",    type: "User",        status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  // Additional users
  { id: "u6", email: "liam.ch@demo.zohocreator.com",     username: "liam.ch",     displayName: "Liam Chen",      type: "User",        status: "Active",   createdOn: "2026-07-02", assignedApps: 0 },
  { id: "u7", email: "elena.vk@demo.zohocreator.com",    username: "elena.vk",    displayName: "Elena Volkova",  type: "User",        status: "Active",   createdOn: "2026-07-03", assignedApps: 1 },
  // Pre-provisioned portal users
  { id: "p1", email: "sara.gh@demoportaluser.zohocreator.com",  username: "sara.gh.portal",  displayName: "Sara (Portal)",  type: "Portal User", status: "Active",   createdOn: "2026-06-01", assignedApps: 1 },
  { id: "p2", email: "james.lw@demoportaluser.zohocreator.com", username: "james.lw.portal", displayName: "James (Portal)", type: "Portal User", status: "Active",   createdOn: "2026-06-01", assignedApps: 2 },
  { id: "p3", email: "vendor.x@demoportaluser.zohocreator.com", username: "vendor.x.portal", displayName: "Vendor X",       type: "Portal User", status: "Inactive", createdOn: "2026-06-01", assignedApps: 0 },
  { id: "p4", email: "client.b@demoportaluser.zohocreator.com", username: "client.b.portal", displayName: "Client B",       type: "Portal User", status: "Active",   createdOn: "2026-07-01", assignedApps: 1 },
  { id: "p5", email: "guest.z@demoportaluser.zohocreator.com",  username: "guest.z.portal",  displayName: "Guest Z",        type: "Portal User", status: "Active",   createdOn: "2026-07-01", assignedApps: 0 },
]

// ─── App Assignment — seed data ───────────────────────────────────────────────

export const SEED_ASSIGNMENTS: AppAssignment[] = [
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

// ─── Roles & Permissions — reference lists ────────────────────────────────────

export const MOCK_ROLES = ["Admin", "Manager", "Executive", "Viewer", "Developer"]
export const MOCK_PERMISSIONS = ["Full Access", "Read Only", "Edit Access", "Export Access", "CRM Access"]
export const MOCK_PORTAL_PERMISSIONS = ["Applicant View", "Customer Portal", "Vendor Access", "Public View"]

// ─── AI Name Pool ─────────────────────────────────────────────────────────────

/** AI-generated persona name pool — used by AI Generate dialog */
export const AI_NAME_POOL = [
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

// ─── Domain helpers ───────────────────────────────────────────────────────────

export function getDomain(type: DemoUserType): string {
  return type === "User"
    ? "@demo.zohocreator.com"
    : "@demoportaluser.zohocreator.com"
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

export function userTypeColor(type: DemoUserType): string {
  return type === "User"
    ? "var(--cds-primary-surface-default)"
    : "var(--cds-success-surface-default)"
}

// ─── Pool capacity constants ──────────────────────────────────────────────────

export const POOL_MAX_USERS = 40
export const POOL_MAX_PORTAL = 10
export const POOL_MAX_TOTAL = 50
