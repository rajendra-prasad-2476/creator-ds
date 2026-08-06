# Slide Deck — Creator DS · AI-Powered Screen Generation System
> 3-slide narrative for team / stakeholder presentation
> Covers: React Component Library · MCP Server · Feature Generation Workflow

---

## 🟦 Slide 1 — What We Built & Why

**Title:** _A design system that teaches AI how to build Creator screens_

### The Problem We Solved
> "Every time a PM or engineer asks an AI to generate a screen, it invents its own components, hardcodes colours, uses the wrong font, and ignores the design system entirely."

**Before:**
- AI generates raw `<div>`, `<button>`, `<input>` — no DS components
- Hardcoded hex colours everywhere (`#0D4EF2`, `#CC1914`)
- Wrong fonts (Inter, system-ui) instead of Zoho Puvi
- No page structure — no TopBar, no LeftNav
- Every screen looks different — zero consistency

**After (what we built):**
```
┌─────────────────────────────────────────────┐
│         Creator DS System — 3 layers         │
│                                              │
│  1. Component Library   42 DS components     │
│     (React + Tailwind)  6 page templates     │
│                         400+ design tokens   │
│                                              │
│  2. MCP Server          7 tools AI can call  │
│     (Model Context      Components · Tokens  │
│      Protocol)          Templates · Lint     │
│                                              │
│  3. Feature Registry    Live preview         │
│     (Screen system)     PRD → Screen workflow│
│                                              │
└─────────────────────────────────────────────┘
```

### Why It Matters
- Any AI tool (Cursor, Copilot, Claude, Sahaa) now **calls the MCP server first** — it knows what components exist before writing a single line
- AGENTS.md codifies **hard rules** (no hardcoded hex, Zoho Puvi only, mandatory shell) that the AI must follow
- Result: AI-generated screens that are **production-ready DS-compliant** on first attempt

---

## 🟩 Slide 2 — The Three Layers in Detail

**Title:** _Component Library · MCP Server · Feature Registry_

---

### Layer 1 — React Component Library (`creator-ds-react`)

**42 components** across 3 categories, all in `src/components/ui/`:

| Category | Count | Examples |
|---|---|---|
| **Atoms** | 16 | Button, Input, Badge, Toggle, Tag, Avatar, StatusBadge |
| **Molecules** | 14 | Select, Tabs, ContentSwitcher, InputSuffix, TagInput, Sonner |
| **Organisms** | 12 | Card, Table, Dialog, Sheet, TopBar, LeftNav, BuilderShell |

**6 Page Templates** (`src/templates/`) — ready-to-import layouts:
- `CardGridTemplate` — browse / manage collections
- `TabbedSectionsTemplate` — categorised resource hubs
- `SplitPanelTemplate` — pipeline / environment comparisons
- `LinkCategoryTemplate` — settings / ops landing pages
- `BreadcrumbDetailTemplate` — inner detail drill-down pages
- `BillingTemplate` — subscription / usage management

**400+ design tokens** (`--cds-*`) — single source of truth for colour, spacing, radius, typography. No hardcoded values anywhere in the codebase.

---

### Layer 2 — MCP Server (`mcp/src/server.ts`)

An **MCP (Model Context Protocol) server** that any AI coding tool can connect to. Exposes **7 tools**:

| Tool | What it does |
|---|---|
| `list_components` | Returns all 42 components with import paths + use-cases |
| `get_component` | Full props, variants, anti-patterns for one component |
| `find_tokens` | Search `--cds-*` tokens by keyword, group, or value |
| `list_templates` | All 6 page templates with decision rules |
| `creator_coding_guidelines` | Full AGENTS.md hard rules as structured text |
| `list_screens` | All registered screens with IDs for navigation |
| `validate_component_usage` | Static lint — detects hardcoded colours, wrong fonts, raw HTML |

