# FrictionAI — UI Flow & Screen Inventory

**Version:** v1.0  
**Date:** 2026-07-16  
**Status:** Draft  

---

## 1. User Journey Overview

```
Landing Page
    │
    ▼
Onboarding Wizard
    ├── Step 1: Company Context
    ├── Step 2: Pain Radar (Friction Selector)
    └── Step 3: Priority Question
         │
         ▼
    Friction Map (Estimated)  ← "Aha Moment"
         │
         ├── [Connect Tools] → Tool Integration → Friction Map (Confirmed)
         │
         └── [See Solution] → Solution Detail
                                  ├── Creator App Spec
                                  └── Process Playbook
                                           │
                                           ▼
                                    Dashboard (Ongoing)
                                      ├── Friction Map (live)
                                      ├── Solutions Tracker
                                      ├── ROI Report
                                      └── AI Chat
```

---

## 2. Screen Inventory

| # | Screen ID | Screen Name | Entry Point | Primary CTA |
|---|---|---|---|---|
| 1 | `landing` | Landing Page | Direct URL | Start Free Audit |
| 2 | `onboard-1` | Onboarding: Company Context | Landing CTA | Next → |
| 3 | `onboard-2` | Onboarding: Pain Radar | Step 1 | Next → |
| 4 | `onboard-3` | Onboarding: Priority Question | Step 2 | Show My Friction Map → |
| 5 | `generating` | Generating Friction Map (Loading) | Step 3 | (auto-advances) |
| 6 | `friction-map` | Friction Map (Estimated) | Loading screen | See Solution / Connect Tools |
| 7 | `connect-tools` | Tool Integration Hub | Friction Map CTA | Connect (per tool) |
| 8 | `solution-detail` | Solution Detail Page | Friction Map item | Build in Creator / Download Playbook |
| 9 | `dashboard` | Executive Dashboard | Post-onboarding | (navigation hub) |
| 10 | `ai-chat` | AI Conversation Interface | Dashboard | Ask AI |
| 11 | `roi-report` | ROI Impact Report | Dashboard | Export / Share |

---

## 3. Detailed Screen Specs

---

### Screen 1: Landing Page (`landing`)

**Purpose:** Convert visitors to start the free audit. Immediately communicate the value proposition.

**Layout:** Full-screen hero + 3 value props + social proof + CTA

