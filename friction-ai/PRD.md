# FrictionAI — Product Requirements Document

**Product Name:** FrictionAI  
**Tagline:** Find where your company bleeds time. Fix it with Zoho Creator.  
**Document Version:** v1.0  
**Date:** 2026-07-16  
**Author:** Brainstorm Session  
**Status:** Draft  

---

## 1. Executive Summary

FrictionAI is an independent AI-powered enterprise productivity tool that:
1. **Detects** operational friction points inside any organization using behavioral signals + AI
2. **Diagnoses** whether the friction requires a custom app or a process improvement
3. **Delivers** ready-to-deploy Zoho Creator apps as solutions — or actionable process recommendations

The product is **vendor-agnostic on the input side** (connects to any tool: Slack, Teams, Jira, CRM, ERP) and **Zoho Creator-native on the output side** (solutions are delivered as Creator apps or configuration playbooks).

---

## 2. Problem Statement

### The Enterprise Time Problem
Enterprise organizations — especially mid-market (200–2000 employees) — lose 20–40% of their workforce productivity to operational friction: manual processes, approval bottlenecks, duplicated data entry, knowledge gaps, and coordination overhead.

### The Visibility Gap
- CFOs and COOs feel the cost but cannot pinpoint *where* it happens
- Traditional process consulting takes 3–6 months and costs $200K+
- Generic productivity tools find friction but can't deliver solutions
- Internal IT backlogs mean problems stay unfixed for months

### The Creator Gap
Zoho Creator is an excellent low-code platform to solve these exact problems — but companies don't know *which* workflows to build. They know something is broken; they don't know what to build.

**FrictionAI bridges this gap**: it finds the friction and tells you exactly which Creator app to build to fix it.

---

## 3. Target Users

### Primary Buyer (Economic)
- **Title:** CFO, COO, CEO
- **Company size:** 200–2,000 employees
- **Industry:** Manufacturing, Retail, Professional Services, Healthcare Admin, Logistics
- **Pain:** "We're growing headcount but productivity isn't keeping up. I know we're inefficient but I can't prove where."
- **Outcome they want:** ROI evidence + a fix they can show the board

### Champion (Drives Purchase)
- **Title:** VP Operations, Head of Digital Transformation, IT Manager
- **Pain:** "I know exactly where we waste time but I can't get budget without data, and I can't fix it without dev resources."
- **Outcome they want:** A tool that proves the problem AND builds the solution

### End Users (Adoption)
- **Title:** Team Leads, Department Managers
- **Pain:** "Our processes are broken but nobody listens when I say it"
- **Outcome they want:** Work gets less frustrating; their complaints become action

---

## 4. Core Value Proposition

> **"In 5 minutes, see where your organization is losing time and money. In 2 weeks, have a Zoho Creator app running that fixes it."**

| Competitor | What they do | FrictionAI difference |
|---|---|---|
| McKinsey/BCG | Find friction (3–6 months, $200K+) | We do it in 5 minutes, free audit |
| Celonis | Process mining from ERP logs only | We work across all tools + qualitative signals |
| Zapier/Make | Automation if you know what to automate | We tell you WHAT to automate first |
| Generic AI tools | Surface insights, no solution | We deliver a deployable Creator app |
| Zoho Creator | Build apps if you know what to build | We tell you what to build + build it |

---

## 5. Product Overview

### 5.1 Core Flow

```
DISCOVER → DIAGNOSE → DELIVER → MEASURE
```

**DISCOVER:** AI collects signals from connected tools + a 5-minute structured intake  
**DIAGNOSE:** AI generates a Friction Map ranked by impact × effort  
**DELIVER:** For each friction: either a Creator app blueprint or a process improvement playbook  
**MEASURE:** Ongoing monitoring shows what improved, what's new, what remains  

### 5.2 Two Solution Types

**Type 1 — Creator App Solution**  
Used when: No structured system exists; data tracked in spreadsheets/email; approvals happen informally; reporting is manual  
Output: A complete Creator app specification including fields, workflows, automations, and reports — ready to build in Creator

**Type 2 — Process Improvement Playbook**  
Used when: The right tool already exists but the process around it is broken; delegation is unclear; meetings are duplicating async work  
Output: A step-by-step playbook with specific actions, owner assignments, and expected outcomes

