# Creator Studio — Storage Architecture on Zoho Catalyst

**Date:** 2026-07-10  
**Status:** Ideation  
**Platform:** Zoho Catalyst (Serverless PaaS) + Stratus (Object Storage)

---

## 1. Architecture Overview

Creator Studio is a **web-based tool** (like lovable.dev) where PMs generate, preview, and share UI screens built with Creator DS components. The platform runs entirely on **Zoho Catalyst**.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Creator Studio (Web App)                      │
│                                                                 │
│  PM opens browser → creates feature → AI generates screens      │
│  → previews live → shares link → stakeholder reviews            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Zoho Catalyst Platform                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Web Client   │  │  Serverless  │  │  Authentication      │  │
│  │  Hosting      │  │  Functions   │  │  (Zoho OAuth)        │  │
│  │  (SPA)        │  │  (Node.js)   │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                     │
│         ▼                 ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Storage Layer                           │  │
│  │                                                          │  │
│  │  ┌─────────────┐    ┌─────────────────────────────────┐  │  │
│  │  │  Data Store  │    │         Stratus                  │  │  │
│  │  │  (Metadata)  │    │    (Object Storage)              │  │  │
│  │  │              │    │                                   │  │  │
│  │  │  • Features  │    │  • Generated .tsx screen code    │  │  │
│  │  │  • Screens   │    │  • PRD documents                 │  │  │
│  │  │  • Comments  │    │  • Screen thumbnails/previews    │  │  │
│  │  │  • Versions  │    │  • DS component bundle           │  │  │
│  │  │  • Users     │    │  • Exported feature packages     │  │  │
│  │  └─────────────┘    └─────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │  Cache        │  │  CRON        │                            │
│  │  (Sessions,   │  │  (DS Sync,   │                            │
│  │   previews)   │  │   cleanup)   │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Why This Split (Data Store + Stratus)

| Concern | Data Store (Relational DB) | Stratus (Object Storage) |
|---|---|---|
| **What** | Structured metadata — IDs, names, statuses, relationships | Unstructured blobs — code files, documents, images |
| **Query** | ZCQL — filter by status, owner, date, full-text search | Key-based lookup by path |
| **Size** | Small rows (KB each) | Large objects (code files, bundles — KB to MB) |
| **Speed** | Fast relational queries, indexes | Optimized for read/write of large objects |
| **Versioning** | Manual (version history table) | Built-in object versioning in Stratus |
| **Why separate** | You need to search/filter/sort features by metadata *fast* | You need to store arbitrarily large code files *cheaply* |

**Rule of thumb:**  
- If you need to **query it** (filter, sort, search) → **Data Store**  
- If you need to **read/write it as a file** (code, docs, images) → **Stratus**

---

## 3. Data Store — Schema Design

### 3.1 `Features` Table

The central entity. One row per feature being designed.

| Column | Type | Description |
|---|---|---|
| `feature_id` | `TEXT` (PK) | Unique ID, e.g. `"001"`, `"002"` |
| `name` | `TEXT` | Feature name, e.g. "Zia Configuration Enhancements" |
| `slug` | `TEXT` | URL-safe slug, e.g. `"zia-configuration"` |
| `prd_ref` | `TEXT` | PRD reference, e.g. `"#001"` |
| `version` | `TEXT` | Current version, e.g. `"v1.0"` |
| `status` | `TEXT` | One of: `draft`, `in-review`, `approved`, `pushed` |
| `owner` | `TEXT` | Owner's Zoho login / email |
| `created_at` | `DATETIME` | When the feature was created |
| `updated_at` | `DATETIME` | Last modification timestamp |
| `description` | `TEXT` | Short description of the feature |
| `prd_stratus_key` | `TEXT` | Stratus object key for the full PRD document |

### 3.2 `Screens` Table

Each feature has multiple screens.

| Column | Type | Description |
|---|---|---|
| `screen_id` | `TEXT` (PK) | Unique ID, e.g. `"001-operations"` |
| `feature_id` | `TEXT` (FK) | References `Features.feature_id` |
| `name` | `TEXT` | Screen name, e.g. "Operations (Entry)" |
| `slug` | `TEXT` | URL-safe slug, e.g. `"operations"` |
| `sort_order` | `INT` | Display order within the feature |
| `template_used` | `TEXT` | Template name, e.g. `"LinkCategoryTemplate"` |
| `code_stratus_key` | `TEXT` | Stratus key for the `.tsx` source code |
| `thumbnail_stratus_key` | `TEXT` | Stratus key for preview thumbnail image |
| `created_at` | `DATETIME` | When the screen was generated |
| `updated_at` | `DATETIME` | Last modification |

