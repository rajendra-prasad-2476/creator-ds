/**
 * feature-registry.tsx
 *
 * Single source of truth for all features being designed/iterated locally.
 * Add an entry here whenever a new feature's screens are generated.
 *
 * Workflow:
 *   1. Add a feature entry with status "draft"
 *   2. Preview + iterate in the Features tab of the dev server
 *   3. Bump version + update versionHistory when making changes
 *   4. Set status to "approved" when Designer + PM have signed off
 *   5. Use the "Push" action to copy screens to creator-features and commit
 */

import * as React from "react"
import DemoUsersOrgPoolScreen from "@/screens/demo-users/DemoUsersOrgPoolScreen"
import DemoUsersAppAssignmentScreen from "@/screens/demo-users/DemoUsersAppAssignmentScreen"
import DemoUsersViewAsScreen from "@/screens/demo-users/DemoUsersViewAsScreen"
import EnvironmentSettingsScreen from "@/screens/demo-users/EnvironmentSettingsScreen"
import EnvironmentsScreen from "@/screens/demo-users/EnvironmentsScreen"
import OperationsScreen from "@/screens/zia-configuration/OperationsScreen"
import ZiaSettingsScreen from "@/screens/zia-configuration/ZiaSettingsScreen"
import ZiaProviderDetailScreen from "@/screens/zia-configuration/ZiaProviderDetailScreen"
import PortalSecurityLandingScreen from "@/screens/portal-security/PortalSecurityLandingScreen"
import PortalPasswordPolicyScreen from "@/screens/portal-security/PortalPasswordPolicyScreen"
import PortalMFAScreen from "@/screens/portal-security/PortalMFAScreen"
import PortalAllowedIPsScreen from "@/screens/portal-security/PortalAllowedIPsScreen"
import PortalAdvancedSettingsScreen from "@/screens/portal-security/PortalAdvancedSettingsScreen"
import { type ScreenParams } from "@/screens/navigation"

// Raw source imports (Vite ?raw) — used by "Copy for Figma" in the Feature Dashboard
import OperationsScreenRaw from "@/screens/zia-configuration/OperationsScreen.tsx?raw"
import ZiaSettingsScreenRaw from "@/screens/zia-configuration/ZiaSettingsScreen.tsx?raw"
import ZiaProviderDetailScreenRaw from "@/screens/zia-configuration/ZiaProviderDetailScreen.tsx?raw"
import PortalSecurityLandingScreenRaw from "@/screens/portal-security/PortalSecurityLandingScreen.tsx?raw"
import PortalPasswordPolicyScreenRaw from "@/screens/portal-security/PortalPasswordPolicyScreen.tsx?raw"
import PortalMFAScreenRaw from "@/screens/portal-security/PortalMFAScreen.tsx?raw"
import PortalAllowedIPsScreenRaw from "@/screens/portal-security/PortalAllowedIPsScreen.tsx?raw"
import PortalAdvancedSettingsScreenRaw from "@/screens/portal-security/PortalAdvancedSettingsScreen.tsx?raw"
import DemoUsersOrgPoolScreenRaw from "@/screens/demo-users/DemoUsersOrgPoolScreen.tsx?raw"
import DemoUsersAppAssignmentScreenRaw from "@/screens/demo-users/DemoUsersAppAssignmentScreen.tsx?raw"
import DemoUsersViewAsScreenRaw from "@/screens/demo-users/DemoUsersViewAsScreen.tsx?raw"
import EnvironmentSettingsScreenRaw from "@/screens/demo-users/EnvironmentSettingsScreen.tsx?raw"
import EnvironmentsScreenRaw from "@/screens/demo-users/EnvironmentsScreen.tsx?raw"

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeatureStatus = "draft" | "in-review" | "approved" | "pushed"

export interface ScreenEntry {
  id: string
  name: string
  factory: (params: ScreenParams) => React.ReactNode
  sourcePath: string
  destPath: string
  /** Raw TSX source — imported via Vite ?raw, used by "Copy for Figma" */
  rawSource: string
  /**
   * Custom / raw-HTML elements used in this screen that are NOT DS components.
   * Used by the Feature Dashboard to surface DS gaps per screen.
   *
   * Format: { element: string; reason: string; dsAlternative?: string }[]
   * - element: what was used (e.g. "raw <div> capacity card")
   * - reason: "DS component not available" | "component doesn't fit" | "oversight"
   * - dsAlternative: the DS component that should replace it when available
   */
  customComponents?: Array<{
    element: string
    reason: "DS component not available" | "component doesn't fit" | "oversight"
    dsAlternative?: string
    parity?: "P1" | "P2" | "P3"
  }>
}

