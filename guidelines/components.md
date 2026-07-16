# Creator DS — Component Guidelines

This file documents per-component usage patterns specific to the Creator DS kit.
Import all components from `@creator-kit/creator-ds-react`. Never use raw HTML elements when a DS component exists.

## Core rule: always use DS components
Only use components from `@creator-kit/creator-ds-react`.
Never compose raw `<div>`, `<button>`, `<input>`, or `<span>` elements when a DS component exists.

---

## Component catalogue

### Atoms

| Component | Import name | Purpose |
|---|---|---|
| Button | `Button`, `SplitButton` | All interactive actions |
| Input | `Input` | Single-line text entry |
| Textarea | `Textarea` | Multi-line text entry |
| Label | `Label` | Form field labels |
| Checkbox | `Checkbox` | Boolean / multi-select options |
| RadioGroup | `RadioGroup`, `RadioGroupItem` | Mutually exclusive options |
| RadioCard | `RadioCard` | Selectable card for mutually-exclusive choices |
| Switch | `Switch` | Simple binary on/off toggle (no colour variants) |
| Toggle | `Toggle` | Sliding on/off switch — 2 sizes × 3 variants × 6 colours |
| Slider | `Slider` | Range input |
| InputOTP | `InputOTP`, `InputOTPGroup`, `InputOTPSlot` | One-time password entry |
| Avatar | `Avatar`, `AvatarImage`, `AvatarFallback` | User portraits |
| Badge | `Badge` | Status labels, counts, tags |
| StatusBadge | `StatusBadge` | Semantic status pills (configured / error / pending) |
| Blanket | `Blanket` | Overlay scrim behind modals and sheets |
| Progress | `Progress` | Linear progress bars |
| Separator | `Separator` | Horizontal/vertical dividers |
| Tag | `Tag` | Dismissible chip/pill — use `closeable` + `onClose` |

### Molecules

| Component | Import name | Purpose |
|---|---|---|
| Breadcrumb | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` | Page hierarchy navigation |
| ContentSwitcher | `ContentSwitcher` | Toggle between parallel views (Grid/List, Day/Week) |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Switching between content panels |
| Select | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Dropdown single-select |
| Popover | `Popover`, `PopoverTrigger`, `PopoverContent` | Floating overlay |
| Tooltip | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | Short hover hints |
| DropdownMenu | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` | Action menus |
| NavigationMenu | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem` | Multi-level nav links |
| Collapsible | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | Expand/collapse sections |
| ScrollArea | `ScrollArea`, `ScrollBar` | Scrollable region with styled scrollbar |
| Notes | `Notes` | Inline annotation blocks |
| InputSuffix | `InputSuffix` | Text field with trailing CTA (copy, clear, search) |
| InputPrefix | `InputPrefix` | Text field with leading icon or label |
| InputAffixed | `InputAffixed` | Text field with both leading AND trailing CTAs |
| Tile | `Tile` | Clickable card tiles in a grid |
| Toaster | `Toaster` | Toast notifications (Sonner) |
| TagInput | `TagInput` | Multi-tag chip input field |

### Organisms

| Component | Import name | Purpose |
|---|---|---|
| Card | `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` | Content containers |
| Dialog | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogClose` | Modal dialogs |
| AlertDialog | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel` | Destructive confirmations |
| Sheet | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle` | Slide-in side panels |
| Table | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | Tabular data |
| TopBar | `TopBar` | Global app header — always present |
| LeftNav | `LeftNav` | Global sidebar navigation — always present |

---

## Decision guide: which component to use

| Intent | Use | Never use |
|---|---|---|
| Destructive action confirmation | `AlertDialog` | `Dialog`, `window.confirm()` |
| Toggle with semantic colour (success/error/warning) | `Toggle` | custom `<div>` or `Switch` |
| Simple binary on/off, no colour needed | `Switch` | `Toggle` |
| Form input with trailing action | `InputSuffix` | raw `<div>` + `<button>` beside `<input>` |
| Form input with leading icon | `InputPrefix` | absolutely-positioned icon inside wrapper |
| Input with both sides | `InputAffixed` | two raw `<span>` flanking an `<input>` |
| Progress/capacity bar | `Progress` | raw `<div>` with fixed height and inline width |
| Stat/capacity card | `Card` + `CardContent` | raw `<div>` with manual border |
| Mutually exclusive choice as card | `RadioCard` inside `RadioGroup` | custom card `<div>` |
| Dismissible chip/pill/tag | `Tag` | hand-styled `<span>` |
| Multi-value chip input | `TagInput` | raw `<input>` + custom chip divs |
| Toast/temporary message | `Toaster` (Sonner) | raw `<div>` alert banners |
| Filter between 2–6 parallel views | `ContentSwitcher` | `Tabs`, custom radio buttons |
| Navigate between page sections | `Tabs` | `ContentSwitcher`, `NavigationMenu` |
| Slide-in detail pane | `Sheet` | `Dialog` |
| Action overflow menu | `DropdownMenu` | bare `<ul>` |
| Contextual help text | `Tooltip` | `title` attribute |
| Overlay/scrim backdrop | `Blanket` | custom `<div>` with background |
| User/entity photo | `Avatar` | `<img>` with manual border-radius |
| Configured/error/pending status | `StatusBadge` | hand-composed `Badge` + icon |

---

## ContentSwitcher vs Tabs — decision rule

```
Same data, different view?  →  ContentSwitcher  (e.g. Grid / List, Day / Week / Month)
Different content areas?    →  Tabs             (e.g. Overview | Settings | Analytics)
```

---

## Components NOT yet available (do not stub)

Use a placeholder comment instead:

```tsx
{/* TODO: replace with <Spinner /> once built */}
{/* TODO: replace with <Skeleton /> once built */}
{/* TODO: replace with <EmptyState /> once built */}
{/* TODO: replace with <DatePicker /> once built */}
{/* TODO: replace with <Pagination /> once built */}
```