### 3.3 `ScreenVersions` Table

Version history for each screen (every AI generation or manual edit creates a version).

| Column | Type | Description |
|---|---|---|
| `version_id` | `TEXT` (PK) | Auto-generated UUID |
| `screen_id` | `TEXT` (FK) | References `Screens.screen_id` |
| `version_number` | `TEXT` | e.g. `"v1.0"`, `"v1.1"` |
| `code_stratus_key` | `TEXT` | Stratus key for this version's code |
| `change_notes` | `TEXT` | What changed in this version |
| `created_by` | `TEXT` | Who made this change |
| `created_at` | `DATETIME` | When this version was created |

### 3.4 `Comments` Table

Feedback on features/screens from stakeholders.

| Column | Type | Description |
|---|---|---|
| `comment_id` | `TEXT` (PK) | Auto-generated UUID |
| `feature_id` | `TEXT` (FK) | References `Features.feature_id` |
| `screen_id` | `TEXT` (FK, nullable) | Optional — comment on a specific screen |
| `author` | `TEXT` | Commenter's name/email |
| `body` | `TEXT` | Comment text |
| `created_at` | `DATETIME` | When posted |

### 3.5 `Attachments` Table

PRD documents, screenshots, and reference images uploaded by PMs.

| Column | Type | Description |
|---|---|---|
| `attachment_id` | `TEXT` (PK) | Auto-generated UUID |
| `feature_id` | `TEXT` (FK) | References `Features.feature_id` |
| `message_id` | `TEXT` (FK, nullable) | If attached in a chat message |
| `type` | `TEXT` | `"prd"`, `"screenshot"`, `"reference"` |
| `original_filename` | `TEXT` | e.g. `"PRD-Leave-Mgmt.pdf"` |
| `mime_type` | `TEXT` | e.g. `"application/pdf"`, `"image/png"` |
| `file_size` | `INT` | File size in bytes |
| `stratus_key` | `TEXT` | Stratus object path |
| `extracted_text` | `TEXT` | For PRDs: extracted plain text (truncated preview) |
| `label` | `TEXT` | PM's label, e.g. `"List view mockup"` |
| `created_at` | `DATETIME` | When uploaded |

### 3.6 `DSVersions` Table

Tracks which version of Creator DS components is active.

| Column | Type | Description |
|---|---|---|
| `ds_version_id` | `TEXT` (PK) | Version string, e.g. `"1.3.0"` |
| `bundle_stratus_key` | `TEXT` | Stratus key for the component bundle |
| `changelog_json` | `TEXT` | JSON changelog for this version |
| `synced_at` | `DATETIME` | When this version was synced |
| `is_active` | `BOOLEAN` | Whether this is the current active version |

---

## 4. Stratus — Bucket & Object Design

### 4.1 Bucket Structure

```
creator-studio-bucket/
│
├── ds-components/                     ← Creator DS component bundle
│   ├── v1.3.0/
│   │   ├── bundle.js                  ← Compiled component library
│   │   ├── bundle.css                 ← DS styles + tokens
│   │   └── manifest.json             ← Component list + versions
│   └── v1.4.0/
│       └── ...
│
├── features/                          ← All feature data
│   ├── 001-zia-configuration/
│   │   ├── prd.md                     ← Extracted PRD text (always markdown)
│   │   ├── attachments/               ← PRDs, screenshots, reference images
│   │   │   ├── PRD-original.pdf       ← Original uploaded PRD file
│   │   │   ├── reference-001.png      ← Screenshot/Figma export #1
│   │   │   ├── reference-001-label.txt← "This is the list view"
│   │   │   ├── reference-002.png      ← Screenshot #2
│   │   │   └── chat-img-uuid.png      ← Image attached in chat
│   │   └── screens/
│   │       ├── operations/
│   │       │   ├── current.tsx         ← Latest screen code
│   │       │   ├── v1.0.tsx            ← Version 1.0 snapshot
│   │       │   ├── v1.1.tsx            ← Version 1.1 snapshot
│   │       │   └── thumbnail.png       ← Preview thumbnail
│   │       ├── zia-settings/
│   │       │   ├── current.tsx
│   │       │   └── thumbnail.png
│   │       └── zia-provider-detail/
│   │           ├── current.tsx
│   │           └── thumbnail.png
│   │
│   └── 002-portal-security/
│       ├── prd.md
│       └── screens/
│           ├── portal-security-landing/
│           │   ├── current.tsx
│           │   └── thumbnail.png
│           └── ...
│
└── exports/                           ← Packaged exports for engineering
    ├── 001-zia-configuration-v1.0.zip
    └── 002-portal-security-v1.0.zip
```

