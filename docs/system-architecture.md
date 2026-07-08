# Creator DS — System Architecture & Roadmap

**Last updated:** 2026-07-07  
**Status:** Planning

---

## 1. Vision

A two-repo system where:
- **`creator-ds-react`** (this repo) is the single source of truth for all UI components
- **`creator-features`** (new repo) is where PMs write PRDs and AI generates screens
- Any change to a component in `creator-ds-react` automatically syncs into `creator-features`
- Designers, PMs, and engineers all work from the same component set

---

## 2. Repository Structure

```
GitHub Organization
│
├── creator-ds-react/          ← THIS REPO (Component Library)
│   ├── src/components/ui/     ← 34+ components (source of truth)
│   ├── src/templates/         ← Page-level templates
│   ├── src/patterns/          ← Reusable UI patterns
│   ├── docs/
│   │   ├── ds-parity.csv      ← DS parity drift tracker
│   │   └── system-architecture.md  ← This file
│   └── AGENTS.md              ← AI instructions (all platforms)
│
└── creator-features/          ← NEW REPO (Feature & PRD Hub)
    ├── .github/
    │   ├── ISSUE_TEMPLATE/
    │   │   ├── prd.md         ← PRD template for PMs
    │   │   └── screen-request.md
    │   └── workflows/
    │       └── sync-components.yml  ← Auto-sync from creator-ds-react
    ├── components/            ← Auto-synced copy of creator-ds-react/src/components/ui/
    ├── templates/             ← Auto-synced copy of creator-ds-react/src/templates/
    ├── features/
    │   ├── 001-feature-name/
    │   │   ├── PRD.md         ← PM writes this
    │   │   ├── screens/       ← AI-generated output saved here
    │   │   └── feedback.md    ← Review notes
    │   └── 002-another-feature/
    ├── AGENTS.md              ← Synced from creator-ds-react
    └── README.md
```

---

## 3. How Component Sync Works

### The Mechanism: GitHub Actions

When a designer or engineer merges a change into `creator-ds-react` (main branch), a **GitHub Actions workflow** automatically:
1. Copies updated component files into `creator-features/components/`
2. Copies updated templates into `creator-features/templates/`
3. Copies `AGENTS.md` (AI instructions) into `creator-features/`
4. Opens a Pull Request in `creator-features` so the team can review what changed
5. Auto-merges if no conflicts

```
creator-ds-react                    creator-features
      │                                   │
      │  Push to main                     │
      ├──────────────────────────────────►│
      │                                   │
      │  GitHub Actions triggers          │
      │  Copies components/               │
      │  Copies templates/                │  PR opened:
      │  Copies AGENTS.md         ───────►│  "Sync: Updated Button, added Spinner"
      │                                   │
      │                                   │  Auto-merged (or reviewed)
      │                                   │
```

### Workflow File (to be created in `creator-ds-react`)

```yaml
# .github/workflows/sync-to-features.yml
name: Sync Components to creator-features

on:
  push:
    branches: [main]
    paths:
      - 'src/components/ui/**'
      - 'src/templates/**'
      - 'src/patterns/**'
      - 'AGENTS.md'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout creator-ds-react
        uses: actions/checkout@v4

      - name: Sync to creator-features
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.SYNC_TOKEN }}
          repository: your-org/creator-features
          event-type: sync-components
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

> **Token setup:** A GitHub PAT (Personal Access Token) with `repo` scope is stored as a secret called `SYNC_TOKEN` in `creator-ds-react`. One-time setup by an admin.

---

## 4. DS Parity Tracker

File: `docs/ds-parity.csv`

Tracks every component that exists in the Figma DS but is not yet built in the repo. Designers update the **Figma Node ID** column. Engineers update the **Status** column.

```
Component, Category, Status, Figma Node ID, Required By Feature, Priority, Notes
Spinner, Atom, Missing, , All async states, P1, Inline loading indicator
Skeleton, Atom, Missing, , All list/detail views, P1, Content placeholder
InlineAlert, Molecule, Missing, , All form screens, P1, Not a dialog — inline banner
FormField, Molecule, Missing, , All forms, P1, Label + Input + HelperText + Error composed
Pagination, Molecule, Missing, , List views, P1, Page numbers + prev/next
Tag/Chip, Atom, Missing, , Filters + tagging, P2, Dismissible, with icon
StatCard, Molecule, Missing, , Dashboard, P2, Metric + label + trend
DatePicker, Molecule, Missing, , Scheduling features, P2, Calendar + input trigger
Accordion, Molecule, Missing, , Settings pages, P2, Expand/collapse with header
DataTable, Organism, Partial, , All list views, P1, Needs sort, filter, pagination
Stepper, Molecule, Missing, , Onboarding wizard, P3, Multi-step progress
CommandPalette, Organism, Missing, , Global search, P3, ⌘K search
FileUpload, Molecule, Missing, , Document features, P2, Drag-and-drop zone
EmptyState, Atom, Missing, , All list views, P1, Illustration + heading + CTA
```

### Workflow for Designers
1. Open `docs/ds-parity.csv` in GitHub
2. Find the missing component row
3. Design it in Figma
4. Copy the Figma Node ID and paste into the CSV
5. Update status to `Figma Ready`
6. Engineer picks it up → builds it → marks `Done`

### Workflow for Engineers
1. Filter CSV by `Status = Missing` and `Priority = P1`
2. Build component in `src/components/ui/`
3. Add it to the appropriate Section showcase
4. Update CSV status to `Done`
5. Merge to main → auto-syncs to `creator-features`

---

## 5. Feature / PRD Hub (creator-features)

### GitHub Projects Board

Everyone in the org can see this board:

```
┌──────────────┬──────────────────┬────────────────────┬───────────┬──────────┐
│  Brainstorm  │  PRD In Progress │  Ready for UI Gen  │  Screens  │   Done   │
│              │                  │                    │ Generated │          │
├──────────────┼──────────────────┼────────────────────┼───────────┼──────────┤
│ #12 Expense  │ #08 Leave Mgmt   │ #05 Form Builder   │ #03 CRM   │ #01 Auth │
│ Tracker      │                  │                    │ Dashboard │          │
│              │ #11 Reports      │ #07 Approval Flow  │           │ #02 List │
│ #14 Calendar │                  │                    │           │          │
└──────────────┴──────────────────┴────────────────────┴───────────┴──────────┘
```

Each card is a GitHub Issue. PMs move cards across columns as features progress.

### PRD Issue Template

When a PM creates a new feature Issue, they fill in:

```markdown
## Feature Name
[Name]

