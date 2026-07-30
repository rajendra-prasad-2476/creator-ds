import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardHorizontal, CardHorizontalIcon, CardHorizontalBody, CardHorizontalTitle, CardHorizontalDescription, CardHorizontalAction, CardOperations, CardOperationsPill, CardOperationsBody, CardOperationsGrid, CardOperationsLink, CardBilling, CardBillingIcon, CardBillingBody, CardBillingValue, CardBillingLabel } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogIcon, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tile, TileIcon, TileTitle, TileDescription } from "@/components/ui/tile";
import { Notes } from "@/components/ui/notes";
import { Blanket } from "@/components/ui/blanket";
import { TopBar } from "@/components/ui/top-bar";
import { LeftNav } from "@/components/ui/left-nav";
import { FullPageDialog } from "@/components/ui/full-page-dialog";
import type { FullPageDialogStep } from "@/components/ui/full-page-dialog";
import { List } from "@/components/ui/list";
import type { ListItemData } from "@/components/ui/list";
import { BarChart3, Plus, Filter, ArrowUpDown, Eye, Edit, Trash2, Database, Layers, Globe, PenLine, Link2, Key, Copy, CheckCircle2, LayoutGrid, GitFork, Lock, ChevronDown, User, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { ContentSwitcher } from "@/components/ui/content-switcher";
import { Switch } from "@/components/ui/switch";
import { BuilderShell } from "@/components/ui/builder-shell";
import type { BuilderViewport, BuilderNavItemType } from "@/components/ui/builder-shell";
import { BuilderLeftNav } from "@/components/ui/builder-left-nav";
import { ProductIllustration } from "@/components/ui/product-illustration";

function FullPageDialogDemo() {
  const [navStyle, setNavStyle] = useState<"section" | "stepper">("section")
  const [showHints, setShowHints] = useState(false)
  const [activeItem, setActiveItem] = useState("authentication")

  const sampleSections = [
    {
      id: "general",
      label: "GENERAL",
      icon: <Globe size={14} />,
      items: [{ id: "basic-details", label: "Basic Details" }],
    },
    {
      id: "security",
      label: "SECURITY",
      icon: <Lock size={14} />,
      items: [
        { id: "authentication", label: "Authentication" },
        { id: "oauth-scopes", label: "OAuth Scopes" },
      ],
    },
  ]

  const sampleSteps: FullPageDialogStep[] = [
    { id: "step-1", label: "Basic Details", status: "complete" },
    { id: "step-2", label: "Request",       status: "complete" },
    { id: "step-3", label: "Response",      status: "active" },
    { id: "step-4", label: "Configuration", status: "pending" },
    { id: "step-5", label: "Summary",       status: "pending" },
  ]

  const sampleHints = [
    "Ensure to name your custom API with terms that are descriptive, memorable, and reflective of their functionality.",
    "The link name will be appended to the endpoint URL generated.",
  ]

  return (
    <div className="space-y-[var(--cds-space-12)]">
      <div className="flex items-center gap-[var(--cds-gap-default)] flex-wrap">
        <ContentSwitcher
          items={["Section", "Stepper"]}
          value={navStyle === "section" ? "Section" : "Stepper"}
          onValueChange={(v) => setNavStyle(v === "Stepper" ? "stepper" : "section")}
        />
        <label className="flex items-center gap-[var(--cds-gap-small)] cursor-pointer">
          <Switch checked={showHints} onCheckedChange={setShowHints} />
          <span className="text-[length:var(--cds-text-p2)] text-[color:var(--cds-huegrey-text-dark)]">Show Hints</span>
        </label>
      </div>
      <div className="border border-[var(--border)] rounded-[var(--cds-radius-r)] overflow-hidden h-[480px]">
        <FullPageDialog
          title="Dialog Title"
          status="Draft"
          actionLabel="Action"
          navStyle={navStyle}
          sections={sampleSections}
          activeItemId={activeItem}
          onItemSelect={setActiveItem}
          steps={sampleSteps}
          showHints={showHints}
          hintsTitle="Hints"
          hints={sampleHints}
          onClose={() => {}}
        >
          <p className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)] w-full">
            Content goes here. Add form fields, cards, or other components.
          </p>
        </FullPageDialog>
      </div>
    </div>
  )
}

function BlanketDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setOpen(true)}>Show Blanket</Button>
      <div className="relative h-64 overflow-hidden rounded-[var(--cds-radius-r)] border bg-[var(--cds-huegrey-surface-subtle)]">
        <div className="p-6 space-y-2">
          <h4 className="text-[var(--cds-text-h6)] font-medium leading-[var(--cds-leading-h6)]">Underlying content</h4>
          <p className="text-sm text-muted-foreground">The blanket dims this content while an overlay panel is active. Click the button to toggle it.</p>
        </div>
        {open && (
          <>
            <Blanket className="absolute z-10" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 right-0 z-20 flex w-64 flex-col gap-3 border-l bg-white p-6 shadow-[-4px_4px_10px_rgba(0,0,0,0.25)]">
              <h4 className="text-[var(--cds-text-h6)] font-medium leading-[var(--cds-leading-h6)]">Overlay Panel</h4>
              <p className="text-sm text-muted-foreground">Sits above the blanket scrim.</p>
              <Button variant="outline" size="sm" className="mt-auto self-start" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const LIST_DEMO_ITEMS: ListItemData[] = [
  {
    id: "1",
    title: "Application Name",
    badge: { label: "Approved", colour: "success" },
    avatarText: "EM",
    avatarColour: "#CC3359",
    meta: "3 times",
    actionLabel: "Connect",
    onAction: () => {},
    onRemove: () => {},
  },
  {
    id: "2",
    title: "CRM Connector",
    badge: { label: "Active", colour: "primary" },
    avatarText: "CR",
    avatarColour: "#0D4EF2",
    meta: "12 times",
    actionLabel: "Connect",
    onAction: () => {},
    onRemove: () => {},
  },
  {
    id: "3",
    title: "Invoice Automation",
    subText: "Sends PDF invoices via SMTP",
    badge: { label: "Pending", colour: "warning" },
    avatarText: "IN",
    avatarColour: "#D25704",
    meta: "1 time",
    actionLabel: "Enable",
    onAction: () => {},
    onRemove: () => {},
  },
  {
    id: "4",
    title: "User Sync",
    badge: { label: "Error", colour: "error" },
    avatarText: "US",
    avatarColour: "#CC1914",
    meta: "0 times",
    actionLabel: "Retry",
    onAction: () => {},
    onRemove: () => {},
  },
]

function ListDemo() {
  const [selectable, setSelectable] = useState(true)
  const [size, setSize] = useState<"Large" | "Default">("Large")

  return (
    <div className="flex flex-col gap-[var(--cds-space-16)]">
      <div className="flex items-center gap-[var(--cds-gap-default)]">
        <ContentSwitcher
          items={["Large", "Default"]}
          value={size}
          onValueChange={(v) => setSize(v as "Large" | "Default")}
          size="sm"
        />
        <div className="flex items-center gap-[var(--cds-gap-small)]">
          <Switch checked={selectable} onCheckedChange={setSelectable} />
          <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)]">
            Selectable
          </span>
        </div>
      </div>
      <List items={LIST_DEMO_ITEMS} size={size} selectable={selectable} />
    </div>
  )
}

