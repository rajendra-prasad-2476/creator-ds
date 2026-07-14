# Creator Studio — Ideation Document

**Date:** 2026-07-10  
**Purpose:** Ideate the webapp tool before implementation  
**Analogy:** "lovable.dev for Creator PMs"

---

## 1. The Problem

Today, when a PM wants to show stakeholders what a feature will look like:

```
PM writes a spec → Waits for designer mockup → Waits for engineering prototype
→ Stakeholder sees it weeks later → "That's not what I meant" → Repeat
```

**Pain points:**
- PMs can't visualize their ideas without designer/engineer help
- Sharing UI concepts requires running a dev server or building screenshots
- No single place where all feature screens live together
- Feedback happens over email/Slack — disconnected from the screens
- Component consistency is enforced only if the developer remembers

---

## 2. The Vision

**Creator Studio** = A webapp where PMs generate real, interactive UI screens from their feature ideas, preview them instantly, and share with stakeholders via a link.

```
PM describes what they want → AI generates pixel-perfect screens using the DS
→ PM previews live in browser → Shares a link with stakeholders
→ Stakeholder clicks link, sees real UI → Gives feedback
→ PM iterates → Approved → Engineering picks up production-ready screens
```

### What makes this different from Figma/lovable.dev?

| | Figma | lovable.dev | Creator Studio |
|---|---|---|---|
| **Components** | Designer-managed | Generic | Your actual DS components |
| **Tokens** | Manual | None | Auto-enforced (--cds-*) |
| **Output** | Static mockups | Generic React | Production-ready Creator React |
| **Who uses it** | Designers | Developers | PMs (with AI assistance) |
| **Sharing** | Figma link | Deploy URL | Simple preview URL |
| **Engineering handoff** | Export + interpret | Code refactoring needed | Direct copy — already uses your components |

**Key insight:** The screens AI generates here aren't throwaway prototypes. They use the real components, real tokens, real templates. Engineering can literally copy-paste them into production.

---

## 3. User Personas

### PM (Primary User)
- **Goal:** Quickly visualize a feature idea and get stakeholder buy-in
- **Technical skill:** Can't write React, but can describe what they want
- **Workflow:** Opens Creator Studio → Creates a feature → Describes screens → AI generates → Preview → Share

### Stakeholder (Viewer)
- **Goal:** See what the feature will look like, give feedback
- **Technical skill:** Zero — just clicks a link
- **Workflow:** Receives a link → Opens in browser → Sees real UI → Comments

### Designer (Reviewer)
- **Goal:** Ensure AI-generated screens follow DS guidelines
- **Technical skill:** Knows the DS inside out
- **Workflow:** Reviews generated screens → Flags DS violations → Approves or requests changes

### Engineer (Consumer)
- **Goal:** Get production-ready screen code for implementation
- **Technical skill:** Full-stack developer
- **Workflow:** Sees approved screen → Copies code into feature branch → Integrates with API

---

## 4. Core Features — Brainstorm

### 4.1 Feature Workspace (The Hub)

The central dashboard where PMs manage all their features.

```
┌─────────────────────────────────────────────────────────────┐
│  Creator Studio                              [+ New Feature]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 3 Features · 8 Screens · 2 In Review · 1 Approved      │
│                                                             │
│  🔍 Search features...          [All] [Draft] [Review] [✓] │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #001 Zia Configuration                    In Review │   │
│  │ 3 screens · v1.0 · rajendra.prasad · Jul 8         │   │
│  │ [Preview All] [Share] [Push to Eng]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #002 Leave Management                       Draft   │   │
│  │ 0 screens · v0.1 · pm.name · Jul 10                │   │
│  │ [Generate Screens] [Edit PRD]                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ideas:**
- Status-based filtering (Draft / In Review / Approved / Pushed)
- Owner-based filtering (My Features / All)
- Quick stats bar
- Inline preview (expand to see screen thumbnails)
- Batch actions (share all, push all)

### 4.2 Feature Detail Page

When you click into a feature, you see everything about it.

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back    #001 Zia Configuration              [In Review] │
│  rajendra.prasad · v1.0 · Last updated Jul 8              │
├─────────────────────────────────────────────────────────────┤
│  [Screens]  [PRD/Brief]  [History]  [Settings]             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Screens (3)                         [+ Add Screen] [Share]│
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │          │  │          │  │          │                   │
│  │ thumb    │  │ thumb    │  │ thumb    │                   │
│  │          │  │          │  │          │                   │
│  ├──────────┤  ├──────────┤  ├──────────┤                   │
│  │Operations│  │Zia Setup │  │Provider  │                   │
│  │[Preview] │  │[Preview] │  │[Preview] │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ideas:**
- Screen thumbnail grid with preview buttons
- PRD/brief tab where the PM's original description lives
- Version history timeline
- Settings (rename, change status, delete)
- "Share All Screens" → generates a single link showing all screens in sequence

### 4.3 Screen Preview

Full-screen, interactive preview of a generated screen.

```
┌─────────────────────────────────────────────────────────────┐
│  ◀ ▶  Operations Screen    [📋 Copy Link] [📱 Mobile] [🖥 Desktop] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │           Full rendered screen here                 │   │
│  │           (TopBar + LeftNav + Content)              │   │
│  │                                                     │   │
│  │                                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Screen 1 of 3          [◀ Prev]  [Next ▶]                │
└─────────────────────────────────────────────────────────────┘
```

**Ideas:**
- Responsive preview toggle (desktop / tablet / mobile viewport)
- Screen-to-screen navigation (prev/next through all screens in the feature)
- Copy shareable link
- "View Code" toggle for engineers
- Annotations / comment overlay (future)
- Full-screen mode (hide the studio chrome)

### 4.4 Template Gallery

Browse available page templates before asking AI to generate.

```
┌─────────────────────────────────────────────────────────────┐
│  Templates                                                  │
│  Pick a layout pattern. Tell the AI which template to use. │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ ░░░░░░░░ │  │ ░░ │ ░░░ │  │ ░░░░░░░░ │                 │
│  │ ▪ ▪ ▪ ▪  │  │ ░░ │ ░░░ │  │ ━━━━━━━━ │                 │
│  │ ▪ ▪ ▪ ▪  │  │ ░░ │ ░░░ │  │ ▪▪▪  ▪▪▪ │                 │
│  ├──────────┤  ├──────────┤  ├──────────┤                   │
│  │Card Grid │  │Split     │  │Tabbed    │                   │
│  │          │  │Panel     │  │Sections  │                   │
│  │App       │  │Deploy    │  │Resource  │                   │
│  │galleries │  │views     │  │pages     │                   │
│  │[Preview] │  │[Preview] │  │[Preview] │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ > Link1  │  │ ← / / /  │  │ 💰 Plan  │                 │
│  │ > Link2  │  │ ━━━━━━━━ │  │ ▪ ▪ ▪ ▪  │                 │
│  │ > Link3  │  │ tabs...  │  │ stats    │                   │
│  ├──────────┤  ├──────────┤  ├──────────┤                   │
│  │Link      │  │Breadcrumb│  │Billing   │                   │
│  │Category  │  │Detail    │  │          │                   │
│  │Settings  │  │Inner     │  │Plans &   │                   │
│  │pages     │  │pages     │  │usage     │                   │
│  │[Preview] │  │[Preview] │  │[Preview] │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ideas:**
- Visual thumbnails (mini-rendered or ASCII wireframe)
- "When to use" description for each template
- Live full-screen preview on click
- "Use this template" → shows the AI prompt to use
- Props reference for AI (what data the template accepts)

### 4.5 Component Reference (For AI Context)

Not a primary PM