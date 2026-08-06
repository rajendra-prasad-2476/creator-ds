# UX Spec — Mobile App Deployment (Feature 004)
> **Retroactive spec produced by Maya (UX Designer persona)**  
> **Date:** 2026-07-22  
> **Status:** Design Debt Review  
> **Covers:** All 8 screens in `src/screens/mobile-deployment/`  
> **Skill used:** `ux-designer` (Sahaa custom skill)

---

## Overview & Navigation Map

```
MobileAppListScreen (S-00) ─── [row click] ──→ Code-sign Sheet (inline, S-00b)
       │                                              │
       │                                        [Deploy button]
       │                                              │
       ├── [Manage credentials] ──────────→ DeploymentCredentialsScreen (S-01)
       │         ↑                                    │
       │     [back]                            [add credential Sheet]
       │                                            [delete AlertDialog]
       │
       └── [View history] ──────────────→ DeploymentHistoryScreen (S-06)
                                                  [retry] ──→ DeployWizardChannelScreen
                                                  [new deploy] ──→ DeployWizardChannelScreen

DeployWizardChannelScreen (S-02) — Step 1: Channel selection
       │
       ├── [Google Play] ──────────────→ DeployWizardPlayScreen (S-03)
       │                                        │
       │                          [Deploy] ─────┤────────→ DeployInProgressScreen (S-05)
       │                                        │                   │
       │                          [Draft error]─┘──→ PlaySetupGuideScreen (S-07)
       │                                                     │
       │                                              [Retry] ──→ DeployWizardPlayScreen
       │
       └── [Firebase] ─────────────────→ DeployWizardFirebaseScreen (S-04)
                                               │
                                         [Deploy] ──→ DeployInProgressScreen (S-05)
```

---

## UX Spec: S-00 — MobileAppListScreen

### User & Context
- **Persona:** App Admin / Super Admin / Admin
- **Trigger:** User navigates to the "Mobile" section from LeftNav → "Deploy" hub
- **Goal:** See all mobile apps associated with the Creator account, check code-sign status, and initiate deployment

### Interaction Model
- **Pattern:** Full page — Tab-based hub (Mobile App tab / SDK tab)
- **Steps:** N/A (list screen, not a wizard)
- **Navigation flow:**
  - Entry: LeftNav → Mobile (exact nav item label unclear — ⚠️ **debt**)
  - Row click → Code-sign Sheet (S-00b, slide-in side panel)
  - Sheet → "Deploy" → DeployWizardChannelScreen (S-02)
  - Sheet → "Manage credentials" → DeploymentCredentialsScreen (S-01)
  - Sheet → "View history" → DeploymentHistoryScreen (S-06)
  - Cancel: Sheet close → returns to list

### States

| State | Trigger | UI |
|---|---|---|
| Empty | No apps found | ⚠️ **DEBT** — No EmptyState component used; raw `<p>` text assumed |
| Loading | Apps list fetching | ⚠️ **DEBT** — No Spinner/Skeleton state; list renders immediately with seed data |
| Populated | Apps exist | Table with columns: App name, Platform, User Type, Code-sign Status, Version, Actions |
| Signed | codesignStatus = "signed" | StatusBadge "configured" variant |
| Not-signed | codesignStatus = "not-signed" | StatusBadge "not-configured" variant |
| Has update | hasUpdate = true | Badge "Update available" shown alongside version |
| Search active | User types in search Input | ⚠️ **DEBT** — Filter logic present but no debounce, no "no results" state shown |

### Action Hierarchy
- **Primary:** None explicitly at list level (action is inside the Sheet) — ⚠️ **DEBT**: no page-level CTA to guide first-time users
- **Secondary:** Search, filter (SlidersHorizontal icon present — ⚠️ **DEBT**: filter panel not implemented)
- **Escape:** TopBar back navigation, LeftNav

### Sub-spec: S-00b — Code-Sign Detail Sheet (inline within S-00)

| Element | Current impl | UX note |
|---|---|---|
| Sheet trigger | Row click | ✅ Correct — Sheet for detail inspection |
| Sheet header | App name + platform badge | ✅ |
| Sheet body: code-sign details | Provisioning profile, certificate, bundle ID | ✅ |
| Sheet body: Deploy section | Deploy button + history link + credentials link | ✅ |
| Deploy button guard | Disabled if not signed | ✅ |
| SheetDescription placement | ⚠️ **DEBT** — check whether description is inside SheetHeader (violates AGENTS.md §3 rule) | |

### Accessibility Notes
- Tab order: Table rows → Sheet trigger → Sheet content
- ⚠️ **DEBT** — No `aria-label` on icon-only action buttons (MoreHorizontal dropdown trigger)
- ⚠️ **DEBT** — DropdownMenu items for row actions (rotate, history, settings) need keyboard nav verification

### Edge Cases & Risks (S-00)
1. **No unsigned-app deploy guard visible at list level** — users may click a row, open the Sheet, and only then discover they can't deploy. Consider adding a visual cue (StatusBadge with tooltip) in the table row itself.
2. **"SDK" tab content** — tab exists but content not implemented (⚠️ **DEBT**: placeholder or empty state missing).
3. **Platform filter** — both iOS and Android apps are listed together with no quick platform filter at the tab/header level. Long lists will be hard to scan.
4. **Search clears on Sheet open** — no state preservation mechanism noted.

---

## UX Spec: S-01 — DeploymentCredentialsScreen

### User & Context
- **Persona:** Super Admin / Admin only (write-permission gate required)
- **Trigger:** "Manage credentials" link in the Code-Sign Detail Sheet (S-00b)
- **Goal:** Add, validate, or remove store credentials (Google Play service account, Firebase, App Store Connect Phase 2)

### Interaction Model
- **Pattern:** Full page (credential management hub)
- **Steps:** N/A at list level; Add credential is a Sheet wizard
- **Navigation flow:**
  - Entry: MobileAppListScreen → Sheet → "Manage credentials"
  - Add credential: DropdownMenu → "Add Google Play" / "Add Firebase" → Sheet slide-in
  - Success (add): Sheet closes → row appears in table with "validating" status → auto-refreshes to "connected"
  - Delete: DropdownMenu → "Delete" → AlertDialog confirm → row removed
  - Cancel: "Back" button → MobileAppListScreen
  - Error: Credential validation failure → "error" StatusBadge + Revalidate action

### States