/* ─── BuilderShell demo sub-components ─── */

const BUILDER_NAV_SECTIONS = [
  {
    id: "design-items",
    label: "Design Work Items",
    defaultExpanded: true,
    items: [
      { id: "form-1", label: "Design Work Items", type: "form" as BuilderNavItemType },
      { id: "report-1", label: "Design Work Items Report", type: "report" as BuilderNavItemType },
    ],
  },
  {
    id: "stage-history",
    label: "Stage History",
    defaultExpanded: false,
    items: [
      { id: "stage-1", label: "Stage History", type: "stage" as BuilderNavItemType },
    ],
  },
]

const MEGA_MENU_COLUMNS = [
  {
    id: "forms",
    label: "Forms",
    items: [
      { id: "form-1", label: "Design Work Items", type: "form" as BuilderNavItemType },
      { id: "stage-1", label: "Stage History",    type: "stage" as BuilderNavItemType },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    filteredBy: ["Design Work Items"],
    items: [
      { id: "report-1", label: "Design Work Items Report", type: "report" as BuilderNavItemType },
    ],
  },
  {
    id: "workflows",
    label: "Workflows",
    filteredBy: ["Design Work Items"],
    items: [],
    emptyMessage: "- No workflows to display -",
  },
  {
    id: "pages",
    label: "Pages",
    items: [],
    emptyMessage: "- No pages to display -",
  },
]

function CanvasContent({ viewport }: { viewport: BuilderViewport }) {

  /* ── Shared form fields (Design Work Items form) ── */
  const formFields = [
    { label: "Work Item Name", placeholder: "Enter single line value", required: true },
    { label: "Figma File URL", placeholder: "https://" },
    { label: "Figma File Key", placeholder: "Enter single line value" },
    { label: "Figma Version Name", placeholder: "Enter single line value" },
    { label: "Created By", placeholder: "Enter email address" },
  ]

  /* ── PHONE viewport — phone bezel + form + bottom nav (image 2) ── */
  if (viewport === "phone") {
    return (
      <div className="flex h-full items-center justify-center p-[var(--cds-space-16)]">
        <div
          className="flex flex-col overflow-hidden shadow-xl"
          style={{ width: 290, height: 560, borderRadius: 32, border: "7px solid #1B1E2D" }}
        >
          {/* Notch */}
          <div className="flex h-6 shrink-0 items-center justify-center bg-[#5C2D91]">
            <div className="h-1 w-14 rounded-full bg-white/20" />
          </div>
          {/* App header */}
          <div className="flex h-10 shrink-0 items-center px-4 bg-[#5C2D91]">
            <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "15px", fontWeight: 500, color: "white" }}>
              Design Work Items
            </span>
          </div>
          {/* Form */}
          <div className="flex flex-1 flex-col overflow-y-auto bg-white">
            {formFields.map(({ label, placeholder, required }) => (
              <div key={label} className="flex flex-col gap-1.5 border-b border-[var(--border)] px-4 py-3">
                <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#26282B" }}>
                  {label}{required && <span style={{ color: "#CC1914" }}> *</span>}
                </span>
                <div className="flex h-9 items-center rounded-[6px] border border-[var(--border)] px-3">
                  <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "12px", color: "#9EA1A9" }}>{placeholder}</span>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1.5 border-b border-[var(--border)] px-4 py-3">
              <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#26282B" }}>Current Stage</span>
              <div className="flex h-9 items-center justify-between rounded-[6px] border border-[var(--border)] px-3">
                <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "12px", color: "#9EA1A9" }}>Select value</span>
                <ChevronDown size={13} className="text-[var(--cds-huegrey-text-default)]" />
              </div>
            </div>
          </div>
          {/* Bottom navigation */}
          <div className="flex h-14 shrink-0 items-center justify-around border-t border-[var(--border)] bg-white px-1">
            {[
              { label: "Design Wo...", active: true },
              { label: "Design Wo...", active: false },
              { label: "Stage...", active: false },
              { label: "Stage...", active: false },
            ].map(({ label, active }, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="h-5 w-5 rounded-[3px]"
                  style={{ backgroundColor: active ? "#5C2D91" : "#E5E5E7" }}
                />
                <span style={{ fontSize: "9px", fontFamily: "'Zoho Puvi', sans-serif", color: active ? "#5C2D91" : "#9EA1A9" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── TABLET viewport — tablet bezel + icon nav + form (image 1) ── */
  if (viewport === "tablet") {
    return (
      <div className="flex h-full items-center justify-center p-[var(--cds-space-16)]">
        <div
          className="flex flex-col overflow-hidden shadow-xl"
          style={{ width: 560, height: 430, borderRadius: 16, border: "6px solid #1B1E2D" }}
        >
          {/* Browser chrome dots */}
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-[var(--border)] bg-[#F5F5F5] px-3">
            <div className="h-2 w-2 rounded-full bg-[#FF5F57]" />
            <div className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
            <div className="h-2 w-2 rounded-full bg-[#28C840]" />
          </div>
          {/* App layout: icon nav + content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Compact icon-only nav */}
            <div className="flex w-[60px] shrink-0 flex-col items-center gap-2 bg-[var(--cds-primary-surface-bold,#041644)] py-3">
              <div
                className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB]"
                style={{ fontSize: "10px", fontFamily: "'Zoho Puvi', sans-serif", fontWeight: 700, color: "white" }}
              >
                FPT
              </div>
              {/* Active nav item */}
              <div className="flex w-full flex-col items-center gap-0.5 rounded-[4px] bg-white/15 px-1 py-1.5">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="white" strokeWidth="0.9" />
                  <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: "8px", color: "white", textAlign: "center", fontFamily: "'Zoho Puvi', sans-serif", lineHeight: 1.1 }}>Design Work Items</span>
              </div>
              {/* Stage nav item */}
              <div className="flex w-full flex-col items-center gap-0.5 px-1 py-1.5">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="4" width="4" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="0.9" />
                  <rect x="8.5" y="4" width="4" height="6" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="0.9" />
                  <path d="M5.5 7h3" stroke="rgba(255,255,255,0.5)" strokeWidth="0.9" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", textAlign: "center", fontFamily: "'Zoho Puvi', sans-serif", lineHeight: 1.1 }}>Stage History</span>
              </div>
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-white">
              {/* Purple gradient header */}
              <div
                className="flex h-20 shrink-0 items-center gap-3 px-5"
                style={{ background: "linear-gradient(135deg, #5C2D91 0%, #C2185B 100%)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/20">
                  <User size={24} className="text-white/60" />
                </div>
                <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "18px", fontWeight: 500, color: "white" }}>
                  👋 Hello, Rajendra Prasad
                </span>
                <div className="ml-auto flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                      <div className="h-3 w-3 rounded-full bg-white/40" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Form heading */}
              <div className="border-b border-[var(--border)] px-4 py-2">
                <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#26282B", fontWeight: 500 }}>Design Work Items</span>
              </div>
              {/* Compact form rows */}
              {formFields.slice(0, 3).map(({ label, placeholder, required }) => (
                <div key={label} className="flex items-center gap-4 border-b border-[var(--border)] px-4 py-2">
                  <span className="w-32 shrink-0" style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "12px", color: "#696C74" }}>
                    {label}{required && <span style={{ color: "#CC1914" }}> *</span>}
                  </span>
                  <div className="flex flex-1 h-7 items-center rounded-[4px] border border-[var(--border)] px-2">
                    <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "11px", color: "#9EA1A9" }}>{placeholder}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 border-b border-[var(--border)] px-4 py-2">
                <span className="w-32 shrink-0" style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "12px", color: "#696C74" }}>Current Stage</span>
                <div className="flex flex-1 h-7 items-center justify-between rounded-[4px] border border-[var(--border)] px-2">
                  <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "11px", color: "#9EA1A9" }}>-Select-</span>
                  <ChevronDown size={11} className="text-[var(--cds-huegrey-text-default)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── WEB viewport — browser frame + entity nav (BuilderLeftNav) + form ── */
  return (
    <div className="flex h-full overflow-hidden p-[var(--cds-space-12)]">
      <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--cds-radius-r)] border border-[var(--border)] shadow-sm">
        {/* Browser chrome */}
        <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-[var(--border)] bg-[#F5F5F5] px-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        {/* App layout: entity nav (dark) + content */}
        <div className="flex flex-1 overflow-hidden">
          {/* BuilderLeftNav — app entity tree, shown inside the browser live preview */}
          <BuilderLeftNav
            appName="Figma Plugin Test"
            appInitials="FPT"
            appIconColor="#5C2D91"
            sections={BUILDER_NAV_SECTIONS}
            activeItemId="form-1"
            user={{ name: "Rajendra Prasad", initials: "RP" }}
          />
          {/* App content area */}
          <div className="flex flex-1 flex-col overflow-hidden bg-white">
            {/* Purple gradient header */}
            <div
              className="flex h-24 shrink-0 items-center gap-4 px-6"
              style={{ background: "linear-gradient(135deg, #5C2D91 0%, #C2185B 100%)" }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white/20">
                <User size={28} className="text-white/60" />
              </div>
              <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "20px", fontWeight: 500, color: "white" }}>
                👋 Hello, Rajendra Prasad
              </span>
            </div>
            {/* Form section */}
            <div className="border-b border-[var(--border)] px-6 py-3">
              <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "15px", color: "#26282B", fontWeight: 500 }}>
                Design Work Items
              </span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              {formFields.map(({ label, placeholder, required }) => (
                <div key={label} className="flex items-center gap-6 border-b border-[var(--border)] px-6 py-3">
                  <span className="w-36 shrink-0" style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#696C74" }}>
                    {label}{required && <span style={{ color: "#CC1914" }}> *</span>}
                  </span>
                  <div className="flex flex-1 h-9 items-center rounded-[6px] border border-[var(--border)] px-3">
                    <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#9EA1A9" }}>{placeholder}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-6 border-b border-[var(--border)] px-6 py-3">
                <span className="w-36 shrink-0" style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#696C74" }}>Current Stage</span>
                <div className="flex flex-1 h-9 items-center justify-between rounded-[6px] border border-[var(--border)] px-3">
                  <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#9EA1A9" }}>-Select-</span>
                  <ChevronDown size={14} className="text-[var(--cds-huegrey-text-default)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertiesPanelContent({ viewport }: { viewport: BuilderViewport }) {
  const [activeView, setActiveView] = useState<"quick" | "detail">("quick")
  const [activeTab, setActiveTab] = useState<"layout" | "actions">("layout")

  const layoutOptions = viewport === "phone"
    ? [{ label: "List 1-col" }, { label: "List 2-col" }, { label: "Card compact" }]
    : viewport === "tablet"
    ? [{ label: "Table 3-col" }, { label: "Card grid" }, { label: "List rows" }]
    : [{ label: "Full table" }, { label: "Card 2-col" }, { label: "Card 3-col" }, { label: "List compact" }, { label: "Custom" }]

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Zoho Puvi', sans-serif" }}>
      {/* Quick View / Detail View toggle */}
      <div className="flex border-b border-[var(--border)]">
        {(["quick", "detail"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setActiveView(v)}
            className={[
              "flex-1 py-2.5 text-[length:var(--cds-text-p3)] transition-colors",
              activeView === v
                ? "text-[var(--cds-primary-text-default)] border-b-2 border-[var(--cds-primary-surface-default)] font-medium"
                : "text-[var(--cds-huegrey-text-default)] hover:text-[var(--cds-huegrey-text-dark)]",
            ].join(" ")}
          >
            {v === "quick" ? "Quick View" : "Detail View"}
          </button>
        ))}
      </div>

      {/* Layout / Actions toggle */}
      <div className="flex border-b border-[var(--border)]">
        {(["layout", "actions"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={[
              "flex-1 py-2 text-[length:var(--cds-text-p3)] capitalize transition-colors",
              activeTab === t
                ? "bg-[var(--cds-primary-surface-subtle)] text-[var(--cds-primary-text-default)] font-medium rounded-[var(--cds-radius-s)] mx-1 my-1"
                : "text-[var(--cds-huegrey-text-default)] hover:text-[var(--cds-huegrey-text-dark)]",
            ].join(" ")}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Layout options grid */}
      {activeTab === "layout" && (
        <div className="flex flex-col gap-[var(--cds-gap-default)] p-[var(--cds-padding-card)]">
          <div className="grid grid-cols-2 gap-[var(--cds-gap-small)]">
            {layoutOptions.slice(0, 4).map((opt, i) => (
              <div
                key={opt.label}
                className={[
                  "flex flex-col items-start gap-2 rounded-[var(--cds-radius-r)] border p-3 cursor-pointer transition-colors",
                  i === 0
                    ? "border-[var(--cds-primary-surface-default)] bg-[var(--cds-primary-surface-subtle)]"
                    : "border-[var(--border)] hover:border-[var(--cds-primary-surface-default)]",
                ].join(" ")}
              >
                {/* Layout preview lines */}
                <div className="flex w-full flex-col gap-1">
                  <div className="h-1.5 w-full rounded-full bg-[var(--cds-primary-surface-default)] opacity-40" />
                  <div className="h-1.5 w-3/4 rounded-full bg-[var(--cds-primary-surface-default)] opacity-30" />
                  <div className="h-1.5 w-1/2 rounded-full bg-[var(--cds-primary-surface-default)] opacity-20" />
                </div>
                <span className="text-[length:var(--cds-text-p4)] text-[var(--cds-huegrey-text-default)]">{opt.label}</span>
              </div>
            ))}
          </div>

          {/* Custom layout */}
          <div>
            <span className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] font-medium">Custom Layout</span>
            <div className="mt-2 flex items-center justify-center rounded-[var(--cds-radius-r)] border border-dashed border-[var(--border)] p-6 cursor-pointer hover:border-[var(--cds-primary-surface-default)] transition-colors">
              <div className="flex flex-col items-center gap-1">
                <Plus size={20} className="text-[var(--cds-huegrey-text-default)]" />
                <span className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)]">Create New Layout</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "actions" && (
        <div className="flex flex-col gap-2 p-[var(--cds-padding-card)]">
          <span className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)]">No actions configured for this view.</span>
        </div>
      )}
    </div>
  )
}