export interface VersionNote {
  version: string
  date: string
  notes: string[]
}

/**
 * Structured narrative for the Overview tab shown in Feature Dashboard.
 * Helps designers & devs understand the "why" before diving into screens.
 */
export interface FeatureOverview {
  /** One-sentence elevator pitch for the feature */
  tagline: string
  /** Description of the pain/gap that existed before this feature */
  problemStatement: string
  /** List of specific pain points (shown as "Before" bullets) */
  painPoints: string[]
  /** Description of what this feature delivers */
  solutionStatement: string
  /** List of specific improvements (shown as "After" bullets) */
  improvements: string[]
  /** Plain-text navigation flow tree (copied from PRD §6) */
  navigationFlow?: string
  /** Screen flow nodes for the visual flow diagram */
  screenFlow?: Array<{
    id: string
    label: string
    /** IDs of screens this one leads to (for drawing arrows) */
    leadsTo?: string[]
    /** Optional: "entry" | "sheet" | "dialog" | "detail" */
    type?: "entry" | "sheet" | "dialog" | "detail"
  }>
}

export interface FeatureEntry {
  id: string
  name: string
  prdRef: string
  version: string
  status: FeatureStatus
  owner: string
  lastUpdated: string
  /** Optional narrative overview shown in the Overview tab */
  overview?: FeatureOverview
  screens: ScreenEntry[]
  versionHistory: VersionNote[]
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const FEATURE_REGISTRY: FeatureEntry[] = [
  {
    id: "001",
    name: "Zia Configuration Enhancements",
    prdRef: "#001",
    version: "v1.0",
    status: "in-review",
    owner: "rajendra.prasad",
    lastUpdated: "2026-07-08",
    overview: {
      tagline: "Give admins direct control over which AI provider powers each Zia feature — no more one-size-fits-all AI.",
      problemStatement: "Zia's AI provider was fixed at the platform level. Admins had no way to choose which LLM powered which feature, could not add their own API keys, and couldn't see which Zia capabilities were even active for their org.",
      painPoints: [
        "No visibility into which LLM provider Zia was using",
        "Couldn't swap providers (e.g. use OpenAI for one feature, Anthropic for another)",
        "API keys had to be managed by Zoho support — not self-service",
        "No per-feature on/off control; Zia was all-or-nothing",
        "No usage tracking to understand token consumption",
      ],
      solutionStatement: "Admins can now configure LLM providers, add their own API keys, map providers to specific Zia features, and toggle each feature independently — all from a single settings page.",
      improvements: [
        "4 providers supported: Zoho Zia (default), OpenAI, Anthropic, Google Gemini",
        "Self-service API key management with a 5-key limit per provider",
        "Per-feature provider mapping (e.g. AI Prediction → OpenAI)",
        "Per-feature on/off toggle with clear status badges",
        "Usage tab per provider with deep links to billing dashboards",
      ],
      navigationFlow: `Operations → Zia Configuration
  └─ [Zia Settings — LLM Providers tab]
       ├─ Click provider card → [Provider Detail]
       │    ├─ Manage API Keys (add / delete)
       │    └─ Usage tab → external billing links
       └─ Switch to Features tab
            └─ Map provider + toggle per Zia feature`,
      screenFlow: [
        { id: "operations",        label: "Operations",       type: "entry",  leadsTo: ["zia-settings"] },
        { id: "zia-settings",      label: "Zia Settings",     type: "detail", leadsTo: ["zia-provider-detail"] },
        { id: "zia-provider-detail", label: "Provider Detail", type: "detail", leadsTo: [] },
      ],
    },
    screens: [
      {
        id: "operations",
        name: "Operations (Entry)",
        factory: () => <OperationsScreen />,
        sourcePath: "src/screens/zia-configuration/OperationsScreen.tsx",
        destPath: "features/001-zia-configuration/screens/OperationsScreen.tsx",
        rawSource: OperationsScreenRaw,
      },
      {
        id: "zia-settings",
        name: "Zia Settings",
        factory: () => <ZiaSettingsScreen />,
        sourcePath: "src/screens/zia-configuration/ZiaSettingsScreen.tsx",
        destPath: "features/001-zia-configuration/screens/ZiaSettingsScreen.tsx",
        rawSource: ZiaSettingsScreenRaw,
      },
      {
        id: "zia-provider-detail",
        name: "Provider Detail",
        factory: (params) => (
          <ZiaProviderDetailScreen
            providerId={(params.providerId as string) ?? "openai"}
          />
        ),
        sourcePath: "src/screens/zia-configuration/ZiaProviderDetailScreen.tsx",
        destPath: "features/001-zia-configuration/screens/ZiaProviderDetailScreen.tsx",
        rawSource: ZiaProviderDetailScreenRaw,
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-07-08",
        notes: [
          "Initial generation from PRD",
          "LLM Providers tab: 4 provider cards (Zoho, OpenAI, Anthropic, Google)",
          "Features tab: mapping dropdown + ON/OFF toggle for 6 Zia features",
          "Provider Detail: key CRUD with max-5 enforcement + Usage tab redirect links",
          "Component gaps flagged: InlineAlert (×3), EmptyState (×1)",
        ],
      },
    ],
  },

  // ── Add new features below this line ─────────────────────────────────────

  {
    id: "003",
    name: "Demo Users in Environments",
    prdRef: "#003",
    version: "v1.3",
    status: "draft",
    owner: "rajendra.prasad",
    lastUpdated: "2026-07-15",
    overview: {
      tagline: "Test portal user flows safely — without using real accounts or exposing production data.",
      problemStatement: "Developers and QA engineers had no way to test portal user flows in Dev or Stage environments without creating real Zoho accounts, sharing credentials, or risking data leakage into production.",
      painPoints: [
        "Required real email accounts to simulate portal user sessions",
        "Credentials were shared informally — a security risk",
        "No way to reset user state between test runs",
        "Portal user assignments had to be managed manually with no tracking",
        "Switching between portal user personas during testing required logging out and back in",
      ],
      solutionStatement: "An org-level Demo Users pool gives teams up to 50 sandboxed identities (40 User + 10 Portal User) that can be assigned to apps per environment, given roles and permissions, and switched live using a 'View As' mode — all without real accounts.",
      improvements: [
        "Create up to 50 demo identities manually or via AI generation",
        "Assign demo users to specific apps in Dev or Stage environments",
        "Set role and permission level per assignment",
        "Live 'View As' mode: switch active persona without logging out",
        "Environment Settings: configure notifications, variables, and workflow schedules per environment",
      ],
      navigationFlow: `Manage → Demo Users (Org Pool)
  └─ [Org Pool List]
       ├─ Add Manually → [Add Demo User Sheet]
       ├─ AI Generate → [Generate Dialog]
       ├─ Row: Edit → [Edit Sheet]
       ├─ Row: Assign to App → [App Assignment]
       └─ Row: View As → [View As — Live Mode]

Manage → Environments
  └─ [Environments — App List + Stage/Production]
       └─ ··· → Settings → [Environment Settings Sheet]
            ├─ Demo Users tab
            ├─ Notifications tab
            ├─ Variables tab
            └─ Workflow Schedules tab`,
      screenFlow: [
        { id: "demo-users-org-pool",     label: "Org Pool",       type: "entry",  leadsTo: ["demo-users-app-assignment", "demo-users-view-as"] },
        { id: "demo-users-app-assignment", label: "App Assignment", type: "detail", leadsTo: [] },
        { id: "demo-users-view-as",      label: "View As",        type: "detail", leadsTo: [] },
        { id: "environments",            label: "Environments",   type: "entry",  leadsTo: [] },
      ],
    },
    screens: [
      {
        id: "demo-users-org-pool",
        name: "Demo Users — Org Pool",
        factory: () => <DemoUsersOrgPoolScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersOrgPoolScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersOrgPoolScreen.tsx",
        rawSource: DemoUsersOrgPoolScreenRaw,
        customComponents: [
          { element: "raw <div> capacity stat cards (3×)", reason: "DS component not available", dsAlternative: "Card + StatCard", parity: "P2" },
          { element: "raw <div> progress bar (capacity fill)", reason: "component doesn't fit", dsAlternative: "Progress with colour prop", parity: "P1" },
          { element: "absolutely-positioned <Search> icon over <Input>", reason: "oversight", dsAlternative: "InputPrefix with prefixIcon", parity: undefined },
          { element: "raw <div> AI dialog warning banner", reason: "oversight", dsAlternative: "Notes variant=warning", parity: undefined },
          { element: "raw <p> pagination placeholder", reason: "DS component not available", dsAlternative: "Pagination", parity: "P1" },
        ],
      },
      {
        id: "demo-users-app-assignment",
        name: "App Assignment",
        factory: () => <DemoUsersAppAssignmentScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersAppAssignmentScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersAppAssignmentScreen.tsx",
        rawSource: DemoUsersAppAssignmentScreenRaw,
        customComponents: [
          { element: "raw <p> empty state text", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
        ],
      },
      {
        id: "demo-users-view-as",
        name: "View As (Live Mode)",
        factory: () => <DemoUsersViewAsScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersViewAsScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersViewAsScreen.tsx",
        rawSource: DemoUsersViewAsScreenRaw,
        customComponents: [
          { element: "raw <button> user switcher entry cards", reason: "DS component not available", dsAlternative: "Future SelectionCard or ListItem DS component", parity: "P3" },
          { element: "raw <p> empty search state", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
          { element: "absolutely-positioned <Search> icon over <Input>", reason: "oversight", dsAlternative: "InputPrefix with prefixIcon", parity: undefined },
        ],
      },
      {
        id: "environment-settings",
        name: "Environment Settings (standalone — deprecated, use environment-settings-sheet)",
        factory: () => <EnvironmentSettingsScreen />,
        sourcePath: "src/screens/demo-users/EnvironmentSettingsScreen.tsx",
        destPath: "features/003-demo-users/screens/EnvironmentSettingsScreen.tsx",
        rawSource: EnvironmentSettingsScreenRaw,
        customComponents: [
          { element: "raw <p> empty state text in Demo Users tab", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
          { element: "raw <div> variables table (no DS Table for simple key-value)", reason: "component doesn't fit", dsAlternative: "Table component could work here", parity: undefined },
        ],
      },
      {
        id: "environments",
        name: "Environments (App list + Stage/Production + Settings Sheet)",
        factory: () => <EnvironmentsScreen />,
        sourcePath: "src/screens/demo-users/EnvironmentsScreen.tsx",
        destPath: "features/003-demo-users/screens/EnvironmentsScreen.tsx",
        rawSource: EnvironmentsScreenRaw,
        customComponents: [
          { element: "raw <p> empty state text (Demo Users tab)", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
        ],
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-07-14",
        notes: [
          "Phase 1 — Org Pool management screens",
          "Screen 1: Demo Users Org Pool — table with capacity banner (40 User + 10 Portal), search/filter, Deactivate/Reactivate",
          "Screen 2 (inline): Add Manually Sheet — email local part + auto domain suffix + display name + type selector + real-time duplicate check",
          "Screen 3 (inline): AI Generate Dialog — count + type selectors, preview panel, Regenerate, Confirm",
          "Component gaps flagged: EmptyState (×1), Pagination (×1)",
        ],
      },
      {
        version: "v1.1",
        date: "2026-07-15",
        notes: [
          "Added Edit Demo User sheet — display name editable, email/type locked",
          "Added App Assignment screen — assign org pool users to app per environment, role + permission, remove action",
          "Added View As (Live Mode) screen — grouped User/Portal User switcher, search/filter, active context detail panel",
          "Navigate from Org Pool row action menu: Edit, Assign to App",
          "Component gaps flagged: EmptyState (×3)",
        ],
      },
      {
        version: "v1.3",
        date: "2026-07-15",
        notes: [
          "Added EnvironmentsScreen — uses SplitPanelTemplate (app list + Stage/Production columns + ··· menu with grouped actions)",
          "Settings menu opens Environment Settings Sheet (correct slide-in panel per help doc screenshot)",
          "SplitPanelTemplate extended: sublabel, accentColor, menuGroups with group labels, activeNavId prop",
          "Old EnvironmentSettingsScreen retained as standalone preview (deprecated)",
        ],
      },
      {
        version: "v1.2",
        date: "2026-07-15",
        notes: [
          "Added Environment Settings screen (help-doc-aligned) — Demo Users, Notifications, Variables, Workflow Schedules tabs",
          "Demo Users tab: add from org pool with role + permission, remove with AlertDialog",
          "Environment switcher (ContentSwitcher) in app context header",
          "Notifications tab: Mail / SMS / Push with all help-doc options",
          "Variables tab: read-only defined + current value table",
          "Workflow Schedules tab: Suspend All / Application-Specific",
          "Component gaps flagged: EmptyState (×1)",
        ],
      },
    ],
  },

  {
    id: "002",
    name: "Portal Security Policies",
    prdRef: "#002",
    version: "v1.0",
    status: "draft",
    owner: "rajendra.prasad",
    lastUpdated: "2026-07-10",
    overview: {
      tagline: "Give portal admins the security controls they need — password policy, MFA, IP allowlisting, and session management in one place.",
      problemStatement: "Zoho Creator portals had no built-in security policy management for portal users. Admins couldn't enforce password strength, require MFA, restrict access by IP range, or control session lifetimes — leaving portals open to brute-force attacks and unauthorized access.",
      painPoints: [
        "No password strength enforcement for portal user accounts",
        "MFA was unavailable for portal-facing login flows",
        "No IP allowlisting — any IP could attempt to access the portal",
        "Session lifetime and account lockout were not configurable",
        "Security setup was scattered across multiple unrelated settings",
      ],
      solutionStatement: "A unified Security Policies section brings password policy, MFA configuration, IP allowlisting, and advanced session controls under a single, structured settings flow — giving admins clear visibility and control over portal security posture.",
      improvements: [
        "Password Policy: strength presets (Strong / Good / Fair / Custom) + complexity + age rules",
        "MFA: method selection (TOTP, SMS, OneAuth) + remember-device lifetime + backup codes",
        "Allowed IP Addresses: Individual IPs, CIDR ranges, and IP ranges — all in one table",
        "Advanced Settings: session lifetime + consecutive-failure lockout period",
        "Each policy can be enabled independently — no forced all-or-nothing setup",
      ],
      navigationFlow: `Portal → Security Policies
  └─ [Landing — intro card + Setup CTA]
       ├─ Left nav → [Password Policy]
       ├─ Left nav → [Multi-Factor Authentication]
       ├─ Left nav → [Allowed IP Addresses]
       └─ Left nav → [Advanced Settings]`,
      screenFlow: [
        { id: "portal-security-landing",   label: "Security Landing",    type: "entry",  leadsTo: ["portal-password-policy", "portal-mfa", "portal-allowed-ips", "portal-advanced-settings"] },
        { id: "portal-password-policy",    label: "Password Policy",     type: "detail", leadsTo: [] },
        { id: "portal-mfa",                label: "MFA",                 type: "detail", leadsTo: [] },
        { id: "portal-allowed-ips",        label: "Allowed IPs",         type: "detail", leadsTo: [] },
        { id: "portal-advanced-settings",  label: "Advanced Settings",   type: "detail", leadsTo: [] },
      ],
    },
    screens: [
      {
        id: "portal-security-landing",
        name: "Security Policies — Landing",
        factory: () => <PortalSecurityLandingScreen />,
        sourcePath: "src/screens/portal-security/PortalSecurityLandingScreen.tsx",
        destPath: "features/002-portal-security/screens/PortalSecurityLandingScreen.tsx",
        rawSource: PortalSecurityLandingScreenRaw,
      },
      {
        id: "portal-password-policy",
        name: "Password Policy",
        factory: () => <PortalPasswordPolicyScreen />,
        sourcePath: "src/screens/portal-security/PortalPasswordPolicyScreen.tsx",
        destPath: "features/002-portal-security/screens/PortalPasswordPolicyScreen.tsx",
        rawSource: PortalPasswordPolicyScreenRaw,
      },
      {
        id: "portal-mfa",
        name: "Multi-Factor Authentication",
        factory: () => <PortalMFAScreen />,
        sourcePath: "src/screens/portal-security/PortalMFAScreen.tsx",
        destPath: "features/002-portal-security/screens/PortalMFAScreen.tsx",
        rawSource: PortalMFAScreenRaw,
      },
      {
        id: "portal-allowed-ips",
        name: "Allowed IP Addresses",
        factory: () => <PortalAllowedIPsScreen />,
        sourcePath: "src/screens/portal-security/PortalAllowedIPsScreen.tsx",
        destPath: "features/002-portal-security/screens/PortalAllowedIPsScreen.tsx",
        rawSource: PortalAllowedIPsScreenRaw,
      },
      {
        id: "portal-advanced-settings",
        name: "Advanced Settings",
        factory: () => <PortalAdvancedSettingsScreen />,
        sourcePath: "src/screens/portal-security/PortalAdvancedSettingsScreen.tsx",
        destPath: "features/002-portal-security/screens/PortalAdvancedSettingsScreen.tsx",
        rawSource: PortalAdvancedSettingsScreenRaw,
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-07-10",
        notes: [
          "Initial generation from PRD + Zoho Creator reference (image 3)",
          "Landing: empty-state intro card with highlights + Setup CTA",
          "Password Policy: strength selector (Strong/Good/Fair/Custom) + Complexity + Age",
          "MFA: method checkboxes + OneAuth nested toggles + lifetime dropdown + backup codes",
          "Allowed IPs: add/delete IP table (Individual / Range / CIDR)",
          "Advanced Settings: session management + lock period dropdowns",
          "Navigation: left sub-nav (4 items) using useNavigation()",
          "Component gaps flagged: EmptyState (×1)",
        ],
      },
    ],
  },
]