| State | Trigger | UI |
|---|---|---|
| Empty | No credentials added | ⚠️ **DEBT** — EmptyState placeholder comment exists but UI not verified; no "Add first credential" CTA in empty state |
| Loading (validate) | After adding credential | StatusBadge "pending" → auto-transitions |
| Populated | Credentials exist | Table: Label, Type badge, Status badge, Last validated, Actions |
| Connected | Status = "connected" | StatusBadge "configured" |
| Expired | Status = "expired" | StatusBadge "error" + Revalidate action |
| Error | Status = "error" | StatusBadge "error" + error message tooltip |
| Validating | Status = "validating" | StatusBadge "pending" |
| Add Sheet open | User triggers add | Sheet from right with Label input + credential type Select + JSON textarea / file upload area |

### Action Hierarchy
- **Primary:** "Add Credential" (+ button, top right) → opens credential type Sheet
- **Secondary:** Revalidate (per-row action)
- **Destructive:** Delete → AlertDialog confirm ("This will break any future deployments using this credential")
- **Escape:** Back button → MobileAppListScreen

### Accessibility Notes
- ⚠️ **DEBT** — JSON textarea for service account JSON has no character count or format hint; users may paste incorrectly
- DropdownMenu per-row: needs icon on every item (✅ confirmed in code: Trash2, RefreshCw, ShieldAlert icons present)

### Edge Cases & Risks (S-01)
1. **Credential in use guard** — if a credential is deleted while a deployment job is running, there is no explicit guard or warning. Need to check if the backend protects this; if not, the UI needs a "credential in use" state.
2. **No last-used context** — the table shows "Last validated" but not "last used in deployment". Admins can't tell which credentials are actively in use before deleting.
3. **App Store Connect is Phase 2** — the UI currently shows it disabled. The disabled state needs a clear "Coming soon" badge and tooltip rather than just being non-interactive.
4. **File upload for JSON** — currently appears to use a `<Textarea>` for JSON paste. A `FileUpload` component would be better UX (`{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` pattern applies).
5. **Validation is simulated** — status transitions are mocked; no actual API integration in prototype.

---

## UX Spec: S-02 — DeployWizardChannelScreen

### User & Context
- **Persona:** App Admin / Admin (same user initiating deploy from S-00b Sheet)
- **Trigger:** "Deploy" button pressed on a signed app in the Code-Sign Sheet
- **Goal:** Choose the distribution channel for this build

### Interaction Model
- **Pattern:** Full page — Step 1 of 2 in deploy wizard
- **Steps:** Step 1 (Channel) → Step 2 (Channel-specific config)
- **Navigation flow:**
  - Entry: MobileAppListScreen Sheet → Deploy
  - Google Play selected → Next → DeployWizardPlayScreen (S-03)
  - Firebase selected → Next → DeployWizardFirebaseScreen (S-04)
  - MDM / Ad-hoc selected → Next → existing flows (⚠️ **DEBT**: navigatesTo = undefined; these paths are dead ends in prototype)
  - Cancel / Back → MobileAppListScreen (goBack)
  - Manage Credentials link → DeploymentCredentialsScreen (S-01)

### States

| State | Trigger | UI |
|---|---|---|
| Default | Wizard opens | All channels listed; Google Play pre-selected (first item) |
| Channel unconfigured | credConfigured = false | RadioCard disabled with "Configure credentials" link inline |
| Channel selected | User clicks RadioCard | RadioCard highlighted; Next button enabled |
| No credentials configured | credConfigured false on all | ⚠️ **DEBT** — No empty/blocked state; user can still see channels but can't proceed |

### Action Hierarchy
- **Primary:** "Next →" button → navigates to step 2
- **Secondary:** "Manage Credentials" text link (top right of channel list)
- **Destructive:** None
- **Escape:** "← Back" → MobileAppListScreen

### Accessibility Notes
- RadioGroup + RadioCard: ✅ correct pattern for mutually-exclusive channel selection
- ⚠️ **DEBT** — No step indicator (breadcrumb or Stepper) visible on wizard — user doesn't know they're on "Step 1 of 2"
- Tab order: Context bar → RadioCards → Next button

### Edge Cases & Risks (S-02)
1. **No wizard step indicator** — `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` should be placed at the top of the wizard. Users don't know how many steps remain.
2. **MDM and Ad-hoc navigation gap** — both channels have `navigatesTo: undefined`. In a real implementation these would navigate to different flows. The current screen silently does nothing when user clicks Next with these selected (⚠️ critical UX gap).
3. **App context bar duplicated** — `SignedAppContextBar` is a local component defined identically in S-02, S-03, and S-04. Should be a shared component to prevent drift.
4. **Platform mismatch not shown** — if the user's signed app is iOS, Google Play should be disabled (it only accepts Android AAB). No platform-awareness guard on channel availability.
5. **No "what is this?" disclosure** — Firebase "Beta" and MDM "Enterprise" badges give hints, but new users won't know the difference. A brief tooltip or expandable description (beyond the one-liner) would help.

---

## UX Spec: S-03 — DeployWizardPlayScreen

### User & Context
- **Persona:** App Admin / Admin
- **Trigger:** User selects "Google Play" in DeployWizardChannelScreen and presses Next
- **Goal:** Configure the Google Play release (track, rollout %, release notes, draft mode) and submit

### Interaction Model
- **Pattern:** Full page — Step 2 of wizard (Google Play path)
- **Steps:** Single form screen (no sub-steps)
- **Navigation flow:**
  - Entry: DeployWizardChannelScreen → Next (Google Play)
  - Deploy (non-production): AlertDialog skipped → navigate to DeployInProgressScreen (S-05)
  - Deploy (production): AlertDialog confirmation → navigate to DeployInProgressScreen (S-05)
  - Draft app error: navigate to PlaySetupGuideScreen (S-07)
  - Cancel/Back: DeployWizardChannelScreen

### States

| State | Trigger | UI |
|---|---|---|
| Default | Screen loads | Internal track pre-selected; staged rollout hidden; release notes empty |
| Production selected | Track = "production" | Staged rollout Slider appears; release notes become required |
| Release notes missing (prod) | User attempts Deploy with empty release notes on Production | ⚠️ **DEBT** — Validation error exists in code but uses raw `<p style>` text, not an InlineAlert or Badge |
| Production confirm | Deploy on Production track | AlertDialog: "Release to all Play Store users?" with staged rollout % shown |
| Draft app | Backend returns draft error | Navigate to PlaySetupGuideScreen (S-07) |
| Submit as Draft toggle on | User enables draft mode | Switch changes deploy label; info notice shown |

### Action Hierarchy
- **Primary:** "Deploy to [Track]" button
- **Secondary:** "← Back" to channel selection
- **Destructive (soft):** Production deploy → AlertDialog confirm before proceeding
- **Escape:** Back button