const WORKFLOW_SUB_TABS = [
  "Form workflows", "Schedules", "Approvals", "Payments",
  "Blueprints", "Batch workflows", "Functions",
].map((label) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label }))

function WorkflowCanvas() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[var(--cds-gap-default)] bg-white p-[var(--cds-padding-section-h)]">
      <ProductIllustration type="workflow-form-event" state="Default" />
      <div className="flex flex-col items-center gap-[var(--cds-gap-tight)] text-center">
        <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "14px", color: "#696C74" }}>
          Run actions while forms are being filled out or while records
        </span>
        <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "14px", color: "#696C74" }}>
          are being edited or deleted.
        </span>
      </div>
      <button
        type="button"
        className="rounded-[var(--cds-radius-s)] bg-[var(--cds-primary-surface-default,#0D4EF2)] px-[var(--cds-space-20)] py-[var(--cds-space-8)] text-white"
        style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "14px", fontWeight: 500 }}
      >
        Create Workflow
      </button>
      <button
        type="button"
        className="flex items-center gap-[var(--cds-gap-tight)] text-[var(--cds-primary-text-default,#0D4EF2)]"
        style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="0.9"/>
          <path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
        </svg>
        See how it works
      </button>
    </div>
  )
}

function BuilderShellDemo() {
  const [viewport, setViewport] = useState<BuilderViewport>("web")
  const [activeTab, setActiveTab] = useState<"design" | "workflow" | "settings">("design")
  const [activeSubTab, setActiveSubTab] = useState(WORKFLOW_SUB_TABS[0].id)

  const viewportLabel = viewport === "web" ? "Web" : viewport === "tablet" ? "Tablet" : "Phone"
  const isWorkflow = activeTab === "workflow"

  return (
    <div className="flex flex-col gap-[var(--cds-gap-default)]">
      {/* Controls */}
      <div className="flex items-center gap-[var(--cds-gap-default)]">
        <span
          className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)]"
          style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
        >
          Viewport:
        </span>
        <ContentSwitcher
          value={viewport === "web" ? "Web" : viewport === "tablet" ? "Tablet" : "Phone"}
          items={["Web", "Tablet", "Phone"]}
          onValueChange={(v) => setViewport(v === "Tablet" ? "tablet" : v === "Phone" ? "phone" : "web")}
        />
      </div>

      {/* Shell preview — constrained height */}
      <div className="overflow-hidden rounded-[var(--cds-radius-r)] border border-[var(--border)]">
        <BuilderShell
          className="h-[500px]"
          viewport={viewport}
          onViewportChange={setViewport}
          topBar={{
            appName: "Figma Plugin Test",
            appInitials: "FPT",
            appIconColor: "#5C2D91",
            activePageName: isWorkflow ? "Workflow" : "Design Work Items Report",
            activeTab,
            onTabChange: setActiveTab,
          }}
          megaMenuColumns={MEGA_MENU_COLUMNS}
          megaMenuActiveId="form-1"
          tabSubNav={isWorkflow ? {
            tabs: WORKFLOW_SUB_TABS,
            activeTabId: activeSubTab,
            onTabChange: setActiveSubTab,
            actions: (
              <div className="flex items-center gap-[var(--cds-gap-small)]">
                {/* Search */}
                <div className="flex h-8 items-center gap-[var(--cds-gap-tight)] rounded-[var(--cds-radius-s)] border border-[var(--border)] bg-white px-[var(--cds-space-8)]" style={{ width: 200 }}>
                  <Search size={13} className="text-[var(--cds-huegrey-text-default)] shrink-0" />
                  <span style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", color: "#9EA1A9" }}>
                    Search for Workflows or Acti...
                  </span>
                </div>
                {/* New Workflow */}
                <button
                  type="button"
                  className="flex h-8 items-center rounded-[var(--cds-radius-s)] bg-[var(--cds-primary-surface-default,#0D4EF2)] px-[var(--cds-space-12)] text-white"
                  style={{ fontFamily: "'Zoho Puvi', sans-serif", fontSize: "13px", fontWeight: 500 }}
                >
                  New Workflow
                </button>
              </div>
            ),
          } : undefined}
          showPropertiesPanel={!isWorkflow}
          propertiesPanelTitle={`Report Customization · ${viewportLabel}`}
          propertiesPanel={<PropertiesPanelContent viewport={viewport} />}
        >
          {isWorkflow ? <WorkflowCanvas /> : <CanvasContent viewport={viewport} />}
        </BuilderShell>
      </div>
    </div>
  )
}