### 4.2 Why Stratus for Code Storage

- **Versioning:** Stratus has built-in object versioning — every save creates a new version automatically. You get full history for free.
- **No size limits:** Screen code can be arbitrarily large. Stratus handles objects of any size.
- **Direct download:** Engineers can download the `.tsx` files directly via Stratus URLs.
- **Encryption:** Built-in encryption at rest — code is secure.
- **Cost-efficient:** Object storage is cheaper than storing large text blobs in a relational DB.

---

## 5. Serverless Functions — API Layer

Catalyst serverless functions (Node.js) act as the API between the web client and storage.

### 5.1 API Endpoints

```
Feature CRUD
  POST   /api/features                    → Create a new feature
  GET    /api/features                    → List all features (with filters)
  GET    /api/features/:id                → Get feature detail
  PUT    /api/features/:id                → Update feature metadata
  DELETE /api/features/:id                → Delete feature

Screen CRUD
  POST   /api/features/:id/screens        → Add a screen to a feature
  GET    /api/features/:id/screens        → List screens for a feature
  GET    /api/features/:id/screens/:sid   → Get screen detail + code
  PUT    /api/features/:id/screens/:sid   → Update screen code (new version)
  DELETE /api/features/:id/screens/:sid   → Delete a screen

Preview & Share
  GET    /api/preview/:feature/:screen    → Get rendered preview data
  POST   /api/share/:feature              → Generate shareable link
  GET    /api/share/:token                → Resolve share link → preview

AI Generation
  POST   /api/generate                    → Trigger AI screen generation
                                            (sends PRD + DS component list → AI → stores result)

DS Sync
  POST   /api/ds/sync                     → Upload new DS component bundle
  GET    /api/ds/current                  → Get current DS version + manifest

Comments
  POST   /api/features/:id/comments       → Add a comment
  GET    /api/features/:id/comments       → List comments

Export
  POST   /api/features/:id/export         → Package feature for engineering
  GET    /api/exports/:id                 → Download export package
```

### 5.2 Function Architecture

```
catalyst-functions/
├── features/           ← Feature CRUD functions
│   ├── create.js
│   ├── list.js
│   ├── get.js
│   ├── update.js
│   └── delete.js
├── screens/            ← Screen CRUD + code storage
│   ├── create.js       → writes metadata to Data Store + code to Stratus
│   ├── get.js          → reads metadata from Data Store + code from Stratus
│   └── update.js       → creates new Stratus version + updates Data Store
├── generate/           ← AI generation orchestration
│   └── generate.js     → reads PRD + DS manifest → calls AI API → stores result
├── share/              ← Share link generation
│   └── share.js
├── ds-sync/            ← DS component bundle management
│   └── sync.js
└── export/             ← Package features for engineering
    └── export.js
```

---

## 6. How Key Flows Work

### 6.1 PM Creates a New Feature

```
PM clicks "+ New Feature" in Creator Studio
    │
    ▼
Web Client → POST /api/features
    │         { name: "Leave Management", owner: "pm.name", prdText: "..." }
    │
    ▼
Serverless Function:
    1. Insert row into Data Store → Features table
    2. Upload prd.md to Stratus → features/003-leave-management/prd.md
    3. Return feature_id + shareable URL
    │
    ▼
PM sees new feature card in dashboard
```

### 6.2 AI Generates Screens