### Accessibility Notes
- Slider for staged rollout: ✅ DS Slider component used
- Switch for "Submit as draft": ✅ Switch (no colour variant needed — binary only) is the correct component
- ⚠️ **DEBT** — Release notes validation error uses inline styled `<p>` — should use `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}`
- ⚠️ **DEBT** — `Label` elements present for all inputs ✅, but the `htmlFor`/`id` linkage should be verified for screen readers

### Edge Cases & Risks (S-03)
1. **Package name mismatch warning** — code has a `packageMismatch` warning condition with an inline styled alert div. This should use `{/* TODO: replace with <InlineAlert /> once built */}` and the warning condition logic needs to be data-driven (not hardcoded in prototype).
2. **Staged rollout UX** — the Slider goes 0–100 but the semantics are unclear: does 0 mean "pause rollout" or "don't roll out"? Add explicit label states (e.g., "Full rollout" at 100%, "Phased rollout: 10%" at 10%).
3. **"Submit as Draft" toggle — Switch vs Toggle** — `Switch` is used; since this is a simple binary with no semantic colour needed, `Switch` is correct per AGENTS.md §3. ✅ No debt here.
4. **No release notes character count** — Google Play has a 500-character limit per release notes per language. No counter shown in UI.
5. **Localization gap** — release notes textarea is single-language. Google Play supports per-language release notes. Phase 2 concern but worth flagging.
6. **Production rollout percentage persists** — if user switches from Production to Internal and back, the slider value resets to default. Should it persist or reset? Current behavior (reset) should be intentional.

---

## UX Spec: S-04 — DeployWizardFirebaseScreen

### User & Context
- **Persona:** App Admin / Admin
- **Trigger:** User selects "Firebase App Distribution" in DeployWizardChannelScreen and presses Next
- **Goal:** Add testers, write release notes, and push the build to Firebase

### Interaction Model
- **Pattern:** Full page — Step 2 of wizard (Firebase path)
- **Steps:** Single form screen
- **Navigation flow:**
  - Entry: DeployWizardChannelScreen → Next (Firebase)
  - Deploy: navigate to DeployInProgressScreen (S-05)
  - Back: DeployWizardChannelScreen

### States

| State | Trigger | UI |
|---|---|---|
| Default | Screen loads | Tester TagInput empty; release notes empty; Deploy enabled |
| Testers added | User enters emails | TagInput chips shown; invalid emails ⚠️ **DEBT** — no email format validation on tag entry |
| No testers | User deploys with empty TagInput | ⚠️ **DEBT** — No explicit guard; Firebase allows deploy without testers (just notifies nobody) — should show a warning |
| Deploy pressed | Button click | Navigate to DeployInProgressScreen |

### Action Hierarchy
- **Primary:** "Deploy via Firebase" button
- **Secondary:** "← Back" to channel selection
- **Destructive:** None
- **Escape:** Back button

### Accessibility Notes
- TagInput used for tester emails ✅ — correct DS pattern per AGENTS.md §3
- ⚠️ **DEBT** — No `aria-describedby` connecting tester input to helper text ("Testers receive an email invite")

### Edge Cases & Risks (S-04)
1. **Email validation in TagInput** — tester emails are free-typed. Invalid email formats (e.g., "not-an-email") will be accepted as tags silently. TagInput should validate on tag-creation and reject invalid email formats.
2. **No tester warning** — deploying to Firebase with zero testers is technically valid but almost certainly a mistake. A warning (`{/* TODO: <InlineAlert /> */}`) should appear if testers list is empty.
3. **Firebase group names** — Firebase supports distributing to *groups* (named tester lists), not just individual emails. The current TagInput only supports individual emails — this is a scoped feature gap vs full Firebase API capability.
4. **Release notes not required** — unlike Google Play, Firebase doesn't mandate release notes. The field should be clearly marked "(optional)" vs unlabelled.
5. **Same context bar** — `SignedAppContextBar` is re-implemented identically here (same as S-02 and S-03). ⚠️ **DEBT** — extract to shared component.

---

## UX Spec: S-05 — DeployInProgressScreen

### User & Context
- **Persona:** App Admin / Admin (same user who initiated deploy)
- **Trigger:** "Deploy" button pressed in S-03 or S-04 (after AlertDialog confirm if production)
- **Goal:** Monitor the deployment job in real time and confirm success or handle failure

### Interaction Model
- **Pattern:** Full page — async progress view
- **Steps:** Queued → Uploading → Processing → Confirming → (Success | Failed)
- **Navigation flow:**
  - Entry: DeployWizardPlayScreen or DeployWizardFirebaseScreen → Deploy
  - Success: auto-navigates to DeploymentHistoryScreen (S-06) OR stays on screen with "View in Console" CTA
  - Failure: stays on screen with error message + Retry button + "View history" link
  - Cancel (Queued state only): cancel available → returns to MobileAppListScreen
  - No "Back" during active upload — back navigation is blocked

### States

| State | Trigger | UI |
|---|---|---|
| Queued | Job created | Step 1 = success (already queued), step 2 running spinner, Cancel button visible |
| Uploading | Upload in progress | Loader2 spinner on "Uploading" step; Progress bar active; Cancel hidden (upload started) |
| Processing | Upload complete | Processing step running; Confirming pending |
| Success | All steps pass | Full-page green ✅ hero; store link (ExternalLink); "View History" button |
| Failed | Any step error | Red ✗ hero; error message; Retry button; "View History" link |
| Simulated (prototype) | setInterval ticking | Steps auto-advance; ⚠️ **DEBT** — hardcoded to succeed after N ticks; no real failure simulation toggle |

### Action Hierarchy
- **Primary (success):** "View History" → DeploymentHistoryScreen
- **Primary (failure):** "Retry" → DeployWizardChannelScreen (or back to S-03/S-04?)
- **Secondary (success):** "View in [Store] Console" external link
- **Secondary (failure):** "View History" link
- **Cancel (Queued only):** "Cancel Job" → AlertDialog? ⚠️ **DEBT** — cancel action calls no AlertDialog, cancels immediately
- **Escape:** None intentional (deliberate — user should not navigate away mid-deploy)

### Accessibility Notes
- ⚠️ **DEBT** — Loader2 spin animation uses inline `animation: "spin 1s linear infinite"` style — this should use the DS pattern and be verified against `prefers-reduced-motion`
- Progress bar uses DS `Progress` component ✅
- ⚠️ **DEBT** — No `aria-live="polite"` region for step status updates — screen reader users won't hear progress changes