**Key Elements:**
```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                                        [Sign In]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│         Find where your company bleeds time.                  │
│         Fix it with Zoho Creator.                             │
│                                                               │
│    In 5 minutes, get a precise map of where your              │
│    organization loses productivity — and a ready-to-build      │
│    Zoho Creator app to fix it.                                │
│                                                               │
│            [→ Start Free Friction Audit]                      │
│            No tool connections needed to start                │
│                                                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  🔍 FIND     │  │  📋 SPECIFY  │  │  🚀 BUILD    │        │
│  │              │  │              │  │              │        │
│  │  AI detects  │  │  We generate │  │  Deploy in   │        │
│  │  your        │  │  the exact   │  │  Zoho Creator│        │
│  │  operational │  │  Creator app │  │  in days,    │        │
│  │  friction    │  │  spec to     │  │  not months  │        │
│  │  in 5 min    │  │  fix it      │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                               │
├────────────────────────────────────────────────────────────────┤
│  "We identified $2.3M in recoverable time in our first audit" │
│  — COO, 400-person Manufacturing Co.                         │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Primary CTA → `onboard-1`
- Sign In → Dashboard (returning users)

---

### Screen 2: Onboarding Step 1 — Company Context (`onboard-1`)

**Purpose:** Collect minimal context to enable benchmark-based friction prediction.

**Progress:** Step 1 of 3

**Layout:** Clean wizard, centered card, progress indicator

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ●──────○──────○   Step 1 of 3                                │
│  Company   Pain   Priority                                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Tell us about your company                              │ │
│  │  (We use this to find matching benchmarks)               │ │
│  │                                                          │ │
│  │  Industry                                                │ │
│  │  ┌─────────────────────────────────────┐                 │ │
│  │  │  Select your industry         [▾]   │                 │ │
│  │  └─────────────────────────────────────┘                 │ │
│  │  Manufacturing · Retail · Professional Services ·        │ │
│  │  Healthcare · Logistics · Technology · Finance           │ │
│  │                                                          │ │
│  │  Company Size                                            │ │
│  │  ○ 50–200 employees                                      │ │
│  │  ● 200–500 employees                                     │ │
│  │  ○ 500–2000 employees                                    │ │
│  │  ○ 2000+ employees                                       │ │
│  │                                                          │ │
│  │  Your Role                                               │ │
│  │  ┌─────────────────────────────────────┐                 │ │
│  │  │  COO                         [▾]   │                 │ │
│  │  └─────────────────────────────────────┘                 │ │
│  │  CEO · CFO · COO · VP Operations · IT Manager            │ │
│  │                                                          │ │
│  │  Departments you oversee                                 │ │
│  │  [✓] Operations  [✓] Finance  [ ] Engineering            │ │
│  │  [✓] HR          [ ] Sales    [ ] Customer Support       │ │
│  │                                                          │ │
│  │                              [Next →]                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  🔒 No account required · Takes 3 minutes                    │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Next → validates form → `onboard-2`
- Progress dots are not clickable (linear flow)

---

### Screen 3: Onboarding Step 2 — Pain Radar (`onboard-2`)

**Purpose:** Identify friction categories through fast tile selection. No typing required.

**Progress:** Step 2 of 3

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ○──●──────○   Step 2 of 3                                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Which of these frustrate your team most?                │ │
│  │  Select all that apply — takes 30 seconds                │ │
│  │                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ ⏳ SELECTED      │  │ 📋               │             │ │
│  │  │ Approvals take   │  │ We track things  │             │ │
│  │  │ too long         │  │ in spreadsheets  │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ 🔄 SELECTED      │  │ 🤷               │             │ │
│  │  │ Same info        │  │ Unclear who owns │             │ │
│  │  │ entered twice    │  │ which task       │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ 📞               │  │ ❌               │             │ │
│  │  │ Too many status  │  │ Errors found     │             │ │
│  │  │ update meetings  │  │ too late         │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ 🔍               │  │ 🚫               │             │ │
│  │  │ Hard to find     │  │ New hires take   │             │ │
│  │  │ information      │  │ too long to ramp │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ 📊               │  │ 🔗               │             │ │
│  │  │ Reports take too │  │ Work lost between│             │ │
│  │  │ long to generate │  │ team handoffs    │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                          │ │
│  │  2 selected                    [← Back] [Next →]        │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Tiles toggle selected/unselected on click (highlighted state)
- Next → requires at least 1 selection → `onboard-3`
- Back → `onboard-1`

---

### Screen 4: Onboarding Step 3 — Priority Question (`onboard-3`)

**Purpose:** One open-ended question to anchor the most important friction.

**Progress:** Step 3 of 3

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ○──○──●   Step 3 of 3                                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Almost there! One last question:                        │ │
│  │                                                          │ │
│  │  What's the one thing that, if fixed tomorrow,           │ │
│  │  would make the biggest difference to your team?         │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ Our purchase approvals take too long and no one   │  │ │
│  │  │ knows where a request is at any given time.       │  │ │
│  │  │                                                    │  │ │
│  │  │                                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  Or pick from common answers:                            │ │
│  │  → "We spend too much time in meetings"                  │ │
│  │  → "Reports take 2 days to prepare manually"             │ │
│  │  → "New employee onboarding is inconsistent"             │ │
│  │  → "We don't have visibility into inventory levels"      │ │
│  │  → "Customer complaints aren't tracked properly"         │ │
│  │                                                          │ │
│  │  [← Back]              [Show My Friction Map →]          │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Quick answer chips auto-populate the textarea
- "Show My Friction Map" → `generating`

---

### Screen 5: Generating (Loading) (`generating`)

**Purpose:** Build anticipation while AI processes. Transparent about what it's doing.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                                                               │
│                  Analyzing your organization...               │
│                                                               │
│              ████████████████████░░░░  78%                   │
│                                                               │
│   ✓  Matched to Manufacturing benchmarks (APQC 2024)         │
│   ✓  Cross-referenced 500-employee company patterns          │
│   ✓  Identified 3 friction categories from your inputs       │
│   ⟳  Calculating weekly cost estimates...                    │
│                                                               │
│                                                               │
│   We're comparing your inputs against data from              │
│   2,400+ companies in your industry segment                  │
│                                                               │
│                                                               │
└────────────────────────────────────────────────────────────────┘
```

**Behavior:** Auto-advances to `friction-map` after 3–5 seconds (simulated in prototype)

---

### Screen 6: Friction Map — Estimated (`friction-map`)

