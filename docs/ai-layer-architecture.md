# Creator Studio — AI Layer Architecture

**Date:** 2026-07-10  
**Status:** Ideation  
**Depends on:** `docs/storage-architecture.md` (Catalyst + Stratus storage layer)

---

## 1. The AI Experience — Overview

Creator Studio's AI layer is the core of the PM experience. It powers two modes:

1. **Prompt Wizard** — structured initial generation (pick template → describe feature → AI generates full screens)
2. **Ideation Chat** — conversational iteration (PM chats with AI to refine, modify, and extend screens)

```
┌──────────────────────────────────────────────────────────────────────┐
│                       Creator Studio — AI Layer                      │
│                                                                      │
│  ┌────────────────────────┐     ┌─────────────────────────────────┐ │
│  │   Phase 1: Wizard       │     │   Phase 2: Chat                  │ │
│  │                         │     │                                   │ │
│  │  "What are you          │     │  PM: "Add a search bar above     │ │
│  │   building?"            │     │       the table"                  │ │
│  │                         │     │                                   │ │
│  │  ┌─ Pick template ──┐  │     │  AI: "Done. I added an           │ │
│  │  │  CardGrid         │  │     │   InputPrefix with a search      │ │
│  │  │  LinkCategory     │  │ ──► │   icon above the Table.          │ │
│  │  │  TabbedSections   │  │     │   Here's the updated preview."   │ │
│  │  └──────────────────┘  │     │                                   │ │
│  │                         │     │  PM: "Make it filter live         │ │
│  │  ┌─ Describe fields ┐  │     │       as I type"                  │ │
│  │  │  Name, Email...   │  │     │                                   │ │
│  │  └──────────────────┘  │     │  AI: "Updated with onChange       │ │
│  │                         │     │   handler. Preview refreshed."    │ │
│  │  [Generate Screens →]  │     │                                   │ │
│  └────────────────────────┘     └─────────────────────────────────┘ │
│                                                                      │
│                    ┌──────────────────────┐                          │
│                    │   Live Preview Pane   │                          │
│                    │   (renders in real    │                          │
│                    │    time as AI edits)  │                          │
│                    └──────────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Input Types — PRD Documents & Screenshots

The Wizard and Chat both accept **three types of input** that the AI uses to generate screens:

### 2.1 Supported Inputs

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Input Types for AI Generation                    │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────┐   │
│  │  📝 Text          │  │  📄 PRD Document  │  │  🖼 Screenshots    │   │
│  │                   │  │                   │  │                   │   │
│  │  Free-form text   │  │  .md / .pdf /     │  │  .png / .jpg /    │   │
│  │  typed in wizard  │  │  .docx / .txt     │  │  .webp / Figma    │   │
│  │  or chat box      │  │  uploaded or      │  │  exports, UI      │   │
│  │                   │  │  pasted            │  │  mockups, hand-   │   │
│  │  "Create a leave  │  │                   │  │  drawn sketches   │   │
│  │   management      │  │  Full PRD with    │  │                   │   │
│  │   screen with..." │  │  user stories,    │  │  "Build this      │   │
│  │                   │  │  fields, rules    │  │   screen like      │   │
│  │                   │  │                   │  │   this image"      │   │
│  └─────────────────┘  └─────────────────┘  └───────────────────┘   │
│                                                                     │
│  All three can be combined in a single request:                      │
│  "Here's our PRD [📄] and a Figma screenshot [🖼].                  │
│   Generate the list view with these exact columns."                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 PRD Document Support

PMs can upload their PRD documents directly into Creator Studio instead of retyping everything.

**Supported formats:**
| Format | How it's processed |
|---|---|
| `.md` (Markdown) | Read as-is — passed directly to AI as context |
| `.pdf` | Extracted via PDF parser (pdf-parse) on Catalyst function |
| `.docx` | Extracted via docx parser (mammoth) on Catalyst function |
| `.txt` | Read as-is |
| Pasted text | Stored as `.md` in Stratus |

**PRD processing flow:**
```
PM uploads PRD document (drag-drop or file picker)
    │
    ▼
Web Client → POST /api/features/:id/prd
    │         Content-Type: multipart/form-data
    │         Body: { file: <PRD.pdf>, feature_id: "003" }
    │
    ▼
Catalyst Function:
    1. Detect file type (.md / .pdf / .docx / .txt)
    2. Extract plain text:
       - .md → use as-is
       - .pdf → pdf-parse library → extract text + tables
       - .docx → mammoth library → extract text + headings
       - .txt → use as-is
    3. Store original file to Stratus:
       → features/003/attachments/PRD-original.pdf
    4. Store extracted text to Stratus:
       → features/003/prd.md (always markdown)
    5. Update Data Store → Features.prd_stratus_key
    6. Return extracted text preview to client
    │
    ▼
PM sees PRD content preview in the wizard/chat
(Can edit the extracted text before generating)
```

**Smart PRD parsing:**
```
The AI receives the full PRD text but is instructed to focus on:
  • User Stories → determines what screens to generate
  • Screen Descriptions → maps to specific screen layouts
  • Data Fields → becomes form inputs, table columns
  • Business Rules → becomes validation logic, conditional UI
  • Figma References → paired with screenshots if uploaded
```

### 2.3 Screenshot & Image Support

PMs can upload **screenshots, Figma exports, hand-drawn sketches, or any reference images** and the AI will use them as visual context to generate matching screens.

**Supported formats:**
| Format | Max size | Notes |
|---|---|---|
| `.png` | 20 MB | Best for UI screenshots |
| `.jpg` / `.jpeg` | 20 MB | Compressed photos/mockups |
| `.webp` | 20 MB | Modern web format |
| `.svg` | 5 MB | Vector graphics / icons |
| `.gif` | 10 MB | First frame extracted for analysis |

**How screenshots are used:**
```
┌───────────────────────────────────────────────────────────────┐
│                    Vision-Capable AI Flow                      │
│                                                               │
│  PM uploads screenshot of existing Zoho Creator UI             │
│      ↓                                                        │
│  Image stored in Stratus:                                      │
│    features/003/attachments/reference-001.png                  │
│      ↓                                                        │
│  AI Gateway checks provider capabilities:                      │
│    ✓ OpenAI GPT-4o         → vision supported                 │
│    ✓ Anthropic Claude      → vision supported                 │
│    ✓ Google Gemini         → vision supported                 │
│    ✓ Zoho Platform AI      → vision supported (check)         │
│    ✗ Some local LLMs       → text-only, image described       │
│      ↓                                                        │
│  If vision-capable provider:                                   │
│    → Image sent as base64 or URL in the API message            │
│    → AI sees the screenshot + reads text prompt                │
│    → Generates screen code matching the visual design          │
│      ↓                                                        │
│  If text-only provider (fallback):                             │
│    → Image analyzed by a vision model first                    │
│    → Produces a text description of the UI layout              │
│    → Description passed to text-only model as context          │
│      ↓                                                        │
│  Result: Screen code that matches the uploaded reference       │
└───────────────────────────────────────────────────────────────┘
```

**Vision prompt strategy:**
```
When screenshots are attached, the system prompt includes:

