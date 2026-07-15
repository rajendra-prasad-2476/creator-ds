# PRD Template — Zoho Creator Feature

> Copy this template for every new feature. Fill all sections before handing off to engineering.
> Sections marked **[REQUIRED]** must be completed. Sections marked **[OPTIONAL]** can be deferred.
> Delete this instruction block before sharing.

---

## Feature Header

| Field | Value |
|---|---|
| **Feature Name** | _(e.g. "Demo Users in Environments")_ |
| **Feature ID** | _(e.g. #003)_ |
| **Product Area** | _(e.g. Creator 6 — Developer Console)_ |
| **Phase** | Phase 1 / Phase 2 / Phase N |
| **DCs** | All DCs / Specific DC |
| **Owner (PM)** | _(name)_ |
| **Design Owner** | _(name)_ |
| **Eng Lead** | _(name)_ |
| **Last Updated** | YYYY-MM-DD |
| **Status** | Draft / In Review / Approved / Shipped |

---

## 1. Objective [REQUIRED]

> One paragraph. What user problem does this solve? What business outcome does it drive?
> Be specific — avoid "improve UX" or "increase efficiency" without context.

---

## 2. Scope [REQUIRED]

### In scope
- _(bullet list of what IS included in this phase)_

### Out of scope
- _(bullet list of what is NOT included — deferred to Phase 2 or explicitly excluded)_

### Environments / DCs
- Applicable for: Creator 6 (C6)
- DCs: All / _(list specific DCs)_
- Environments: Dev only / Dev + Stage / All

---

## 3. User Roles & Permissions [REQUIRED]

List every role that interacts with this feature and what they can do.

| Action | Admin | Developer | Portal User | Notes |
|---|---|---|---|---|
| _(action)_ | ✓ | — | — | _(any conditions)_ |
| _(action)_ | ✓ | ✓ | — | _(any conditions)_ |

---

## 4. Functional Requirements [REQUIRED]

### FR-1: _(Sub-feature name)_

**Description:** _(What does this sub-feature do?)_

**Rules:**
- _(Rule 1)_
- _(Rule 2)_

**Inputs:**
| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| _(field)_ | Text / Select / Toggle | Yes / No | _(rule)_ | _(note)_ |

**Outputs / Results:**
- _(What happens after the action succeeds?)_

**Error states:**
| Condition | Message shown to user |
|---|---|
| _(e.g. duplicate email)_ | "This email already exists." |
| _(e.g. required field empty)_ | "X is required." |

---

### FR-2: _(Sub-feature name)_

_(repeat block above for each functional area)_

---

## 5. Data Model [REQUIRED for data-heavy features]

### Entity: _(Name)_

| Field | Type | Editable | Description |
|---|---|---|---|
| `id` | string | Never | System-generated unique ID |
| `email` | string | Never | Locked after creation |
| `displayName` | string | Yes — Admin | Shown in View As, propagates to all assignments |
| _(field)_ | _(type)_ | _(when)_ | _(description)_ |

### Capacity limits
- _(e.g. Max 50 per org: 40 User + 10 Portal User)_
- _(e.g. Same identity reusable across multiple apps)_

---

## 6. Screen Inventory [REQUIRED]

List every screen/modal/sheet/dialog that needs to be built. This maps directly to what engineering implements.

| Screen ID | Name | Type | Entry Point | Description |
|---|---|---|---|---|
| `S1` | _(e.g. Org Pool List)_ | Full page | _(menu path)_ | _(what it shows)_ |
| `S2` | _(e.g. Add Manually)_ | Slide-in Sheet | CTA on S1 | _(what it does)_ |
| `S3` | _(e.g. AI Generate)_ | Dialog | CTA on S1 | _(what it does)_ |
| `S4` | _(e.g. Edit User)_ | Slide-in Sheet | Row action on S1 | _(what it does)_ |
| `S5` | _(e.g. Deactivate Confirm)_ | Alert Dialog | Row action on S1 | _(destructive confirm)_ |

### Navigation flow
```
_(e.g.)_
Manage → Demo Users
  └─ [Org Pool List] S1
       ├─ [Add Manually Sheet] S2
       ├─ [AI Generate Dialog] S3
       ├─ Row action → [Edit Sheet] S4
       ├─ Row action → [App Assignment] S5
       └─ Row action → [Deactivate Confirm] S6
```

---

## 7. Empty States [REQUIRED]

For every list/table in the feature, define the empty state.

| Screen | Empty condition | Heading | Subtext | CTA |
|---|---|---|---|---|
| _(S1 table)_ | No records exist | "No demo users yet" | "Add your first demo user to get started." | "Add Manually" |
| _(S1 table)_ | Search/filter returns nothing | "No results" | "Try adjusting your filters." | "Clear filters" |

---

## 8. Loading & Error States [REQUIRED for API-connected features]

| State | Trigger | UI treatment |
|---|---|---|
| Loading list | API call in progress | Show skeleton rows (3–5 rows) |
| Submit loading | Form submit API call | Disable submit button + show spinner label |
| API error on submit | Network/server error | Show inline error banner: "Something went wrong. Try again." |
| Partial save failure | _(e.g. AI generate partial fail)_ | Retry only. No partial save. |

---

## 9. Copy (Labels, Messages, CTA text) [OPTIONAL but recommended]

| Element | Copy |
|---|---|
| Page title | _(e.g. "Demo Users")_ |
| Page subtitle | _(e.g. "Org-level identity pool. Assign demo personas to apps in Dev or Stage environments.")_ |
| Primary CTA | _(e.g. "Add Manually")_ |
| Sheet title | _(e.g. "Add Demo User")_ |
| Sheet subtitle | _(e.g. "Creates a new identity in the org pool. Email is locked after creation.")_ |
| Confirm button | _(e.g. "Add to Pool")_ |
| Destructive confirm | _(e.g. "Yes, Deactivate")_ |
| Cancel/back label | _(e.g. "No, Keep Active")_ |
| Success toast | _(e.g. "{name} added to the org pool.")_ |

---

## 10. DS Component Hints [OPTIONAL — helps engineering pick the right component]

List components that are expected to be used. This prevents misuse (e.g. using Dialog for a Sheet use-case).

| UI element | DS component | Notes |
|---|---|---|
| Slide-in form panel | `Sheet` | Not `Dialog` |
| Destructive confirmation | `AlertDialog` | Not `Dialog` or `window.confirm` |
| Type selection (card-style) | `RadioCard` in `RadioGroup` | Not a raw `<div>` card |
| Email with domain suffix | `InputSuffix` | `suffixLabel={domain}` |
| Status message / warning | `Notes` variant=warning | Not a raw `<div>` |
| Search box with icon | `InputPrefix` with `prefixIcon` | Not a raw `<div>` + absolute icon |
| Environment switcher (Dev/Stage) | `ContentSwitcher` | Not `Tabs` |
| Row actions (edit, delete) | `DropdownMenu` | Not bare `<button>` elements |
| Progress / capacity bar | `Progress` | Not a raw `<div>` height bar |
| Capacity stat card | `Card` + `CardContent` | Not a raw `<div>` |

---

## 11. Open Questions [REQUIRED — resolve before dev starts]

| # | Question | Owner | Status | Resolution |
|---|---|---|---|---|
| 1 | _(e.g. What is the max username length?)_ | PM / EM | Open | — |
| 2 | _(e.g. Does deactivate cascade to Stage assignments?)_ | EM | Open | — |

---

## 12. Phase 2 / Deferred [OPTIONAL]

Items explicitly deferred to a future phase. Do not implement in Phase 1.

- _(e.g. Export/Import for on-prem deployments)_
- _(e.g. Cross-app pool visibility for Super Admin)_
- _(e.g. Region/Locale selector in AI Generate)_

---

## 13. Version History

| Version | Date | Summary of changes |
|---|---|---|
| v0.1 | YYYY-MM-DD | Initial draft |
| v0.2 | YYYY-MM-DD | Added data model, screen inventory |
| v1.0 | YYYY-MM-DD | Approved by design + eng lead |

---

_Template version: 1.0 · Creator DS · Maintained by the DS team_
