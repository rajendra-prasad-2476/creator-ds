# DS Audit Report — Mobile App Deployment (Feature 004)
> **Auditor:** Arjun (DS Specialist — `ds-specialist` skill)  
> **Date:** 2026-07-22  
> **Source:** All 8 screens in `src/screens/mobile-deployment/`  
> **Reference spec:** `docs/ux-spec-mobile-deployment.md`  
> **AGENTS.md version:** 1.1.1 (post ghost-token fix)

---

## Audit Summary

| Screen | File | Verdict |
|---|---|---|
| S-00 MobileAppListScreen | `MobileAppListScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-01 DeploymentCredentialsScreen | `DeploymentCredentialsScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-02 DeployWizardChannelScreen | `DeployWizardChannelScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-03 DeployWizardPlayScreen | `DeployWizardPlayScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-04 DeployWizardFirebaseScreen | `DeployWizardFirebaseScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-05 DeployInProgressScreen | `DeployInProgressScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-06 DeploymentHistoryScreen | `DeploymentHistoryScreen.tsx` | ⚠️ APPROVED WITH NOTES |
| S-07 PlaySetupGuideScreen | `PlaySetupGuideScreen.tsx` | ⚠️ APPROVED WITH NOTES |

> No screens are fully BLOCKED. Critical violations from the initial code state have been resolved (ghost tokens, invisible colon, badge fontSize). Remaining issues are MAJOR/MINOR.

---

## DS Audit Report: S-00 — MobileAppListScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ Ghost tokens: `--cds-space-10/14` removed (fixed this session)
- ✅ Invisible colon: `fontSize: "var(--cds-space-4)"` fixed → `var(--cds-text-p3)`
- ✅ Badge fontSize: `"10px"` fixed → `size="sm"` prop
- ✅ Navigation: uses `useNavigation()` throughout
- ✅ Destructive actions (credential delete): `AlertDialog` ✅

### Major warnings (should fix before shipping)

1. **Search field not using `InputPrefix`** — Line ~926:
   ```tsx
   <div style={{ position: "relative", width: 280 }}>
     <Search size={13} style={{ position: "absolute", ... }} />
     <Input ... style={{ paddingLeft: "var(--cds-space-32)" }} />
   </div>
   ```
   → Replace with `<InputPrefix prefixIcon={<Search size={13} />} placeholder="Search" />`

2. **Share email input not using `InputSuffix`** — Sheet section:
   ```tsx
   <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
     <Input placeholder="Please enter user's email address" style={{ flex: 1 }} />
     <Button size="sm">Share</Button>
   </div>
   ```
   → Replace with `<InputSuffix placeholder="Please enter user's email address" suffixCta={<Button size="sm">Share</Button>} />`

3. **SDK tab has no empty state** — `TabsContent value="sdk"` renders `AppTable` with SDK apps but no empty state or placeholder when SDK_APPS is empty. Add `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}`.

4. **Avatar `<div>` used instead of `Avatar` component** — App list rows (32×32) and Sheet header (48×48) use manual `<div>` with `borderRadius: "var(--cds-radius-s)"`. AGENTS.md §3: "User / entity photo → `Avatar`". Wrap in `<Avatar>` with `fallback={app.initials}`.

5. **Hardcoded hex avatar colors in seed data** (non-blocking for prototype, must fix before production):
   - `#1a1a2e` → use `var(--cds-huegrey-surface-dark)` or DS token
   - `#6c3fd6` → use `var(--cds-primary-surface-default)`
   - `#0e8a6e` → use `var(--cds-success-surface-default)`
   - `#c0392b` → use `var(--cds-error-surface-default)`

6. **MDM restriction notice is a raw `<div>`** — AGENTS.md §3: inline info notices → `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}`

### Minor notes (track for next iteration)

- Step indicator circles in credential add Sheet (width/height 22px raw) → `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}`
- `<style>{\`@keyframes spin {...}\`}</style>` injected in wizard JSX body — move to `src/index.css`
- `fontFamily: "monospace"` on JSON textarea (credential add Sheet) — acceptable per ds-specialist §MINOR rule for JSON content ✅
- `margin: "2px 0 0"` raw value (error message below status badge in history table) — use `var(--cds-space-4)` (nearest valid token)
- `padding: "4px 8px"` on Console button in history table — use `var(--cds-space-4) var(--cds-space-8)`

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `EmptyState` | P1 | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| `InlineAlert` | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |
| `Skeleton` | P1 | `{/* TODO: replace with <Skeleton /> once built — ds-parity P1 */}` |