```
PM clicks "Generate Screens" on a feature
    │
    ▼
Web Client → POST /api/generate
    │         { feature_id: "003", prompt: "Generate list view..." }
    │
    ▼
Serverless Function:
    1. Fetch PRD from Stratus → features/003/prd.md
    2. Fetch DS manifest from Stratus → ds-components/v1.3.0/manifest.json
    3. Compose AI prompt: PRD + AGENTS.md rules + available components
    4. Call AI API (Zoho Zia / OpenAI / Anthropic)
    5. Receive generated .tsx code
    6. Upload code to Stratus → features/003/screens/list-view/current.tsx
    7. Insert row into Data Store → Screens table
    8. Return screen preview data
    │
    ▼
PM sees generated screen in preview panel
```

### 6.3 Stakeholder Views a Shared Link

```
PM copies share link: https://creator-studio.catalyst.zoho.com/share/abc123
    │
    ▼
Stakeholder clicks link (no login needed)
    │
    ▼
Web Client → GET /api/share/abc123
    │
    ▼
Serverless Function:
    1. Resolve token → feature_id + screen_id
    2. Fetch screen code from Stratus
    3. Fetch DS component bundle from Stratus
    4. Return everything needed for client-side rendering
    │
    ▼
Browser renders the screen using DS components
(Stakeholder sees the real interactive UI)
```

### 6.4 DS Component Sync (from creator-ds-react)

```
Engineer merges to main in creator-ds-react
    │
    ▼
GitHub Actions workflow:
    1. npm run build → produces compiled DS bundle
    2. POST /api/ds/sync → uploads bundle to Stratus
       → ds-components/v1.4.0/bundle.js
       → ds-components/v1.4.0/bundle.css
       → ds-components/v1.4.0/manifest.json
    3. Insert row into Data Store → DSVersions table
    4. Set is_active = true for new version
    │
    ▼
Creator Studio now uses the latest DS components for all new generations
(Existing screens continue to reference the DS version they were built with)
```

---

## 7. Creator DS as the Core

The Creator DS components are the **immutable foundation**. Here's how they stay central:

### 7.1 Component Bundle in Stratus

```
ds-components/v1.3.0/
├── bundle.js          ← All 34+ components compiled (ESM)
├── bundle.css         ← All CSS tokens, font-face, theme variables
└── manifest.json      ← Machine-readable component registry
```

**manifest.json** example:
```json
{
  "version": "1.3.0",
  "font": "Zoho Puvi",
  "components": {
    "atoms": [
      { "name": "Button", "file": "button.tsx", "props": ["variant", "size", "disabled"] },
      { "name": "Input", "file": "input.tsx", "props": ["placeholder", "type", "disabled"] },
      { "name": "Badge", "file": "badge.tsx", "props": ["variant", "size"] }
    ],
    "molecules": [
      { "name": "Select", "file": "select.tsx", "props": ["options", "placeholder"] },
      { "name": "Tabs", "file": "tabs.tsx", "props": ["defaultValue", "children"] }
    ],
    "organisms": [
      { "name": "TopBar", "file": "top-bar.tsx", "props": [] },
      { "name": "LeftNav", "file": "left-nav.tsx", "props": [] },
      { "name": "Dialog", "file": "dialog.tsx", "props": ["open", "onOpenChange"] }
    ],
    "templates": [
      { "name": "CardGridTemplate", "file": "CardGridTemplate.tsx" },
      { "name": "LinkCategoryTemplate", "file": "LinkCategoryTemplate.tsx" }
    ]
  },
  "tokens": {
    "colors": ["--cds-primary-surface-default", "..."],
    "spacing": ["--cds-space-4", "--cds-space-8", "..."],
    "radius": ["--cds-radius-r", "--cds-radius-l", "..."]
  }
}
```

### 7.2 How AI Uses the DS

When generating screens, the serverless function sends the AI:

1. **AGENTS.md** — all rules (font, tokens, component-to-use-case mapping)
2. **manifest.json** — exact list of available components + their props
3. **PM's PRD** — what the feature should do
4. **Template reference** — if PM selected a template

The AI can **only** use components from the manifest. The AGENTS.md rules ensure it never generates raw HTML, wrong fonts, or hardcoded colors.

### 7.3 Live Preview Rendering

```
Browser receives:
  1. Screen .tsx code (from Stratus)
  2. DS bundle.js + bundle.css (from Stratus)

Client-side:
  - Load DS bundle (all components available)
  - Compile/eval the screen .tsx code using in-browser transpiler (SWC/Babel)
  - Render the screen using actual DS components
  - Result: pixel-perfect interactive UI in the browser
```