**Purpose:** THE "aha moment." Show the user their probable friction with dollar values. Drive tool connection.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                              [Connect Tools] [Sign Up]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Your Friction Map                              Manufacturing · 200–500
│  Based on industry benchmarks · 3 areas found  [ESTIMATED]   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 🔴 CRITICAL                                             │  │
│  │                                                         │  │
│  │ Approval Workflow Friction                              │  │
│  │ ─────────────────────────────────────────────────────  │  │
│  │ Your approvals likely take 6–9 days                     │  │
│  │ Industry benchmark: 2.1 days  ▲ You're ~3-4× slower    │  │
│  │                                                         │  │
│  │ Estimated weekly cost: $2,800–$4,200                    │  │
│  │ Found in 78% of manufacturing companies your size       │  │
│  │                                                         │  │
│  │ Confidence: ████████░░ Medium (benchmark-based)         │  │
│  │                                                         │  │
│  │              [See Solution →]  [Confirm with real data] │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 🟠 HIGH                                                 │  │
│  │                                                         │  │
│  │ Spreadsheet-based Operations Tracking                   │  │
│  │ ─────────────────────────────────────────────────────  │  │
│  │ Manual data entry creates errors + no real-time view    │  │
│  │ Industry: 67% of companies have this · Avg 5h/week      │  │
│  │                                                         │  │
│  │ Confidence: ██████░░░░ Medium                           │  │
│  │              [See Solution →]                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 🟡 MEDIUM                                               │  │
│  │                                                         │  │
│  │ Reporting & Visibility Friction                         │  │
│  │ ─────────────────────────────────────────────────────  │  │
│  │ Reports likely prepared manually · 2–4 days/month       │  │
│  │              [See Solution →]                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│  🔒 These are ESTIMATES based on benchmarks.                 │
│     Connect your tools to see your exact numbers.            │
│                    [Connect Tools & Confirm →]                │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- "See Solution →" → `solution-detail` (passes friction item context)
- "Connect Tools & Confirm" → `connect-tools`
- "Sign Up" → account creation modal

---

### Screen 7: Tool Integration Hub (`connect-tools`)

**Purpose:** Let users connect tools to upgrade from estimated to confirmed data.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI        ← Back to Friction Map                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Connect your tools                                           │
│  Each connection upgrades your friction map from              │
│  estimated to confirmed with real numbers.                    │
│                                                               │
│  ─── Start with these (fastest to connect) ─────────────── │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ [G] Google Calendar / Microsoft Outlook                 │  │
│  │     Reveals: meeting load, focus time, after-hours work  │  │
│  │     Time to connect: 2 min                              │  │
│  │     Privacy: Only event metadata (no content)           │  │
│  │                              [Connect →]                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ [S] Slack / Microsoft Teams                             │  │
│  │     Reveals: communication patterns, response delays    │  │
│  │     Time to connect: 2 min                              │  │
│  │     Privacy: Only metadata (no message content)         │  │
│  │                              [Connect →]                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ─── For deeper insights ──────────────────────────────── │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │ [J] Jira       │  │ [Z] Zoho CRM   │  │ [A] Asana      │  │
│  │ Task patterns  │  │ Approval speed │  │ Task patterns  │  │
│  │ [Connect →]    │  │ [Connect →]    │  │ [Connect →]    │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│  🔒 What we collect: timestamps, durations, participant       │
│     counts. Never message content or personal data.          │
│     Read our Privacy Policy →                                │
│                                                               │
│  [Skip for now — keep estimated data]                        │
└────────────────────────────────────────────────────────────────┘
```

---

### Screen 8: Solution Detail Page (`solution-detail`)

**Purpose:** Show the specific fix for a friction — either Creator App spec or Process Playbook.

**Layout:** Two-tab view (Creator App | Process Playbook)

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI        ← Back to Friction Map                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔴 Approval Workflow Friction                                │
│  Estimated cost: $2,800–$4,200/week · Affects: Operations, Finance │
│                                                               │
│  [Creator App Solution ●]  [Process Playbook ○]              │
│                                                               │
│  ─── Recommended Solution ──────────────────────────────── │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  📱 PURCHASE APPROVAL WORKFLOW APP                      │  │
│  │  Built in Zoho Creator · Est. 2–3 days to build         │  │
│  │                                                         │  │
│  │  What it does:                                          │  │
│  │  Replaces email/WhatsApp approvals with a structured    │  │
│  │  system: submit → notify → approve/reject → track.      │  │
│  │                                                         │  │
│  │  Fields included:                                       │  │
│  │  • Request title, description, amount                   │  │
│  │  • Category (vendor/equipment/service)                  │  │
│  │  • Requester, department, date needed                   │  │
│  │  • Supporting documents (upload)                        │  │
│  │  • Approval status + approver comments                  │  │
│  │                                                         │  │
│  │  Automations included:                                  │  │
│  │  • Auto-notify manager when request submitted           │  │
│  │  • Escalate to VP if no action in 24h                   │  │
│  │  • Auto-approve requests < $1,000                       │  │
│  │  • Notify requester of decision + reason                │  │
│  │                                                         │  │
│  │  Reports included:                                      │  │
│  │  • Pending approvals dashboard (real-time)              │  │
│  │  • Approval cycle time trend (weekly)                   │  │
│  │  • Spend by category (monthly)                          │  │
│  │                                                         │  │
│  │  Expected outcome:                                      │  │
│  │  Approval cycle: 7 days → 1.5 days (-78%)              │  │
│  │  Management time saved: ~6h/week                        │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [🚀 Build This in Zoho Creator]  [📥 Download Spec]    │  │
│  │  Opens Creator with pre-filled configuration            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ─── Similar companies who fixed this ──────────────────── │
│  "Reduced approval time from 8 days to 1 day. Our ops       │
│   team finally has visibility." — VP Ops, Manufacturing co.  │
└────────────────────────────────────────────────────────────────┘
```