"The user has uploaded reference images. Analyze each image and:
  1. Identify the layout pattern (card grid, table, form, sidebar nav, etc.)
  2. Identify UI elements (buttons, inputs, dropdowns, tabs, etc.)
  3. Map each visual element to the closest Creator DS component
  4. Match the spacing, alignment, and visual hierarchy
  5. Use --cds-* tokens to approximate colors (do NOT copy exact hex values)
  6. Generate screen code that recreates this design using only DS components

IMPORTANT: The goal is to recreate the INTENT and LAYOUT, not pixel-copy.
Use Creator DS components and tokens — the result should look like it
belongs in the Creator Design System, not be a clone of the screenshot."
```

### 2.4 Updated Wizard with PRD + Screenshots

```
Step 1: Feature Basics
┌─────────────────────────────────────────────────────────────┐
│  What are you building?                                      │
│                                                             │
│  Feature name: [Leave Management                    ]       │
│  Description:  [Employees can request leave...      ]       │
│                                                             │
│  ┌─ PRD Document (optional) ────────────────────────────┐   │
│  │                                                       │   │
│  │  📄 Drag & drop your PRD here, or [Browse Files]     │   │
│  │                                                       │   │
│  │  Supports: .md, .pdf, .docx, .txt                    │   │
│  │                                                       │   │
│  │  ✅ PRD-Leave-Management.pdf uploaded                 │   │
│  │     23 pages · 4 user stories · 12 fields detected    │   │
│  │     [Preview Extracted Text] [Remove]                 │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                             │
│                                        [Next →]             │
└─────────────────────────────────────────────────────────────┘

Step 2: Reference Screenshots (optional)
┌─────────────────────────────────────────────────────────────┐
│  Do you have reference designs?                              │
│  Upload screenshots, Figma exports, or sketches.             │
│                                                             │
│  ┌─ Screenshots ────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  🖼 Drag & drop images, or [Browse Files]             │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │          │  │          │  │          │             │   │
│  │  │ [img 1]  │  │ [img 2]  │  │  + Add   │             │   │
│  │  │          │  │          │  │  more     │             │   │
│  │  ├──────────┤  ├──────────┤  │          │             │   │
│  │  │List view │  │Form view │  └──────────┘             │   │
│  │  │  [✕]     │  │  [✕]     │                           │   │
│  │  └──────────┘  └──────────┘                           │   │
│  │                                                       │   │
│  │  Each image can have a label:                         │   │
│  │  "This is the list view" / "This is the form"         │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                             │
│  [← Back]    [Skip]                    [Next →]             │
└─────────────────────────────────────────────────────────────┘

Step 3: Describe Your Screens (enhanced)
┌─────────────────────────────────────────────────────────────┐
│  What screens do you need?                                   │
│                                                             │
│  PRD detected 2 screens. AI pre-filled descriptions:        │
│                                                             │
│  Screen 1: Leave Request List              [📄 From PRD]    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ A list of all leave requests with status, employee   │    │
│  │ name, dates, and type of leave. Manager can approve  │    │
│  │ or reject from this view.                            │    │
│  └─────────────────────────────────────────────────────┘    │
│  🖼 Reference: screenshot-1.png attached                    │
│                                                             │
│  Screen 2: Leave Request Form              [📄 From PRD]    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Form to submit a new leave request. Fields: start    │    │
│  │ date, end date, leave type (dropdown), reason.       │    │
│  └─────────────────────────────────────────────────────┘    │
│  🖼 Reference: screenshot-2.png attached                    │
│                                                             │
│  [+ Add Another Screen]                                     │
│                                                             │
│  [← Back]              [Generate Screens →]                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.5 Updated Chat with Image Support

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI Chat                                               [⚙ Model]   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │ You: "Here's a screenshot of how Zoho CRM does their     │     │
│  │ list view. Make our leave list look similar but use our   │     │
│  │ DS components."                                           │     │
│  │                                                           │     │
│  │ 🖼 [screenshot-crm-list.png]  ← thumbnail preview        │     │
│  │                                                           │     │
│  │ AI: "I see the CRM list uses a table with inline status   │     │
│  │ badges, action dropdowns, and a search bar. I've          │     │
│  │ recreated this using:                                     │     │
│  │  • Table component for the data grid                      │     │
│  │  • Badge (variant: success/warning/destructive) for status│     │
│  │  • DropdownMenu for row actions                           │     │
│  │  • InputPrefix with search icon for the filter bar        │     │
│  │                                                           │     │
│  │ Preview updated."                                         │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │ Type your message...              [📎 Attach] [📄 PRD] [Send] │ │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│  📎 Attach: Images (.png, .jpg, .webp)                              │
│  📄 PRD: Upload or update the PRD document                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.6 Stratus — Attachments Storage

```
creator-studio-bucket/
│
├── features/{id}/
│   ├── prd.md                          ← Extracted PRD text (always markdown)
│   ├── attachments/
│   │   ├── PRD-original.pdf            ← Original uploaded PRD file
│   │   ├── reference-001.png           ← Screenshot upload #1
│   │   ├── reference-001-label.txt     ← "This is the list view"
│   │   ├── reference-002.png           ← Screenshot upload #2
│   │   ├── reference-002-label.txt     ← "This is the form view"
│   │   ├── chat-img-msg-uuid-1.png     ← Image attached in chat message
│   │   └── chat-img-msg-uuid-2.jpg     ← Another chat image
│   └── screens/
│       └── ...
```

### 2.7 Data Store — Attachments Table

```
┌──────────────────────────────────────────────────────────────┐
│  Attachments                                                  │
│                                                              │
│  attachment_id     TEXT PK      UUID                         │
│  feature_id        TEXT FK      → Features                    │
│  message_id        TEXT FK      → Messages (nullable, if from chat) │
│  type              TEXT         "prd" | "screenshot" | "reference" │
│  original_filename TEXT         e.g. "PRD-Leave-Mgmt.pdf"    │
│  mime_type         TEXT         e.g. "application/pdf", "image/png" │
│  file_size         INT          Bytes                         │
│  stratus_key       TEXT         Stratus object path           │
│  extracted_text    TEXT         For PRDs: extracted plain text (truncated) │
│  label             TEXT         PM's description, e.g. "List view mockup" │
│  created_at        DATETIME                                   │
└──────────────────────────────────────────────────────────────┘
```

### 2.8 How PRD + Screenshots Flow into the AI Prompt

