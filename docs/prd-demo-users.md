# PRD — Demo Users in Environments

> Generated from: `Demo User Requirement Document.docx`
> Template version: 1.0 · Creator DS

---

## Feature Header

| Field | Value |
|---|---|
| **Feature Name** | Demo Users in Environments |
| **Feature ID** | #003 |
| **Product Area** | Creator 6 — Developer Console |
| **Phase** | Phase 1 |
| **DCs** | All DCs |
| **Owner (PM)** | _(to be filled)_ |
| **Design Owner** | _(to be filled)_ |
| **Eng Lead** | _(to be filled)_ |
| **Last Updated** | 2026-07-15 |
| **Status** | Draft |

---

## 1. Objective [REQUIRED]

Enable admins and developers to test Creator apps as realistic demo personas in Dev and Stage environments — without requiring real user accounts. This feature addresses customer-reported issues in the existing demo user flow, introduces org-level identity management with display name support, increases the demo user pool capacity (from 5 to 50), and adds AI-assisted generation of personas. The goal is to allow teams to simulate production live-mode experiences for both shared and portal users accurately, without impacting real data or real users.

---

## 2. Scope [REQUIRED]

### In scope
- Org-level demo user identity pool (max 50: 40 User + 10 Portal User)
- Manual Add flow — admin creates demo user by entering email local part
- AI Generate flow — admin triggers AI to generate a batch of demo users
- App Assignment — assign org pool users to a specific app + environment (Dev or Stage)
- Copy to Stage — promote Dev assignments to Stage
- View As (Live Mode) — persistent switcher in app top bar to switch persona context
- Active / Inactive status management (no hard delete)
- Display name at org level (propagates to all assignments)
- Migration of existing 5-user setups to new pool (first 5 slots)
- Pre-provisioning of 10 users on org creation (5 User + 5 Portal User)

### Out of scope
- Production environments — **excluded**; Dev and Stage only
- Non-environment-enabled apps
- Export / Import for on-prem and installed client deployments (Phase 2)
- Demo users for non-production apps (Phase 2, pending evaluation)
- Portal creation for environment apps (Phase 2)
- Addition of real users in environments (Phase 2)
- Cross-app pool visibility for Super Admin (Phase 2)
- Region / Locale selector in AI Generate (Phase 2)

### Environments / DCs
- Applicable for: Creator 6 (C6)
- DCs: All DCs
- Environments: Dev + Stage (Prod excluded)

---

## 3. User Roles & Permissions [REQUIRED]

| Action | Admin | Developer | Notes |
|---|---|---|---|
| Generate (AI) / Manually add demo user | ✓ | — | Org-level pool management; Admin only |
| Edit display name | ✓ | — | Propagates to all assignments immediately |
| Deactivate / Reactivate | ✓ | — | No hard delete; deactivate removes app assignments (with warning) |
| Assign demo user to app | ✓ | ✓ | Developer can only assign to their own app |
| Remove app assignment | ✓ | ✓ | Identity stays in org pool |
| Copy to Stage | ✓ | ✓ | Overrides existing Stage assignments |
| View cross-app assignments | ✓ | — | Developer sees own app only |

---

## 4. Functional Requirements [REQUIRED]

### FR-1: Demo User Identity & Org Pool

**Description:** A shared pool of demo user identities managed at the org level. Identities are reusable across multiple apps and environments.

**Rules:**
- Max 50 identities per org: 40 of type **User**, 10 of type **Portal User**
- 10 identities are pre-provisioned on org creation using platform-detected locale (5 User + 5 Portal User)
- Email domain is platform-controlled: `@demo.zohocreator.com` for User, `@demoportaluser.zohocreator.com` for Portal User
- Same email local part can exist for both types — domains differ, so they are distinct identities (e.g. `sarah.gh@demo.zohocreator.com` and `sarah.gh@demoportaluser.zohocreator.com`)
- Email is **locked** after creation
- Username is **auto-generated** from the email local part and is locked; not shown in the Add form
- Display name is **editable** by admin at any time; changes propagate to all assignments immediately
- Type (User / Portal User) is **set at creation and cannot be changed**
- Status is **Active** (default) or **Inactive** — no hard delete
- Duplicate check runs against active + inactive pool on every add/generate
- Inactive users are freed from the 50-cap. Reactivating restores availability; app assignments must be manually redone

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| Email local part | Text | Yes | Alphanumeric + `.` + `-`; no `@` | Domain suffix auto-appended |
| Display name | Text | Yes | Free text | Suggested from email local part; editable |
| Type | Select (User / Portal User) | Yes | — | Locked after creation |