## User Story
As a [role], I want to [action] so that [outcome].

## Screens Required
- [ ] List view
- [ ] Detail view
- [ ] Create/Edit form
- [ ] Dashboard widget

## Key Data Fields
- Field 1 (type: text / number / date / select)
- Field 2

## Business Rules / Validations
- Rule 1
- Rule 2

## Missing Components (if known)
- [ ] Component name — describe what it should do

## Figma Reference (if available)
[Figma link]
```

### How a PM Generates Screens
1. Open `creator-features` repo in any AI tool (Copilot, Cursor, Claude, etc.)
2. The AI reads `AGENTS.md` → knows to use only the synced components
3. PM says: *"Generate the list view for feature #05 Form Builder based on PRD.md"*
4. AI generates screens using only components from `creator-features/components/`
5. Output saved to `features/005-form-builder/screens/`
6. PM reviews, moves card to "Screens Generated" on the board

---

## 6. AGENTS.md — AI Instructions File

This file is the rulebook for every AI platform. It lives in both repos (synced).

Key rules it will contain:
- **Only use components from `components/ui/`** — never generate raw HTML/CSS
- **Font is always `'Zoho Puvi'`** — never Inter, Roboto, or system-ui
- **Use CDS tokens** (`--cds-*`) for colors, spacing, and radius — never hardcode hex values
- **Page structure**: always compose `TopBar` + `LeftNav` + page content
- **Which component for which use case** (e.g. "use `InlineAlert` for form errors, not a custom div")
- **Naming conventions** for generated screen files

---

## 7. Rollout Plan

### Phase 1 — Foundation (This Week)
- [ ] Fix all 34 existing components (tomorrow's audit)
- [ ] Write `AGENTS.md` in this repo
- [ ] Create `docs/ds-parity.csv` with all missing components

### Phase 2 — Missing Components (Week 2–3)
- [ ] Build P1 Atoms: `Spinner`, `Skeleton`, `EmptyState`
- [ ] Build P1 Molecules: `InlineAlert`, `FormField`, `Pagination`
- [ ] Enhance `DataTable` organism (sort, filter, pagination)
- [ ] Build 3 Templates: `ListPage`, `DetailPage`, `FormPage`

### Phase 3 — New Repo Setup (Week 2)
- [ ] Create `creator-features` GitHub repo
- [ ] Set up GitHub Projects board with columns
- [ ] Create PRD Issue template
- [ ] Set up GitHub Actions sync workflow
- [ ] Test end-to-end sync: push a component change → verify it appears in `creator-features`

### Phase 4 — First PRD Test (Week 3–4)
- [ ] Pick one real PM PRD
- [ ] Run it through the AI generation workflow
- [ ] Log every component gap found
- [ ] Update `ds-parity.csv` with findings
- [ ] Refine `AGENTS.md` based on what the AI got wrong

### Phase 5 — Scale (Month 2)
- [ ] Onboard all PMs to `creator-features` repo
- [ ] Train PMs on PRD template format
- [ ] Build remaining P2 components from ds-parity tracker
- [ ] Monthly DS parity review meeting: designer + engineer + PM

---

## 8. Access Control

| Role | creator-ds-react | creator-features |
|---|---|---|
| Engineer | Write | Write |
| Designer | Write (components) | Read + Comment |
| PM | Read | Write (features only) |
| Stakeholder | Read | Read |

---

## 9. Open Questions / Decisions Needed

- [x] **GitHub Org name** — `rajendra-prasad-2476` · repos: `creator-ds` and `creator-features`
- [ ] **Who sets up the sync token?** — needs admin access to both repos
- [ ] **PRD format** — free-form text first, structured template later (agreed)
- [x] **Who owns `ds-parity.csv`** — Designer lead
- [x] **Review process for AI-generated screens** — Designer + PM must both approve before moving to "Done"