### Edge Cases & Risks (S-05)
1. **Cancel without confirmation** — cancelling a queued job has no AlertDialog confirm step. If misclicked, the job is immediately cancelled with no undo. Needs `AlertDialog` gate: "Cancel this deployment? The signed build will not be uploaded."
2. **Back navigation during upload** — if the user navigates away (browser back, LeftNav click) during an active upload, the job continues server-side but the user loses visibility. Need a `Blanket`-level guard or navigation block.
3. **Retry destination unclear** — the Retry button navigates to `deploy-wizard-channel` (Step 1). For transient errors (e.g., network timeout during upload), the user shouldn't have to re-select the channel and re-enter release notes. Retry should ideally re-submit with the same config.
4. **Success auto-navigation** — code suggests auto-navigating to history on success. Auto-navigation without user consent is disorienting. Prefer: show success state, let user click "View History" themselves.
5. **No partial progress on reconnect** — if the user closes and re-opens the app, they can't reconnect to an in-progress deploy job. The history screen would need a "running" row to bridge this.

---

## UX Spec: S-06 — DeploymentHistoryScreen

### User & Context
- **Persona:** App Admin / Admin / Super Admin (read access); Admin (retry action)
- **Trigger:** (a) Success navigation from DeployInProgressScreen; (b) "View history" link from Code-Sign Sheet (S-00b)
- **Goal:** See all past deployment attempts, identify failures, retry failed jobs, or view live deployments

### Interaction Model
- **Pattern:** Full page — sortable table, newest-first
- **Steps:** N/A (list screen)
- **Navigation flow:**
  - Entry (a): DeployInProgressScreen success/failure
  - Entry (b): MobileAppListScreen → Code-Sign Sheet → "View history"
  - Retry action: navigate to DeployWizardChannelScreen (S-02) with pre-filled context
  - View in Console: external link (opens new tab)
  - New Deploy: navigate to DeployWizardChannelScreen (S-02)
  - Back: MobileAppListScreen

### States

| State | Trigger | UI |
|---|---|---|
| Empty | No deployments yet | ⚠️ **DEBT** — `{/* TODO: replace with <EmptyState /> */}` placeholder should be here but not confirmed in code |
| Populated | Deployments exist | Table: Channel, Track, Version, Build, Status, Initiated By, Date, Actions |
| Running row | status = "running" | Badge "Running" + Loader2 icon; no action (job in flight) |
| Success row | status = "success" | Badge "Success"; "View in Console" ExternalLink button |
| Failed row | status = "failed" | Badge "Failed"; "Retry" RotateCcw button; error message in row? ⚠️ **DEBT** — error detail not surfaced in table |
| Queued row | status = "queued" | Badge "Queued"; no action |
| Cancelled row | status = "cancelled" | Badge "Cancelled"; "Retry" available? ⚠️ **DEBT** — unclear |

### Action Hierarchy
- **Primary:** "New Deploy →" button (top right) → DeployWizardChannelScreen
- **Secondary:** Per-row "Retry" (failed/cancelled rows); per-row "View in Console" (success rows)
- **Destructive:** None (history is read-only; no delete)
- **Escape:** Back → MobileAppListScreen

### Accessibility Notes
- ⚠️ **DEBT** — Table has no `caption` or `aria-label` describing what the table contains
- Running rows with Loader2 icon need `aria-live` for status changes

### Edge Cases & Risks (S-06)
1. **Error details not in table** — failed deployments show a "Failed" badge but the error message is only stored in `errorMessage` field of the data model. The table should surface a truncated error message or a "See details" expand action.
2. **No date filtering or search** — for apps with frequent deployments, the history table will grow long with no way to filter by date, channel, or status. `{/* TODO: replace with <Pagination /> once built — ds-parity P1 */}` applies.
3. **Retry pre-fills same config?** — Retry navigates to DeployWizardChannelScreen (Step 1). It should ideally pre-fill the same channel + track + release notes. Current implementation likely loses this context.
4. **Live "running" row** — if a deploy is in progress and user lands on history (from entry point b), the running row has no way to reconnect to the live DeployInProgressScreen. Clicking the running row should navigate to S-05.
5. **"Initiated by" shows username** — shows raw login handle (e.g., `rajan.sharma`). Should ideally show display name or Avatar for better scanability.

---

## UX Spec: S-07 — PlaySetupGuideScreen

### User & Context
- **Persona:** App Admin / Admin — specifically a *first-time* Google Play deployer whose app is in Draft state
- **Trigger:** Backend returns "Only releases with status draft may be created on draft app" error during Deploy; system navigates here from DeployInProgressScreen
- **Goal:** Understand why deployment failed, manually complete the first Play Console release, then successfully retry from Creator

### Interaction Model
- **Pattern:** Full page — guided checklist / tutorial (not a wizard with form inputs)
- **Steps:** 5 manual steps (numbered checklist)
- **Navigation flow:**
  - Entry: DeployInProgressScreen (draft app error) → navigate to play-setup-guide
  - Also entry: DeployWizardPlayScreen → "Submit as Draft" path (⚠️ **DEBT** — direct entry from S-03 is noted in JSDoc but navigation implementation unclear)
  - Step 1: Download AAB → marks step done (checkbox state)
  - Step 2: Open Play Console → external link → marks step done
  - Steps 3–5: Manual instructions with checkboxes
  - Final action: "Retry Deploy" → DeployWizardPlayScreen (S-03) with submit_as_draft=true
  - Alternate: "Back to Deploy Wizard" → DeployWizardChannelScreen (S-02)

### States

| State | Trigger | UI |
|---|---|---|
| Default | Screen loads | All 5 steps unchecked; Retry button present but steps not complete |
| Steps progressing | User checks off steps | CheckCircle2 icon appears on completed steps |
| All steps done | All 5 checked | ⚠️ **DEBT** — Retry button is always enabled regardless of step completion; no validation that user actually did the steps |
| Step 1 action | Download AAB click | Sets step 1 = done in local state (simulated) |
| Step 2 action | Open Play Console click | External link; marks step done |

### Action Hierarchy
- **Primary:** "Retry Deploy in Creator" → DeployWizardPlayScreen with draft mode on
- **Secondary:** "Back to Deploy Wizard" → DeployWizardChannelScreen
- **Secondary:** Per-step: Download AAB (step 1), Open Play Console (step 2)
- **Destructive:** None
- **Escape:** Back button or LeftNav

### Accessibility Notes
- ✅ Steps use structured list-like layout with numbered labels
- ⚠️ **DEBT** — Steps are rendered as `<div>` rows, not as `<ol><li>` or an Accordion — no semantic list structure
- CheckCircle2 icon for done state has no `aria-label` or `role="img"` with `aria-label="completed"`