**Outputs / Results:**
- New identity appears in org pool table
- Username auto-generated and shown in table after creation
- Pre-provisioned users appear immediately on org creation

**Error states:**
| Condition | Message shown to user |
|---|---|
| Email (local part) already exists in active or inactive pool | "This email already exists in the demo user pool." |
| Pool limit reached (40 User or 10 Portal User) | "You've reached the maximum of [40 User / 10 Portal User] demo users." |
| Required field empty | "[Field name] is required." |

---

### FR-2: Manual Add

**Description:** Admin manually creates a demo user by entering an email local part. Domain suffix is fixed and auto-appended.

**Rules:**
- Admin enters only the email local part (e.g. `sarah.gh`); domain appended automatically
- Username auto-generated; shown in table after creation, not in the add form
- Display name suggested from email local part; editable before and after creation
- Real-time duplicate check — blocks submission if email exists (active or inactive)

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| Email local part | Text | Yes | No `@` character; platform validates format | Domain shown as suffix label |
| Display name | Text | Yes | Free text | Pre-filled from local part |
| Type | Select | Yes | User / Portal User | Locked after creation |

**Outputs / Results:**
- Identity added to org pool, status Active
- Username visible in pool table

**Error states:**
| Condition | Message shown to user |
|---|---|
| Duplicate email in pool | "This email already exists." |
| Pool capacity reached | "You've reached the maximum demo user limit." |

---

### FR-3: AI Generate

**Description:** Admin triggers AI to generate a batch of demo user identities. Preview is shown before confirming.

**Rules:**
- Entry point: Manage → Demo Users → AI Generate
- Inputs: Count, Region/Locale, Type — **optional for Phase 1**, not required
- Preview batch shown before confirming
- Regenerate available before confirm
- Email and username locked on confirm; display name editable after
- Active + inactive pool passed as exclusion list — no duplicates ever generated
- On failure: retry only. No partial save

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| Count | Number | No (Phase 1 optional) | 1–N within remaining capacity | — |
| Region / Locale | Select | No (Phase 1 optional) | — | Deferred inputs |
| Type | Select | No (Phase 1 optional) | User / Portal User | — |

**Outputs / Results:**
- Preview set shown to admin before confirming
- On confirm: identities added to org pool with Active status

**Error states:**
| Condition | Message shown to user |
|---|---|
| Generation fails | "Generation failed. Please try again." (No partial save) |
| Generated email collides with existing pool | Excluded automatically via exclusion list; no user-visible error |

---

### FR-4: App Assignment

**Description:** Assign demo user identities from the org pool to a specific app + environment (Dev or Stage only).

**Rules:**
- Each assignment is app + environment specific
- User (type: shared): requires **role + permission**
- Portal User: requires **permission only** — no role
- Display name is read-only at assignment level (set at org level)
- Same identity can be assigned to multiple apps with different roles/permissions
- Admin has cross-app visibility; Developer sees own app only
- Remove assignment: confirm modal → Remove / Cancel. Identity stays in org pool

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| Demo user (from pool) | Select | Yes | Active only; slots already assigned to this app excluded | — |
| Role | Select | Yes (User type only) | — | Not shown for Portal User |
| Permission | Select | Yes | Filters to portal-configured permissions for Portal User | — |

**Outputs / Results:**
- Demo user assigned to app + environment
- Appears in app's demo user list and View As switcher

**Error states:**
| Condition | Message shown to user |
|---|---|
| Required field empty | "[Field name] is required." |
| Demo user already assigned to this app | Excluded from pool dropdown automatically |

---

### FR-5: Copy to Stage

**Description:** Promote Dev app assignments to Stage in bulk.