```
┌─────────────────────────────────────────────────────────────────┐
│                   Prompt Assembly with Attachments               │
│                                                                 │
│  ┌── System Message ──────────────────────────────────────────┐ │
│  │  AGENTS.md rules + DS manifest.json                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌── PRD Context (if uploaded) ───────────────────────────────┐ │
│  │  "The PM has provided the following PRD document:           │ │
│  │                                                             │ │
│  │  # Leave Management PRD                                     │ │
│  │  ## User Story 1: As a manager, I want to...               │ │
│  │  ## Screens Required:                                       │ │
│  │  - List view: shows all requests with...                    │ │
│  │  - Form view: fields include start date, end date...        │ │
│  │  ## Business Rules:                                         │ │
│  │  - Max 30 days per year...                                  │ │
│  │                                                             │ │
│  │  Use this PRD to inform the screen generation."             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌── Screenshots (if uploaded) — vision content ──────────────┐ │
│  │                                                             │ │
│  │  Image 1: [base64 or Stratus URL]                          │ │
│  │  Label: "This is the list view from Zoho Creator"          │ │
│  │                                                             │ │
│  │  Image 2: [base64 or Stratus URL]                          │ │
│  │  Label: "This is the form view from Zoho Creator"          │ │
│  │                                                             │ │
│  │  "Analyze these reference images and recreate the layouts   │ │
│  │   using Creator DS components. Match the visual hierarchy   │ │
│  │   and layout intent, but use DS tokens for styling."        │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌── User Message ────────────────────────────────────────────┐ │
│  │  PM's text: "Generate the list view and form view           │ │
│  │  based on the PRD and these screenshots."                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌── Conversation History (if chat mode) ─────────────────────┐ │
│  │  [previous messages...]                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.9 Provider Capability Matrix for Vision

```
| Provider        | Text | Vision | PRD Parsing | Max Images | Notes |
|-----------------|------|--------|-------------|------------|-------|
| OpenAI GPT-4o   |  ✅  |   ✅   |     ✅      |    20      | Best vision |
| Anthropic Claude |  ✅  |   ✅   |     ✅      |    20      | Strong vision |
| Google Gemini    |  ✅  |   ✅   |     ✅      |    16      | Good vision |
| Zoho Zia         |  ✅  |   ⚠️   |     ✅      |    TBD     | Check vision support |
| Zoho Platform AI |  ✅  |   ⚠️   |     ✅      |    TBD     | Check vision support |
| Local LLM        |  ✅  |   ⚠️   |     ✅      |    varies  | Depends on model |

When a non-vision provider is selected but images are attached:
  → Auto-route images to a vision-capable provider for description
  → Pass the text description to the selected provider
  → Transparent to the PM
```

### 2.10 API Endpoints — File Uploads

```
PRD Upload
  POST   /api/features/:id/prd           → Upload PRD document
         Content-Type: multipart/form-data
         Body: { file: <PRD.pdf> }
         Returns: { extracted_text, page_count, detected_screens[] }

Screenshot Upload
  POST   /api/features/:id/screenshots   → Upload reference images
         Content-Type: multipart/form-data
         Body: { files: [<img1.png>, <img2.png>], labels: ["list view", "form view"] }
         Returns: { attachments: [{ id, stratus_key, thumbnail_url }] }

Chat with Attachments
  POST   /api/generate/chat              → Chat message with optional images
         Content-Type: multipart/form-data
         Body: { 
           conversation_id, feature_id, screen_id,
           message: "Make it look like this screenshot",
           images: [<screenshot.png>],
           provider: "auto"
         }

Attachment Management
  GET    /api/features/:id/attachments    → List all attachments for a feature
  DELETE /api/attachments/:id             → Delete an attachment
```

---

## 3. Multi-Provider AI Gateway

Creator Studio supports **multiple AI providers** behind a unified gateway. The PM doesn't need to know which model is running — but power users can choose.

### 2.1 Provider Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Gateway (Catalyst Function)            │
│                                                               │
│  Incoming request:                                            │
│    { provider: "auto", prompt: "...", context: {...} }        │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Provider Router                       │  │
│  │                                                         │  │
│  │  "auto"     → picks best provider based on task type    │  │
│  │  "zia"      → Zoho Zia API                              │  │
│  │  "openai"   → OpenAI API (GPT-4o / o3)                  │  │
│  │  "anthropic" → Anthropic API (Claude Sonnet/Opus)        │  │
│  │  "google"   → Google Gemini API                          │  │
│  │  "local"    → Local/Self-hosted LLM (Ollama/vLLM)       │  │
│  │  "platform" → Zoho Platform AI (internal)                │  │
│  │                                                         │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                               │
│               ▼                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Prompt Composer                            │  │
│  │                                                         │  │
│  │  Assembles the full prompt from:                        │  │
│  │    1. System prompt (AGENTS.md rules)                   │  │
│  │    2. DS manifest (available components + props)        │  │
│  │    3. Conversation history (for chat mode)              │  │
│  │    4. Current screen code (for modifications)           │  │
│  │    5. PM's message or wizard inputs                     │  │
│  │                                                         │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                               │
│               ▼                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Response Processor                         │  │
│  │                                                         │  │
│  │  1. Extract .tsx code blocks from AI response           │  │
│  │  2. Validate: uses only DS components? tokens? font?    │  │
│  │  3. Store code to Stratus                               │  │
│  │  4. Generate preview bundle                             │  │
│  │  5. Return structured response + preview URL            │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Provider Configuration

```
Data Store → `AIProviders` Table

| Column         | Type    | Description                                     |
|----------------|---------|--------------------------------------------------|
| provider_id    | TEXT PK | e.g. "zia", "openai", "anthropic", "local"       |
| display_name   | TEXT    | e.g. "Zoho Zia", "OpenAI GPT-4o"                |
| api_endpoint   | TEXT    | Base URL for the provider's API                  |
| api_key_ref    | TEXT    | Catalyst Segment secret key reference            |
| model_id       | TEXT    | e.g. "gpt-4o", "claude-sonnet-4-20250514", "gemini-2.5-pro"   |
| is_enabled     | BOOL   | Whether this provider is active                   |
| is_default     | BOOL   | Whether this is the default "auto" choice         |
| max_tokens     | INT    | Max output tokens for this provider               |
| priority       | INT    | Fallback order (1 = try first, 2 = fallback)     |
```

### 2.3 Provider Selection Logic

```
"auto" mode selection:
  1. Try the provider marked is_default = true
  2. If it fails (rate limit, timeout, error):
     → fall back to next provider by priority order
  3. If all fail → return error to PM

PM can also explicitly pick a provider:
  Settings → "AI Model" dropdown → shows all is_enabled = true providers
```

### 2.4 Local / Self-Hosted LLM Support

For teams that want to run models on-prem or on their own GPU:

```
┌─────────────────────────────────────────────┐
│  Local LLM Setup                             │
│                                              │
│  Ollama / vLLM / LocalAI running at:         │
│    http://internal-gpu-server:11434/v1/chat   │
│                                              │
│  Provider config:                            │
│    api_endpoint: "http://gpu-server:11434"   │
│    model_id: "llama3.1:70b"                  │
│    api_key_ref: null (no auth needed)        │
│                                              │
│  Catalyst function connects via HTTP         │
│  (same interface as OpenAI-compatible API)   │
└─────────────────────────────────────────────┘
```

### 2.5 Zoho Platform AI (Internal)

```
For Zoho internal teams:
  → Uses Zoho's internal AI platform APIs
  → No external API calls — data stays within Zoho infra
  → Configured via internal endpoint + service token
  → Provider ID: "platform"