---

## 6. Functional Requirements

### FR-01: Onboarding — Instant Friction Diagnosis (No Tool Connection Required)

**Requirement:** A new user (COO/CFO) must be able to see their probable friction map within 5 minutes, without connecting any tools.

**How:**
- 3-screen intake wizard collects: industry, company size, role, department oversight, pain selections (multi-select tiles), and one open-ended priority question
- AI uses benchmark database (APQC + research + anonymized aggregate patterns) to generate probable friction map
- Each friction item shows: confidence level (estimated/confirmed), industry benchmark, estimated weekly cost

**Acceptance Criteria:**
- Intake completes in ≤ 5 minutes
- Friction map is generated within 10 seconds of intake completion
- Each friction item shows confidence level and benchmark source
- A "Connect Tools to Confirm" CTA is prominently shown

---

### FR-02: Tool Integration (Signal Collection)

**Requirement:** Users can connect business tools to upgrade from estimated to confirmed friction data.

**Supported Integrations (Phase 1):**
- Slack / Microsoft Teams (messaging signals)
- Google Calendar / Microsoft Outlook (meeting load signals)
- Google Workspace / Microsoft 365 (document access signals)
- Jira / Asana / Monday.com (task/project signals)
- Zoho CRM / Salesforce (pipeline + approval signals)

**Supported Integrations (Phase 2):**
- Zoho Books / QuickBooks (financial approval signals)
- SAP / Oracle ERP (process execution signals)
- Zoho Desk / Freshdesk / Zendesk (support ticket signals)
- HR systems: Zoho People / BambooHR / Workday

**Data collection rules:**
- Only metadata is collected (timestamps, participants, durations, categories) — never message content
- All data anonymized at rest
- EU GDPR + US SOC 2 compliant
- Employees notified of what data is collected (transparency mandate)

**Acceptance Criteria:**
- OAuth 2.0 integration for all connectors
- Connection takes < 3 minutes per tool
- After connection, friction map updates from "estimated" to "confirmed" within 24 hours
- User can disconnect any tool at any time and data is purged within 48 hours

---

### FR-03: Friction Map Generation

**Requirement:** AI generates a visual, ranked, actionable Friction Map for the organization.

**Friction Map Contents:**
- Up to 10 friction items (top 5 in critical/high tier)
- For each item: name, category, symptoms, root cause, benchmark comparison, estimated weekly cost, confidence level
- Items ranked by: Impact × Frequency × Effort-to-fix
- Color coding: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low

**Friction Categories:**
1. Approval Workflow Friction
2. Data Entry & Duplication Friction
3. Knowledge & Information Friction
4. Meeting & Communication Overhead
5. Onboarding & Training Friction
6. Reporting & Visibility Friction
7. Cross-team Handoff Friction
8. Customer Facing Process Friction

**Acceptance Criteria:**
- Friction map renders within 10 seconds
- Each item links to solution recommendations
- Map can be exported as PDF for sharing with board/leadership
- Map refreshes automatically when new signals are detected

---

### FR-04: Solution Recommendation Engine

**Requirement:** For each friction item, AI recommends either a Creator App or a Process Improvement, with full specifications.

**Decision Logic:**
```
IF no structured system exists for this workflow
   OR data is tracked in spreadsheets/email/WhatsApp
   OR multiple people collaborate without a shared system
   OR approvals/notifications/audit trail needed
   → Recommend Creator App

IF right tool exists but wrong process
   OR friction is communication/clarity based
   OR fix is a policy change or delegation
   OR implementation is <1 day of work
   → Recommend Process Improvement Playbook
```

**Creator App Recommendation includes:**
- App name and purpose
- Data model (fields, relationships)
- Workflow design (stages, transitions, approvals)
- Automation rules (notifications, escalations)
- Report requirements (dashboards, exports)
- Estimated build time in Creator
- Direct link to start building in Zoho Creator (OAuth handoff)

**Process Improvement Playbook includes:**
- Problem statement (specific to this company)
- Root cause analysis
- Recommended changes (step-by-step)
- Who needs to act (role-specific actions)
- Success metrics (how to know it worked)
- Timeline to implement