**Rules:**
- Entry: Environment Settings → Demo Users tab (Development selected)
- Select users from table → action bar appears → Copy to Stage
- Confirm modal shows selected user summary + override warning
- Overrides existing Stage assignments for selected users; per-app, cannot be undone
- Blocked if app is not yet published to Stage — inline warning shown

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| Selected demo users (checkboxes) | Multi-select | Yes (≥ 1) | — | From Dev assignment table |

**Outputs / Results:**
- Selected users' assignments duplicated to Stage environment
- Existing Stage assignments for selected users overwritten

**Error states:**
| Condition | Message shown to user |
|---|---|
| App not published to Stage | Inline warning: "Publish the app to Stage before copying demo users." |
| No users selected | Copy to Stage action remains disabled |

---

### FR-6: View As (Live / Preview Mode)

**Description:** Persistent persona switcher in the app top bar allowing the developer/admin to view the app as any assigned demo user.

**Rules:**
- Top bar is **always visible** (correction from existing behaviour)
- Switcher groups entries by type: User / Portal User
- Each entry shows: display name, username, role, permission
- Search/filter available in the switcher
- **Myself** is always present; only Myself has edit access
- Switching re-renders app with demo user's role + permission context — no full page reload
- Demo user view is **read-only** — edit attempts show permission-denied state, not a crash or redirect

**Outputs / Results:**
- App renders in the context of the selected demo user
- UI clearly indicates the active persona

---

### FR-7: Active / Inactive Management

**Description:** Admins can deactivate demo users instead of deleting them to preserve record traceability.

**Rules:**
- Active (default): available for assignment and View As
- Inactive: hidden from developers; app assignments removed (admin informed before confirming deactivation)
- No hard delete — records preserved; consistent with IAM behaviour for real users
- Reactivate makes user available again; app assignments must be manually redone
- Freed from 50-cap when inactive

**Error states:**
| Condition | Message shown to user |
|---|---|
| Deactivating a user with active app assignments | Warning modal listing affected apps before confirm |

---

## 5. Data Model [REQUIRED]

### Entity: Demo User (Org Pool)

| Field | Type | Editable | Description |
|---|---|---|---|
| `id` | string | Never | System-generated unique ID |
| `email` | string | Never | Full email; locked after creation (`local@domain`) |
| `emailLocalPart` | string | Never | The part admin entered (e.g. `sarah.gh`) |
| `username` | string | Never | Auto-generated from email local part |
| `displayName` | string | Yes — Admin anytime | Org-level display name; propagates to all assignments |
| `type` | enum: `User` \| `PortalUser` | Never | Set at creation |
| `status` | enum: `Active` \| `Inactive` | Yes — Admin | Active = available; Inactive = hidden from devs |
| `createdAt` | timestamp | Never | — |
| `createdBy` | string | Never | Admin who created the record |

### Entity: App Assignment (Casting)

| Field | Type | Editable | Description |
|---|---|---|---|
| `id` | string | Never | System-generated |
| `orgUserId` | ref → Demo User | Never | Links to org pool identity |
| `appId` | string | Never | Target app |
| `environment` | enum: `Dev` \| `Stage` | Never | Set at assignment; cannot be changed |
| `role` | string | Yes | Only for type `User`; not applicable for `PortalUser` |
| `permission` | string | Yes | Required for both types |
| `displayName` | string | Read from org | Inherited from org-level; read-only at casting level |

### Identity Behaviour Notes

**User (Shared):**
- Account-level identity. Same username permanent.
- Records preserved across deactivate/reactivate.
- Re-assigning same role + permission restores record visibility (consistent with production).
- Display name is app-specific at casting level.

**Portal User:**
- App-level identity. Auto-generated username per addition.
- Permission only — no role. No invite flow. Active immediately. No Pending state.
- Deactivate/reactivate preserves records under same username.
- Delete and re-add generates a new username (no record bleed) — same as production.

### Capacity Limits
- Max 50 per org: **40 User + 10 Portal User**
- 10 pre-provisioned on org creation: 5 User + 5 Portal User
- Same identity reusable across multiple apps and both environments
- Inactive users are freed from the 50-cap

---