```

---

## 3. Ideation Chat — Data Model

Every feature has a **conversation thread** where the PM interacts with the AI.

### 3.1 Storage Design

```
Data Store Tables:

┌──────────────────────────────────────────────────────────┐
│  Conversations                                            │
│                                                          │
│  conversation_id  TEXT PK    UUID                        │
│  feature_id       TEXT FK    → Features.feature_id       │
│  screen_id        TEXT FK    → Screens.screen_id (null = feature-level) │
│  title            TEXT       Auto-generated or PM-named   │
│  provider_used    TEXT       Which AI provider was used    │
│  created_at       DATETIME                                │
│  updated_at       DATETIME                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Messages                                                 │
│                                                          │
│  message_id       TEXT PK    UUID                        │
│  conversation_id  TEXT FK    → Conversations              │
│  role             TEXT       "user" | "assistant" | "system" │
│  content          TEXT       Message text                  │
│  code_snapshot    TEXT       Stratus key for code at this point │
│  token_count      INT        Tokens used for this message  │
│  provider_used    TEXT       Which provider generated this  │
│  created_at       DATETIME                                │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Conversation Flow

```
Feature #003 "Leave Management"
│
├── Conversation 1: "Initial Generation"         (from Prompt Wizard)
│   ├── [system]  AGENTS.md + DS manifest
│   ├── [user]    "Create a leave request form with date picker..."
│   ├── [assistant] "Here's the LeaveRequestFormScreen using..."
│   │              → code_snapshot: features/003/screens/leave-form/v1.tsx
│   ├── [user]    "Add a 'reason' dropdown with predefined options"
│   ├── [assistant] "Updated. Added a Select component with options..."
│   │              → code_snapshot: features/003/screens/leave-form/v2.tsx
│   └── [user]    "Perfect, let's keep this version"
│
├── Conversation 2: "Dashboard Widget"            (from Chat)
│   ├── [system]  AGENTS.md + DS manifest
│   ├── [user]    "Create a dashboard widget showing pending leaves"
│   ├── [assistant] "Here's a Card-based widget..."
│   │              → code_snapshot: features/003/screens/dashboard/v1.tsx
│   └── ...
│
└── Conversation 3: "Iteration on Form"           (from Chat)
    ├── [system]  AGENTS.md + DS manifest + current code of leave-form
    ├── [user]    "The form needs validation. Show inline errors."
    ├── [assistant] "Added validation. Using Badge variant destructive..."
    │              → code_snapshot: features/003/screens/leave-form/v3.tsx
    └── ...
```

### 3.3 Context Window Management

AI models have limited context windows. Here's how we manage it:

```
┌─────────────────────────────────────────────────────────────┐
│              Context Window Strategy                         │
│                                                             │
│  Priority 1 (always included):                              │
│    • System prompt (AGENTS.md rules) .............. ~2K tokens │
│    • DS manifest (components + props) ............ ~1K tokens │
│    • Current screen code (if modifying) .......... ~2-4K tokens │
│    • PM's latest message ......................... variable    │
│                                                             │
│  Priority 2 (included if space allows):                     │
│    • Last 5 messages from conversation ........... ~2-5K tokens │
│    • PRD excerpt (relevant section) .............. ~1K tokens │
│                                                             │
│  Priority 3 (summarized if too long):                       │
│    • Earlier conversation messages → summarized ... ~500 tokens │
│    • Other screens in the feature (names only) ... ~200 tokens │
│                                                             │
│  Total target: ≤ 16K tokens input (leaves room for output)  │
└─────────────────────────────────────────────────────────────┘
```

**Sliding window with summarization:**
```
If conversation > 20 messages:
  1. Summarize messages 1–15 into a single "context summary"
  2. Keep messages 16–20 verbatim
  3. Always keep the system prompt + current code
```

---

## 4. Prompt Wizard — Phase 1 (Initial Generation)

The guided flow that creates screens from scratch.

### 4.1 Wizard Steps

```
Step 1: Feature Basics
┌─────────────────────────────────────────────────┐
│  What are you building?                          │
│                                                 │
│  Feature name: [Leave Management          ]     │
│  Description:  [Employees can request leave,    │
│                 managers can approve/reject]     │
│                                                 │
│                              [Next →]           │
└─────────────────────────────────────────────────┘

Step 2: Pick a Template (optional)
┌─────────────────────────────────────────────────┐
│  Choose a layout pattern (or skip for AI to     │
│  decide)                                         │
│                                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │CardGrid│  │Tabbed  │  │Link    │            │
│  │        │  │Sections│  │Category│            │
│  └────────┘  └────────┘  └────────┘            │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │Split   │  │Bread-  │  │Billing │            │
│  │Panel   │  │crumb   │  │        │            │
│  └────────┘  └────────┘  └────────┘            │
│                                                 │
│  [← Back]    [Skip]         [Next →]            │
└─────────────────────────────────────────────────┘

Step 3: Describe Your Screens
┌─────────────────────────────────────────────────┐
│  What screens do you need?                       │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ Describe what each screen should show.   │    │
│  │                                          │    │
│  │ Screen 1: A list of all leave requests   │    │
│  │ with status (pending/approved/rejected), │    │
│  │ employee name, dates, and type of leave. │    │
│  │ Manager can approve/reject from this     │    │
│  │ view.                                    │    │
│  │                                          │    │
│  │ Screen 2: A form to submit a new leave   │    │
│  │ request. Fields: start date, end date,   │    │
│  │ leave type (dropdown), reason (optional).│    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [← Back]              [Generate Screens →]     │
└─────────────────────────────────────────────────┘
```

### 4.2 What Happens on "Generate"

