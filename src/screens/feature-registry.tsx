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
}

export interface VersionNote {
  version: string
  date: string
  notes: string[]
}

export interface FeatureEntry {
  id: string
  name: string
  prdRef: string
  version: string
  status: FeatureStatus
  owner: string
  lastUpdated: string
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
    version: "v1.0",
    status: "draft",
    owner: "rajendra.prasad",
    lastUpdated: "2026-07-15",
    screens: [
      {
        id: "demo-users-org-pool",
        name: "Demo Users — Org Pool",
        factory: () => <DemoUsersOrgPoolScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersOrgPoolScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersOrgPoolScreen.tsx",
        rawSource: DemoUsersOrgPoolScreenRaw,
      },
      {
        id: "demo-users-app-assignment",
        name: "App Assignment",
        factory: () => <DemoUsersAppAssignmentScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersAppAssignmentScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersAppAssignmentScreen.tsx",
        rawSource: DemoUsersAppAssignmentScreenRaw,
      },
      {
        id: "demo-users-view-as",
        name: "View As (Live Mode)",
        factory: () => <DemoUsersViewAsScreen />,
        sourcePath: "src/screens/demo-users/DemoUsersViewAsScreen.tsx",
        destPath: "features/003-demo-users/screens/DemoUsersViewAsScreen.tsx",
        rawSource: DemoUsersViewAsScreenRaw,
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