**Acceptance Criteria:**
- Every friction item has at least one solution recommendation
- Creator App specs are complete enough for a Creator developer to build without clarification
- "Build in Creator" button opens the app with pre-filled configuration (API integration)
- Playbooks are editable and shareable

---

### FR-05: Benchmark Database

**Requirement:** AI uses a curated benchmark database to compare company performance against industry standards.

**Phase 1 — Synthetic Benchmarks (Pre-customer):**
- Sourced from: APQC, McKinsey GI, Microsoft Work Trend Index, Gartner, Deloitte HC Trends
- Structured by: Industry × Company Size × Department
- ~500 benchmark data points at launch
- Every data point has: source citation, year, confidence rating

**Phase 2 — Calibrated Benchmarks (Post design partners):**
- Updated with real data from 10+ design partners
- Confidence levels upgraded per category
- New dimensions added (e.g., "companies with auto-approval rules")

**Phase 3 — Self-updating Benchmarks (Scale):**
- Anonymized aggregate data from all customers automatically updates benchmarks
- Individual company data is never exposed — only statistical aggregates
- Data governance: minimum n=30 before a benchmark is "published" to avoid re-identification

---

### FR-06: Executive Intelligence Digest

**Requirement:** Proactive weekly summary delivered to CFO/COO without them needing to log in.

**Contents:**
- Top 3 active friction items with status change (better/worse/new)
- One "quick win" recommendation with estimated effort
- Progress summary on deployed Creator app solutions
- One industry benchmark comparison

**Format:** Email + in-app notification  
**Frequency:** Weekly (Monday morning, configurable)  
**Delivery:** Email (HTML formatted), Slack notification (if connected), in-app badge

---

### FR-07: Conversational AI Interface

**Requirement:** CFO/COO can ask the AI natural language questions about their organization's friction and get specific, data-backed answers.

**Example queries:**
- "Why did our Q2 operating costs increase without headcount growth?"
- "Which team has the most approval bottlenecks?"
- "How do we compare to similar companies in our industry?"
- "What would happen if we automated our purchase approvals?"

**Response format:**
- Root cause + contributing factors
- Supporting data points from signal collection
- Benchmark comparison
- Ranked solution options
- One-click action to implement top solution

---

### FR-08: Solution Tracking & ROI Measurement

**Requirement:** Track the status and impact of deployed solutions over time.

**Tracking:**
- Solution status: Recommended → In Progress → Deployed → Measuring
- Before/after friction metrics (e.g., approval cycle: 7.2 days → 1.8 days)
- Estimated vs. actual time saved
- Creator app usage stats (if connected)

**ROI Reporting:**
- Monthly ROI report: total hours saved, cost savings (at loaded hourly rates), friction items resolved
- Shareable "Impact Report" for board presentations
- Cumulative savings tracker ("Since using FrictionAI, you've saved X hours and $Y")

---

## 7. Non-Functional Requirements

### Performance
- Intake to Friction Map: < 10 seconds
- Tool connection to data sync: < 24 hours
- Dashboard load time: < 2 seconds

### Security
- SOC 2 Type II compliance (target: within 12 months of launch)
- GDPR compliant data handling
- OAuth 2.0 for all integrations (no stored passwords)
- Data encryption at rest (AES-256) and in transit (TLS 1.3)
- All signal data anonymized before processing
- Right to deletion: data purged within 48 hours of request

### Privacy by Design
- No message content ever stored — only metadata
- Employees see what data is collected about their work patterns
- Company admin controls what signals are enabled
- Individual-level data never surfaced to executives (only team/department aggregates)

### Scalability
- Support up to 10,000 employees per organization
- Multi-tenant architecture
- 99.9% uptime SLA (target for GA)

---

## 8. Out of Scope (v1.0)

- Real-time monitoring (batched processing, refreshed daily)
- Mobile app (web-only for v1.0)
- Integration with non-English language tools
- Employee-facing interface (executive/manager only for v1.0)
- Direct code generation for Creator apps (spec + handoff, not auto-build)
- Integration with SAP/Oracle ERP (Phase 2)

---

## 9. Success Metrics

### Acquisition
- Time from landing to first friction map: < 5 minutes
- Intake completion rate: > 70%
- Free-to-paid conversion: > 25% within 30 days