```
PM clicks [Generate Screens →]
    │
    ▼
Web Client → POST /api/generate/wizard
    │
    │  Payload:
    │  {
    │    feature_id: "003",
    │    template: "BreadcrumbDetailTemplate",  // or null
    │    screens: [
    │      { name: "Leave Requests List", description: "..." },
    │      { name: "Leave Request Form", description: "..." }
    │    ],
    │    provider: "auto"   // or user-selected
    │  }
    │
    ▼
AI Gateway Function:
    │
    ├── 1. Create Conversation record in Data Store
    │      (type: "wizard", feature_id: "003")
    │
    ├── 2. Compose system prompt:
    │      ┌────────────────────────────────────────┐
    │      │ SYSTEM PROMPT                           │
    │      │                                         │
    │      │ You are a UI engineer using the Creator │
    │      │ Design System. Follow these rules:      │
    │      │                                         │
    │      │ [full AGENTS.md]                        │
    │      │                                         │
    │      │ Available components:                    │
    │      │ [manifest.json — atoms, molecules,      │
    │      │  organisms, templates with props]       │
    │      │                                         │
    │      │ Template to use: BreadcrumbDetailTemplate│
    │      │                                         │
    │      │ Output format:                           │
    │      │ - One code block per screen              │
    │      │ - Each block starts with // SCREEN: name │
    │      │ - Use only DS components                 │
    │      │ - Follow token rules for colors/spacing  │
    │      └────────────────────────────────────────┘
    │
    ├── 3. Send to AI provider (route via provider config)
    │
    ├── 4. Receive response → parse code blocks
    │
    ├── 5. Validate each screen:
    │      ✓ Uses only DS components from manifest?
    │      ✓ Uses --cds-* tokens, not hex colors?
    │      ✓ Uses 'Zoho Puvi' font (or no font override)?
    │      ✓ Has TopBar + LeftNav shell?
    │      ✓ Valid JSX/TSX syntax?
    │
    ├── 6. Store to Stratus:
    │      features/003/screens/leave-list/current.tsx
    │      features/003/screens/leave-form/current.tsx
    │
    ├── 7. Insert Screen records in Data Store
    │
    ├── 8. Save conversation messages (system + user + assistant)
    │
    └── 9. Return response to client:
           {
             screens: [
               { id: "leave-list", name: "Leave Requests List", previewReady: true },
               { id: "leave-form", name: "Leave Request Form", previewReady: true }
             ],
             conversation_id: "conv-uuid-123",
             provider_used: "anthropic"
           }
    │
    ▼
Web Client:
    - Shows generated screens in preview pane
    - Opens chat sidebar for iteration (Phase 2)
```

---

## 5. Ideation Chat — Phase 2 (Iterative Refinement)

After initial generation, the PM iterates via a chat interface.

### 5.1 Chat UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Creator Studio — Leave Management (#003)                            │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Screens    │              Live Preview                              │
│             │  ┌───────────────────────────────────────────────┐    │
│  ● Leave    │  │  ┌─────────────────────────────────────────┐  │    │
│    List  ←  │  │  │ TopBar                                  │  │    │
│             │  │  ├─────┬───────────────────────────────────┤  │    │
│  ○ Leave    │  │  │Left │                                   │  │    │
│    Form     │  │  │Nav  │   [Search: ___________]           │  │    │
│             │  │  │     │                                   │  │    │
│             │  │  │     │   ┌─────┬──────┬──────┬─────┐    │  │    │
│             │  │  │     │   │Name │Dates │Status│Action│    │  │    │
│             │  │  │     │   ├─────┼──────┼──────┼─────┤    │  │    │
│             │  │  │     │   │John │Jul 10│Pend. │[✓][✗]│   │  │    │
│             │  │  │     │   │Jane │Jul 12│Appr. │ —    │    │  │    │
│             │  │  │     │   └─────┴──────┴──────┴─────┘    │  │    │
│             │  │  └─────┴───────────────────────────────────┘  │    │
│             │  └───────────────────────────────────────────────┘    │
│             │                                                       │
│─────────────┼───────────────────────────────────────────────────────┤
│             │                                                       │
│  Chat       │  AI Chat                                     [⚙ Model]│
│  History    │                                                       │
│             │  ┌───────────────────────────────────────────────┐    │
│  Conv 1:    │  │ You: "Add a search bar above the table"       │    │
│  Initial    │  │                                               │    │
│  generation │  │ AI: "Done. Added InputPrefix with a search   │    │
│             │  │ icon. The table now filters by employee name. │    │
│  Conv 2: ← │  │ Preview updated."                             │    │
│  Iteration  │  │                                               │    │
│             │  │ You: "Also add a status filter dropdown"      │    │
│             │  │                                               │    │
│             │  │ AI: "Added a Select with options: All,        │    │
│             │  │ Pending, Approved, Rejected. Placed next to   │    │
│             │  │ the search bar."                              │    │
│             │  └───────────────────────────────────────────────┘    │
│             │                                                       │
│             │  ┌───────────────────────────────────────────────┐    │
│             │  │ Type your message...                    [Send] │    │
│             │  └───────────────────────────────────────────────┘    │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 5.2 Chat Message Flow

```
PM types: "Add a badge showing leave balance next to the employee name"
    │
    ▼
Web Client → POST /api/generate/chat
    │
    │  Payload:
    │  {
    │    conversation_id: "conv-uuid-456",
    │    feature_id: "003",
    │    screen_id: "leave-list",
    │    message: "Add a badge showing leave balance next to the employee name",
    │    provider: "auto"
    │  }
    │
    ▼
AI Gateway Function:
    │
    ├── 1. Load conversation history from Data Store
    │      (last N messages from this conversation_id)
    │
    ├── 2. Load current screen code from Stratus
    │      features/003/screens/leave-list/current.tsx
    │
    ├── 3. Compose prompt:
    │      ┌────────────────────────────────────────────┐
    │      │ [System] AGENTS.md + manifest.json          │
    │      │                                             │
    │      │ [System] Current screen code:               │
    │      │ ```tsx                                       │
    │      │ // ... current leave-list screen code        │
    │      │ ```                                          │
    │      │                                             │
    │      │ [Previous messages — last 5]                 │
    │      │                                             │
    │      │ [User] "Add a badge showing leave balance   │
    │      │ next to the employee name"                   │
    │      │                                             │
    │      │ [Instructions] Return the FULL updated      │
    │      │ screen code. Mark changed sections with     │
    │      │ // CHANGED comments. Explain what you did.  │
    │      └────────────────────────────────────────────┘
    │
    ├── 4. Send to AI provider
    │
    ├── 5. Parse response:
    │      - Extract explanation text
    │      - Extract updated .tsx code block
    │
    ├── 6. Validate code (DS compliance check)
    │
    ├── 7. Save new version to Stratus:
    │      features/003/screens/leave-list/current.tsx  (overwritten)
    │      features/003/screens/leave-list/v3.tsx       (snapshot)
    │
    ├── 8. Save messages to Data Store:
    │      [user] message + [assistant] response + code_snapshot key
    │
    └── 9. Return to client:
           {
             reply: "Added a Badge component next to each employee name showing their remaining leave balance...",
             screen_updated: true,
             code_snapshot: "features/003/screens/leave-list/v3.tsx",
             preview_ready: true
           }
    │
    ▼
Web Client:
    - Shows AI reply in chat
    - Live preview refreshes with updated screen
    - Version counter increments (v2 → v3)
```

---

## 6. DS Compliance Validator

Every AI-generated screen passes through a validator before storage.

### 6.1 Validation Rules