## Creator Parity Check [REQUIRED — run before screen generation]

> Queried via `http://zcem-u24-vm37:8001/api/ask` · `llm_provider: internal` · `product: creator`
> Date: 2026-07-16

| # | Feature area | Question asked | API result | Status | Notes |
|---|---|---|---|---|---|
| 1 | Demo / test users | "Does Zoho Creator support demo users or test users in environments?" | Empty answer | **Gap** | Fully new feature — no existing demo user pool concept in Creator help docs |
| 2 | Portal users | "Can you add portal users to a Zoho Creator app and assign them permissions?" | Full answer + 3 sources | **Exists** | Sources: *Manage And Configure Portal Users*, *Manage And Configure Permissions*, *Add Permission In Portal*. The PRD extends this existing flow — screens must build on the established portal user UX pattern, not replace it |
| 3 | Dev / Stage environments | "What are Creator environments and how do Dev and Stage environments work?" | Empty answer + 4 doc sources | **Partially exists** | Sources: *Understand Environments*, *Manage Development Environment*, *Manage Stage Environment*, *Environments*. The Environments concept exists but demo-user assignment to environments is new — design only the demo-user assignment layer, not the environment concept itself |
| 4 | View As / persona switcher | "Does Zoho Creator have an environment switcher or View As feature to preview an app as a different user or role?" | Empty answer | **Gap** | Fully new — the API returned no answer. View As persona switcher (S11) must be designed from scratch |

### Parity interpretation for screen generation

- **Portal user management (FR-4 App Assignment, FR-5 Copy to Stage):** Creator already has a portal user flow. The App Assignment screens (S7–S10) should feel like a natural **extension** of the existing Settings → Portal Users flow — reuse familiar UX patterns (same table structure, same role/permission selector patterns).
- **Environments (FR-5, FR-6):** Creator already has Dev/Stage environments. Do **not** redesign the environments concept — only design the demo-user assignment tab within the existing Environment Settings sheet.
- **Demo user pool (FR-1, FR-2, FR-3):** Fully new. Design the Org Pool screens (S1–S6) from scratch.
- **View As (FR-6, S11):** Fully new. Design from scratch, integrated into the app top bar.

---

## 6. Screen Inventory [REQUIRED]

| Screen ID | Name | Type | Entry Point | Description |
|---|---|---|---|---|
| `S1` | Org Pool List | Full page | Manage → Demo Users | Lists all demo users in the org pool with status, type, display name, username. Admin actions: Add Manually, AI Generate, Deactivate/Reactivate. |
| `S2` | Add Manually | Slide-in Sheet | "Add Manually" CTA on S1 | Admin enters email local part, display name, type. Duplicate check real-time. |
| `S3` | AI Generate | Dialog | "AI Generate" CTA on S1 | Admin configures count/locale/type → preview → confirm. Regenerate available before confirm. |
| `S4` | Edit Demo User | Slide-in Sheet | Row action on S1 | Edit display name only (email/username/type locked). |
| `S5` | Deactivate Confirm | Alert Dialog | Row action on S1 | Warns about affected app assignments. Yes, Deactivate / No, Keep Active. |
| `S6` | Reactivate Confirm | Alert Dialog | Row action on S1 | Confirms reactivation. User must manually redo app assignments. |
| `S7` | App Assignment List | Full page / Tab | Environment Settings → Demo Users | Lists demo users assigned to a specific app + environment. Add / Remove assignment. |
| `S8` | Add Assignment | Slide-in Sheet | "Add Demo User" CTA on S7 | Select from org pool, assign role (User only) + permission. |
| `S9` | Remove Assignment Confirm | Alert Dialog | Row action on S7 | Confirms removal. "Remove / Cancel." Identity stays in org. |
| `S10` | Copy to Stage | Dialog | Action bar on S7 (Dev selected) | Shows selected user summary + override warning. Confirms copy. Blocked if app not published to Stage. |
| `S11` | View As Switcher | Inline (Top Bar) | App live/preview mode top bar | Persistent switcher grouped by User / Portal User. Search/filter. Myself always present. |

