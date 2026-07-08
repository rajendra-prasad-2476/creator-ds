# creator-ds — Creator Design System

> Single source of truth for all UI components, page templates, and AI screen generation rules for the **Creator** product.

---

## What is this repo?

```
creator-ds/                  ← YOU ARE HERE
├── src/components/ui/       ← 34+ DS components (source of truth)
├── src/templates/           ← 6 page-level templates
├── src/screens/             ← AI-generated feature screens (iteration workspace)
├── src/screens/feature-registry.tsx  ← register every new screen here
├── src/screens/navigation.tsx        ← prototype navigation context
├── AGENTS.md                ← AI coding rules (synced to creator-features)
└── docs/                    ← architecture, parity tracker, this guide

creator-features/            ← SEPARATE REPO
├── components/ui/           ← auto-synced from creator-ds
├── templates/               ← auto-synced from creator-ds
├── features/                ← approved screens live here permanently
└── AGENTS.md                ← auto-synced from creator-ds
```

---

## Quick start (all roles)

```bash
git clone https://github.com/rajendra-prasad-2476/creator-ds.git
cd creator-ds
npm install
npm run dev -- --port 5177
```

Open in browser:

| URL | What it shows | For |
|---|---|---|
| `localhost:5177/` | DS Component Showcase | Engineers & Designers |
| `localhost:5177/features.html` | Feature Dashboard | PMs |
| `localhost:5177/preview.html?feature=001&screen=operations` | Full-screen prototype | Anyone |

---

## VS Code setup

Install these extensions:
- **GitHub Copilot** — required for AI screen generation
- **GitHub Copilot Chat** — where PMs describe features and get screens

> `AGENTS.md` in the repo root is automatically picked up by Copilot as context.
> It tells the AI which components to use, which tokens to apply, and how to wire navigation.
> **You do not need to brief Copilot manually** — just share the PRD.

---

## Engineer / Designer workflow

### Update or add a DS component

1. Edit or create a file in `src/components/ui/`
2. Add a demo to the relevant section showcase (`src/sections/AtomsSection.tsx`, `MoleculesSection.tsx`, or `OrganismsSection.tsx`)
3. Update `docs/ds-parity.csv` — set status to `Done`
4. Update the component table in `AGENTS.md` Section 2
5. Push to `main` → GitHub Actions auto-syncs to `creator-features`

### Add a page template

1. Create `src/templates/<TemplateName>Template.tsx`
2. Add it to `src/sections/TemplatesSection.tsx`
3. Document it in `AGENTS.md` Section 6 (Available Templates)
4. Push to `main` → auto-syncs to `creator-features`

---

## PM workflow — create a feature, preview it, push it

### Step 1 — Describe your PRD to Copilot

Open **Copilot Chat** in VS Code (the chat panel, not inline suggestions) and say:

```
Generate screens for this PRD.
Feature slug: leave-management
PRD number: #002
Owner: priya.sharma

[paste your full PRD here]
```

Copilot will:
- Generate screen files in `src/screens/leave-management/`
- Register them in `src/screens/feature-registry.tsx` with your name and status `draft`

### Step 2 — Preview your screens

Open `http://localhost:5177/features.html` in your browser.

Find your feature card → expand it → click **Preview** next to a screen.

A new tab opens with the full screen rendered — `TopBar`, `LeftNav`, all click actions working. Navigate through the complete user flow.

### Step 3 — Iterate

Not happy with something? Tell Copilot Chat:

```
In LeaveRequestFormScreen, add a date range picker placeholder
and an approval flow section below the form.
```

Copilot edits the screen file. Refresh your preview tab.

Repeat until you and the designer are satisfied.

### Step 4 — Mark as approved and push

When both **Designer and PM** have signed off:

1. Update `status` in `src/screens/feature-registry.tsx` from `"draft"` to `"approved"`
2. On `localhost:5177/features.html` → expand your feature → click **Push**
3. The side panel shows a bash script — click **Copy Script**
4. Open the VS Code terminal and paste + run the script

The script copies your screens to `creator-features/features/<slug>/screens/` and commits them. The whole team can now `git pull` in `creator-features` to see your approved screens.

---

## Navigation between screens

Use `useNavigation()` — never `href` or `window.location`.

```tsx
import { useNavigation } from "@/screens/navigation"

export default function MyScreen() {
  const { navigate, goBack, canGoBack, params } = useNavigation()

  // Go to another screen
  navigate("target-screen-id", { someParam: "value" })

  // Go back (use in breadcrumbs)
  if (canGoBack) goBack()
}
```

In `LinkCategoryTemplate` entries (Operations-style pages):
```tsx
{ label: "My Feature", onClick: () => navigate("my-screen-id") }
```

---

## Registering a new screen (mandatory)

Every screen must be registered in `src/screens/feature-registry.tsx` or it won't appear in the Feature Dashboard.

```tsx
import MyScreen from "@/screens/my-feature/MyScreen"

export const FEATURE_REGISTRY: FeatureEntry[] = [
  {
    id: "002",
    name: "My Feature",
    prdRef: "#002",
    version: "v1.0",
    status: "draft",           // draft → in-review → approved → pushed
    owner: "priya.sharma",     // your login name
    lastUpdated: "2026-07-09",
    screens: [
      {
        id: "my-screen",
        name: "My Screen",
        factory: () => <MyScreen />,
        sourcePath: "src/screens/my-feature/MyScreen.tsx",
        destPath: "features/002-my-feature/screens/MyScreen.tsx",
      },
    ],
    versionHistory: [],
  },
]
```

---

## Design tokens (always use these, never hardcode)

```css
/* Colors */
var(--cds-primary-surface-default)   /* blue #0D4EF2  */
var(--cds-huegrey-text-dark)         /* body text     */
var(--cds-huegrey-text-default)      /* muted text    */
var(--cds-success-surface-default)   /* green #078841 */
var(--cds-error-surface-default)     /* red #CC1914   */
var(--border)                         /* border grey   */

/* Spacing */
var(--cds-space-4)   /* 4px  */
var(--cds-space-8)   /* 8px  */
var(--cds-space-12)  /* 12px */
var(--cds-space-16)  /* 16px */
var(--cds-space-24)  /* 24px */

/* Radius */
var(--cds-radius-r)    /* 6px — default */
var(--cds-radius-full) /* pill          */
```

Full token reference → `AGENTS.md` Section 5.

---

## Key files

| File | Purpose |
|---|---|
| `AGENTS.md` | Full AI coding rules — read this before generating anything |
| `docs/ds-parity.csv` | Missing components tracker — Designer owns this |
| `docs/system-architecture.md` | Full architecture and roadmap |
| `src/screens/feature-registry.tsx` | Register every new screen here |
| `src/screens/navigation.tsx` | Prototype navigation context |

---

## Related repos

| Repo | URL | Purpose |
|---|---|---|
| creator-ds | https://github.com/rajendra-prasad-2476/creator-ds | This repo |
| creator-features | https://github.com/rajendra-prasad-2476/creator-features | Approved feature screens |