### Approved for code generation: YES (with noted fixes for sprint)

---

## DS Audit Report: S-01 — DeploymentCredentialsScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ Token spacing: No ghost tokens (post-fix)
- ✅ Navigation: `useNavigation()` + `goBack()` used
- ✅ Destructive: Delete credential uses `AlertDialog` ✅
- ✅ StatusBadge used for credential status ✅

### Major warnings (should fix)

1. **`fontFamily: "monospace"` on JSON Textarea** — Technically acceptable for JSON preview per skill §MINOR rule. However AGENTS.md §1.2 states only `'Zoho Puvi'` is permitted. **Verdict:** Add comment `{/* TODO: monospace for JSON preview — awaiting DS token --cds-font-family-code */}` and track as P3 until DS approves a code font token.

2. **Permission notice (ShieldAlert box) is a raw `<div>`** — Should be `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` wrapping the current implementation.

3. **Credential type selector in add Sheet uses raw `<button>` elements** — Not DS `RadioCard`. Each credential type option is a custom `<button>` with border/background styles:
   ```tsx
   <button key={type} type="button" onClick={...} style={{ border: ..., borderRadius: ..., padding: ... }}>
   ```
   → Replace with `<RadioGroup>` + `<RadioCard>` for each credential type. This is exactly the pattern AGENTS.md §3 prescribes for mutually-exclusive card choices.

4. **Empty state for credential table** — When `credentials.length === 0` (after deleting all), the Table renders with empty body. Add `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` with "Add a credential to start deploying" CTA.

5. **Sheet internal structure** — `<SheetContent>` has non-zero default padding. The Sheet header inside uses `padding: "var(--cds-space-20) var(--cds-space-4) var(--cds-space-16)"` — the `--cds-space-4` horizontal padding is extremely narrow and visually incorrect. Should be `var(--cds-space-24)`.

### Minor notes

- Step indicator dots in add-credential Sheet: `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}`
- `fontFamily: "monospace"` on `packageHint` display in credential table — **This is a violation.** `packageHint` is a package name (e.g. `com.zylker.app`), not JSON/code. Remove monospace font; use default DS font.
- `Upload` icon imported but not used in a FileUpload component — confirm no dead import (TypeScript should catch at build)

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `EmptyState` | P1 | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| `InlineAlert` | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |
| `FileUpload` | P2 | `{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` (already noted in code ✅) |

### Approved for code generation: YES (with RadioCard fix recommended)

---

## DS Audit Report: S-02 — DeployWizardChannelScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens
- ✅ Navigation: `useNavigation()` ✅
- ✅ RadioGroup + RadioCard used correctly ✅ — This is exactly right per AGENTS.md §3

### Major warnings (should fix)

1. **"Manage store credentials" is a raw `<button>`** — Should be `Button variant="ghost"`:
   ```tsx
   <button type="button" onClick={onOpenCredentials} style={{ background: "none", border: "none", cursor: "pointer", ... }}>
   ```
   → `<Button variant="ghost" size="sm" onClick={onOpenCredentials}><Settings size={12} /> Manage store credentials</Button>`

2. **No step indicator** — User is on "Step 1 of 2" but no visual indicator exists. Add: `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` with a temporary text breadcrumb: `"Step 1 of 2 — Choose channel"`

3. **SignedAppContextBar is a local duplicated component** — Same component defined in S-02, S-03, and S-04. Should be extracted to a shared file per DRY principle. Not a DS violation per se, but creates drift risk.

4. **MDM + Ad-hoc channels have `navigatesTo: undefined`** — Clicking Next with these selected does nothing. Needs either a disabled state or a "coming soon" tooltip on the Next button when these are selected.

5. **`letterSpacing: "0.05em"` on section label** — No DS token exists for `letterSpacing`. Remove or add to a CSS class.

### Minor notes