export function OrganismsSection() {
  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Top Bar</CardTitle>
          <CardDescription>Fixed global navigation bar at the top of every Creator screen. Contains the Zoho Creator logo, workspace selector, user avatar, and app switcher.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-[var(--cds-radius-r)]">
          <TopBar workspaceName="All Organizations" userInitials="RJ" className="static" />
        </CardContent>
      </Card>

      {/* Left Navigation Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Left Navigation Bar</CardTitle>
          <CardDescription>Fixed sidebar navigation for Creator screens. Groups nav items under section headers (DEVELOP, DEPLOY, MANAGE) with icon, label, active highlight, and left-edge indicator.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-[var(--cds-radius-r)]">
          <LeftNav />
        </CardContent>
      </Card>

      {/* Page Header / Dashboard Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header / Dashboard Header</CardTitle>
          <CardDescription>Top-level page heading with actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-[var(--cds-text-h4)] font-semibold leading-[var(--cds-leading-h4)]">All Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage and view all your records in one place.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline" size="sm"><ArrowUpDown className="mr-2 h-4 w-4" /> Sort</Button>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Record</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Data table with sorting, status badges, and row actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><Checkbox /></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "John Doe", email: "john@zoho.com", status: "Active", role: "Admin" },
                { name: "Jane Smith", email: "jane@zoho.com", status: "Pending", role: "Editor" },
                { name: "Bob Wilson", email: "bob@zoho.com", status: "Inactive", role: "Viewer" },
                { name: "Alice Brown", email: "alice@zoho.com", status: "Active", role: "Editor" },
              ].map((row) => (
                <TableRow key={row.email}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell>
                    <Badge className={
                      row.status === "Active" ? "bg-[var(--cds-success-surface-subtle)] text-[var(--cds-success-text-bold)] border border-[var(--cds-success-border-default)]" :
                      row.status === "Pending" ? "bg-[var(--cds-warning-surface-subtle)] text-[var(--cds-warning-text-bold)] border border-[var(--cds-warning-border-default)]" :
                      "bg-[var(--cds-error-surface-subtle)] text-[var(--cds-error-text-bold)] border border-[var(--cds-error-border-default)]"
                    }>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card Layouts */}
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
          <CardDescription>Card patterns for dashboard widgets, statistics, and content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardDescription>Total Users</CardDescription><CardTitle className="text-2xl text-primary">12,456</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-[var(--cds-success-text-default)]">↑ 12% from last month</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardDescription>Revenue</CardDescription><CardTitle className="text-2xl">$45,231</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-[var(--cds-success-text-default)]">↑ 8% from last month</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardDescription>Active Sessions</CardDescription><CardTitle className="text-2xl">573</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-[var(--cds-error-text-default)]">↓ 3% from last hour</p></CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Microservices Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Microservices Cards</CardTitle>
          <CardDescription>
            Interactive cards for microservice catalog screens (AI-Model, Connection, Custom-API, AR-Library). Hover state turns the border blue via the <code>interactive</code> prop on <code>Card</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* AI-Model card */}
            <Card interactive className="flex flex-col gap-[var(--cds-space-16)] p-[var(--cds-space-24)] pb-[var(--cds-space-20)]">
              <Avatar size="xl" shape="squircle">
                <AvatarFallback color="primary">AI</AvatarFallback>
              </Avatar>
              <p className="text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] font-medium text-[color:var(--cds-huegrey-text-dark)]">AI Models</p>
              <p className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)]">Subtext description for the AI model service.</p>
              <div className="flex items-center justify-between pt-[var(--cds-space-4)]">
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <Eye size={16} className="text-[color:var(--cds-huegrey-text-default)]" />
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-dark)]">Prediction</span>
                </div>
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <PenLine size={16} className="text-[color:var(--cds-huegrey-text-default)]" />
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)]">Draft</span>
                </div>
              </div>
            </Card>

            {/* Connection card */}
            <Card interactive className="flex flex-col gap-[var(--cds-space-6)] p-[var(--cds-space-24)] pb-[var(--cds-space-20)]">
              <div className="flex size-10 items-center justify-center rounded-[var(--cds-radius-r)] bg-[var(--cds-primary-surface-subtle)]">
                <Link2 size={20} className="text-[color:var(--cds-primary-text-default)]" />
              </div>
              <p className="text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] font-medium text-[color:var(--cds-huegrey-text-dark)]">Zoho Analytics</p>
              <div className="flex items-center gap-[var(--cds-gap-tight)]">
                <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)]">zoho_analytics_connection</span>
                <Copy size={14} className="text-[color:var(--cds-huegrey-text-default)] shrink-0" />
              </div>
              <div className="flex items-center justify-end gap-[var(--cds-gap-small)] pt-[var(--cds-space-4)]">
                <CheckCircle2 size={16} className="text-[color:var(--cds-success-text-default)]" />
                <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-success-text-default)]">Connected</span>
              </div>
            </Card>

            {/* Custom-API card */}
            <Card interactive className="flex flex-col gap-[var(--cds-space-12)] p-[var(--cds-space-24)] pb-[var(--cds-space-20)]">
              <Avatar size="xl" shape="squircle">
                <AvatarFallback color="avocado">CA</AvatarFallback>
              </Avatar>
              <p className="text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] font-medium text-[color:var(--cds-huegrey-text-dark)]">After Trip Public</p>
              <div className="flex items-center gap-[var(--cds-gap-tight)] flex-wrap">
                <span className="text-[length:var(--cds-text-p2)] font-medium text-[color:var(--cds-primary-text-default)]">POST</span>
                <span className="text-[length:var(--cds-text-p2)] text-[color:var(--cds-huegrey-text-default)]">zoho_analytics_connection</span>
                <Copy size={14} className="text-[color:var(--cds-huegrey-text-default)] shrink-0" />
              </div>
              <div className="flex items-center justify-between pt-[var(--cds-space-4)]">
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <Key size={16} className="text-[color:var(--cds-huegrey-text-default)]" />
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-dark)]">Public Key</span>
                </div>
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <CheckCircle2 size={16} className="text-[color:var(--cds-success-text-default)]" />
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-success-text-default)]">Ready to invoke</span>
                </div>
              </div>
            </Card>

            {/* AR-Library card */}
            <Card interactive className="flex flex-col gap-[var(--cds-space-16)] p-[var(--cds-space-24)] pb-[var(--cds-space-20)]">
              <Avatar size="xl" shape="squircle">
                <AvatarFallback color="russet">AR</AvatarFallback>
              </Avatar>
              <p className="text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] font-medium text-[color:var(--cds-huegrey-text-dark)]">AR Library</p>
              <div className="flex items-center justify-between pt-[var(--cds-space-4)]">
                <div className="flex items-center gap-[var(--cds-gap-tight)]">
                  <span className="flex items-center justify-center border border-[var(--cds-huegrey-border-fairish)] rounded-[var(--cds-radius-s)] px-[var(--cds-space-6)] py-[var(--cds-space-1)] text-[length:var(--cds-text-p2)] text-[color:var(--cds-huegrey-text-dark)] min-w-[21px]">3</span>
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-dark)]">Elements</span>
                </div>
                <div className="flex items-center gap-[var(--cds-gap-small)]">
                  <Eye size={16} className="text-[color:var(--cds-huegrey-text-default)]" />
                  <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[color:var(--cds-huegrey-text-default)]">Mark-based</span>
                </div>
              </div>
            </Card>

          </div>
        </CardContent>
      </Card>

      {/* Card Horizontal — list-row variant */}
      <Card>
        <CardHeader>
          <CardTitle>Card Horizontal</CardTitle>
          <CardDescription>
            Horizontal list-item card for microservice / resource catalog rows. Contains a
            fixed illustration slot, title + description body, and a CTA that switches from
            huegrey-bordered (default) to primary-fill on card hover.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-[var(--cds-gap-default)]">
            <CardHorizontal>
              <CardHorizontalIcon>
                <div className="flex items-center justify-center w-full h-full rounded-[var(--cds-radius-r)] bg-[var(--cds-primary-surface-subtle)]">
                  <span className="text-[length:var(--cds-text-p3)] font-semibold text-[color:var(--cds-primary-text-default)]">AI</span>
                </div>
              </CardHorizontalIcon>
              <CardHorizontalBody>
                <CardHorizontalTitle>AI Models</CardHorizontalTitle>
                <CardHorizontalDescription>Add AI capabilities to your apps</CardHorizontalDescription>
              </CardHorizontalBody>
              <CardHorizontalAction>Create</CardHorizontalAction>
            </CardHorizontal>

            <CardHorizontal>
              <CardHorizontalIcon>
                <div className="flex items-center justify-center w-full h-full rounded-[var(--cds-radius-r)] bg-[var(--cds-info-surface-subtle,#e8f1fe)]">
                  <span className="text-[length:var(--cds-text-p3)] font-semibold text-[color:var(--cds-info-text-default,#0d4ef2)]">AR</span>
                </div>
              </CardHorizontalIcon>
              <CardHorizontalBody>
                <CardHorizontalTitle>AR Library</CardHorizontalTitle>
                <CardHorizontalDescription>Augmented reality elements for your apps</CardHorizontalDescription>
              </CardHorizontalBody>
              <CardHorizontalAction>Create</CardHorizontalAction>
            </CardHorizontal>

            <CardHorizontal>
              <CardHorizontalIcon>
                <div className="flex items-center justify-center w-full h-full rounded-[var(--cds-radius-r)] bg-[var(--cds-success-surface-subtle)]">
                  <span className="text-[length:var(--cds-text-p3)] font-semibold text-[color:var(--cds-success-text-default)]">DS</span>
                </div>
              </CardHorizontalIcon>
              <CardHorizontalBody>
                <CardHorizontalTitle>Connections</CardHorizontalTitle>
                <CardHorizontalDescription>Connect to external services and APIs</CardHorizontalDescription>
              </CardHorizontalBody>
              <CardHorizontalAction>Create</CardHorizontalAction>
            </CardHorizontal>
          </div>
        </CardContent>
      </Card>

      {/* Card Operations — floated title-pill variant */}
      <Card>
        <CardHeader>
          <CardTitle>Card Operations</CardTitle>
          <CardDescription>
            "Floated title pill" card variant for Operations / settings landing pages. A rounded pill
            (icon circle + title) is absolutely positioned at the top, partially overlapping the white
            card body to create a tabbed appearance. The body contains a 2-column link grid.
            Sub-components: CardOperations, CardOperationsPill, CardOperationsBody, CardOperationsGrid,
            CardOperationsLink.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-[var(--cds-space-20)]">
            <CardOperations>
              <CardOperationsPill
                icon={<LayoutGrid size={16} color="var(--cds-huegrey-text-default)" />}
                title="Applications"
              />
              <CardOperationsBody>
                <CardOperationsGrid>
                  {["Backup", "Audit Trail", "Email Management", "Domain Restriction",
                    "API Management", "Blueprint Analytics", "Logs", "Publish"].map((label) => (
                    <CardOperationsLink key={label}>{label}</CardOperationsLink>
                  ))}
                </CardOperationsGrid>
              </CardOperationsBody>
            </CardOperations>

            <CardOperations>
              <CardOperationsPill
                icon={<BarChart3 size={16} color="var(--cds-huegrey-text-default)" />}
                title="BI & Analytics"
              />
              <CardOperationsBody>
                <CardOperationsGrid>
                  {["Workspaces", "Data Sources", "Reports", "Dashboards",
                    "Slideshows", "AI Assistant", "Permissions", "Shared Views"].map((label) => (
                    <CardOperationsLink key={label}>{label}</CardOperationsLink>
                  ))}
                </CardOperationsGrid>
              </CardOperationsBody>
            </CardOperations>

            <CardOperations>
              <CardOperationsPill
                icon={<GitFork size={16} color="var(--cds-huegrey-text-default)" />}
                title="Integration Flow"
              />
              <CardOperationsBody>
                <CardOperationsGrid>
                  {["Flow Builder", "Triggers", "Actions", "Connectors",
                    "Webhooks", "Schedules", "History", "Variables"].map((label) => (
                    <CardOperationsLink key={label}>{label}</CardOperationsLink>
                  ))}
                </CardOperationsGrid>
              </CardOperationsBody>
            </CardOperations>
          </div>
        </CardContent>
      </Card>

      {/* CardBilling */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Card</CardTitle>
          <CardDescription>Compact stat card for Billing / Usage pages. Supports default (interactive hover) and disabled states.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--cds-gap-default)]">
            {/* Default — hover to see blue border */}
            <CardBilling className="w-[280px]">
              <CardBillingIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </CardBillingIcon>
              <CardBillingBody>
                <CardBillingValue>236 / 7,500,000</CardBillingValue>
                <CardBillingLabel>Records</CardBillingLabel>
              </CardBillingBody>
            </CardBilling>
            {/* Disabled */}
            <CardBilling disabled className="w-[280px]">
              <CardBillingIcon disabled>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </CardBillingIcon>
              <CardBillingBody>
                <CardBillingValue>0 / 500</CardBillingValue>
                <CardBillingLabel>API Calls (disabled)</CardBillingLabel>
              </CardBillingBody>
            </CardBilling>
          </div>
        </CardContent>
      </Card>

      {/* Tiles */}
      <Card>
        <CardHeader>
          <CardTitle>Tiles</CardTitle>
          <CardDescription>Selectable tile cards for feature/module navigation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Tile variant="active"><TileIcon><Database className="h-5 w-5" /></TileIcon><TileTitle>Database</TileTitle><TileDescription>Manage data</TileDescription></Tile>
            <Tile><TileIcon><Layers className="h-5 w-5" /></TileIcon><TileTitle>Forms</TileTitle><TileDescription>Build forms</TileDescription></Tile>
            <Tile><TileIcon><BarChart3 className="h-5 w-5" /></TileIcon><TileTitle>Reports</TileTitle><TileDescription>View analytics</TileDescription></Tile>
            <Tile variant="muted"><TileIcon><Globe className="h-5 w-5" /></TileIcon><TileTitle>Portal</TileTitle><TileDescription>Coming soon</TileDescription></Tile>
          </div>
        </CardContent>
      </Card>

      {/* Dialog / Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Popup Form / Dialog</CardTitle>
          <CardDescription>Modal dialog for forms, confirmations, and detail views.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger><Button variant="outline">Popup Form</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Record</DialogTitle><DialogDescription>Fill in the details to create a new record.</DialogDescription></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Name</Label><Input placeholder="Enter name" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Enter email" /></div>
                  <div className="space-y-2"><Label>Role</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="viewer">Viewer</SelectItem></SelectContent></Select>
                  </div>
                </div>
                <DialogFooter><Button variant="outline">Cancel</Button><Button>Create</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger><Button variant="outline">Popup Details</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Record Details</DialogTitle><DialogDescription>View complete information about this record.</DialogDescription></DialogHeader>
                <div className="space-y-3 py-4">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Name</span><span className="text-sm font-medium">John Doe</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Email</span><span className="text-sm">john@example.com</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><Badge className="bg-[var(--cds-success-surface-subtle)] text-[var(--cds-success-text-bold)] border border-[var(--cds-success-border-default)]">Active</Badge></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Role</span><span className="text-sm">Admin</span></div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog / Popup Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Popup Alert / Alert Dialog</CardTitle>
          <CardDescription>Confirmation dialog with status icons for destructive, success, info, and warning actions. Matches the Figma Popup Alert component with 4 variants.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {/* Alert / Delete variant */}
          <AlertDialog>
            <AlertDialogTrigger><Button variant="destructive">Delete Alert</Button></AlertDialogTrigger>
            <AlertDialogContent variant="alert">
              <AlertDialogHeader>
                <AlertDialogIcon />
                <AlertDialogTitle>Delete</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. Are you sure want to delete this backup version?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Delete</AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Success variant */}
          <AlertDialog>
            <AlertDialogTrigger><Button className="bg-[var(--cds-success-surface-default)] text-white hover:bg-[var(--cds-success-surface-default)]/90">Success Alert</Button></AlertDialogTrigger>
            <AlertDialogContent variant="success">
              <AlertDialogHeader>
                <AlertDialogIcon />
                <AlertDialogTitle>Success</AlertDialogTitle>
                <AlertDialogDescription>Your changes have been saved successfully. The record has been updated with the latest information.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Info variant */}
          <AlertDialog>
            <AlertDialogTrigger><Button>Info Alert</Button></AlertDialogTrigger>
            <AlertDialogContent variant="info">
              <AlertDialogHeader>
                <AlertDialogIcon />
                <AlertDialogTitle>Information</AlertDialogTitle>
                <AlertDialogDescription>A new version of the application is available. Please update to access the latest features and improvements.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Update Now</AlertDialogAction>
                <AlertDialogCancel>Later</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Warning variant */}
          <AlertDialog>
            <AlertDialogTrigger><Button className="bg-[var(--cds-warning-surface-default)] text-white hover:bg-[var(--cds-warning-surface-default)]/90">Warning Alert</Button></AlertDialogTrigger>
            <AlertDialogContent variant="warning">
              <AlertDialogHeader>
                <AlertDialogIcon />
                <AlertDialogTitle>Warning</AlertDialogTitle>
                <AlertDialogDescription>You have unsaved changes that will be lost if you continue. Do you want to proceed without saving?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Proceed</AlertDialogAction>
                <AlertDialogCancel>Go Back</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Blanket / Overlay */}
      <Card>
        <CardHeader>
          <CardTitle>Blanket / Overlay</CardTitle>
          <CardDescription>Scrim backdrop rendered behind Slider panels, sheets, dialogs, and other overlays. Uses the <code>--cds-blanket-overlay</code> token (primary-surface-bold-alpha10).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlanketDemo />
          <Notes variant="neutral" title="Blanket">Dialog, Sheet, and AlertDialog render the blanket automatically. For custom overlays, use the <code>&lt;Blanket /&gt;</code> component instead of a hardcoded rectangle.</Notes>
        </CardContent>
      </Card>

      {/* Slider Form / Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Slider Form / Slider Details (Sheet)</CardTitle>
          <CardDescription>Slide-in panel from the right edge. Has a fixed header (title + close), scrollable body, and sticky footer with Cancel/Save actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger><Button variant="outline">Slider Details (Right)</Button></SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Slider Title</SheetTitle>
                <Button size="sm" className="h-8 min-w-[66px] rounded-[var(--cds-radius-r)] bg-[var(--cds-primary-surface-default)] text-white hover:bg-[var(--cds-primary-surface-default-hover)] text-[14px] px-3">
                  Button
                </Button>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
                <p className="text-[16px] font-medium leading-[21px] text-foreground">Sample Heading</p>
                <p className="text-[14px] leading-[18px] text-[var(--cds-neutral-text-default)]">
                  Explore the features of our innovative software that streamlines your workflow and enhances productivity. Discover how it can transform your daily tasks!
                </p>
                <Notes variant="info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit a bibendum mauris.
                </Notes>
              </div>
              <SheetFooter>
                <Button variant="outline" className="h-9 min-w-[70px] rounded-[var(--cds-radius-r)] border-[#b0b2b8] text-[var(--cds-neutral-text-bold)]">Cancel</Button>
                <Button className="h-9 min-w-[70px] rounded-[var(--cds-radius-r)] bg-[var(--cds-primary-surface-default)] text-white hover:bg-[var(--cds-primary-surface-default-hover)] gap-2">
                  <svg width="14" height="14" viewBox="0 0 13.125 13.125" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.948 0.820C1.325 0.820 0.820 1.325 0.820 1.948V11.177C0.820 11.800 1.325 12.305 1.948 12.305H11.177C11.800 12.305 12.305 11.800 12.305 11.177V4.214C12.305 3.857 12.163 3.514 11.910 3.262L9.864 1.215C9.611 0.962 9.268 0.820 8.911 0.820H1.948ZM0 1.948C0 0.872 0.872 0 1.948 0H8.911C9.486 0 10.037 0.228 10.444 0.635L12.490 2.681C12.897 3.088 13.125 3.639 13.125 4.214V11.177C13.125 12.253 12.253 13.125 11.177 13.125H1.948C0.872 13.125 0 12.253 0 11.177V1.948Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.614 8.101C4.614 7.025 5.487 6.152 6.563 6.152C7.638 6.152 8.511 7.025 8.511 8.101C8.511 9.177 7.638 10.049 6.563 10.049C5.487 10.049 4.614 9.177 4.614 8.101ZM6.563 6.973C5.940 6.973 5.435 7.478 5.435 8.101C5.435 8.724 5.940 9.229 6.563 9.229C7.185 9.229 7.690 8.724 7.690 8.101C7.690 7.478 7.185 6.973 6.563 6.973Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.486 0C3.713 0 3.896 0.184 3.896 0.410V3.076H7.690V0.410C7.690 0.184 7.874 0 8.101 0C8.327 0 8.511 0.184 8.511 0.410V3.486C8.511 3.713 8.327 3.896 8.101 3.896H3.486C3.260 3.896 3.076 3.713 3.076 3.486V0.410C3.076 0.184 3.260 0 3.486 0Z" fill="white"/>
                  </svg>
                  Save
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger><Button variant="outline">Slider Details (Left)</Button></SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Record Summary</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-4 space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-1 border-b pb-3">
                      <p className="text-xs text-muted-foreground">Field {i + 1}</p>
                      <p className="text-sm">Sample value for field {i + 1}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <SheetFooter>
                <Button variant="outline" className="h-9 min-w-[70px] rounded-[var(--cds-radius-r)] border-[#b0b2b8]">Close</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* Form Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Form Pattern</CardTitle>
          <CardDescription>Standard form layout with labels, inputs, and validation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-lg space-y-4 border rounded-[var(--cds-radius-r)] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><Input placeholder="John" /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Doe" /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="john@example.com" /></div>
            <div className="space-y-2"><Label>Department</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="eng">Engineering</SelectItem><SelectItem value="des">Design</SelectItem><SelectItem value="mkt">Marketing</SelectItem></SelectContent></Select>
            </div>
            <div className="flex items-center gap-2"><Checkbox id="form-terms" /><Label htmlFor="form-terms" className="font-normal text-sm">I agree to the terms and conditions</Label></div>
            <Separator />
            <div className="flex justify-end gap-2"><Button variant="outline">Cancel</Button><Button>Submit</Button></div>
          </div>
        </CardContent>
      </Card>

      {/* Full Page Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Full Page Dialog</CardTitle>
          <CardDescription>
            Full-screen dialog shell with a header (title, status, CTA, close), a 200px sidebar nav
            (section groups or stepper progress), a scrollable content area, and an optional 240px
            hints panel. Toggle between Section and Stepper nav styles, and the Hints panel, below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FullPageDialogDemo />
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>
            Structured vertical list of data rows with optional checkboxes, avatar, badge, meta
            text, action CTA, and remove button. Supports Large (64px) and Default (52px) row
            density. Toggle selectable mode and size below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListDemo />
        </CardContent>
      </Card>

      {/* Builder Shell */}
      <Card>
        <CardHeader>
          <CardTitle>Builder Shell</CardTitle>
          <CardDescription>
            Full app-builder layout shell. Composes BuilderTopBar (dark nav with app icon tile,
            Design/Workflow/Settings tabs, Upgrade + Access CTAs), BuilderLeftNav (collapsible
            entity tree with form/report/page/workflow/stage items), a viewport toolbar
            (Desktop/Tablet/Phone switcher + theme tools), a scrollable canvas, and an optional
            right-hand properties panel. Left nav auto-collapses on Tablet/Phone viewport.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-[var(--cds-padding-card)]">
          <BuilderShellDemo />
        </CardContent>
      </Card>
    </div>
  );
}