```
┌─────────────────────────────────────────────────────────────┐
│                  DS Compliance Validator                      │
│                                                               │
│  Rule 1: Component Check                                      │
│    ✓ All imported components exist in manifest.json            │
│    ✗ FAIL if: import { SomeWidget } from 'some-lib'           │
│    ✗ FAIL if: raw <div>, <button>, <input> where DS has one   │
│                                                               │
│  Rule 2: Token Check                                          │
│    ✓ Colors use var(--cds-*) tokens                           │
│    ✗ FAIL if: color: #0D4EF2 or color: blue                  │
│    ✓ Spacing uses var(--cds-space-*) tokens                   │
│    ✗ FAIL if: padding: 16px (should be var(--cds-space-16))   │
│                                                               │
│  Rule 3: Font Check                                           │
│    ✓ No fontFamily overrides found                            │
│    ✗ FAIL if: fontFamily: "Inter" or fontFamily: "Roboto"     │
│                                                               │
│  Rule 4: Structure Check                                      │
│    ✓ Has TopBar + LeftNav shell                               │
│    ✗ FAIL if: page content without shell wrapper              │
│                                                               │
│  Rule 5: Syntax Check                                         │
│    ✓ Valid TSX syntax (parsed by SWC/Babel)                   │
│    ✗ FAIL if: syntax errors                                   │
│                                                               │
│  On validation failure:                                       │
│    → Auto-fix if possible (e.g., replace hex with token)      │
│    → Re-prompt AI: "Fix these violations: [list]"             │
│    → Max 2 retry attempts before showing error to PM          │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Auto-Fix Pipeline

```
AI generates code
    │
    ▼
Validator scans for violations
    │
    ├── No violations → ✅ Store & preview
    │
    ├── Auto-fixable violations (hex colors, raw px values):
    │   → Apply regex-based fixes
    │   → Re-validate
    │   → ✅ Store & preview (with "auto-fixed" note)
    │
    └── Non-fixable violations (wrong components, bad structure):
        → Re-prompt AI with error list
        → Retry (max 2 times)
        → If still failing → show to PM with warnings
```

---

## 7. Conversation Storage — Complete Schema

### 7.1 Data Store Tables

```
┌──────────────────────────────────────────────────────────────┐
│  Conversations                                                │
│                                                              │
│  conversation_id   TEXT PK      UUID                         │
│  feature_id        TEXT FK      → Features                    │
│  screen_id         TEXT FK      → Screens (nullable)          │
│  type              TEXT         "wizard" | "chat"             │
│  title             TEXT         Auto or PM-named              │
│  provider_used     TEXT         Primary provider for this conv│
│  total_tokens      INT          Running token count           │
│  message_count     INT          Number of messages            │
│  created_at        DATETIME                                   │
│  updated_at        DATETIME                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Messages                                                     │
│                                                              │
│  message_id        TEXT PK      UUID                         │
│  conversation_id   TEXT FK      → Conversations               │
│  role              TEXT         "system" | "user" | "assistant"│
│  content           TEXT         Message text (markdown)        │
│  code_stratus_key  TEXT         Stratus key for code snapshot  │
│  has_code          BOOL         Whether response contains code│
│  input_tokens      INT          Tokens in this prompt         │
│  output_tokens     INT          Tokens in this response       │
│  provider_used     TEXT         Which provider answered        │
│  model_id          TEXT         e.g. "claude-sonnet-4-20250514"│
│  validation_status TEXT         "passed" | "auto-fixed" | "warning" │
│  sort_order        INT          Message order in conversation  │
│  created_at        DATETIME                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  ConversationSummaries                                        │
│  (created when conversation exceeds 20 messages)              │
│                                                              │
│  summary_id        TEXT PK      UUID                         │
│  conversation_id   TEXT FK      → Conversations               │
│  summary_text      TEXT         Compressed context summary     │
│  covers_messages   TEXT         "1-15" (which messages it covers) │
│  created_at        DATETIME                                   │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Stratus — Chat-Related Objects

```
creator-studio-bucket/
│
├── features/{id}/screens/{slug}/
│   ├── current.tsx              ← Latest code (always up-to-date)
│   ├── v1.tsx                   ← After wizard generation
│   ├── v2.tsx                   ← After chat iteration #1
│   ├── v3.tsx                   ← After chat iteration #2
│   └── ...
│
└── system/
    ├── agents.md                ← Current AGENTS.md (synced from repo)
    ├── system-prompt.md         ← Compiled system prompt template
    └── few-shot-examples/       ← Example input→output pairs for AI
        ├── card-grid-example.tsx
        ├── tabbed-sections-example.tsx
        └── link-category-example.tsx
```

---

## 8. Few-Shot Examples — Teaching the AI

To improve generation quality, we store curated examples in Stratus.

```
System prompt includes:

"Here is an example of a well-built screen using the CardGridTemplate:

```tsx
// SCREEN: Solutions Gallery
import CardGridTemplate from "@/templates/CardGridTemplate"
...
```

Here is an example of a well-built screen using the LinkCategoryTemplate:

```tsx
// SCREEN: Operations Settings
import LinkCategoryTemplate from "@/templates/LinkCategoryTemplate"
...
```

Now generate the screens described below, following the same patterns."
```

**Source of few-shot examples:** The existing screens in `creator-ds-react/src/screens/` (Zia Configuration, Portal Security) serve as the initial training examples. As PMs generate and approve more screens, the best ones get promoted to few-shot examples.

---

## 9. Complete System Flow — End to End

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   PM opens Creator Studio (Catalyst-hosted SPA)                         │
│                                                                         │
│   ┌─ Prompt Wizard ─────────────────────────────────────────────────┐   │
│   │  1. Name the feature                                             │   │
│   │  2. Pick template (optional)                                     │   │
│   │  3. Describe screens                                             │   │
│   │  4. [Generate] →                                                 │   │
│   └──────────┬──────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│   ┌─ AI Gateway (Catalyst Function) ────────────────────────────────┐   │
│   │                                                                  │   │
│   │  Prompt Composer:                                                │   │
│   │    AGENTS.md + manifest.json + PRD + few-shot examples           │   │
│   │                                                                  │   │
│   │  Provider Router:                                                │   │
│   │    Zia → OpenAI → Anthropic → Google → Local → Platform         │   │
│   │    (auto-select or PM choice)                                    │   │
│   │                                                                  │   │
│   │  Response Processor:                                             │   │
│   │    Parse code → Validate DS compliance → Auto-fix → Store        │   │
│   │                                                                  │   │
│   └──────────┬──────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│   ┌─ Storage Layer ─────────────────────────────────────────────────┐   │
│   │                                                                  │   │
│   │  Data Store:                                                     │   │
│   │    Features → Screens → Conversations → Messages                 │   │
│   │                                                                  │   │
│   │  Stratus:                                                        │   │
│   │    Screen code (.tsx) → PRDs → DS bundles → Thumbnails           │   │
│   │                                                                  │   │
│   └──────────┬──────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│   ┌─ Live Preview ──────────────────────────────────────────────────┐   │
│   │                                                                  │   │
│   │  Browser loads:                                                  │   │
│   │    DS bundle (bundle.js + bundle.css) from Stratus               │   │
│   │    Screen .tsx code from Stratus                                 │   │
│   │    In-browser transpiler (SWC WASM) compiles .tsx → JS           │   │
│   │    React renders the screen with real DS components              │   │
│   │                                                                  │   │
│   └──────────┬──────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│   ┌─ Ideation Chat (iterate) ───────────────────────────────────────┐   │
│   │                                                                  │   │
│   │  PM: "Change the layout from cards to a table"                   │   │
│   │  AI: "Updated. Replaced Tile grid with Table component..."       │   │
│   │  Preview refreshes instantly                                     │   │
│   │                                                                  │   │
│   │  PM: "Add sorting on the status column"                         │   │
│   │  AI: "Added sort handler to the Status column header..."         │   │
│   │  Preview refreshes                                               │   │
│   │                                                                  │   │
│   │  (Each iteration: same AI Gateway → validate → store → preview)  │   │
│   │                                                                  │   │
│   └──────────┬──────────────────────────────────────────────────────┘   │
│              │                                                         │
│              ▼                                                         │
│   ┌─ Share & Approve ──────────────────────────────────────────────┐   │
│   │                                                                  │   │
│   │  PM clicks [Share] → generates link                              │   │
│   │  Stakeholder clicks link → sees live preview (no login needed)   │   │
│   │  Stakeholder leaves comments → stored in Data Store              │   │
│   │  PM + Designer approve → status moves to "approved"              │   │
│   │  [Export to Engineering] → zip of .tsx files from Stratus        │   │
│   │                                                                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. API Endpoints — AI Layer

