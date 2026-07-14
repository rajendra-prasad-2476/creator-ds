/**
 * creator-ds.ts
 * Component catalog, template list, and screen registry for Creator DS.
 * This is the authoritative machine-readable companion to AGENTS.md.
 */

export type Category = "Atom" | "Molecule" | "Organism"

export interface Component {
  name: string
  file: string
  importPath: string
  category: Category
  useFor: string
  neverUse?: string
  variants?: string[]
  sizes?: string[]
  props?: string[]
  notes?: string
}

export interface Template {
  name: string
  file: string
  importPath: string
  pattern: string
  useWhen: string
  props?: string[]
}

export interface Screen {
  featureId: string
  featureName: string
  screenId: string
  screenName: string
  sourcePath: string
}

// ─── Component Catalog ────────────────────────────────────────────────────────

export const COMPONENTS: Component[] = [
  // ── Atoms ──────────────────────────────────────────────────────────────────
  {
    name: "Button",
    file: "button.tsx",
    importPath: "@/components/ui/button",
    category: "Atom",
    useFor: "All interactive actions",
    neverUse: "Never use raw <button> elements",
    variants: ["default (fill/blue)", "outline (border)", "ghost (minimal-border)", "subtle (minimal-fill)", "link", "hyperlink", "secondary (huegrey)", "destructive"],
    sizes: ["xs (26px)", "sm (32px)", "default/base (36px)", "lg (40px)"],
    props: ["variant", "size", "shape", "icon", "iconPosition", "disabled", "loading", "asChild"],
    notes: "shape='icon' or shape='circle' for icon-only buttons. Use iconPosition='left'|'right' for icon+text.",
  },
  {
    name: "Input",
    file: "input.tsx",
    importPath: "@/components/ui/input",
    category: "Atom",
    useFor: "Single-line text entry",
    neverUse: "Never use raw <input> elements",
    props: ["type", "placeholder", "value", "onChange", "disabled", "error", "id"],
  },
  {
    name: "Textarea",
    file: "textarea.tsx",
    importPath: "@/components/ui/textarea",
    category: "Atom",
    useFor: "Multi-line text entry",
    neverUse: "Never use raw <textarea> elements",
    props: ["placeholder", "value", "onChange", "disabled", "rows"],
  },
  {
    name: "Label",
    file: "label.tsx",
    importPath: "@/components/ui/label",
    category: "Atom",
    useFor: "Form field labels — always pair with an Input",
    neverUse: "Never use raw <label> or styled <span> for form labels",
    props: ["htmlFor", "required"],
  },
  {
    name: "Checkbox",
    file: "checkbox.tsx",
    importPath: "@/components/ui/checkbox",
    category: "Atom",
    useFor: "Boolean / multi-select options",
    neverUse: "Never use raw <input type='checkbox'>",
    props: ["checked", "onCheckedChange", "disabled", "id"],
  },
  {
    name: "RadioGroup",
    file: "radio-group.tsx",
    importPath: "@/components/ui/radio-group",
    category: "Atom",
    useFor: "Mutually exclusive options — always wrap RadioGroupItem inside RadioGroup",
    neverUse: "Never use raw <input type='radio'>",
    props: ["value", "onValueChange", "disabled", "orientation"],
    notes: "Import both RadioGroup and RadioGroupItem from the same path.",
  },
  {
    name: "Switch",
    file: "switch.tsx",
    importPath: "@/components/ui/switch",
    category: "Atom",
    useFor: "Simple binary on/off toggle — no colour variants",
    neverUse: "For semantic colour variants (success=on / error=off) use Toggle instead",
    props: ["checked", "onCheckedChange", "disabled"],
  },
  {
    name: "Toggle",
    file: "toggle.tsx",
    importPath: "@/components/ui/toggle",
    category: "Atom",
    useFor: "DS sliding on/off switch with semantic colour — 2 sizes × 3 variants × 6 colour states",
    neverUse: "For plain binary switches without colour variants use Switch instead",
    variants: ["fill", "border", "subtle"],
    sizes: ["sm (14px track)", "default (16px track)"],
    props: ["checked", "onCheckedChange", "size", "variant", "color", "label", "disabled"],
    notes: "color prop: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'huegrey'",
  },
  {
    name: "Slider",
    file: "slider.tsx",
    importPath: "@/components/ui/slider",
    category: "Atom",
    useFor: "Range input",
    props: ["value", "onValueChange", "min", "max", "step", "disabled"],
  },
  {
    name: "InputOTP",
    file: "input-otp.tsx",
    importPath: "@/components/ui/input-otp",
    category: "Atom",
    useFor: "One-time password entry",
    props: ["maxLength", "value", "onChange"],
  },
  {
    name: "Avatar",
    file: "avatar.tsx",
    importPath: "@/components/ui/avatar",
    category: "Atom",
    useFor: "User/entity portraits",
    neverUse: "Never use raw <img> with manual border-radius for avatars",
    props: ["src", "alt", "fallback", "size"],
  },
  {
    name: "Badge",
    file: "badge.tsx",
    importPath: "@/components/ui/badge",
    category: "Atom",
    useFor: "Status labels, counts, tags",
    variants: ["prominent", "subtle"],
    props: ["variant", "color", "size"],
    notes: "Only variants are 'prominent' and 'subtle'. Never use secondary/outline/default as variant.",
  },
  {
    name: "StatusBadge",
    file: "status-badge.tsx",
    importPath: "@/components/ui/status-badge",
    category: "Atom",
    useFor: "Semantic status pills with fixed colour + icon (configured / not-configured / error / pending)",
    neverUse: "Never hand-compose Badge + icon per-screen for status states — use StatusBadge",
    props: ["status"],
    notes: "status: 'configured' | 'not-configured' | 'error' | 'pending'",
  },
  {
    name: "Blanket",
    file: "blanket.tsx",
    importPath: "@/components/ui/blanket",
    category: "Atom",
    useFor: "Overlay/scrim backdrop behind Sheets, Dialogs, and custom overlays",
    neverUse: "Never build a custom scrim with a raw <div> and background-color — use Blanket. Note: Dialog and Sheet already render Blanket automatically.",
    props: ["onClick", "visible"],
    notes: "Uses --cds-blanket-overlay = rgba(1,3,10,0.1). No backdrop blur.",
  },
  {
    name: "Progress",
    file: "progress.tsx",
    importPath: "@/components/ui/progress",
    category: "Atom",
    useFor: "Linear progress bars",
    props: ["value", "max", "color"],
  },
  {
    name: "Separator",
    file: "separator.tsx",
    importPath: "@/components/ui/separator",
    category: "Atom",
    useFor: "Horizontal or vertical dividers between content sections",
    props: ["orientation", "decorative"],
  },
  {
    name: "RadioCard",
    file: "radio-card.tsx",
    importPath: "@/components/ui/radio-card",
    category: "Atom",
    useFor: "Selectable card for mutually-exclusive choices with description — always use inside RadioGroup",
    neverUse: "Never build a custom card <div> with a manual radio indicator for card-style radio choices",
    props: ["value", "label", "description", "icon", "disabled"],
  },
  {
    name: "Tag",
    file: "tag.tsx",
    importPath: "@/components/ui/tag",
    category: "Atom",
    useFor: "Dismissible chip/pill for labels, categories, keywords — 4 style variants × 2 sizes",
    neverUse: "Never use hand-styled <span> or <div> for chip/pill UI",
    variants: ["default", "bold", "outlined", "ghost"],
    sizes: ["base (26px)", "small (18px)"],
    props: ["variant", "size", "closeable", "onClose", "disabled"],
    notes: "Use closeable + onClose for interactive dismissible tags.",
  },

  // ── Molecules ──────────────────────────────────────────────────────────────
  {
    name: "Breadcrumb",
    file: "breadcrumb.tsx",
    importPath: "@/components/ui/breadcrumb",
    category: "Molecule",
    useFor: "Page hierarchy navigation",
    props: ["items"],
    notes: "Import BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage from same path.",
  },
  {
    name: "ContentSwitcher",
    file: "content-switcher.tsx",
    importPath: "@/components/ui/content-switcher",
    category: "Molecule",
    useFor: "Toggle between parallel views of the SAME data — e.g. Grid/List, Day/Week/Month",
    neverUse: "Never use Tabs for parallel views of the same data. ContentSwitcher sits ABOVE the content region.",
    props: ["value", "onValueChange", "options"],
    notes: "Decision rule: same data different view → ContentSwitcher. Different content areas → Tabs.",
  },
  {
    name: "Tabs",
    file: "tabs.tsx",
    importPath: "@/components/ui/tabs",
    category: "Molecule",
    useFor: "Switching between DIFFERENT content panels within a page",
    neverUse: "Never use Tabs for parallel views of the same data — use ContentSwitcher instead",
    props: ["value", "onValueChange", "defaultValue"],
    notes: "Import Tabs, TabsList, TabsTrigger, TabsContent from same path.",
  },
  {
    name: "Select",
    file: "select.tsx",
    importPath: "@/components/ui/select",
    category: "Molecule",
    useFor: "Dropdown single-select — searchable, creatable, grouped variants built-in",
    neverUse: "Never use raw <select>",
    props: ["value", "onValueChange", "placeholder", "disabled", "searchable", "creatable"],
    notes: "Import SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel from same path.",
  },
  {
    name: "Popover",
    file: "popover.tsx",
    importPath: "@/components/ui/popover",
    category: "Molecule",
    useFor: "Floating overlay anchored to a trigger element",
    props: ["open", "onOpenChange"],
    notes: "Import PopoverTrigger and PopoverContent from same path.",
  },
  {
    name: "Tooltip",
    file: "tooltip.tsx",
    importPath: "@/components/ui/tooltip",
    category: "Molecule",
    useFor: "Short hover hints on interactive elements",
    neverUse: "Never use the HTML title attribute for tooltip hints",
    props: ["content", "side", "align", "delayDuration"],
    notes: "Import TooltipProvider, TooltipTrigger, TooltipContent from same path. Wrap app in TooltipProvider once.",
  },
  {
    name: "DropdownMenu",
    file: "dropdown-menu.tsx",
    importPath: "@/components/ui/dropdown-menu",
    category: "Molecule",
    useFor: "Action overflow menus triggered from a button",
    neverUse: "Never build a bare <ul> action menu",
    props: ["open", "onOpenChange"],
    notes: "Import DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator from same path.",
  },
  {
    name: "NavigationMenu",
    file: "navigation-menu.tsx",
    importPath: "@/components/ui/navigation-menu",
    category: "Molecule",
    useFor: "Multi-level navigation links",
  },
  {
    name: "Collapsible",
    file: "collapsible.tsx",
    importPath: "@/components/ui/collapsible",
    category: "Molecule",
    useFor: "Expand/collapse a single section",
    props: ["open", "onOpenChange", "defaultOpen"],
    notes: "Import CollapsibleTrigger, CollapsibleContent from same path.",
  },
  {
    name: "ScrollArea",
    file: "scroll-area.tsx",
    importPath: "@/components/ui/scroll-area",
    category: "Molecule",
    useFor: "Scrollable region with DS-styled scrollbar",
    props: ["className", "orientation"],
  },
  {
    name: "Notes",
    file: "notes.tsx",
    importPath: "@/components/ui/notes",
    category: "Molecule",
    useFor: "Inline annotation or comment blocks",
    props: ["variant", "children"],
  },
  {
    name: "InputSuffix",
    file: "input-suffix.tsx",
    importPath: "@/components/ui/input-suffix",
    category: "Molecule",
    useFor: "Text field with trailing CTA — icon, label, or clear (×) button",
    neverUse: "Never use a raw <div> wrapper + <button> beside an <input>",
    variants: ["default", "error", "success", "disabled"],
    props: ["value", "onChange", "suffix", "onSuffixClick", "placeholder", "disabled", "status"],
  },
  {
    name: "InputPrefix",
    file: "input-prefix.tsx",
    importPath: "@/components/ui/input-prefix",
    category: "Molecule",
    useFor: "Text field with leading CTA — icon or label (URL scheme, currency, country code)",
    neverUse: "Never use a raw <span> + <input> side by side for prefixed inputs",
    props: ["value", "onChange", "prefix", "placeholder", "disabled", "status"],
  },
  {
    name: "InputAffixed",
    file: "input-affixed.tsx",
    importPath: "@/components/ui/input-affixed",
    category: "Molecule",
    useFor: "Text field with BOTH leading AND trailing CTAs (currency + unit, code + extension)",
    neverUse: "Never use two raw <span> elements flanking an <input>",
    props: ["value", "onChange", "prefix", "suffix", "placeholder", "disabled", "status"],
    notes: "Status applies to prefix + input only; right CTA stays default grey.",
  },
  {
    name: "Tile",
    file: "tile.tsx",
    importPath: "@/components/ui/tile",
    category: "Molecule",
    useFor: "Clickable card tiles displayed in a grid",
    props: ["title", "description", "icon", "onClick", "selected", "disabled"],
  },
  {
    name: "Sonner",
    file: "sonner.tsx",
    importPath: "@/components/ui/sonner",
    category: "Molecule",
    useFor: "Toast notifications — temporary status messages",
    neverUse: "Never build raw <div> alert banners for transient messages — use Sonner (toast)",
    props: ["position", "richColors", "closeButton"],
    notes: "Import { toast } from 'sonner' to trigger toasts. Place <Sonner /> once at root.",
  },
  {
    name: "TagInput",
    file: "tag-input.tsx",
    importPath: "@/components/ui/tag-input",
    category: "Molecule",
    useFor: "Multi-value chip input — type + Enter/comma to add tags, × to dismiss",
    neverUse: "Never build a custom multi-value chip input with raw <input> beside custom chip divs",
    props: ["value", "onChange", "placeholder", "maxTags", "disabled", "error"],
  },

  // ── Organisms ──────────────────────────────────────────────────────────────
  {
    name: "Card",
    file: "card.tsx",
    importPath: "@/components/ui/card",
    category: "Organism",
    useFor: "Content containers and panels",
    props: ["className"],
    notes: "Import CardHeader, CardTitle, CardDescription, CardContent, CardFooter from same path.",
  },
  {
    name: "Dialog",
    file: "dialog.tsx",
    importPath: "@/components/ui/dialog",
    category: "Organism",
    useFor: "Modal dialogs requiring a user response",
    neverUse: "Never use Dialog for destructive confirmation — use AlertDialog instead. Dialog already renders Blanket automatically.",
    props: ["open", "onOpenChange"],
    notes: "Import DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter from same path.",
  },
  {
    name: "AlertDialog",
    file: "alert-dialog.tsx",
    importPath: "@/components/ui/alert-dialog",
    category: "Organism",
    useFor: "Destructive confirmation dialogs (delete, reset, etc.)",
    neverUse: "Never use Dialog or window.confirm() for destructive confirmations",
    props: ["open", "onOpenChange"],
    notes: "Import AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel from same path.",
  },
  {
    name: "Sheet",
    file: "sheet.tsx",
    importPath: "@/components/ui/sheet",
    category: "Organism",
    useFor: "Slide-in side panels for detail views or forms",
    neverUse: "Never use Dialog for a slide-in side panel — use Sheet. Sheet already renders Blanket automatically.",
    props: ["open", "onOpenChange", "side"],
    notes: "side: 'left' | 'right' | 'top' | 'bottom'. Import SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription from same path.",
  },
  {
    name: "Table",
    file: "table.tsx",
    importPath: "@/components/ui/table",
    category: "Organism",
    useFor: "Tabular data display",
    neverUse: "Never compose raw <table><tr><td> elements",
    notes: "Import TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption from same path.",
  },
  {
    name: "TopBar",
    file: "top-bar.tsx",
    importPath: "@/components/ui/top-bar",
    category: "Organism",
    useFor: "Global app header — ALWAYS present in every full-page screen",
    neverUse: "Never skip TopBar in full-page screen outputs",
    notes: "Part of the mandatory page shell: <TopBar /> + <LeftNav /> must wrap every screen.",
  },
  {
    name: "LeftNav",
    file: "left-nav.tsx",
    importPath: "@/components/ui/left-nav",
    category: "Organism",
    useFor: "Global sidebar navigation — ALWAYS present in every full-page screen",
    neverUse: "Never skip LeftNav in full-page screen outputs. Never put page-level navigation inside <main>.",
    props: ["activeId"],
    notes: "activeId must match one of the nav item IDs. Use activeId='operations' for Zia/Operations screens.",
  },
]