**Tab 2: Process Playbook view** (when solution is process-only):
```
  ─── Process Improvement Playbook ──────────────────────── 
  
  Problem: Purchase requests sit in managers' inboxes for 6+ days
  Root cause: No single owner; approvals scattered across 3 channels
  
  Step 1 (Day 1): Designate ONE approval channel
    → Owner: COO
    → Action: Announce all purchase requests go through [chosen channel]
    
  Step 2 (Day 2–3): Set delegation rules
    → Owner: Finance VP
    → Action: Define who can approve what amount without escalation
    
  Step 3 (Week 2): Add a 24h SLA policy
    → Owner: COO
    → Action: Requests unresolved in 24h auto-escalate to the next level
    
  Success metrics: Track approval cycle time weekly for 4 weeks
```

---

### Screen 9: Executive Dashboard (`dashboard`)

**Purpose:** Ongoing home for the CFO/COO. Shows live friction status, solutions progress, and ROI.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI                         [AI Chat]  [Settings]  [👤]│
├──────────┬─────────────────────────────────────────────────────┤
│          │                                                     │
│  Nav     │  Good morning, Sarah.                              │
│  ────    │  Acme Manufacturing · Last updated: Today 6:00am   │
│          │                                                     │
│  📊      │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  Friction│  │ 3        │  │ $8,200   │  │ 1        │         │
│  Map     │  │ Active   │  │ Est./wk  │  │ Solution │         │
│          │  │ Frictions│  │ lost     │  │ deployed │         │
│  💡      │  └──────────┘  └──────────┘  └──────────┘         │
│  Solutions│                                                    │
│          │  ─── Your Friction Map ──────────────────────────  │
│  📈      │                                                     │
│  ROI     │  🔴 Approval Workflow        6–9 days  $2,800/wk   │
│          │     [ESTIMATED]              [See Solution →]      │
│  💬      │                                                     │
│  AI Chat │  🟠 Spreadsheet Tracking     5h/wk     $1,600/wk   │
│          │     [ESTIMATED]              [See Solution →]      │
│          │                                                     │
│          │  🟡 Reporting Friction       3h/wk     $800/wk     │
│          │     [ESTIMATED]              [See Solution →]      │
│          │                                                     │
│          │  ─────────────────────────────────────────────── │
│          │  Confirm these with real data:                     │
│          │  [Connect Tools →]                                │
│          │                                                    │
└──────────┴─────────────────────────────────────────────────────┘
```

---

### Screen 10: AI Chat Interface (`ai-chat`)

**Purpose:** Conversational Q&A for executives to get instant, data-backed answers.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI  ← Back              AI Advisor                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  👤 Sarah: Why are our operations costs higher           │ │
│  │     this quarter without headcount changes?              │ │
│  │                                                          │ │
│  │  🤖 AI: I found 3 likely contributing factors:          │ │
│  │                                                          │ │
│  │  1. APPROVAL DELAYS (estimated 40% of the increase)     │ │
│  │     Your purchase approval cycle is ~7 days vs the      │ │
│  │     2.1-day benchmark. At your company size, this        │ │
│  │     costs approx $2,800/week in management time.        │ │
│  │     → Fix: Deploy the Approval Workflow App in Creator   │ │
│  │             [See App Spec →]                             │ │
│  │                                                          │ │
│  │  2. MANUAL REPORTING (estimated 30% of the increase)    │ │
│  │     Based on your inputs, reports are likely prepared    │ │
│  │     manually — averaging 2–4 days/month across teams.   │ │
│  │     → Fix: Automated reporting dashboard in Creator      │ │
│  │             [See App Spec →]                             │ │
│  │                                                          │ │
│  │  3. MEETING OVERHEAD (estimated 30%)                    │ │
│  │     Manufacturing companies your size average 38%       │ │
│  │     of time in meetings. This is often a process fix.   │ │
│  │     → Fix: Process Playbook (no app needed)             │ │
│  │             [See Playbook →]                             │ │
│  │                                                          │ │
│  │  Connect your tools for precise numbers instead of      │ │
│  │  estimates. [Connect Tools →]                           │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────┐  [Send]     │
│  │ Ask anything about your organization...      │             │
│  └──────────────────────────────────────────────┘             │
│                                                                │
│  Suggested: "How do we compare to peers?" · "What to fix first?" │
└────────────────────────────────────────────────────────────────┘
```