---

## 8. Migration Path from Current State

### Current → Catalyst Migration

| Current (In-Repo) | Future (Catalyst) |
|---|---|
| `feature-registry.tsx` (hardcoded array) | **Data Store** → `Features` + `Screens` tables |
| `src/screens/**/*.tsx` (source files) | **Stratus** → `features/{id}/screens/{slug}/current.tsx` |
| `docs/*.md` (PRD documents) | **Stratus** → `features/{id}/prd.md` |
| `npm run dev` (local preview) | **Catalyst Web Client** hosting (accessible via URL) |
| No sharing (must run dev server) | **Share API** → generates public preview links |
| Git commit history | **Stratus versioning** + `ScreenVersions` table |
| AGENTS.md (in repo) | **Stratus** → bundled with DS component version |

### Phase 1 — Set Up Catalyst Project
- [ ] Create Catalyst project "Creator Studio"
- [ ] Set up Web Client hosting (React SPA)
- [ ] Create Data Store tables (Features, Screens, ScreenVersions, Comments, DSVersions)
- [ ] Create Stratus bucket `creator-studio-bucket`

### Phase 2 — Build API Layer
- [ ] Implement feature CRUD functions
- [ ] Implement screen CRUD with Stratus code storage
- [ ] Implement DS bundle upload/sync endpoint
- [ ] Build share link generation + resolution

### Phase 3 — Build Web Client
- [ ] Migrate FeaturesApp to Catalyst-hosted SPA
- [ ] Implement feature dashboard with Data Store queries
- [ ] Implement screen preview with Stratus code loading
- [ ] Build share/preview flow for stakeholders

### Phase 4 — AI Generation Pipeline
- [ ] Build AI generation endpoint (PRD + manifest → AI → code → Stratus)
- [ ] Integrate with Zoho Zia or external AI APIs
- [ ] Build iteration flow (edit prompt → regenerate → new version)

### Phase 5 — DS Sync Automation
- [ ] GitHub Actions in creator-ds-react → build bundle → upload to Catalyst Stratus
- [ ] Automatic manifest.json generation from component source
- [ ] Version pinning (each feature remembers which DS version it was built with)

---

## 9. Key Advantages of This Architecture

| Advantage | How |
|---|---|
| **Zero infrastructure management** | Catalyst is fully serverless — no servers to provision |
| **Zoho ecosystem native** | Auth via Zoho accounts, integrates with Zoho Projects for tracking |
| **Code versioning built-in** | Stratus object versioning = free version history |
| **Shareable without setup** | Catalyst Web Client hosting = public URLs out of the box |
| **DS stays the source of truth** | DS bundle in Stratus is immutable per version; screens reference a specific DS version |
| **Scales automatically** | Catalyst handles scaling — from 1 PM to 100 PMs |
| **Cost-effective** | Catalyst free tier is generous; Stratus pricing is storage-based |
| **Secure** | Stratus encryption at rest; Catalyst auth; share links can be time-limited |

---

## 10. Related Documents

- **AI Layer Architecture:** `docs/ai-layer-architecture.md` — covers the ideation chat, prompt wizard, multi-provider AI gateway, conversation storage, and DS compliance validator
- **Product Vision:** `docs/product-vision.md` — overall Creator Studio vision and phases
- **System Architecture:** `docs/system-architecture.md` — two-repo architecture and sync workflows
- **Ideation Document:** `docs/creator-studio-ideation.md` — original brainstorm and wireframes

---

## 11. Open Questions

- [ ] **AI API choice:** Use Zoho Zia for generation, or external (OpenAI/Anthropic) via Catalyst functions?
- [ ] **In-browser compilation:** Use SWC WASM or Babel standalone for client-side .tsx rendering?
- [ ] **Real-time collaboration:** Do PMs need to see each other's edits live (WebSocket via Catalyst)?
- [ ] **Export format:** When engineering "picks up" a feature, export as .tsx files or a Git PR?
- [ ] **Catalyst project region:** US/EU/IN data center for Stratus bucket?
- [ ] **Authentication scope:** Zoho org-only, or allow external stakeholder access via share links?