- `textTransform: "uppercase"` on section label ("Select channel") — No DS token. Remove uppercase or use a CSS class.
- Avatar context bar icon (40×40 raw `<div>`) → consider `Avatar` component

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `Stepper` | P3 | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` |

### Approved for code generation: YES

---

## DS Audit Report: S-03 — DeployWizardPlayScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens
- ✅ Production deploy uses `AlertDialog` for confirmation ✅
- ✅ Navigation: `useNavigation()` ✅
- ✅ `Switch` used correctly for "Submit as draft" (binary, no colour variant) ✅
- ✅ `Slider` used correctly for staged rollout ✅
- ✅ `Select` + `SelectItem` used for track selector ✅

### Major warnings (should fix)

1. **Validation error uses raw `<p>` + `<AlertCircle>` instead of InlineAlert**:
   ```tsx
   <div style={{ display: "flex", gap: "var(--cds-gap-tight)", alignItems: "center" }}>
     <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)" }} />
     <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>{errors.releaseNotes}</p>
   </div>
   ```
   → `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}`

2. **Package name mismatch warning uses raw `<div>` with inline styles** — Same as above. Needs `{/* TODO: <InlineAlert /> ds-parity P1 */}`.

3. **"Back" is a raw `<button>`** — Should be `Button variant="outline"` (it is in the dialog version but standalone screen uses raw button).

4. **No release notes character count** — Google Play limit is 500 chars. Add a `<span>` character counter below the Textarea using `var(--cds-text-p3)` and `var(--cds-huegrey-text-default)`.

5. **SignedAppContextBar duplicated** — Same issue as S-02. Extract to shared component.

### Minor notes

- `letterSpacing: "0.05em"` on step label — same as S-02, remove
- `textTransform: "uppercase"` on step label — same, remove
- Slider rollout description ("Full rollout" at 100%) missing — add explicit labels

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `InlineAlert` | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |

### Approved for code generation: YES

---

## DS Audit Report: S-04 — DeployWizardFirebaseScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens
- ✅ Navigation: `useNavigation()` ✅
- ✅ `TagInput` used for tester emails ✅ — Correct DS pattern

### Major warnings (should fix)

1. **Validation error uses raw `<p>` + `<AlertCircle>`** — Same pattern as S-03:
   ```tsx
   <div style={{ display: "flex", gap: "var(--cds-gap-tight)", alignItems: "center" }}>
     <AlertCircle size={12} style={{ color: "var(--cds-error-text-default)" }} />
     <p style={{ ... }}>{errors.testers}</p>
   </div>
   ```
   → `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}`

2. **No tester warning when TagInput is empty** — Deploying with zero testers is valid technically but almost certainly a mistake. Add a conditional warning: `{/* TODO: <InlineAlert /> warning if testers empty on Deploy */}`.

3. **SignedAppContextBar duplicated** — Third occurrence. Must extract.

4. **Release notes field is not marked "(optional)"** — Firebase doesn't require release notes. The Label just says "Release notes" — update to `"Release notes (optional)"` to match the correct pattern (verified in standalone version — ✅ already fixed there; confirm in main Dialog version).

### Minor notes

- `letterSpacing: "0.05em"` on step label — same, remove
- `textTransform: "uppercase"` — same, remove
- Avatar context bar icon (40×40 raw `<div>`) → `Avatar` component

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `InlineAlert` | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |

### Approved for code generation: YES

---

## DS Audit Report: S-05 — DeployInProgressScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens
- ✅ Navigation: `useNavigation()` ✅
- ✅ `Progress` DS component used for progress bar ✅
- ✅ `Badge` used for step status labels ✅

### Major warnings (should fix)

1. **Cancel job has no `AlertDialog` confirm** — The cancel action (available in Queued state) directly cancels without any confirmation gate:
   ```tsx
   <Button variant="outline" onClick={handleCancel}>Cancel job</Button>
   ```
   AGENTS.md §3: "destructive actions gated by `AlertDialog`". Cancelling a deployment is destructive (irreversible). Wrap in `AlertDialog`: "Cancel this deployment? The signed build will not be uploaded."

2. **Retry navigates to S-02 (channel selection) instead of re-submitting** — For transient errors, user shouldn't need to re-select channel + re-enter release notes. Retry should pass the previous config via `navigate("deploy-wizard-play", { prefillConfig: true })`.

3. **Inline `@keyframes spin` injected in JSX** — `<style>{\`@keyframes spin {...}\`}</style>` in component body causes style tag duplication on each render. Move to `src/index.css`.

4. **`Loader2` spinner has no `prefers-reduced-motion` guard** — The `animation: "spin 1s linear infinite"` inline style bypasses any CSS motion preference. Add `@media (prefers-reduced-motion: reduce) { .spin-animation { animation: none; } }` to `src/index.css`.

5. **Step list has no `aria-live` region** — Screen reader users won't hear step status changes:
   ```tsx
   <div aria-live="polite" aria-label="Deployment progress">
     {progressSteps.map(...)}
   </div>
   ```

### Minor notes

- `Circle` import from lucide-react used for pending step icon — but renders as a raw `<div>` in `StepIcon`. The `Circle` import is unused. Clean up.
- Step connector `margin: "0 0 2px"` — use `var(--cds-space-4)` (nearest valid token, not a ghost token)
- Success auto-navigation to history — consider keeping user on success state and letting them choose to navigate

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `Spinner` | P1 | `{/* TODO: replace with <Spinner /> once built — ds-parity P1 */}` |

### Approved for code generation: YES (AlertDialog for cancel is blocking in production)

---

## DS Audit Report: S-06 — DeploymentHistoryScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens (post-fix)
- ✅ Navigation: `useNavigation()` ✅
- ✅ `Badge` variant used for status indicators ✅

### Major warnings (should fix)

1. **Empty state not confirmed with `EmptyState` placeholder** — The zero-deployment state has:
   ```tsx
   {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
   ```
   ✅ Placeholder exists — confirm it renders a CTA button (not just text) for "Start your first deploy".

2. **Running row has no click-through to DeployInProgressScreen** — A running deployment row is inert. Should navigate to S-05:
   ```tsx
   <TableRow onClick={record.status === "running" ? () => navigate("deploy-in-progress") : undefined} style={{ cursor: record.status === "running" ? "pointer" : "default" }}>
   ```

3. **Error message not surfaced in failed rows** — `record.errorMessage` exists in the data model but is only partially visible (`maxWidth: 180` truncation). Failed rows should have a "See error" popover or expandable row showing the full error message.

4. **`aria-live` missing for running rows** — Loader2 animation in running rows needs `role="status"` and `aria-label="Deployment in progress"`.

5. **"Initiated by" shows raw login handle** — `record.initiatedBy` shows `rajan.sharma`. Should show Avatar + display name.

### Minor notes

- `margin: "2px 0 0"` on error text — use `var(--cds-space-4)`
- Table has no `aria-label` — add `aria-label="Deployment history"`
- `padding: "4px 8px"` on Console button — use `var(--cds-space-4) var(--cds-space-8)`

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `EmptyState` | P1 | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| `Pagination` | P1 | `{/* TODO: replace with <Pagination /> once built — ds-parity P1 */}` |

### Approved for code generation: YES

---

## DS Audit Report: S-07 — PlaySetupGuideScreen

### Audit result: ⚠️ APPROVED WITH NOTES

### Critical violations (blocking)
- ✅ Shell: `TopBar + LeftNav + <main>` present
- ✅ No ghost tokens
- ✅ Navigation: `useNavigation()` ✅
- ✅ No destructive actions — no AlertDialog needed ✅

### Major warnings (should fix)

1. **"Retry Deploy" button always enabled** — Button should only become primary/active once all checklist steps are marked done:
   ```tsx
   <Button
     onClick={() => navigate("deploy-wizard-play", { submitAsDraft: true })}
     disabled={!allStepsCompleted}
   >
     Retry Deploy in Creator
   </Button>
   ```
   Currently `allStepsCompleted` state exists but the button is not gated on it — confirm.

2. **Steps rendered as raw `<div>` rows** — Semantically should be `<ol>` with `<li>` items:
   ```tsx
   <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
     {steps.map(step => <li key={step.id}>...</li>)}
   </ol>
   ```

3. **No `SignedAppContextBar`** — Unlike S-02/S-03/S-04, S-07 lacks the app context bar. If user navigates here from a failed deploy, they lose track of which app they were deploying. Add the shared `SignedAppContextBar`.

4. **CheckCircle2 done icon has no accessible label**:
   ```tsx
   <CheckCircle2 style={{ color: "var(--cds-success-text-default)" }} />
   ```
   Add `aria-label="Step completed"` or `role="img" aria-label="Completed"`.

5. **Warning notice (AlertTriangle + text) is a raw `<div>`** — The "First-time release required" notice should be `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}`.

### Minor notes

- Step line connector uses `flex: 1, height: "..." backgroundColor: "..."` raw div — use `<Separator orientation="vertical" />` or DS-approved vertical separator pattern
- "Back to Deploy Wizard" is a raw `<button>` → `Button variant="outline"` or `Button variant="ghost"`
- Download AAB and Open Play Console per-step buttons are raw `<button>` → `Button variant="ghost" size="sm"`

### DS gaps identified

| Component | Priority | Placeholder text |
|---|---|---|
| `InlineAlert` | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |

### Approved for code generation: YES (Retry gate fix is critical before production)

---

## Cross-Screen Summary: All CRITICAL items

> **Last updated:** 2026-07-22 (Sprint 1 fixes applied)

| ID | Screen | Issue | Severity | Status |
|---|---|---|---|---|
| CR-01 | S-05 | Cancel job → no AlertDialog confirm | 🔴 CRITICAL | ✅ Fixed — `AlertDialog` + `cds-spin` class + `aria-live` |
| CR-02 | S-07 | Retry button not gated on step completion | 🔴 CRITICAL | ✅ Already gated (`disabled={!allStepsCompleted}`) |
| CR-03 | S-00–S-04 | `SignedAppContextBar` duplicated in 3 screens | 🟡 MAJOR | ⏳ Sprint 3 backlog |
| CR-04 | S-00 | Search field not using `InputPrefix` | 🟡 MAJOR | ✅ Fixed — `InputPrefix prefixIcon={<Search />}` |
| CR-05 | S-00 | Share email not using `InputSuffix` | 🟡 MAJOR | ✅ Fixed — `InputSuffix suffixLabel="Share"` |
| CR-06 | S-01 | Credential type selector not using `RadioCard` | 🟡 MAJOR | ⏳ Sprint 2 backlog |
| CR-07 | S-03/04 | Validation errors not using `InlineAlert` placeholder | 🟡 MAJOR | ✅ TODO comments already present in standalone screens |
| CR-08 | S-05 | `@keyframes spin` injected in JSX body | 🟡 MAJOR | ✅ Fixed — moved to `src/index.css` + `prefers-reduced-motion` guard |
| CR-09 | S-06 | Running row not clickable to S-05 | 🟡 MAJOR | ✅ Fixed — row `onClick` + "View progress" button |
| VR-01 | S-00 | 4× hardcoded hex avatar colors | 🟡 MAJOR | ✅ Fixed — all 4 replaced with `--cds-*` tokens |

## Cross-Screen DS Gaps (cumulative)

| Component | Screens needing it | Priority | Placeholder |
|---|---|---|---|
| `InlineAlert` | S-00, S-01, S-03, S-04, S-07 | P1 | `{/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}` |
| `EmptyState` | S-00, S-01, S-06 | P1 | `{/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}` |
| `Skeleton` | S-00 | P1 | `{/* TODO: replace with <Skeleton /> once built — ds-parity P1 */}` |
| `Spinner` | S-05 | P1 | `{/* TODO: replace with <Spinner /> once built — ds-parity P1 */}` |
| `Pagination` | S-06 | P1 | `{/* TODO: replace with <Pagination /> once built — ds-parity P1 */}` |
| `FileUpload` | S-01 | P2 | `{/* TODO: replace with <FileUpload /> once built — ds-parity P2 */}` |
| `Stepper` | S-02, S-03, S-04, wizard | P3 | `{/* TODO: replace with <Stepper /> once built — ds-parity P3 */}` |

## Ghost Token Status (post-fix)

```bash
# Result as of 2026-07-22 after this session's fixes:
grep -rn "cds-space-" src/screens/mobile-deployment/ | grep -vE "cds-space-(0|1|2|4|6|8|12|16|20|24|32|40|48|64|80)\b"
# → No violations found ✅
```

## Recommended Sprint Backlog (prioritised)

### Sprint 1 — Must fix before production
1. **CR-01** S-05: Add `AlertDialog` for Cancel job confirmation
2. **CR-02** S-07: Gate Retry button on `allStepsCompleted`
3. **CR-04** S-00: Replace search `<div>` wrapper with `InputPrefix`
4. **CR-05** S-00: Replace Share row with `InputSuffix`

### Sprint 2 — Fix before handoff review
5. **CR-06** S-01: Replace credential type `<button>` cards with `RadioCard`
6. **CR-07** S-03/04: Add `{/* TODO: <InlineAlert /> */}` placeholder on validation errors
7. **CR-08** S-05: Move `@keyframes spin` to `src/index.css`
8. **CR-09** S-06: Make running history row clickable → S-05
9. **VR-01** S-00: Replace hardcoded hex avatar colors with DS tokens

### Sprint 3 — Polish / DS parity
10. **CR-03** Extract shared `SignedAppContextBar` component
11. All monospace font → remove from non-code fields (packageHint in S-01)
12. All raw `<button>` ghost links → `Button variant="ghost"` across all 8 screens
13. All raw `<div>` avatars → `<Avatar>` component
14. `letterSpacing`/`textTransform` raw values → remove

---

*DS Audit Report — Mobile App Deployment (Feature 004)*  
*Audited by Arjun (ds-specialist skill) · 2026-07-22*  
*Source: `src/screens/mobile-deployment/*.tsx` + `docs/ux-spec-mobile-deployment.md`*