**How it works:**
```
AI coding tool (Cursor / Copilot / Claude / Sahaa)
    │
    ├─ calls list_components        → "What DS components exist?"
    ├─ calls get_component(Button)  → "What props does Button accept?"
    ├─ calls find_tokens("error")   → "What token is the error red?"
    ├─ calls creator_coding_guidelines → "What are the non-negotiable rules?"
    │
    ▼
AI generates screen using ONLY DS components + tokens
    │
    ├─ calls validate_component_usage(code) → lint before commit
    │
    ▼
✅ DS-compliant screen on first attempt
```

---

### Layer 3 — Feature Registry + Screen Navigation

**`src/screens/feature-registry.tsx`** — every generated screen is registered here:
- Gives each screen a unique `id` for navigation
- Powers the **Feature Dashboard** — live preview of all generated screens
- Tracks: feature name, PRD reference, version, status, owner, last updated

**`src/screens/navigation.tsx`** — lightweight navigation context:
```tsx
const { navigate, goBack, canGoBack, params } = useNavigation()
navigate("target-screen-id", { param: "value" })
```
No `href="#"`, no `window.location` — every screen transition is testable.

**Currently registered:** 4 features, 20+ screens across:
- Demo Users in Environments
- Mobile Deployment
- Portal Security
- Zia Configuration

---

## 🟨 Slide 3 — The Workflow: PRD → DS-Compliant Screen

**Title:** _How a PM feature idea becomes a live, reviewable screen_

### End-to-End Flow

```
1. PM writes PRD
   └─ Structured markdown template (docs/prd-template.md)
   └─ Includes: objective, FRs, screen inventory, DS component hints

          ↓

2. AI agent opens the repo in Cursor / Copilot / Claude / Sahaa
   └─ Reads AGENTS.md (hard rules auto-loaded)
   └─ Calls MCP server tools:
       • list_components  → knows all 42 components
       • list_templates   → picks the right page template
       • find_tokens      → correct --cds-* token for every colour/spacing
       • creator_coding_guidelines → enforces mandatory shell, font, no raw HTML

          ↓

3. AI generates the screen file
   └─ Saved to src/screens/<feature-slug>/<ScreenName>.tsx
   └─ Uses only DS components — no raw div/button/input
   └─ Zoho Puvi font, --cds-* tokens, mandatory TopBar + LeftNav shell
   └─ useNavigation() for all screen transitions

          ↓

4. Screen is registered
   └─ Added to src/screens/feature-registry.tsx
   └─ Immediately previewable in the Feature Dashboard (features.html)

          ↓

5. Validation
   └─ MCP tool: validate_component_usage(code) → static lint
   └─ Ghost token guard: grep for undefined --cds-space-* tokens
   └─ Designer + PM review via Feature Dashboard live preview

          ↓

6. ✅ Approved → promoted to creator-features repo
   └─ GitHub Actions auto-syncs component library on every merge to main
```

### What the AGENTS.md Enforces (non-negotiable)

| Rule | What AI must do |
|---|---|
| **Components only** | Use `@/components/ui/` — never raw `<div>`, `<button>`, `<input>` |
| **Font** | `'Zoho Puvi'` only — never Inter, Roboto, system-ui |
| **Colours** | `var(--cds-*)` tokens only — never `#hex`, `rgb()`, `blue` |
| **Layout** | `className` with Tailwind arbitrary values — never `style={{}}` |
| **Spacing** | Only valid `--cds-space-*` tokens (0,1,2,4,6,8,12,16,20,24,32,40,48,64,80px) |
| **Page shell** | TopBar + LeftNav always present on full-page screens |
| **Navigation** | `useNavigation()` always — never `href="#"` or `window.location` |

### Key Numbers

| Metric | Value |
|---|---|
| DS components built | **42** |
| Page templates | **6** |
| Design tokens (`--cds-*`) | **400+** |
| MCP tools exposed | **7** |
| Features with live screens | **4** |
| Screens in registry | **20+** |
| Rules in AGENTS.md | **15 sections** |

---

## 📎 One-Liner to Run the MCP Server

```bash
cd mcp && npm run build && node dist/server.js
# or for development:
npx tsx mcp/src/server.ts
```

Connect any MCP-compatible AI tool to this server and it instantly becomes a DS-aware screen generator.