### Navigation Flow
```
Manage → Demo Users
  └─ [Org Pool List] S1
       ├─ [Add Manually Sheet] S2
       ├─ [AI Generate Dialog] S3
       ├─ Row action → [Edit Sheet] S4
       ├─ Row action → [Deactivate Confirm] S5
       └─ Row action → [Reactivate Confirm] S6

Environment Settings → Demo Users tab
  └─ [App Assignment List] S7
       ├─ [Add Assignment Sheet] S8
       ├─ Row action → [Remove Assignment Confirm] S9
       └─ Select rows → action bar → [Copy to Stage Dialog] S10

App Live / Preview Mode
  └─ Top Bar → [View As Switcher] S11
```

---

## 7. Empty States [REQUIRED]

| Screen | Empty condition | Heading | Subtext | CTA |
|---|---|---|---|---|
| S1 — Org Pool table | No demo users exist (fresh org) | "No demo users yet" | "Add your first demo user to get started." | "Add Manually" |
| S1 — Org Pool table | Search/filter returns nothing | "No results" | "Try adjusting your search or filters." | "Clear filters" |
| S7 — App Assignment table | No users assigned to this app | "No demo users assigned" | "Assign demo personas to test this app as different user types." | "Add Demo User" |
| S7 — App Assignment table | Search/filter returns nothing | "No results" | "Try adjusting your search or filters." | "Clear filters" |
| S11 — View As switcher | Only Myself in switcher | _(No empty state — Myself always shown)_ | — | — |

---

## 8. Loading & Error States [REQUIRED]

| State | Trigger | UI treatment |
|---|---|---|
| Loading pool list | API call in progress | Show skeleton rows (3–5 rows) |
| Loading assignment list | API call in progress | Show skeleton rows (3–5 rows) |
| Submit loading (Add / Edit) | Form submit API call | Disable submit button + show spinner label |
| Submit loading (AI Generate) | AI generation in progress | Disable Confirm + Regenerate; show spinner |
| API error on Add / Edit | Network/server error | Inline error banner: "Something went wrong. Try again." |
| AI Generate failure | AI generation fails | Retry only. No partial save. Toast: "Generation failed. Please try again." |
| Copy to Stage — app not published | App not yet published to Stage | Inline warning in S10 dialog: "Publish the app to Stage before copying demo users." |
| Deactivate — user has active assignments | Admin confirms deactivate | Warning modal lists affected apps before confirm |

---

## 9. Copy (Labels, Messages, CTA text) [OPTIONAL]

| Element | Copy |
|---|---|
| Page title (S1) | "Demo Users" |
| Page subtitle (S1) | "Org-level identity pool. Assign demo personas to apps in Dev or Stage environments." |
| Primary CTA (S1) | "Add Manually" |
| Secondary CTA (S1) | "AI Generate" |
| Sheet title (S2) | "Add Demo User" |
| Sheet subtitle (S2) | "Creates a new identity in the org pool. Email is locked after creation." |
| Email suffix label | `@demo.zohocreator.com` (User) · `@demoportaluser.zohocreator.com` (Portal User) |
| Confirm button (S2) | "Add to Pool" |
| Sheet title (S4) | "Edit Demo User" |
| Confirm button (S4) | "Save Changes" |
| Destructive confirm (S5) | "Yes, Deactivate" |
| Cancel label (S5) | "No, Keep Active" |
| Reactivate confirm (S6) | "Yes, Reactivate" |
| Page title (S7) | "Demo Users — [App Name]" |
| Primary CTA (S7) | "Add Demo User" |
| Action bar CTA (S7) | "Copy to Stage" |
| Remove confirm (S9) | "Remove" |
| Cancel label (S9) | "Cancel" |
| Copy to Stage confirm (S10) | "Copy to Stage" |
| Copy to Stage warning | "This will override existing Stage assignments for the selected users. This cannot be undone." |
| View As switcher label | "View as" |
| Success toast — Add | "{Display Name} added to the org pool." |
| Success toast — Assign | "{Display Name} assigned to {App Name}." |
| Success toast — Copy to Stage | "{N} demo user(s) copied to Stage." |
| Success toast — Deactivate | "{Display Name} has been deactivated." |
| Success toast — Reactivate | "{Display Name} has been reactivated." |