// ─── Template Catalog ─────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    name: "CardGridTemplate",
    file: "CardGridTemplate.tsx",
    importPath: "@/templates/CardGridTemplate",
    pattern: "Title + search/filter bar + responsive tile grid",
    useWhen: "App galleries, solution lists, any browsable card collection",
    props: ["title", "ctaLabel", "items", "onSearch", "onFilter"],
  },
  {
    name: "TabbedSectionsTemplate",
    file: "TabbedSectionsTemplate.tsx",
    importPath: "@/templates/TabbedSectionsTemplate",
    pattern: "Page header + tabs + grouped content cards per tab",
    useWhen: "Multi-category resource pages (Microservices, Marketplace, etc.)",
    props: ["title", "tabs", "sections"],
  },
  {
    name: "SplitPanelTemplate",
    file: "SplitPanelTemplate.tsx",
    importPath: "@/templates/SplitPanelTemplate",
    pattern: "Search list + two status columns",
    useWhen: "Deployment / environment views with multi-stage pipelines",
    props: ["title", "items", "columns"],
  },
  {
    name: "LinkCategoryTemplate",
    file: "LinkCategoryTemplate.tsx",
    importPath: "@/templates/LinkCategoryTemplate",
    pattern: "Page header + grouped navigation link cards",
    useWhen: "Settings / Operations landing pages with named sub-sections",
    props: ["title", "categories"],
  },
  {
    name: "BreadcrumbDetailTemplate",
    file: "BreadcrumbDetailTemplate.tsx",
    importPath: "@/templates/BreadcrumbDetailTemplate",
    pattern: "Breadcrumb + page header + tabs with 3 content variants (card-grid | empty | table)",
    useWhen: "Any inner detail or sub-section page reached via navigation",
    props: ["breadcrumbs", "title", "tabs", "contentVariant"],
  },
  {
    name: "BillingTemplate",
    file: "BillingTemplate.tsx",
    importPath: "@/templates/BillingTemplate",
    pattern: "Page header + tabs + plan summary card + stat tile grid",
    useWhen: "Subscription, billing, usage, or plan management pages",
    props: ["title", "plan", "stats", "tabs"],
  },
]