### Edge Cases & Risks (S-07)
1. **Retry without completing steps** — the "Retry Deploy" button is always enabled. If the user clicks it before completing the Play Console manual steps, the deploy will fail again with the same error, looping back to this screen. The button should only be primary/active once all checklist steps are marked done (or at minimum step 2 confirmed).
2. **No confirmation that Play Console upload was done** — Creator cannot verify externally that the user completed the manual upload. A clear "Have you published the first release manually?" confirmation prompt before Retry would reduce loop frustration.
3. **Steps 3–5 content** — only steps 1–2 have external actions in the code. Steps 3–5 are manual instructions with only a checkbox. Their content in the prototype needs to be reviewed for accuracy against the actual Play Console UI flow.
4. **Entry from S-03 vs S-05** — the JSDoc mentions two entry paths (from DeployWizardPlayScreen and from DeployInProgressScreen error). The params passed (`submit_as_draft`) may differ. Only one path is clearly navigated to in the code — the other needs verification.
5. **App context missing** — unlike S-02/S-03/S-04, S-07 has no `SignedAppContextBar`. If users bookmark or navigate back to this screen, they lose context of which app they were deploying.

---

## Cross-Screen Design Debt Summary

### 🔴 Critical (blocks correct behaviour)

| # | Screen | Issue | Fix |
|---|---|---|---|
| C-01 | S-05 | Cancel job has no AlertDialog confirm — misclick cancels immediately | Add `AlertDialog` guard: "Cancel deployment?" |
| C-02 | S-02 | MDM & Ad-hoc channels have `navigatesTo: undefined` — Next silently does nothing | Implement or disable with "Coming soon" badge |
| C-03 | S-07 | "Retry Deploy" enabled before all checklist steps done — causes error loop | Gate Retry button on step completion |
| C-04 | S-03 | Package name mismatch uses inline styled `<div>` instead of `InlineAlert` | Use `{/* TODO: <InlineAlert /> */}` pattern |

### 🟡 High (UX friction / inconsistency)