---

## 10. DS Component Hints [OPTIONAL]

| UI element | DS component | Notes |
|---|---|---|
| Add / Edit slide-in panel | `Sheet` | Not `Dialog` |
| Destructive confirmation (Deactivate, Remove, Delete) | `AlertDialog` | Not `Dialog` or `window.confirm()` |
| Email field with domain suffix | `InputSuffix` | `suffixLabel="@demo.zohocreator.com"` |
| Type selection (User / Portal User) | `RadioCard` inside `RadioGroup` | Card-style mutually exclusive choice |
| Dev / Stage environment toggle | `ContentSwitcher` | Not `Tabs` — same data, different view |
| Row actions (Edit, Deactivate, Remove) | `DropdownMenu` | Not bare `<button>` elements |
| Status pill (Active / Inactive) | `Badge` | variant `success` / `secondary` |
| Configured / not configured state | `StatusBadge` | Use DS semantic status pill |
| Search box in pool list | `InputPrefix` with `prefixIcon={<Search />}` | Not absolutely-positioned icon in a `<div>` |
| Override / warning message in Copy to Stage | `Notes` variant=`warning` | Not a raw `<div>` alert |
| Capacity stat (e.g. 12/50 used) | `Card` + `CardContent` + `Progress` | Not a raw `<div>` height bar |
| View As top bar switcher | `Popover` + custom trigger in `TopBar` | Grouped by type; search inside |
| Assignment list table | `Table` | — |
| Scrollable assignment list | `ScrollArea` | — |
| Success feedback | `Sonner` (toast) | Not a raw `<div>` alert banner |
| Scrim behind sheet/dialog | `Blanket` | Rendered automatically by `Sheet`/`Dialog` |

---

## 11. Open Questions [REQUIRED — resolve before dev starts]

| # | Question | Owner | Status | Resolution |
|---|---|---|---|---|
| 1 | Portal username counter format confirmed? (e.g. `demoportal_001`) — global and unique per account, per environment | EM | Open | Pending EM backend research |
| 2 | Plan downgrade behaviour: is demo user data guaranteed to be retained on upgrade? | EM | Open | "Confirmation with EM pending" (noted in doc) |
| 3 | AI Generate inputs (Count / Region / Locale / Type) — are any of these included in Phase 1 or all deferred? | PM | Open | Doc marks them as "optional — not required for Phase 1" |
| 4 | Type change between shared and portal — deferred to Phase 2 or dropped entirely? | PM / EM | Open | Phase 1 doc locks type at creation; old doc listed type change as a Phase 1 item pending EM feasibility |
| 5 | Portal username suffix for deleted users — `demoportal_del_XXX` format confirmed for Phase 1? | EM | Open | Listed in old doc; not explicitly in consolidated Phase 1 requirements |
| 6 | Deactivating a user: are Stage assignments also removed, or only Dev? | EM / PM | Open | — |
| 7 | Is the 50-cap enforced across all DCs or per-DC? | EM | Open | — |
| 8 | Migration: portal username auto-generation migration approach (EM to finalise) | EM | Open | Noted in doc |
| 9 | Sibi evaluation: demo users for non-production apps — timeline for Phase 2 scoping? | PM (@Sibi) | Open | Phase 2 item |
| 10 | Revathi items: portal creation for environment apps, addition of real users in environments | PM (@Revathi) | Open | Phase 2 items |

---

## 12. Phase 2 / Deferred [OPTIONAL]

- Export / Import for on-prem and installed client deployments
- Demo users for non-production apps _(pending @Sibi evaluation)_
- Portal creation for environment apps _(pending @Revathi)_
- Addition of real users in environments _(pending @Revathi)_
- Cross-app pool visibility — Super Admin view showing slot utilisation across all apps
- Region / Locale selector in AI Generate
- Type change (shared ↔ portal) — pending EM feasibility confirmation

---

## 13. Version History

| Version | Date | Summary of changes |
|---|---|---|
| v0.1 | 2026-07-15 | Initial draft generated from `Demo User Requirement Document.docx` |

---

_Template version: 1.0 · Creator DS · Maintained by the DS team_
