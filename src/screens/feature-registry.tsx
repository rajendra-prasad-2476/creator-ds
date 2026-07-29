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
import MobileAppListScreen from "@/screens/mobile-deployment/MobileAppListScreen"
import DeploymentCredentialsScreen from "@/screens/mobile-deployment/DeploymentCredentialsScreen"
import DeployWizardChannelScreen from "@/screens/mobile-deployment/DeployWizardChannelScreen"
import DeployWizardPlayScreen from "@/screens/mobile-deployment/DeployWizardPlayScreen"
import DeployWizardFirebaseScreen from "@/screens/mobile-deployment/DeployWizardFirebaseScreen"
import DeployInProgressScreen from "@/screens/mobile-deployment/DeployInProgressScreen"
import DeploymentHistoryScreen from "@/screens/mobile-deployment/DeploymentHistoryScreen"
import PlaySetupGuideScreen from "@/screens/mobile-deployment/PlaySetupGuideScreen"
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
import MobileAppListScreenRaw from "@/screens/mobile-deployment/MobileAppListScreen.tsx?raw"
import DeploymentCredentialsScreenRaw from "@/screens/mobile-deployment/DeploymentCredentialsScreen.tsx?raw"
import DeployWizardChannelScreenRaw from "@/screens/mobile-deployment/DeployWizardChannelScreen.tsx?raw"
import DeployWizardPlayScreenRaw from "@/screens/mobile-deployment/DeployWizardPlayScreen.tsx?raw"
import DeployWizardFirebaseScreenRaw from "@/screens/mobile-deployment/DeployWizardFirebaseScreen.tsx?raw"
import DeployInProgressScreenRaw from "@/screens/mobile-deployment/DeployInProgressScreen.tsx?raw"
import DeploymentHistoryScreenRaw from "@/screens/mobile-deployment/DeploymentHistoryScreen.tsx?raw"
import PlaySetupGuideScreenRaw from "@/screens/mobile-deployment/PlaySetupGuideScreen.tsx?raw"

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
    id: "004",
    name: "Mobile App Deployment (Post-CodeSign Distribution)",
    prdRef: "#004",
    version: "v1.0",
    status: "draft",
    owner: "rajendra.prasad",
    lastUpdated: "2026-07-22",
    overview: {
      tagline: "Go from signed AAB to Google Play Internal Testing in under 10 minutes — without leaving Zoho Creator.",
      problemStatement: "Zoho Creator's codesign pipeline stops at artifact generation. Customers must manually download signed APK/AAB/IPA files and upload them to Google Play Console or App Store Connect — repeating this error-prone process on every release with no visibility inside Creator.",
      painPoints: [
        "Manual download → re-upload cycle for every release to Play Store / App Store",
        "No deployment history — no way to know which build was distributed where",
        "Tester distribution via Firebase requires separate tooling outside Creator",
        "Store credentials managed ad-hoc without security controls",
        "No guided recovery path when Play Console API errors occur (e.g. draft-app constraint)",
      ],
      solutionStatement: "A Deployment Hub built on top of codesign: connect store credentials once, pick a channel (Google Play, Firebase, MDM, ad-hoc), configure the release, and monitor async job progress — all inside the Admin Dashboard Mobile hub.",
      improvements: [
        "Google Play deployment: upload AAB to Internal / Closed / Beta / Production tracks with staged rollout",
        "Firebase App Distribution: distribute to tester emails or group aliases in one step",
        "Deployment history: full audit log per signed app — channel, version, status, store links",
        "Secure credential vault: EAR-encrypted service account JSON + re-validate on demand",
        "First-time Play guide: step-by-step checklist to resolve draft-app constraint",
      ],
      navigationFlow: `Admin Dashboard → Mobile → Code Sign tab → row action Deploy
  └─ [S-02: Deploy Wizard — Channel Select]
       ├─ Google Play → [S-03: Play Config] → [S-05: In Progress] → [S-06: History]
       │    └─ Draft app error → [S-07: First-Time Play Setup Guide]
       └─ Firebase → [S-04: Firebase Config] → [S-05: In Progress] → [S-06: History]

Admin Dashboard → Mobile → Settings → Store Accounts
  └─ [S-01: Deployment Credentials]`,
      screenFlow: [
        { id: "mobile-app-list",          label: "Mobile Hub (Entry)",   type: "entry",  leadsTo: ["deploy-wizard-channel", "deployment-credentials", "deployment-history"] },
        { id: "deployment-credentials",   label: "Store Credentials",   type: "entry",  leadsTo: ["deploy-wizard-channel"] },
        { id: "deploy-wizard-channel",    label: "Channel Select",       type: "entry",  leadsTo: ["deploy-wizard-play", "deploy-wizard-firebase"] },
        { id: "deploy-wizard-play",       label: "Play Config",          type: "detail", leadsTo: ["deploy-in-progress", "play-setup-guide"] },
        { id: "deploy-wizard-firebase",   label: "Firebase Config",      type: "detail", leadsTo: ["deploy-in-progress"] },
        { id: "deploy-in-progress",       label: "In Progress",          type: "detail", leadsTo: ["deployment-history"] },
        { id: "deployment-history",       label: "Deployment History",   type: "detail", leadsTo: ["deploy-wizard-channel"] },
        { id: "play-setup-guide",         label: "First-Time Play Guide", type: "detail", leadsTo: ["deploy-wizard-play"] },
      ],
    },
    screens: [
      {
        id: "mobile-app-list",
        name: "Mobile Hub — Entry Point",
        factory: () => <MobileAppListScreen />,
        sourcePath: "src/screens/mobile-deployment/MobileAppListScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/MobileAppListScreen.tsx",
        rawSource: MobileAppListScreenRaw,
        customComponents: [
          { element: "absolutely-positioned <Search> icon over <Input>", reason: "oversight", dsAlternative: "InputPrefix with prefixIcon", parity: undefined },
          { element: "inline SVG Apple/Android icons (no DS icon system)", reason: "DS component not available", dsAlternative: "DS Icon component if added", parity: "P3" },
        ],
      },
      {
        id: "deployment-credentials",
        name: "Store Credentials (S-01)",
        factory: () => <DeploymentCredentialsScreen />,
        sourcePath: "src/screens/mobile-deployment/DeploymentCredentialsScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeploymentCredentialsScreen.tsx",
        rawSource: DeploymentCredentialsScreenRaw,
        customComponents: [
          { element: "raw <button> credential type selector cards (step 1)", reason: "DS component not available", dsAlternative: "RadioCard inside RadioGroup", parity: undefined },
          { element: "raw <Textarea> for JSON/p8 paste (no FileUpload)", reason: "DS component not available", dsAlternative: "FileUpload", parity: "P2" },
          { element: "raw <p> empty state", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
        ],
      },
      {
        id: "deploy-wizard-channel",
        name: "Deploy Wizard — Channel Select (S-02)",
        factory: () => <DeployWizardChannelScreen />,
        sourcePath: "src/screens/mobile-deployment/DeployWizardChannelScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeployWizardChannelScreen.tsx",
        rawSource: DeployWizardChannelScreenRaw,
      },
      {
        id: "deploy-wizard-play",
        name: "Deploy Wizard — Google Play Config (S-03)",
        factory: () => <DeployWizardPlayScreen />,
        sourcePath: "src/screens/mobile-deployment/DeployWizardPlayScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeployWizardPlayScreen.tsx",
        rawSource: DeployWizardPlayScreenRaw,
        customComponents: [
          { element: "inline error <p> on release notes field", reason: "DS component not available", dsAlternative: "InlineAlert", parity: "P1" },
        ],
      },
      {
        id: "deploy-wizard-firebase",
        name: "Deploy Wizard — Firebase Config (S-04)",
        factory: () => <DeployWizardFirebaseScreen />,
        sourcePath: "src/screens/mobile-deployment/DeployWizardFirebaseScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeployWizardFirebaseScreen.tsx",
        rawSource: DeployWizardFirebaseScreenRaw,
        customComponents: [
          { element: "inline error <p> on testers field", reason: "DS component not available", dsAlternative: "InlineAlert", parity: "P1" },
        ],
      },
      {
        id: "deploy-in-progress",
        name: "Deployment In Progress (S-05)",
        factory: () => <DeployInProgressScreen />,
        sourcePath: "src/screens/mobile-deployment/DeployInProgressScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeployInProgressScreen.tsx",
        rawSource: DeployInProgressScreenRaw,
        customComponents: [
          { element: "inline <style> spin keyframe for Loader2 animation", reason: "component doesn't fit", dsAlternative: "Spinner DS component once available", parity: "P1" },
        ],
      },
      {
        id: "deployment-history",
        name: "Deployment History (S-06)",
        factory: () => <DeploymentHistoryScreen />,
        sourcePath: "src/screens/mobile-deployment/DeploymentHistoryScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/DeploymentHistoryScreen.tsx",
        rawSource: DeploymentHistoryScreenRaw,
        customComponents: [
          { element: "raw <p> empty state", reason: "DS component not available", dsAlternative: "EmptyState", parity: "P1" },
          { element: "raw <p> pagination placeholder", reason: "DS component not available", dsAlternative: "Pagination", parity: "P1" },
        ],
      },
      {
        id: "play-setup-guide",
        name: "First-Time Play Setup Guide (S-07)",
        factory: () => <PlaySetupGuideScreen />,
        sourcePath: "src/screens/mobile-deployment/PlaySetupGuideScreen.tsx",
        destPath: "features/004-mobile-deployment/screens/PlaySetupGuideScreen.tsx",
        rawSource: PlaySetupGuideScreenRaw,
      },
    ],
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-07-22",
        notes: [
          "Initial generation from PRD §9.4 screen inventory",
          "S-01 Store Credentials: 3-step add wizard (type → upload JSON → validate), credentials table with re-validate + delete",
          "S-02 Channel Select: RadioCard picker for Play / Firebase / MDM / Ad-hoc with credential-gate",
          "S-03 Play Config: track selector, staged rollout slider (production), release notes, submit-as-draft toggle, production AlertDialog confirm",
          "S-04 Firebase Config: TagInput tester emails, release notes, deployment summary card",
          "S-05 In Progress: 4-step progress list with simulated async state machine (Queued→Upload→Process→Confirm), success/failed outcomes",
          "S-06 History: full deployment table (channel, track, version, status badges, retry on failed, Console links)",
          "S-07 First-Time Play Guide: 6-step interactive checklist, downloadable AAB, Play Console link, retry gated on completion",
          "Component gaps flagged: EmptyState (×2), Pagination (×1), InlineAlert (×2), FileUpload (×1), Spinner (×1)",
        ],
      },
    ],
  },

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
