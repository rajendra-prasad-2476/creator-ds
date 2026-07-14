# Creator Studio — Product Vision

**Date:** 2026-07-10  
**Status:** Active Development

---

## 1. What This Is

**Creator Studio** is an internal webapp where Product Managers design, preview, and share UI screens with stakeholders — without writing code. Think of it as an internal lovable.dev built on top of the Creator Design System.

### The Core Loop

```
PM writes a PRD/brief → AI generates screens using DS components
→ PM previews in Creator Studio → Iterates with AI → Shares with stakeholders
→ Approved screens get pushed to engineering
```

---

## 2. Current State (Before)

| Capability | Status | Experience |
|---|---|---|
| Component showcase | ✅ Built | Developer-facing, not PM-facing |
| Feature registry | ✅ Built | Requires editing TypeScript code |
| Screen preview | ✅ Built | Works, but discovery is poor |
| Template gallery | ✅ Built | Hidden inside DS showcase tab |
| Share with stakeholders | ❌ Missing | Must run dev server locally |
| New feature wizard | ❌ Missing | Manual code registration |
| PRD integration | ❌ Missing | Separate workflow |
| Status tracking | 🟡 Partial | Basic status badges |
| Search/filter | ❌ Missing | No search in feature dashboard |

---

## 3. Target State (After)

### 3.1 Unified App Shell
- Single app with tabbed navigation: **Features** | **Templates** | **Components** | **Changelog**
- Features tab is the **default landing page** (PM's primary workspace)
- Templates tab shows interactive template picker with live previews
- Components tab links to existing DS showcase
- Changelog shows DS version history

### 3.2 Enhanced Feature Dashboard (Features Tab)
- **Search & filter** by name, status, owner
- **Stats bar** showing counts by status
- **Kanban-style status flow** visualization
- **Direct preview** without opening new tabs (inline preview mode)
- **Share button** that copies a shareable URL
- **"+ New Feature"** button with a guided creation flow

### 3.3 Template Picker (Templates Tab)
- Visual grid of all 6 templates with thumbnail previews
- Click to see full-screen live preview
- "Use This Template" CTA that explains the AI workflow
- Each template shows: name, description, when to use, props reference

### 3.4 Share Flow
- Every feature/screen gets a URL: `/preview.html?feature=001&screen=operations`
- URL works without dev server (static build deployment)
- Copy-to-clipboard share button on every screen card

### 3.5 Workflow Steps Panel
A persistent workflow guide showing PMs the process:
1. Write your PRD/brief
2. Open in AI tool (Cursor/Claude/Copilot)
3. AI generates screens using Creator DS
4. Preview & iterate here
5. Share with stakeholders
6. Get approval → Push to engineering

---

## 4. Architecture

```
Creator Studio (this repo)
├── / (landing) → Features Dashboard (PM workspace)
├── /features.html → Feature Dashboard (current, being enhanced)
├── /preview.html → Full-screen preview (shareable)
├── /index.html → DS Showcase (for designers/engineers)
└── Static deploy → Vercel/Netlify/GitHub Pages (for sharing)
```

### Deployment for Sharing
- `npm run build` produces static files
- Deploy to any static host (Vercel, Netlify, GitHub Pages)
- All preview URLs work without a dev server
- Stakeholders just click a link — no setup needed

---

## 5. Implementation Phases

### Phase 1 — Polish the PM Experience (NOW)
- [x] Analyze repo and document vision
- [ ] Redesign FeaturesApp as the primary "Creator Studio" landing
- [ ] Add search/filter to Feature Dashboard
- [ ] Add stats summary bar (features by status)
- [ ] Add "How to Use" onboarding panel
- [ ] Add share/copy-link buttons on screens
- [ ] Enhance template showcase with interactive previews

### Phase 2 — Collaboration Features (Next)
- [ ] Comments/notes on features
- [ ] Approval workflow (PM → Designer → Engineering)
- [ ] Version comparison (diff between versions)
- [ ] Activity feed / changelog per feature

### Phase 3 — Self-Service Screen Building (Future)
- [ ] Template wizard: pick template → configure via form → preview
- [ ] AI prompt interface: type what you want → AI generates code
- [ ] Hot-reload preview: see changes as AI writes code
- [ ] One-click deploy to staging

---

## 6. Why This Works

| Stakeholder | Value |
|---|---|
| **PM** | Design screens without code, share instantly |
| **Designer** | Components stay consistent via DS enforcement |
| **Engineer** | Receives pixel-perfect, token-compliant screens |
| **Stakeholder** | Clicks a link, sees the real UI, gives feedback |
| **AI** | AGENTS.md ensures correct component usage every time |