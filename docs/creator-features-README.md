# creator-features

> AI-powered feature hub for the **Creator** product.
> PMs write PRDs here. AI agents generate screens from them using the Creator Design System.

---

## How it works

```
PM writes PRD (GitHub Issue)
        │
        ▼
AI reads AGENTS.md + components/ + templates/
        │
        ▼
AI generates screen files → features/<slug>/screens/
        │
        ▼
PM reviews → moves Issue to "Done"
```

Component source files (`components/`, `templates/`, `AGENTS.md`) are **automatically synced**
from [`creator-ds`](https://github.com/rajendra-prasad-2476/creator-ds) on every merge to main.
Never edit them directly here.

---

## Repo structure

```
creator-features/
├── components/ui/       ← Auto-synced DS components (read-only)
├── templates/           ← Auto-synced page templates (read-only)
├── lib/                 ← Auto-synced utilities (read-only)
├── AGENTS.md            ← Auto-synced AI instructions (read-only)
├── features/
│   ├── 001-feature-name/
│   │   ├── PRD.md           ← or linked GitHub Issue
│   │   ├── screens/         ← AI-generated screen files
│   │   └── feedback.md      ← Review notes
│   └── 002-another-feature/
└── README.md            ← This file
```

---

## Creating a new feature

1. Open a **New Issue** → choose the **PRD** template
2. Fill in the User Story, Screens Required, Data Fields, and Business Rules
3. Move the Issue card to **"Ready for UI Generation"** on the [Projects board](../../projects)
4. Open the repo in Copilot, Cursor, or Claude and run:
   > *"Generate the [screen name] screen for feature #[issue number] based on the PRD"*
5. The AI will read `AGENTS.md` and generate files into `features/<slug>/screens/`
6. Review the output, then move the Issue to **"Done"**

---

## GitHub Projects board columns

| Column | Meaning |
|---|---|
| Brainstorm | Idea captured, PRD not started |
| PRD In Progress | PM is writing the PRD |
| Ready for UI Generation | PRD complete, screens not yet generated |
| Screens Generated | AI has produced screen files |
| Done | Reviewed and approved |

---

## Rules for AI agents

See **[AGENTS.md](./AGENTS.md)** — the authoritative rulebook for every AI platform.

Key rules:
- Only use components from `components/ui/` — never generate raw HTML/CSS
- Start every screen from the closest matching template in `templates/`
- Font is always `'Zoho Puvi'` — never Inter, Roboto, or system-ui
- All colors use `--cds-*` tokens — never hardcode hex values
- Every full-page screen must include `TopBar` + `LeftNav`

---

## Sync workflow

Components are kept in sync automatically via GitHub Actions in `creator-ds-react`.

| What | From | To |
|---|---|---|
| `components/ui/` | `creator-ds-react/src/components/ui/` | `creator-features/components/ui/` |
| `templates/` | `creator-ds-react/src/templates/` | `creator-features/templates/` |
| `lib/` | `creator-ds-react/src/lib/` | `creator-features/lib/` |
| `AGENTS.md` | `creator-ds-react/AGENTS.md` | `creator-features/AGENTS.md` |

Every sync opens a PR in this repo for team review before merging.

---

## Access

| Role | Permission |
|---|---|
| Engineer | Write |
| Designer | Read + Comment |
| PM | Write (features/ only) |
| Stakeholder | Read |
