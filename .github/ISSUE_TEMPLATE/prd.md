---
name: "📋 PRD — New Feature"
about: "Product Requirements Document for a new feature. AI agents use this to generate screens."
title: "[PRD] "
labels: ["prd", "needs-screens"]
assignees: []
---

## Feature Name
<!-- Short name, e.g. "Leave Management", "CRM Contact List" -->


## Status
<!-- Update as the feature progresses -->
- [ ] Brainstorm
- [ ] PRD In Progress
- [ ] Ready for UI Generation
- [ ] Screens Generated
- [ ] Done

---

## User Story
<!-- As a [role], I want to [action] so that [outcome] -->
As a **[role]**, I want to **[action]** so that **[outcome]**.

---

## Screens Required
<!-- List every screen that needs to be designed/built. Check off as they are generated. -->
- [ ] List view
- [ ] Detail view
- [ ] Create / Edit form
- [ ] Dashboard widget / summary card
<!-- Add more as needed -->

---

## Key Data Fields
<!-- List the fields shown on screen. Note the type: text | number | date | select | boolean -->
| Field | Type | Notes |
|---|---|---|
| | | |
| | | |

---

## Business Rules & Validations
<!-- What the system must enforce. One rule per line. -->
- 
- 

---

## Navigation & Flows
<!-- How does the user reach this screen? What happens after key actions? -->
- Entry point: 
- After creating a record → 
- After deleting a record → 

---

## Component Gaps (if known)
<!-- List any missing DS components needed for this feature. These become ds-parity tracker entries. -->
- [ ] Component name — describe what it needs to do

---

## Figma Reference (if available)
<!-- Paste the Figma link here. Agents will use this as visual reference. -->
Figma: 

---

## Acceptance Criteria
<!-- What does "done" look like for the generated screens? -->
- [ ] All screens listed above are generated
- [ ] Screens use only components from `components/ui/`
- [ ] No hardcoded colors, fonts, or spacing values
- [ ] `TopBar` + `LeftNav` shell present on every full-page screen
- [ ] Reviewed by PM and designer