// ─── Screen Registry ──────────────────────────────────────────────────────────

export const SCREENS: Screen[] = [
  // Feature 001 — Zia Configuration
  { featureId: "001", featureName: "Zia Configuration Enhancements", screenId: "operations", screenName: "Operations", sourcePath: "src/screens/zia-configuration/OperationsScreen.tsx" },
  { featureId: "001", featureName: "Zia Configuration Enhancements", screenId: "zia-settings", screenName: "Zia Settings", sourcePath: "src/screens/zia-configuration/ZiaSettingsScreen.tsx" },
  { featureId: "001", featureName: "Zia Configuration Enhancements", screenId: "zia-provider-detail", screenName: "Zia Provider Detail", sourcePath: "src/screens/zia-configuration/ZiaProviderDetailScreen.tsx" },
  // Feature 002 — Portal Security
  { featureId: "002", featureName: "Portal Security", screenId: "portal-security-landing", screenName: "Portal Security Landing", sourcePath: "src/screens/portal-security/PortalSecurityLandingScreen.tsx" },
  { featureId: "002", featureName: "Portal Security", screenId: "portal-password-policy", screenName: "Password Policy", sourcePath: "src/screens/portal-security/PortalPasswordPolicyScreen.tsx" },
  { featureId: "002", featureName: "Portal Security", screenId: "portal-mfa", screenName: "Multi-Factor Authentication", sourcePath: "src/screens/portal-security/PortalMFAScreen.tsx" },
  { featureId: "002", featureName: "Portal Security", screenId: "portal-allowed-ips", screenName: "Allowed IPs", sourcePath: "src/screens/portal-security/PortalAllowedIPsScreen.tsx" },
  { featureId: "002", featureName: "Portal Security", screenId: "portal-advanced-settings", screenName: "Advanced Settings", sourcePath: "src/screens/portal-security/PortalAdvancedSettingsScreen.tsx" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function listComponents(): Component[] {
  return COMPONENTS
}

export function getComponent(name: string): Component | undefined {
  return COMPONENTS.find(
    c => c.name === name || c.name.toLowerCase() === name.toLowerCase()
  )
}

export function listTemplates(): Template[] {
  return TEMPLATES
}

export function getTemplate(name: string): Template | undefined {
  return TEMPLATES.find(
    t => t.name === name || t.name.toLowerCase() === name.toLowerCase()
  )
}

export function listScreens(): Screen[] {
  return SCREENS
}
