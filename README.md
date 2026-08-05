# creator-ds-react — Creator Design System

> The official React component library and AI screen-generation system for the **Zoho Creator** product.
> Single source of truth for DS components, page templates, design tokens, and AI coding rules.

[![version](https://img.shields.io/badge/version-1.16.0-blue)](https://github.com/rajendra-prasad-2476/creator-ds/packages)
[![registry](https://img.shields.io/badge/registry-GitHub%20Packages-black)](https://npm.pkg.github.com)

---

## Install (for consuming projects)

### 1. Authenticate with GitHub Packages

Generate a [Classic PAT](https://github.com/settings/tokens) with `read:packages` scope, then add to your shell:

```bash
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.zshrc
source ~/.zshrc
```

### 2. Add `.npmrc` to your project root

```ini
@rajendra-prasad-2476:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. Install the package

```bash
npm install @rajendra-prasad-2476/creator-ds-react
```

### 4. Import styles in your app entry point

```tsx
// main.tsx or App.tsx
import "@rajendra-prasad-2476/creator-ds-react/styles"
```

### 5. Use components

```tsx
import { Button, Badge, Card, CardContent } from "@rajendra-prasad-2476/creator-ds-react"

export default function DemoUserCard() {
  return (
    <Card>
      <CardContent className="flex items-center gap-[var(--cds-gap-default)]">
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <span className="text-[length:var(--cds-text-p2)] font-semibold text-[color:var(--cds-huegrey-text-dark)]">
            john.demo@example.com
          </span>
          <Badge variant="success">Active</Badge>
        </div>
        <Button variant="outline" size="sm">View As</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Real-world example — Demo Users in Environments (PRD #003)

This screen was generated from a PRD using the DS component library. It shows the org-level demo user pool with AI-generated personas, assignment to environments, and the **View As** persona switcher — all built entirely from DS components.

```tsx
import {
  Button, Badge, Avatar, AvatarFallback,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  Switch, Label,
} from "@rajendra-prasad-2476/creator-ds-react"
import { MoreHorizontal, Sparkles } from "lucide-react"

const demoUsers = [
  { id: 1, email: "alex.morgan@demopool", name: "Alex Morgan", type: "User",        status: "active",   env: "Dev"   },
  { id: 2, email: "priya.shah@demopool",  name: "Priya Shah",  type: "Portal User", status: "active",   env: "Stage" },
  { id: 3, email: "tom.chen@demopool",    name: "Tom Chen",    type: "User",        status: "inactive", env: "Dev"   },
]

export default function DemoUserPoolScreen() {
  return (
    <div className="flex flex-col gap-[var(--cds-gap-default)] p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[var(--cds-gap-tight)]">
          <h2 className="text-[length:var(--cds-text-h3)] font-semibold text-[color:var(--cds-huegrey-text-dark)]">
            Demo User Pool
          </h2>
          <p className="text-[length:var(--cds-text-p2)] text-[color:var(--cds-huegrey-text-default)]">
            3 / 50 slots used · Dev &amp; Stage only
          </p>
        </div>
        <div className="flex items-center gap-[var(--cds-gap-small)]">
          <Button variant="outline">+ Add manually</Button>
          <Button>
            <Sparkles size={14} className="mr-[var(--cds-space-4)]" />
            AI Generate
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoUsers.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[length:var(--cds-text-p2)] font-medium text-[color:var(--cds-huegrey-text-dark)]">
                      {u.name}
                    </span>
                    <span className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">
                      {u.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={u.type === "Portal User" ? "secondary" : "outline"}>
                  {u.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{u.env}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-[var(--cds-gap-tight)]">
                  <Switch
                    id={`status-${u.id}`}
                    defaultChecked={u.status === "active"}
                  />
                  <Label htmlFor={`status-${u.id}`} className="text-[length:var(--cds-text-p3)]">
                    {u.status === "active" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View As</DropdownMenuItem>
                    <DropdownMenuItem>Edit display name</DropdownMenuItem>
                    <DropdownMenuItem>Copy to Stage</DropdownMenuItem>
                    <DropdownMenuItem className="text-[color:var(--cds-error-surface-default)]">
                      Deactivate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

> This is one of 4 screens in PRD #003 — Demo Users in Environments. Full screens are in `src/screens/demo-users/`.

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
└── docs/                    ← architecture, parity tracker, PRDs

creator-features/            ← SEPARATE REPO
├── components/ui/           ← auto-synced from creator-ds
├── templates/               ← auto-synced from creator-ds
├── features/                ← approved screens live here permanently
└── AGENTS.md                ← auto-synced from creator-ds
```

---

## Local development

```bash
git clone https://github.com/rajendra-prasad-2476/creator-ds.git
cd creator-ds
npm install
npm run dev -- --port 5177
```

| URL | What it shows | For |
|---|---|---|
| `localhost:5177/` | DS Component Showcase | Engineers & Designers |
| `localhost:5177/features.html` | Feature Dashboard | PMs |
| `localhost:5177/preview.html?feature=001&screen=operations` | Full-screen prototype | Anyone |

---

## VS Code + Copilot setup

Install:
- **GitHub Copilot** + **GitHub Copilot Chat**

`AGENTS.md` in the repo root is automatically picked up by Copilot as context — it tells the AI which components to use, which tokens to apply, and how to wire navigation. **You do not need to brief Copilot manually** — just share the PRD.

---

## Engineer / Designer workflow

### Add or update a DS component

1. Edit or create `src/components/ui/<name>.tsx`
2. Add a demo to `src/sections/AtomsSection.tsx`, `MoleculesSection.tsx`, or `OrganismsSection.tsx`
3. Update `docs/ds-parity.csv` — set status to `Done`
4. Update component table in `AGENTS.md` §2
5. Bump `DS_VERSION` in `src/ds-changelog.ts` and run `npm run ds:changelog`
6. Push to `main`

### Publish a new version

```bash
export GITHUB_TOKEN=ghp_your_classic_pat   # needs write:packages
npm version patch   # or minor / major
npm run build:lib
npm publish
```

---

## PM workflow — generate a feature screen from a PRD

### Step 1 — Open Copilot Chat in VS Code

```
Generate screens for this PRD.
Feature slug: demo-users
PRD number: #003
Owner: your.name

[paste your full PRD here]
```

Copilot generates screen files in `src/screens/demo-users/` and registers them in `feature-registry.tsx`.

### Step 2 — Preview

Open `http://localhost:5177/features.html` → find your feature card → click **Preview**.

### Step 3 — Iterate

```
In DemoUserPoolScreen, add a filter bar to toggle between Active and Inactive users.
```

Copilot edits the file. Refresh the preview tab.

### Step 4 — Approve and push

1. Set `status: "approved"` in `feature-registry.tsx`
2. On `features.html` → click **Push** → copy and run the script in terminal
3. Screens land in `creator-features/features/003-demo-users/screens/`

---

## Navigation between screens

```tsx
import { useNavigation } from "@/screens/navigation"

export default function MyScreen() {
  const { navigate, goBack, canGoBack, params } = useNavigation()

  navigate("target-screen-id", { userId: "123" })  // go to another screen
  if (canGoBack) goBack()                           // breadcrumb back
}
```

---

## Design tokens (never hardcode — always use these)

```css
/* Colors */
var(--cds-primary-surface-default)   /* blue  #0D4EF2  */
var(--cds-huegrey-text-dark)         /* body text      */
var(--cds-huegrey-text-default)      /* muted text     */
var(--cds-success-surface-default)   /* green #078841  */
var(--cds-error-surface-default)     /* red   #CC1914  */
var(--border)                         /* border grey    */

/* Spacing */
var(--cds-space-4)   /* 4px  */   var(--cds-space-8)   /* 8px  */
var(--cds-space-12)  /* 12px */   var(--cds-space-16)  /* 16px */
var(--cds-space-24)  /* 24px */   var(--cds-space-32)  /* 32px */

/* Radius */
var(--cds-radius-r)    /* 6px — default */
var(--cds-radius-full) /* pill          */
```

Full token reference → `AGENTS.md` §5.

---

## Key files

| File | Purpose |
|---|---|
| `AGENTS.md` | Full AI coding rules — read before generating anything |
| `docs/ds-parity.csv` | Missing components tracker |
| `src/screens/feature-registry.tsx` | Register every new screen here |
| `src/screens/navigation.tsx` | Prototype navigation context |
| `src/ds-changelog.ts` | DS version history |
| `CHANGELOG.md` | Auto-generated from ds-changelog.ts |

---

## Related repos

| Repo | URL | Purpose |
|---|---|---|
| creator-ds | https://github.com/rajendra-prasad-2476/creator-ds | This repo — DS source |
| creator-features | https://github.com/rajendra-prasad-2476/creator-features | Approved feature screens |


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