```
Wizard Generation
  POST   /api/generate/wizard          → Initial screen generation from wizard inputs
         Body: { feature_id, template?, screens[], provider? }

Chat Iteration  
  POST   /api/generate/chat            → Send a chat message, get updated code
         Body: { conversation_id, feature_id, screen_id, message, provider? }

Conversation Management
  GET    /api/conversations?feature_id=003         → List conversations for a feature
  GET    /api/conversations/:id                    → Get conversation with messages
  DELETE /api/conversations/:id                    → Delete a conversation

Provider Management
  GET    /api/providers                             → List all configured AI providers
  PUT    /api/providers/:id                         → Update provider config (admin)
  POST   /api/providers/:id/test                    → Test provider connectivity

Code Validation
  POST   /api/validate                              → Validate .tsx code against DS rules
         Body: { code: "..." }

Version Management
  GET    /api/features/:id/screens/:sid/versions    → List all code versions
  GET    /api/features/:id/screens/:sid/versions/:v → Get specific version's code
  POST   /api/features/:id/screens/:sid/revert/:v   → Revert to a previous version
```

---

## 11. Implementation Phases

### Phase 1 — Basic AI Generation (MVP)
- [ ] Build AI Gateway serverless function
- [ ] Implement Prompt Composer (AGENTS.md + manifest injection)
- [ ] Connect to one provider (OpenAI or Anthropic) as default
- [ ] Implement DS Compliance Validator (basic checks)
- [ ] Build Prompt Wizard UI (3-step form)
- [ ] Store generated code to Stratus + metadata to Data Store
- [ ] Basic preview rendering

### Phase 2 — Ideation Chat
- [ ] Build Chat UI component (sidebar layout)
- [ ] Implement conversation storage (Conversations + Messages tables)
- [ ] Context window management (sliding window + summarization)
- [ ] Live preview refresh on each AI response
- [ ] Version snapshots per chat iteration

### Phase 3 — Multi-Provider Support
- [ ] Add Provider Router with fallback logic
- [ ] Configure Zoho Zia as a provider
- [ ] Configure Zoho Platform AI (internal) as a provider
- [ ] Add local LLM support (Ollama-compatible endpoint)
- [ ] PM-facing model selector in Settings/Chat UI

### Phase 4 — Advanced Features
- [ ] Auto-fix pipeline for DS compliance violations
- [ ] Few-shot example management (curate best screens as examples)
- [ ] Conversation summarization for long threads
- [ ] "Undo" button — revert to previous version mid-chat
- [ ] Token usage tracking + cost dashboard per provider
- [ ] Streaming responses (SSE) for real-time AI typing effect

---

## 12. Chat SDK Evaluation — Open Source Options

We evaluated 5 open-source chat SDKs/libraries for powering Creator Studio's ideation chat. Here's the analysis:

### 12.1 Comparison Matrix

```
┌────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Criteria           │ assistant-ui │ Vercel AI SDK│    NLUX      │   reachat    │  prompt-kit  │
├────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Type               │ UI + Runtime │ Hooks + SDK  │ UI Component │ UI Component │ UI Primitives│
│ React/Vite support │ ✅ Yes       │ ✅ Yes       │ ✅ Yes       │ ✅ Yes       │ ✅ Yes       │
│ Streaming          │ ✅ Built-in  │ ✅ Built-in  │ ✅ Built-in  │ ⚠️ BYO       │ ✅ Built-in  │
│ File/Image Upload  │ ✅ Full      │ ✅ Full      │ ❌ No        │ ✅ Full      │ ❌ No        │
│ Vision/Multimodal  │ ✅ Yes       │ ✅ Yes       │ ❌ No        │ ⚠️ Image only│ ❌ No        │
│ Multi-provider     │ ✅ 10+       │ ✅ 20+       │ ✅ 5+        │ ⚠️ BYO       │ ⚠️ BYO       │
│ Tool Calls         │ ✅ Full      │ ✅ Full      │ ❌ No        │ ✅ AG-UI     │ ❌ No        │
│ Custom UI/DS       │ ✅ Primitives│ ✅ Headless  │ ✅ Themes    │ ⚠️ CSS vars  │ ✅ Headless  │
│ Persistence        │ ✅ Built-in  │ ⚠️ Manual    │ ❌ No        │ ✅ Sessions  │ ❌ No        │
│ Conversation Mgmt  │ ✅ Threads   │ ⚠️ Manual    │ ⚠️ Basic     │ ✅ Sessions  │ ❌ No        │
│ Markdown/Code      │ ✅ Built-in  │ ⚠️ Manual    │ ✅ Built-in  │ ✅ Built-in  │ ✅ Built-in  │
│ License            │ MIT          │ Apache 2.0   │ MPL-2.0      │ Apache 2.0   │ MIT          │
│ npm Downloads/wk   │ ~1.2M        │ ~2M+         │ ~5K          │ ~3K          │ ~10K         │
│ Maturity           │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐       │ ⭐⭐⭐       │ ⭐⭐⭐       │
│ Bundle Size        │ ~151KB gz    │ ~50KB gz     │ ~35KB gz     │ ~80KB gz     │ ~15KB gz     │
└────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 12.2 Detailed Analysis

#### 🏆 **assistant-ui** — RECOMMENDED for Creator Studio

```
npm: @assistant-ui/react
URL: https://www.assistant-ui.com
License: MIT
```

**Why it's the best fit:**
- **Primitives-based architecture** — provides unstyled composable primitives (`<ThreadPrimitive>`, `<MessagePrimitive>`, `<ComposerPrimitive>`) that we can wrap with Creator DS components. We're NOT locked into their design.
- **Full file upload support** — drag-drop, paste, programmatic. We can upload PRDs and screenshots natively.
- **Image/vision support** — renders image parts in messages, which maps perfectly to our screenshot workflow.
- **Multi-provider runtime** — has adapters for OpenAI, Anthropic, Google, LangChain, and a `useExternalStoreRuntime` for fully custom backends (our Catalyst functions).
- **Conversation persistence** — built-in thread management with history. We can connect it to our Catalyst Data Store.
- **Tool calls + generative UI** — supports tool invocations with in-chat rendered results. Future-proof for interactive previews.
- **Streaming recovery** — handles disconnects gracefully.
- **1.2M weekly downloads** — heavily production-tested (LangChain, Mastra, Helicone use it).

**How it maps to Creator Studio:**
```
assistant-ui concept       →  Creator Studio usage
─────────────────────────────────────────────────────
Thread                     →  Conversation (per feature/screen)
ThreadPrimitive.Messages   →  Chat message list
ComposerPrimitive.Input    →  Chat input box (styled with DS Input)
ComposerPrimitive.AddAttachment → PRD/screenshot upload button
MessagePrimitive.Content   →  AI response with code blocks
useExternalStoreRuntime    →  Connects to our Catalyst API backend
Tool call UI               →  Inline preview rendering
```

**Integration pattern:**
```tsx
// Creator Studio chat panel using assistant-ui primitives
// Styled with Creator DS components — no alien UI