### Retention
- 90-day retention: > 80%
- Weekly digest open rate: > 45%
- Solutions deployed per customer in 90 days: ≥ 2

### Value
- Average friction items identified per company: 5–8
- Average time saved per deployed Creator solution: 4+ hours/week
- NPS: > 50 within 6 months

### Revenue
- ARR per customer: $12,000–$60,000 (based on company size)
- CAC payback: < 6 months
- Target ARR at 12 months: $500K

---

## 10. Technology Stack (Proposed)

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts / Victory for data visualization
- React Query for data fetching

### Backend
- Node.js / Express (API layer)
- Python (AI/ML signal processing)
- PostgreSQL (primary database)
- Redis (caching + job queue)

### AI Layer
- OpenAI GPT-4o (primary LLM for friction analysis)
- Anthropic Claude (fallback + long-context analysis)
- Custom embedding model (for benchmark similarity matching)
- LangChain (orchestration)

### Infrastructure
- AWS / Google Cloud
- Docker + Kubernetes
- Kafka (event streaming for signal collection)

### Integrations
- OAuth 2.0 framework for all tool connections
- Zoho Creator API (for solution handoff)
- Zoho Marketplace (for distribution)

---

## 11. Monetization

### Pricing Tiers

**Starter — $499/month**
- Up to 200 employees
- Friction audit (estimated, benchmark-based)
- 3 tool integrations
- Basic Creator app recommendations
- Email digest

**Growth — $1,499/month**
- Up to 500 employees
- Confirmed friction (tool integration + signals)
- Unlimited integrations
- Full Creator app specs + ROI tracking
- Conversational AI interface
- Priority support

**Enterprise — Custom**
- 500+ employees
- Custom benchmark models
- Dedicated CSM
- On-premise data processing option
- SLA guarantee
- Quarterly business reviews

### Free Tier
- 5-minute friction audit (estimated, benchmark-based only)
- Top 3 friction items (full map locked behind paid)
- One Creator app recommendation (no full spec)
- 14-day trial of Growth tier

---

## 12. Roadmap

### MVP (Month 1–3)
- [ ] Onboarding intake wizard (3 screens)
- [ ] Benchmark database v1 (synthetic)
- [ ] Estimated friction map
- [ ] 5 Creator app templates (top 5 most common frictions)
- [ ] Process improvement playbooks for non-app frictions
- [ ] Basic dashboard

### Phase 1 (Month 4–6)
- [ ] Tool integrations: Slack, Google Calendar, Jira
- [ ] Confirmed friction map (real signal data)
- [ ] ROI tracking
- [ ] Weekly executive digest

### Phase 2 (Month 7–12)
- [ ] Conversational AI interface
- [ ] Benchmark database v2 (calibrated from design partners)
- [ ] Creator API integration (direct app handoff)
- [ ] 20+ Creator app templates

### Phase 3 (Year 2)
- [ ] Self-updating benchmark database
- [ ] Industry-specific vertical products
- [ ] Zoho Marketplace listing
- [ ] Enterprise compliance (SOC 2, GDPR certification)

---

## 13. Appendix A — Top 10 Friction Patterns (Creator Solutions)

| # | Friction Pattern | Creator Solution | Avg Time Saved |
|---|---|---|---|
| 1 | Approval workflows in email/WhatsApp | Approval Workflow App | 4–6h/week per manager |
| 2 | Spreadsheet-based inventory tracking | Inventory Management App | 5–8h/week |
| 3 | Manual onboarding checklist | Employee Onboarding App | 3–4h per new hire |
| 4 | Unstructured customer complaint handling | Customer Issue Tracker | 3–5h/week per CS agent |
| 5 | Manual expense/purchase request tracking | Procurement Request App | 2–3h/week per requestor |
| 6 | Informal maintenance/facility request | Maintenance Ticket System | 4–6h/week |
| 7 | No visibility on project task status | Project Status Dashboard | 2–3h/week per PM |
| 8 | Manual shift scheduling via WhatsApp | Shift Scheduling App | 3–4h/week per manager |
| 9 | Paper-based quality/inspection checklists | Digital Inspection App | 4–6h/week per inspector |
| 10 | No centralized vendor/contractor tracking | Vendor Management App | 2–4h/week |