| # | Screen | Issue | Fix |
|---|---|---|---|
| H-01 | S-00 | No page-level CTA for first-time users at the list level | Add "Deploy an app" guide CTA in empty state |
| H-02 | S-02/03/04 | `SignedAppContextBar` duplicated across 3 screens | Extract to `@/components/mobile-deployment/SignedAppContextBar.tsx` (shared) |
| H-03 | S-02 | No wizard step indicator | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` at wizard header |
| H-04 | S-06 | Failed row doesn't surface error message inline | Add `errorMessage` truncated text or "See details" popover to failed rows |
| H-05 | S-06 | Running row doesn't link to live S-05 progress screen | Running row should be clickable → DeployInProgressScreen |
| H-06 | S-05 | `aria-live` region missing for step progress updates | Wrap step list in `aria-live="polite"` region |
| H-07 | S-03 | Release notes textarea has no character counter (Google Play limit: 500 chars) | Add character count below Textarea |
| H-08 | S-00 | SDK tab has no content or placeholder | Add `{/* TODO: replace with <EmptyState /> */}` in SDK tab |

### 🟢 Low / Polish

| # | Screen | Issue | Fix |
|---|---|---|---|
| L-01 | S-01 | JSON Textarea for credential paste → should be FileUpload when built | `{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` |
| L-02 | S-04 | Firebase TagInput doesn't validate email format | Add email regex validation on tag creation |
| L-03 | S-04 | No warning when zero testers added | Soft warning via `{/* TODO: <InlineAlert /> */}` if TagInput empty on Deploy |
| L-04 | S-07 | App context bar missing — user loses track of which app they're deploying | Add `SignedAppContextBar` (shared component from H-02) |
| L-05 | S-06 | "Initiated by" shows raw login handle | Show Avatar + display name |
| L-06 | S-05 | `animation: "spin"` inline style not respecting `prefers-reduced-motion` | Use CSS class with `@media (prefers-reduced-motion)` rule |
| L-07 | S-00 | Icon-only action buttons (MoreHorizontal) missing `aria-label` | Add `aria-label="App actions"` to trigger buttons |
| L-08 | S-03 | Staged rollout Slider label unclear at 0% and 100% | Add explicit tick labels: "0% (paused)" and "100% (full rollout)" |

---

## Missing States Across All Screens

| Screen | Missing State | Recommended Treatment |
|---|---|---|
| S-00 MobileAppList | Loading state (app list fetch) | `{/* TODO: replace with <Skeleton /> once built — ds-parity P1 */}` |
| S-00 MobileAppList | Empty state (no apps) | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| S-00 MobileAppList | Search "no results" state | Inline empty message below table |
| S-01 Credentials | Empty state (no credentials) | `{/* TODO: replace with <EmptyState /> */}` with "Add Credential" CTA |
| S-06 History | Empty state (no deployments) | `{/* TODO: replace with <EmptyState /> */}` with "Start your first deploy" CTA |
| S-06 History | Pagination / load more | `{/* TODO: replace with <Pagination /> once built — ds-parity P1 */}` |
| S-05 In-Progress | Cancelled state animation | Currently handled but needs verification |

---

## Platform Awareness Gaps

The deployment feature supports both iOS and Android apps, but channel selection (S-02) is not platform-aware:

| Channel | Valid Platform | Current Guard |
|---|---|---|
| Google Play | Android only | ❌ None — iOS apps can select Google Play |
| Firebase | Both | ✅ Firebase supports both platforms |
| Zoho MDM | Both | ✅ MDM supports both |
| Ad-hoc | iOS primary | ❌ None — no platform-aware description |
| App Store Connect (Phase 2) | iOS only | N/A (Phase 2) |

**Recommendation:** Filter or disable channels based on `platform` prop passed from the selected app (available in `MobileApp` type).

---

## Recommended Shared Component

All wizard screens (S-02, S-03, S-04) and potentially S-07 need a **shared app context bar**. Extract:

```tsx
// src/screens/mobile-deployment/SignedAppContextBar.tsx
interface SignedAppContextBarProps {
  name: string
  initials: string
  avatarColor: string
  platform: "iOS" | "Android"
  version: string
  buildNumber: string
}

export function SignedAppContextBar(props: SignedAppContextBarProps) { ... }
```

This eliminates the 3× duplication and ensures consistent updates.

---

---

## Visual Regression & Token Audit

> **Method:** Automated regex scan of all 8 screen files (`*.tsx`) + manual cross-reference against the Code-Sign Sheet screenshot provided by the user.  
> **Principle from AGENTS.md §1.3–§1.4:** All colors must use `--cds-*` tokens. All spacing and radius must use `--cds-space-*` / `--cds-radius-*` tokens. No hardcoded hex, px margins, or arbitrary sizes.

---

### VR-01 · Hardcoded Hex Color Values

These are **AGENTS.md §1.3 violations** — must use `--cds-*` color tokens, never raw hex.

| File | Code | Violation | Recommended Token |
|---|---|---|---|
| `MobileAppListScreen.tsx` | `avatarColor: "#1a1a2e"` (Servolife apps) | Hardcoded hex in seed data used directly as `backgroundColor` | Use `var(--cds-huegrey-surface-dark)` or a DS palette token |
| `MobileAppListScreen.tsx` | `avatarColor: "#6c3fd6"` (Claim Request SDK) | Hardcoded hex | No exact match — use `var(--cds-primary-surface-default)` or add to token set |
| `MobileAppListScreen.tsx` | `avatarColor: "#0e8a6e"` (Auto Supplies SDK) | Hardcoded hex | Use `var(--cds-success-surface-default)` |
| `MobileAppListScreen.tsx` | `avatarColor: "#c0392b"` (Custom Procurement SDK) | Hardcoded hex | Use `var(--cds-error-surface-default)` |
| `MobileAppListScreen.tsx` (SVG Android icon) | `fill="#3DDC84"` | Hardcoded hex inside inline SVG | Acceptable exception for brand SVG icon — add code comment |

**Impact:** Avatar colors are applied directly as `backgroundColor` style on `<div>` elements in the app list table and the Sheet header. These 4 seeds violate token rules and would fail DS lint.

**Fix pattern:**
```tsx
// Replace seed data hex values:
avatarColor: "var(--cds-huegrey-surface-dark)"   // was "#1a1a2e"
avatarColor: "var(--cds-primary-surface-default)" // was "#6c3fd6"
avatarColor: "var(--cds-success-surface-default)" // was "#0e8a6e"
avatarColor: "var(--cds-error-surface-default)"   // was "#c0392b"
```

---

### VR-02 · Non-Token Spacing Values

These are **AGENTS.md §1.4 violations** — spacing must use `--cds-space-*` tokens.

| File | Code | Value | Violation type |
|---|---|---|---|
| `MobileAppListScreen.tsx` | `margin: "0 0 2px"` (step label gap) | `2px` raw | Should be `var(--cds-space-4)` (min token) or remove |
| `MobileAppListScreen.tsx` | `padding: "4px 8px"` (Console button) | `4px 8px` raw | Should be `var(--cds-space-4) var(--cds-space-8)` |
| `MobileAppListScreen.tsx` | `fontSize: "10px"` (Update Available badge) | `10px` raw | Should use `var(--cds-text-p4)` (11px) |
| `MobileAppListScreen.tsx` | `marginTop: 1`, `marginTop: 2` (icon alignment) | Raw integer (px) | Use `var(--cds-space-4)` or flex `alignItems` instead |
| `MobileAppListScreen.tsx` | `gap: 0` (step list container) | Raw zero | OK for explicit zero-gap — but document intent |
| `MobileAppListScreen.tsx` | `padding: "var(--cds-space-10) ..."` | `--cds-space-10` is **not a standard DS token** | Token does not exist in DS; use `var(--cds-space-8)` or `var(--cds-space-12)` |
| `MobileAppListScreen.tsx` | `padding: "var(--cds-space-14) ..."` (Share/MDM/Deploy sections) | `--cds-space-14` is **not a standard DS token** | Use `var(--cds-space-12)` or `var(--cds-space-16)` |
| `MobileAppListScreen.tsx` | `padding: "var(--cds-space-20) ..."` (Dialog headers) | `--cds-space-20` is **not a standard DS token** | Use `var(--cds-space-16)` or `var(--cds-space-24)` |
| `DeployWizardChannelScreen.tsx` | `padding: "var(--cds-space-20) ..."` | Same non-token | Same fix |
| `DeployWizardPlayScreen.tsx` | `padding: "var(--cds-space-20) ..."` | Same non-token | Same fix |
| `DeployWizardFirebaseScreen.tsx` | `padding: "var(--cds-space-20) ..."` | Same non-token | Same fix |
| `DeploymentCredentialsScreen.tsx` | `padding: "var(--cds-space-20) ..."` | Same non-token | Same fix |
| `PlaySetupGuideScreen.tsx` | `margin: "0 0 " + (step.externalAction ? "var(--cds-space-12)" : "0")` | String concatenation for token — fragile | Use ternary with token in JSX style object |

> ⚠️ **`--cds-space-10`, `--cds-space-14`, `--cds-space-20` are used across all 8 screens but do NOT exist in the DS token set.**  
> The standard tokens are: `4, 8, 12, 16, 24, 32, 40, 48`. These three values are ghost tokens that will resolve to `unset` or `0` in production.

**Standard DS spacing token reference (from AGENTS.md §5):**
```
var(--cds-space-4)  = 4px
var(--cds-space-8)  = 8px
var(--cds-space-12) = 12px
var(--cds-space-16) = 16px
var(--cds-space-24) = 24px
var(--cds-space-32) = 32px
```

**Resolution table:**
| Ghost token | Replace with | Visual result |
|---|---|---|
| `--cds-space-10` | `--cds-space-8` (tighter) or `--cds-space-12` (looser) | Minimal visual diff |
| `--cds-space-14` | `--cds-space-12` or `--cds-space-16` | Sheet section padding will adjust slightly |
| `--cds-space-20` | `--cds-space-16` or `--cds-space-24` | Dialog header height will change by 4–4px |

---

### VR-03 · Non-Token Font & Typography Values

| File | Code | Violation | Fix |
|---|---|---|---|
| `MobileAppListScreen.tsx` | `fontSize: "10px"` on Update Available badge | Raw px font size | Use `var(--cds-text-p4)` = 11px |
| `MobileAppListScreen.tsx` | `letterSpacing: "0.04em"` on "Select channel" label | Raw letter-spacing value | No DS token exists — remove or use CSS class |
| `DeployWizardChannelScreen.tsx` | `letterSpacing: "0.05em"` on section label | Raw value | Same — remove or add a `--cds-tracking-*` token proposal |
| `DeployWizardPlayScreen.tsx` | `letterSpacing: "0.05em"` | Raw value | Same |
| `DeployWizardFirebaseScreen.tsx` | `letterSpacing: "0.05em"` | Raw value | Same |
| `MobileAppListScreen.tsx` | `textTransform: "uppercase"` on badge | Raw CSS — should be variant prop | Use `Badge` variant or label formatting |
| Multiple files | `fontFamily: "monospace"` on JSON Textarea | **AGENTS.md §1.2 violation** — only `'Zoho Puvi'` is permitted | Add `{/* TODO: monospace for JSON preview — awaiting DS token --cds-font-family-code */}` comment; track as P3 debt |

> ⚠️ **`fontFamily: "monospace"` is used in 3 places** (MobileAppListScreen credential JSON textarea, DeploymentCredentialsScreen credential JSON textarea ×2). This directly violates AGENTS.md §1.2 which states the **only** permitted font family is `'Zoho Puvi'`.  
> The rationale for monospace (JSON readability) is sound, but it requires a DS-approved `--cds-font-family-code` token to be compliant.

---

### VR-04 · Non-Token Dimensions & Radius Values

| File | Code | Violation | Fix |
|---|---|---|---|
| `MobileAppListScreen.tsx` | `width: 18, height: 18` (pending step circle) | Raw px dimensions | Use `var(--cds-space-16)` + adjust border; or match DS icon size |
| `MobileAppListScreen.tsx` | `borderRadius: "50%"` (pending step circle) | Raw CSS value | Replace with `var(--cds-radius-full)` |
| `MobileAppListScreen.tsx` | `width: 22, height: 22` (step indicator dots in Sheet wizard) | Raw px | No exact DS token; use `var(--cds-space-24)` or add `--cds-size-icon-l` proposal |
| `MobileAppListScreen.tsx` | `width: 32, height: 32` (app list avatar) | Raw px | No exact DS token — document as custom; use Avatar component instead |
| `MobileAppListScreen.tsx` | `width: 48, height: 48` (Sheet avatar) | Raw px | Same — should be `<Avatar>` component |
| `MobileAppListScreen.tsx` | `width: 280` (search field container) | Raw px | Use `max-w-[280px]` or set via layout; not a spacing token |
| `MobileAppListScreen.tsx` | `maxWidth: 860` (History Dialog) | Raw px | Acceptable for Dialog sizing — add comment |
| `MobileAppListScreen.tsx` | `height: 1` (step connector line) | Raw px | Use `var(--cds-space-4)` not applicable; use `Separator` component instead |
| `DeploymentCredentialsScreen.tsx` | `width: 24, height: 24` (step indicator) | Raw px | Same as above |
| `PlaySetupGuideScreen.tsx` | `width: 24, height: 24` (step indicator) | Raw px | Same |
| `PlaySetupGuideScreen.tsx` | `borderRadius: "50%"` | Raw CSS | Use `var(--cds-radius-full)` |
| Multiple wizard screens | `width: 40, height: 40` (context bar app icon) | Raw px | No DS token — document; consider `Avatar` component |

> ⚠️ **Raw `<div>` avatar badges are used in place of the DS `Avatar` component** across the list screen, the Code-Sign Sheet, and the deploy wizard context bars. AGENTS.md §3 explicitly states: "User / entity photo → `Avatar` — never `<img>` with manual border-radius." The same applies to initial-letter avatar `<div>` replacements.

---

### VR-05 · Custom Raw HTML Elements Replacing DS Components

| Pattern found | DS component should be used | Files affected |
|---|---|---|
| `<button type="button" style={{background:"none",border:"none"...}}>` used as nav/link | `Button variant="ghost"` or `Button variant="link"` | All 8 screens — ~12 occurrences |
| `<div style={{borderRadius:"50%"...}}>` as avatar/avatar-dot | `Avatar` component | MobileAppListScreen, DeployWizardChannelScreen, DeployWizardPlayScreen, DeployWizardFirebaseScreen |
| `<div style={{height:1, backgroundColor:...}}>` as divider line | `Separator` component | MobileAppListScreen (Sheet step indicator connector), DeploymentCredentialsScreen |
| Raw `<p style={{...}}>` error text beneath inputs | `{/* TODO: replace with <InlineAlert /> once built */}` | MobileAppListScreen (wizard validation), DeployWizardPlayScreen |
| `<style>{@keyframes spin...}</style>` injected inline | CSS class in `src/index.css` or DS-approved animation utility | MobileAppListScreen, DeployInProgressScreen |
| Search field: `<Input>` with absolutely-positioned `<Search>` icon inside a `<div>` | `InputPrefix` with `prefixIcon={<Search />}` | MobileAppListScreen (app list search) |
| Step indicator: manual `<div>` circles with numbers | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` | MobileAppListScreen (credential add Sheet), DeploymentCredentialsScreen |

---

### VR-06 · Screenshot Analysis: Code-Sign Detail Sheet (S-00b)

> **Source:** User-provided screenshot of "For User - Code Sign" Sheet for "Auto Dealership" app.

**Visual issues observed from the screenshot vs DS rules:**

| Element | Observed in screenshot | DS Token / Rule | Issue |
|---|---|---|---|
| **Section dividers** | Horizontal `<hr>`-style lines between Share / MDM / Deploy sections | Should use `<Separator />` DS component | Raw `div` with `borderBottom` used as divider — confirmed in code: `padding: "var(--cds-space-14) var(--cds-space-24)"` sections visually separated by borders, not `Separator` |
| **"UPDATE AVAILABLE" badge** | Orange outlined badge in header, `fontSize: "10px"`, `textTransform: "uppercase"` | `Badge` variant should handle text case internally; no raw `fontSize` | Two violations: raw `10px` font size + raw `textTransform: uppercase` on badge content |
| **"Deploy" button** | Full-width dark blue button with icon, spanning the entire sheet width | `Button` component — full-width variant | ✅ Appears correct — DS Button stretched to 100%; no violation |
| **"View history" link** | Small ghost link top-right of Deploy section | Should be `Button variant="ghost" size="sm"` | Currently `<button type="button" style={{...}}>` raw element — not DS Button |
| **Section label spacing** | "Share the app installation link with users" text has `margin: "0 0 var(--cds-space-10)"` | `--cds-space-10` does not exist | Ghost token confirmed — renders as 0 margin in production |
| **MDM restriction notice** | Blue info banner: "Distribution through MDM has been restricted for this account" | Should be `{/* TODO: <InlineAlert /> */}` | Raw `<div>` with background color — AGENTS.md §3 violation |
| **MDM section padding** | `padding: "var(--cds-space-14) var(--cds-space-24)"` | `--cds-space-14` does not exist | Ghost token — renders as 0 padding |
| **Share email input** | `<Input>` + `<Button>Share</Button>` side-by-side | Should use `InputSuffix` with `suffixCta` | Manual flex layout of Input + Button — AGENTS.md §3: "Input needs a trailing action → `InputSuffix`" |
| **Gap between sheet sections** | Visual gap between code-sign detail rows (`10px` gap) | `gap: "var(--cds-space-10)"` | Ghost token — renders as 0 gap |
| **App detail rows** (`App Name:`, `Push Notification:`, etc.) | Colon separator uses `fontSize: "var(--cds-space-4)"` | `--cds-space-4` = `4px` — incorrect use of **spacing** token as **font size** | Critical wrong-token category: spacing token used as font size |
| **"Re-code Sign" link** | Small blue link next to app name in Sheet header | Raw `<button>` | Should be `Button variant="link" size="sm"` |
| **"Download IPA" button** | Outlined button top-right of sheet header | ✅ Appears to use `Button variant="outline"` | Likely correct — confirm `size` prop |

> ⚠️ **Critical wrong-token use found:** `fontSize: "var(--cds-space-4)"` used to size the colon separator character. `--cds-space-4` = `4px` as a font size would render text at 4px — invisible. This is a copy-paste error where a spacing token was placed in a `fontSize` property. Should be `var(--cds-text-p3)` or simply `inherit`.

---

### VR-07 · Layout Shell Compliance

| Screen | TopBar present | LeftNav present | `main` overflow-y | Page padding uses tokens | Compliant? |
|---|---|---|---|---|---|
| S-00 MobileAppListScreen | ✅ | ✅ | ✅ | ⚠️ Uses `--cds-space-20` ghost token for some padding | Partial |
| S-01 DeploymentCredentialsScreen | ✅ | ✅ | ✅ | ⚠️ Same ghost token | Partial |
| S-02 DeployWizardChannelScreen | ✅ | ✅ | ✅ | ⚠️ Same ghost token | Partial |
| S-03 DeployWizardPlayScreen | ✅ | ✅ | ✅ | ⚠️ Same ghost token | Partial |
| S-04 DeployWizardFirebaseScreen | ✅ | ✅ | ✅ | ⚠️ Same ghost token | Partial |
| S-05 DeployInProgressScreen | ✅ | ✅ | ✅ | ✅ Uses real tokens for main content | ✅ |
| S-06 DeploymentHistoryScreen | ✅ | ✅ | ✅ | ✅ | ✅ |
| S-07 PlaySetupGuideScreen | ✅ | ✅ | ✅ | ✅ | ✅ |

All screens correctly implement the `<TopBar> + <LeftNav> + <main>` shell. ✅ No structural shell violations.

---

### VR-08 · Gap & Spacing Inconsistency Across Wizard Steps

The three wizard step screens (S-02, S-03, S-04) use different section-separator padding despite being visually identical in intent:

| Location | Token used | Resolves to |
|---|---|---|
| Dialog body padding | `var(--cds-space-24)` | 24px ✅ |
| Dialog header padding | `var(--cds-space-20)` (ghost) | **0px** ❌ |
| Form field groups | `var(--cds-space-20)` (ghost) for gap | **0px** ❌ |
| Field label-to-input gap | `var(--cds-space-8)` | 8px ✅ |
| Context bar bottom margin | `var(--cds-space-24)` | 24px ✅ |
| Section separator margin | `var(--cds-space-32) 0 var(--cds-space-24)` | 32px / 24px ✅ |

> The ghost token problem means that in the DS showcase preview (where token CSS is loaded), spacing **appears correct** because those properties resolve to something reasonable. But in a production environment where `--cds-space-10`, `--cds-space-14`, `--cds-space-20` are not defined, **all those spacings collapse to 0** — creating compressed, unreadable layouts.

---

### VR-09 · Animation & Motion

| File | Code | Violation | Fix |
|---|---|---|---|
| `MobileAppListScreen.tsx` | `<style>{\`@keyframes spin {...}\`}</style>` injected in JSX render | Inline `<style>` tag in component render — causes style duplication on every re-render | Move to `src/index.css` or use a CSS Module |
| `DeployInProgressScreen.tsx` | Same inline `@keyframes spin` | Same violation | Same fix |
| All files with `Loader2` | `animation: "spin 1s linear infinite"` | No `prefers-reduced-motion` guard | Add `@media (prefers-reduced-motion: reduce) { .spin { animation: none; } }` |

---

### VR-10 · Visual Debt Priority Matrix

| Priority | ID | Issue | Screen(s) | Effort |
|---|---|---|---|---|
| 🔴 P0 | VR-02a | `--cds-space-10/14/20` ghost tokens used everywhere — collapse to 0 in production | All 8 | Medium |
| 🔴 P0 | VR-06g | `fontSize: "var(--cds-space-4)"` wrong-token-category on colon separator | S-00b | Low |
| 🟡 P1 | VR-05d | Share Input + Button → replace with `InputSuffix` | S-00b | Low |
| 🟡 P1 | VR-01 | 4× hardcoded hex avatar colors | S-00 | Low |
| 🟡 P1 | VR-03c | `fontFamily: "monospace"` violates §1.2 | S-01, S-00 | Medium |
| 🟡 P1 | VR-05a | 12+ raw `<button>` ghost links → `Button variant="ghost/link"` | All | Medium |
| 🟡 P1 | VR-05f | Search field → `InputPrefix` | S-00 | Low |
| 🟡 P1 | VR-04d | Raw `<div>` avatars → `Avatar` component | All wizard screens | Medium |
| 🟢 P2 | VR-03a | `fontSize: "10px"` → `var(--cds-text-p4)` | S-00 | Trivial |
| 🟢 P2 | VR-03b | `letterSpacing: "0.04em/0.05em"` → remove or token | S-02/03/04 | Trivial |
| 🟢 P2 | VR-05c | Raw `<div>` height:1 dividers → `Separator` | S-00, S-01 | Trivial |
| 🟢 P2 | VR-09 | Inline `@keyframes` + no `prefers-reduced-motion` | S-00, S-05 | Low |
| 🟢 P3 | VR-04a | Raw `borderRadius: "50%"` → `var(--cds-radius-full)` | Multiple | Trivial |

---

### How to use this section

1. **P0 issues should be fixed before the feature ships to production** — ghost tokens will cause layout collapse.
2. **P1 issues should be filed as design debt tickets** in the sprint backlog.
3. **P2/P3 issues** can be bundled into a "DS polish" sprint after MVP.
4. Run `clGSg50mcp0validate_component_usage` (DS Lint MCP tool) on each screen file to catch additional violations not covered by regex scan.

---

*End of UX Spec — Mobile App Deployment (Feature 004)*  
*Produced retroactively from code analysis by Maya (UX Designer skill)*  
*Visual Regression & Token Audit added: 2026-07-22*  
*Next step: Run `ds-specialist` skill to validate DS compliance against this spec*