import { ThreadPrimitive, ComposerPrimitive, MessagePrimitive } from "@assistant-ui/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

function CreatorStudioChat() {
  return (
    <ThreadPrimitive.Root>
      <ScrollArea>
        <ThreadPrimitive.Messages
          components={{
            UserMessage: CreatorUserMessage,      // our DS-styled message bubble
            AssistantMessage: CreatorAIMessage,    // our DS-styled AI response
          }}
        />
      </ScrollArea>
      <ComposerPrimitive.Root>
        <ComposerPrimitive.AddAttachment>
          <Button variant="ghost" size="sm">📎 Attach</Button>
        </ComposerPrimitive.AddAttachment>
        <ComposerPrimitive.Input asChild>
          <Input placeholder="Describe what you want to change..." />
        </ComposerPrimitive.Input>
        <ComposerPrimitive.Send>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </ThreadPrimitive.Root>
  )
}
```

#### 🥈 **Vercel AI SDK** — Best as the BACKEND layer

```
npm: ai + @ai-sdk/react
URL: https://ai-sdk.dev
License: Apache 2.0
```

**Strengths:**
- **Best multi-provider support** — 20+ providers including OpenAI, Anthropic, Google, Mistral, Cohere, AWS Bedrock, Azure, Ollama, custom OpenAI-compatible endpoints.
- **useChat hook** — production-grade chat state management with streaming.
- **Headless** — provides hooks only, no UI at all. We build 100% custom UI with DS components.
- **Framework-agnostic** — works with plain React/Vite (not just Next.js).
- **Image/file support** — handles multimodal inputs (images as data URLs or URLs).

**Weakness for us:**
- **No UI components** — we'd build everything from scratch. More work but total control.
- **No conversation persistence** — we'd manage all storage ourselves (which we're doing anyway via Catalyst).
- **No thread management** — just a message array.

**Verdict:** Use as the **provider layer** under assistant-ui, or use standalone if we want maximum control.

#### 🥉 **reachat** — Best for quick start, less customizable

```
npm: reachat
URL: https://reachat.dev
License: Apache 2.0
```

**Strengths:**
- **Full-featured UI out of the box** — file uploads, session management, markdown, code highlighting.
- **Session grouping** — automatic conversation organization.
- **3 view modes** — console, companion, chat-only.

**Weakness for us:**
- **Opinionated UI** — harder to skin with Creator DS components. Uses its own design.
- **No built-in streaming** — delegates to backend, which is fine but less integrated.
- **Smaller community** — ~3K downloads/week.

#### NLUX — Too limited

- No file uploads, no vision support, no tool calls.
- Beautiful default UI but limited customization depth.
- Only 5K downloads/week, smaller ecosystem.
- **Not recommended** for Creator Studio's needs.

#### prompt-kit — Good for individual components

- Very lightweight (~15KB), shadcn/ui based.
- Great for cherry-picking individual components (markdown renderer, code blocks).
- No streaming/provider infrastructure.
- **Could supplement** our primary choice for specific rendering components.

### 12.3 Recommended Architecture Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                Creator Studio — Chat Tech Stack                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  UI Layer: assistant-ui primitives                        │  │
│  │  • ThreadPrimitive, MessagePrimitive, ComposerPrimitive   │  │
│  │  • Wrapped with Creator DS components (Button, Input,     │  │
│  │    ScrollArea, Card, Badge, etc.)                         │  │
│  │  • File attachments via ComposerPrimitive.AddAttachment   │  │
│  │  • Image previews via MessagePrimitive (vision support)   │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐  │
│  │  Runtime Layer: useExternalStoreRuntime                    │  │
│  │  • Connects assistant-ui to our Catalyst backend API      │  │
│  │  • Manages threads, messages, streaming state             │  │
│  │  • Handles file upload → Stratus → AI Gateway             │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐  │
│  │  Backend Layer: Catalyst Serverless Functions              │  │
│  │  • AI Gateway with provider router                        │  │
│  │  • Uses Vercel AI SDK (@ai-sdk/provider-*) for            │  │
│  │    multi-provider support (OpenAI, Anthropic, Google,     │  │
│  │    Ollama, Zoho Zia, Platform AI)                         │  │
│  │  • Stores conversations in Data Store                     │  │
│  │  • Stores code + attachments in Stratus                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Optional supplements:                                          │
│  • prompt-kit components for markdown/code block rendering      │
│  • Custom preview rendering via assistant-ui tool call UI       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Why this combo works:**
1. **assistant-ui** gives us a complete chat framework with primitives we can style with our DS
2. **Vercel AI SDK providers** give us the widest LLM provider support on the backend
3. **Creator DS components** wrap all UI — the chat looks native to our design system
4. **Catalyst functions** handle all backend logic — no lock-in to Vercel infrastructure

### 12.4 Key npm Packages

```bash
# Frontend (React/Vite app)
npm install @assistant-ui/react           # Chat UI primitives + runtime
npm install @assistant-ui/react-markdown  # Markdown rendering in messages

# Backend (Catalyst Node.js functions) — pick providers as needed
npm install ai                             # Vercel AI SDK core
npm install @ai-sdk/openai                 # OpenAI provider
npm install @ai-sdk/anthropic              # Anthropic provider
npm install @ai-sdk/google                 # Google Gemini provider
npm install @ai-sdk/openai-compatible      # For Ollama / local LLMs / Zoho Zia
```

---

## 13. Open Questions — AI Layer

- [ ] **Streaming:** Should AI responses stream token-by-token (SSE), or wait for full response? Streaming is better UX but more complex with Catalyst functions.
- [ ] **Code diffing:** Show PM a visual diff of what AI changed, or just update the preview silently?
- [ ] **Multi-screen edits:** Can PM say "update all screens to use the new color scheme" in one chat message?
- [ ] **AI model fine-tuning:** Should we fine-tune a model on existing Creator DS screens for better output quality?
- [ ] **Rate limiting:** How many AI generations per PM per day? (Cost control)
- [ ] **Prompt templates:** Should PMs be able to save/share prompt templates for common screen types?