---

### Screen 11: ROI Report (`roi-report`)

**Purpose:** Shareable evidence of value for board presentations.

```
┌────────────────────────────────────────────────────────────────┐
│  FRICTIONAI  ← Back                        [Export PDF] [Share]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Operations Impact Report                                     │
│  Acme Manufacturing · July 2026                              │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  TOTAL IDENTIFIED OPPORTUNITY            │ │
│  │                                                          │ │
│  │              $427,000 / year                             │ │
│  │         in recoverable time and efficiency               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  Friction Breakdown                                          │
│  ─────────────────                                           │
│  Approval Workflow     $145,600/yr   ████████████░░░░        │
│  Spreadsheet Ops        $83,200/yr   ███████░░░░░░░░         │
│  Reporting Overhead     $41,600/yr   ████░░░░░░░░░░          │
│  Meeting Overhead       $62,400/yr   █████░░░░░░░░           │
│  Onboarding Friction    $94,000/yr   ████████░░░░░           │
│                                                               │
│  Solutions Status                                            │
│  ─────────────────                                           │
│  ✅ Approval Workflow App    Deployed · Saving 6h/wk         │
│  🔄 Inventory Tracking App  In Progress (Week 2 of 3)        │
│  📋 Reporting Playbook       Recommended · Not started       │
│                                                               │
│  Before / After (Approval Workflow)                          │
│  ─────────────────────────────────                           │
│  Cycle time:  7.2 days → 1.4 days   ↓ 81%                   │
│  Hours/week:  12.4h    → 2.1h        ↓ 83%                   │
│  Cost/week:   $2,800   → $490        ↓ 82%                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Navigation Flow Diagram

```
                    [Landing Page]
                          │
                          ▼
                   [Onboard Step 1]
                          │
                          ▼
                   [Onboard Step 2]
                          │
                          ▼
                   [Onboard Step 3]
                          │
                          ▼
                  [Generating / Loading]
                          │
                          ▼
              ┌──[Friction Map]──────────┐
              │           │              │
              ▼           ▼              ▼
       [Connect      [Solution      [Sign Up]
        Tools]        Detail]           │
              │           │             │
              └─────────────────────────┘
                          │
                          ▼
                    [Dashboard]
                    ┌────┼────┐
                    │    │    │
                    ▼    ▼    ▼
               [AI   [ROI  [Solutions
               Chat] Report] Tracker]
```

---

## 5. Key Design Principles

1. **Value before friction** — Show the friction map before asking for account creation
2. **Estimates are OK** — "Estimated" data is clearly labeled, not hidden. It still creates value.
3. **Progressive disclosure** — Start with 3 questions; reveal complexity only when user is engaged
4. **One primary action per screen** — Each screen has one clear next step
5. **Dollar language** — Always show cost in $, not hours — CFOs speak money
6. **Confidence transparency** — Always show if data is estimated vs. confirmed
7. **Creator as the exit** — Every solution recommendation exits to Zoho Creator
