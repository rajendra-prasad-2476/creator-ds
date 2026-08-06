import type { ReactNode } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RadioCard } from "@/components/ui/radio-card"
import { Switch } from "@/components/ui/switch"
import { Blanket } from "@/components/ui/blanket"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { StatusBadge } from "@/components/ui/status-badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tag } from "@/components/ui/tag"
import { ProductIllustration } from "@/components/ui/product-illustration"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ContentSwitcher } from "@/components/ui/content-switcher"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Notes } from "@/components/ui/notes"
import { InputSuffix } from "@/components/ui/input-suffix"
import { InputPrefix } from "@/components/ui/input-prefix"
import { InputAffixed } from "@/components/ui/input-affixed"
import { Tile, TileDescription, TileIcon, TileTitle } from "@/components/ui/tile"
import { TagInput } from "@/components/ui/tag-input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { List } from "@/components/ui/list"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStatus,
} from "@/components/ui/avatar"
import { Mail, Search, ChevronDown, Database } from "lucide-react"

export type ComponentCategory = "Atoms" | "Molecules" | "Organisms"

export interface ComponentDoc {
  id: string
  name: string
  category: ComponentCategory
  description: string
  preview: ReactNode
  code: string
}

export const COMPONENT_REGISTRY: ComponentDoc[] = [
  {
    id: "button",
    name: "Button",
    category: "Atoms",
    description:
      "Triggers an action or event. 8 style variants (fill, outline, ghost, subtle, link, hyperlink, secondary, destructive) across 4 sizes.",
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Button</Button>
        <Button variant="outline">Button</Button>
        <Button variant="ghost">Button</Button>
        <Button variant="destructive"><Mail /> Email</Button>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Button>Button</Button>
      <Button variant="outline">Button</Button>
      <Button variant="ghost">Button</Button>
      <Button variant="destructive">
        <Mail /> Email
      </Button>
    </div>
  )
}`,
  },
  {
    id: "badge",
    name: "Badge",
    category: "Atoms",
    description:
      "Status labels, counts, and tags. Only two variants exist — \"prominent\" and \"subtle\" — across 13 semantic colours.",
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Badge colour="primary" variant="prominent">Primary</Badge>
        <Badge colour="success" variant="subtle">Success</Badge>
        <Badge colour="warning" variant="prominent">Warning</Badge>
        <Badge colour="error" variant="subtle">Error</Badge>
      </div>
    ),
    code: `import { Badge } from "@/components/ui/badge"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Badge colour="primary" variant="prominent">Primary</Badge>
      <Badge colour="success" variant="subtle">Success</Badge>
      <Badge colour="warning" variant="prominent">Warning</Badge>
      <Badge colour="error" variant="subtle">Error</Badge>
    </div>
  )
}`,
  },
  {
    id: "input",
    name: "Input",
    category: "Atoms",
    description:
      "Single-line text entry. Supports a \"status\" prop (default, error, success) that drives border and background colour.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input placeholder="Default input" />
        <Input placeholder="Error state" status="error" />
        <Input placeholder="Success state" status="success" />
      </div>
    ),
    code: `import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="Default input" />
      <Input placeholder="Error state" status="error" />
      <Input placeholder="Success state" status="success" />
    </div>
  )
}`,
  },
  {
    id: "toggle",
    name: "Toggle",
    category: "Atoms",
    description:
      "DS sliding on/off switch — 2 sizes × 3 style variants (fill/border/subtle) × 6 colour states.",
    preview: (
      <div className="flex flex-wrap items-center gap-4">
        <Toggle defaultChecked color="primary" />
        <Toggle defaultChecked color="success" variant="border" />
        <Toggle color="error" variant="subtle" />
      </div>
    ),
    code: `import { Toggle } from "@/components/ui/toggle"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Toggle defaultChecked color="primary" />
      <Toggle defaultChecked color="success" variant="border" />
      <Toggle color="error" variant="subtle" />
    </div>
  )
}`,
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Atoms",
    description:
      "User or entity portrait with image, fallback initials, and an optional status dot.",
    preview: (
      <div className="flex flex-wrap items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>RJ</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback color="caribbean">AB</AvatarFallback>
          <AvatarStatus />
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from "@/components/ui/avatar"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/user.png" alt="User" />
        <AvatarFallback>RJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback color="caribbean">AB</AvatarFallback>
        <AvatarStatus />
      </Avatar>
    </div>
  )
}`,
  },
  {
    id: "card",
    name: "Card",
    category: "Organisms",
    description:
      "Content container / panel. Add the \"interactive\" prop for a hover-border-blue affordance on clickable cards.",
    preview: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>A short supporting description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm">Action</Button>
        </CardContent>
      </Card>
    ),
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short supporting description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm">Action</Button>
      </CardContent>
    </Card>
  )
}`,
  },

  // ── Atoms ────────────────────────────────────────────────────────────────
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Atoms",
    description: "Boolean or multi-select option. Supports checked, unchecked, and indeterminate states.",
    preview: (
      <div className="flex items-center gap-3">
        <Checkbox defaultChecked />
        <Checkbox />
        <Checkbox indeterminate />
      </div>
    ),
    code: `import { Checkbox } from "@/components/ui/checkbox"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox defaultChecked />
      <Checkbox />
      <Checkbox indeterminate />
    </div>
  )
}`,
  },
  {
    id: "radio-group",
    name: "Radio Group",
    category: "Atoms",
    description: "Mutually exclusive options. Use RadioCard when each option needs a label and description inside a selectable card.",
    preview: (
      <RadioGroup defaultValue="a" className="flex items-center gap-4">
        <div className="flex items-center gap-2"><RadioGroupItem value="a" id="ex-a" /><Label htmlFor="ex-a">Option A</Label></div>
        <div className="flex items-center gap-2"><RadioGroupItem value="b" id="ex-b" /><Label htmlFor="ex-b">Option B</Label></div>
      </RadioGroup>
    ),
    code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function Example() {
  return (
    <RadioGroup defaultValue="a" className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="a" />
        <Label htmlFor="a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="b" />
        <Label htmlFor="b">Option B</Label>
      </div>
    </RadioGroup>
  )
}`,
  },
  {
    id: "radio-card",
    name: "Radio Card",
    category: "Atoms",
    description: "A selectable card containing a radio indicator, label, and description — use inside a RadioGroup.",
    preview: (
      <RadioGroup defaultValue="monthly" className="flex w-full max-w-sm flex-col gap-2">
        <RadioCard value="monthly" label="Monthly" description="Billed every month." />
        <RadioCard value="yearly" label="Yearly" description="Billed once a year, save 20%." />
      </RadioGroup>
    ),
    code: `import { RadioGroup } from "@/components/ui/radio-group"
import { RadioCard } from "@/components/ui/radio-card"

export function Example() {
  return (
    <RadioGroup defaultValue="monthly" className="flex flex-col gap-2">
      <RadioCard value="monthly" label="Monthly" description="Billed every month." />
      <RadioCard value="yearly" label="Yearly" description="Billed once a year, save 20%." />
    </RadioGroup>
  )
}`,
  },
  {
    id: "switch",
    name: "Switch",
    category: "Atoms",
    description: "Simple binary on/off toggle with no colour variants. Use Toggle when a semantic colour is needed.",
    preview: (
      <div className="flex items-center gap-4">
        <Switch defaultChecked />
        <Switch size="sm" />
      </div>
    ),
    code: `import { Switch } from "@/components/ui/switch"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Switch defaultChecked />
      <Switch size="sm" />
    </div>
  )
}`,
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "Atoms",
    description: "Multi-line text entry. Supports the same \"status\" prop as Input (default, error, success).",
    preview: <Textarea placeholder="Write a description…" className="max-w-sm" />,
    code: `import { Textarea } from "@/components/ui/textarea"

export function Example() {
  return <Textarea placeholder="Write a description…" />
}`,
  },
  {
    id: "label",
    name: "Label",
    category: "Atoms",
    description: "Form field label. Pair with any input via matching \"htmlFor\" / \"id\".",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Label htmlFor="ex-email">Email</Label>
        <Input id="ex-email" placeholder="you@zoho.com" />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="you@zoho.com" />
    </div>
  )
}`,
  },
  {
    id: "slider",
    name: "Slider",
    category: "Atoms",
    description: "Range input for selecting a numeric value or range along a track.",
    preview: <Slider defaultValue={[40]} className="w-full max-w-sm" />,
    code: `import { Slider } from "@/components/ui/slider"

export function Example() {
  return <Slider defaultValue={[40]} />
}`,
  },
  {
    id: "input-otp",
    name: "Input OTP",
    category: "Atoms",
    description: "One-time password entry — a group of single-character slots.",
    preview: (
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSeparator />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    ),
    code: `import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

export function Example() {
  return (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSeparator />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  )
}`,
  },
  {
    id: "status-badge",
    name: "Status Badge",
    category: "Atoms",
    description: "Semantic status pill locking status → colour + icon + label so every screen shows the same thing for the same state.",
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status="configured" />
        <StatusBadge status="not-configured" />
        <StatusBadge status="error" />
        <StatusBadge status="pending" />
      </div>
    ),
    code: `import { StatusBadge } from "@/components/ui/status-badge"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <StatusBadge status="configured" />
      <StatusBadge status="not-configured" />
      <StatusBadge status="error" />
      <StatusBadge status="pending" />
    </div>
  )
}`,
  },
  {
    id: "progress",
    name: "Progress",
    category: "Atoms",
    description: "Linear progress bar for showing task or capacity completion.",
    preview: <Progress value={62} className="w-full max-w-sm" />,
    code: `import { Progress } from "@/components/ui/progress"

export function Example() {
  return <Progress value={62} />
}`,
  },
  {
    id: "separator",
    name: "Separator",
    category: "Atoms",
    description: "Horizontal or vertical divider between sections of content.",
    preview: (
      <div className="flex h-10 w-full max-w-sm items-center gap-4">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    ),
    code: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div className="flex h-10 items-center gap-4">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  )
}`,
  },
  {
    id: "tag",
    name: "Tag",
    category: "Atoms",
    description: "Dismissible chip/pill — 4 style variants × 2 sizes. Use \"closeable\" + \"onClose\" for interactive tags.",
    preview: (
      <div className="flex flex-wrap items-center gap-2">
        <Tag>Default</Tag>
        <Tag variant="outlined">Outlined</Tag>
        <Tag variant="ghost" closeable onClose={() => {}}>Dismissible</Tag>
      </div>
    ),
    code: `import { Tag } from "@/components/ui/tag"

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Tag>Default</Tag>
      <Tag variant="outlined">Outlined</Tag>
      <Tag variant="ghost" closeable onClose={() => {}}>Dismissible</Tag>
    </div>
  )
}`,
  },
  {
    id: "blanket",
    name: "Blanket",
    category: "Atoms",
    description: "Scrim/overlay backdrop rendered behind Sliders, Sheets, Dialogs, and other overlay components. Renders as `fixed inset-0` in real usage — never build a custom overlay `<div>`.",
    preview: (
      <div className="relative h-24 w-full max-w-sm overflow-hidden rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)]">
        <div className="absolute inset-0 flex items-center justify-center text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)]">Page content</div>
        <Blanket className="absolute inset-0 z-0" />
      </div>
    ),
    code: `import { Blanket } from "@/components/ui/blanket"

export function Example() {
  // Renders fixed inset-0 — mount alongside a Sheet/Dialog/Slider panel
  return <Blanket />
}`,
  },
  {
    id: "product-illustration",
    name: "Product Illustration",
    category: "Atoms",
    description: "Scenario illustrations for empty states and creation wizards — 22 types × Default / Active states.",
    preview: (
      <div className="flex items-center gap-6">
        <ProductIllustration type="create-report" state="Default" />
        <ProductIllustration type="create-report" state="Active" />
      </div>
    ),
    code: `import { ProductIllustration } from "@/components/ui/product-illustration"

export function Example() {
  return (
    <div className="flex items-center gap-6">
      <ProductIllustration type="create-report" state="Default" />
      <ProductIllustration type="create-report" state="Active" />
    </div>
  )
}`,
  },

  // ── Molecules ────────────────────────────────────────────────────────────
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Molecules",
    description: "Page hierarchy navigation trail.",
    preview: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Details</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Details</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
  },
  {
    id: "content-switcher",
    name: "Content Switcher",
    category: "Molecules",
    description: "Toggle between parallel views of the same data (e.g. Grid/List, Day/Week/Month). Use Tabs for switching between different content areas.",
    preview: <ContentSwitcher items={["Grid", "List"]} />,
    code: `import { ContentSwitcher } from "@/components/ui/content-switcher"

export function Example() {
  return <ContentSwitcher items={["Grid", "List"]} />
}`,
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Molecules",
    description: "Switching between content panels within a page.",
    preview: (
      <Tabs defaultValue="overview" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-3 text-sm text-muted-foreground">Overview content.</TabsContent>
        <TabsContent value="settings" className="mt-3 text-sm text-muted-foreground">Settings content.</TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content.</TabsContent>
      <TabsContent value="settings">Settings content.</TabsContent>
    </Tabs>
  )
}`,
  },
  {
    id: "select",
    name: "Select",
    category: "Molecules",
    description: "Dropdown single-select. Searchable, creatable, and grouped variants are built in.",
    preview: (
      <Select defaultValue="creator">
        <SelectTrigger className="w-56"><SelectValue placeholder="Select a workspace" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="creator">Creator</SelectItem>
          <SelectItem value="qengine">QEngine</SelectItem>
          <SelectItem value="bookings">Bookings</SelectItem>
        </SelectContent>
      </Select>
    ),
    code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Example() {
  return (
    <Select defaultValue="creator">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a workspace" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="creator">Creator</SelectItem>
        <SelectItem value="qengine">QEngine</SelectItem>
        <SelectItem value="bookings">Bookings</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    id: "popover",
    name: "Popover",
    category: "Molecules",
    description: "Floating overlay anchored to a trigger, for richer interactive content than a Tooltip.",
    preview: (
      <Popover>
        <PopoverTrigger><Button variant="outline">Open popover</Button></PopoverTrigger>
        <PopoverContent><p className="text-sm">Popover content goes here.</p></PopoverContent>
      </Popover>
    ),
    code: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Popover content goes here.</p>
      </PopoverContent>
    </Popover>
  )
}`,
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Molecules",
    description: "Short hover hint on an interactive element. Non-interactive — use Popover for clickable content.",
    preview: (
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger>
        <TooltipContent>Helpful tip</TooltipContent>
      </Tooltip>
    ),
    code: `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Tooltip>
      <TooltipTrigger><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger>
      <TooltipContent>Helpful tip</TooltipContent>
    </Tooltip>
  )
}`,
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    category: "Molecules",
    description: "Action menu triggered from a button.",
    preview: (
      <DropdownMenu>
        <DropdownMenuTrigger><Button variant="outline">Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    code: `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger><Button variant="outline">Actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
  },
  {
    id: "navigation-menu",
    name: "Navigation Menu",
    category: "Molecules",
    description: "Multi-level nav links.",
    preview: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem><NavigationMenuLink href="#">Overview</NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink href="#">Docs</NavigationMenuLink></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    code: `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem><NavigationMenuLink href="#">Overview</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="#">Docs</NavigationMenuLink></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
  },
  {
    id: "collapsible",
    name: "Collapsible",
    category: "Molecules",
    description: "Expand/collapse a single section of content.",
    preview: (
      <Collapsible className="w-full max-w-sm">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)] px-[var(--cds-space-12)] py-[var(--cds-space-8)] text-[length:var(--cds-text-p2)] font-medium">
          Toggle details
        </CollapsibleTrigger>
        <CollapsibleContent className="px-[var(--cds-space-12)] py-[var(--cds-space-8)] text-[length:var(--cds-text-p2)] text-muted-foreground">
          Additional content revealed when expanded.
        </CollapsibleContent>
      </Collapsible>
    ),
    code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
      <CollapsibleContent>Additional content revealed when expanded.</CollapsibleContent>
    </Collapsible>
  )
}`,
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    category: "Molecules",
    description: "Scrollable region with a styled scrollbar.",
    preview: (
      <ScrollArea className="h-32 w-56 rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)] p-[var(--cds-space-12)]">
        <div className="flex flex-col gap-2 text-[length:var(--cds-text-p2)]">
          {Array.from({ length: 12 }, (_, i) => <div key={i}>Row {i + 1}</div>)}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area"

export function Example() {
  return (
    <ScrollArea className="h-32 w-56 rounded-[var(--cds-radius-r)] border p-3">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 12 }, (_, i) => <div key={i}>Row {i + 1}</div>)}
      </div>
    </ScrollArea>
  )
}`,
  },
  {
    id: "notes",
    name: "Notes",
    category: "Molecules",
    description: "Inline annotation / callout block — 5 semantic variants with an optional CTA bar.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Notes variant="info" title="Information">This is an informational message for the user.</Notes>
        <Notes variant="warning" title="Warning" cta={{ label: "Review settings" }}>Please review before proceeding.</Notes>
      </div>
    ),
    code: `import { Notes } from "@/components/ui/notes"

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Notes variant="info" title="Information">This is an informational message for the user.</Notes>
      <Notes variant="warning" title="Warning" cta={{ label: "Review settings" }}>
        Please review before proceeding.
      </Notes>
    </div>
  )
}`,
  },
  {
    id: "input-suffix",
    name: "Input Suffix",
    category: "Molecules",
    description: "Text field with a trailing CTA (icon, label, or clear button).",
    preview: <InputSuffix placeholder="Search…" suffixLabel="Go" className="w-full max-w-sm" />,
    code: `import { InputSuffix } from "@/components/ui/input-suffix"

export function Example() {
  return <InputSuffix placeholder="Search…" suffixLabel="Go" />
}`,
  },
  {
    id: "input-prefix",
    name: "Input Prefix",
    category: "Molecules",
    description: "Text field with a leading CTA (icon, label) and optional trailing icon.",
    preview: <InputPrefix prefixIcon={<Search />} prefixLabel="Search" trailingIcon={<ChevronDown />} placeholder="Type to search…" className="w-full max-w-sm" />,
    code: `import { InputPrefix } from "@/components/ui/input-prefix"
import { Search, ChevronDown } from "lucide-react"

export function Example() {
  return (
    <InputPrefix
      prefixIcon={<Search />}
      prefixLabel="Search"
      trailingIcon={<ChevronDown />}
      placeholder="Type to search…"
    />
  )
}`,
  },
  {
    id: "input-affixed",
    name: "Input Affixed",
    category: "Molecules",
    description: "Text field with leading AND trailing CTAs on both sides (e.g. currency + unit).",
    preview: <InputAffixed prefixLabel="$" suffixLabel="USD" placeholder="0.00" className="w-full max-w-sm" />,
    code: `import { InputAffixed } from "@/components/ui/input-affixed"

export function Example() {
  return <InputAffixed prefixLabel="$" suffixLabel="USD" placeholder="0.00" />
}`,
  },
  {
    id: "tile",
    name: "Tile",
    category: "Molecules",
    description: "Clickable card tile in a grid, with an icon slot, title, and description.",
    preview: (
      <Tile variant="active" className="w-40">
        <TileIcon><Database className="h-5 w-5" /></TileIcon>
        <TileTitle>Database</TileTitle>
        <TileDescription>Manage data</TileDescription>
      </Tile>
    ),
    code: `import { Tile, TileDescription, TileIcon, TileTitle } from "@/components/ui/tile"
import { Database } from "lucide-react"

export function Example() {
  return (
    <Tile variant="active">
      <TileIcon><Database className="h-5 w-5" /></TileIcon>
      <TileTitle>Database</TileTitle>
      <TileDescription>Manage data</TileDescription>
    </Tile>
  )
}`,
  },
  {
    id: "tag-input",
    name: "Tag Input",
    category: "Molecules",
    description: "Multi-tag input field — type + Enter/comma to add tags, × to dismiss.",
    preview: <TagInput defaultValue={["React", "TypeScript"]} placeholder="Add technology…" className="w-full max-w-sm" />,
    code: `import { TagInput } from "@/components/ui/tag-input"

export function Example() {
  return <TagInput defaultValue={["React", "TypeScript"]} placeholder="Add technology…" />
}`,
  },
  {
    id: "sonner",
    name: "Sonner (Toast)",
    category: "Molecules",
    description: "Toast notifications, triggered programmatically via the \"toast()\" function.",
    preview: (
      <Button variant="outline" onClick={() => toast("File saved successfully.")}>
        Show toast
      </Button>
    ),
    code: `import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="outline" onClick={() => toast("File saved successfully.")}>
      Show toast
    </Button>
  )
}`,
  },

  // ── Organisms ────────────────────────────────────────────────────────────
  {
    id: "dialog",
    name: "Dialog",
    category: "Organisms",
    description: "Modal dialog requiring a user response.",
    preview: (
      <Dialog>
        <DialogTrigger><Button variant="outline">Open dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Record</DialogTitle>
            <DialogDescription>Fill in the details to create a new record.</DialogDescription>
          </DialogHeader>
          <DialogFooter><Button variant="outline">Cancel</Button><Button>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger><Button variant="outline">Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Record</DialogTitle>
          <DialogDescription>Fill in the details to create a new record.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    category: "Organisms",
    description: "Destructive or semantic confirmation dialog — 4 variants (alert, success, info, warning).",
    preview: (
      <AlertDialog>
        <AlertDialogTrigger><Button variant="destructive">Delete</Button></AlertDialogTrigger>
        <AlertDialogContent variant="alert">
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Delete record</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. Are you sure you want to delete this record?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Delete</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogIcon, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger><Button variant="destructive">Delete</Button></AlertDialogTrigger>
      <AlertDialogContent variant="alert">
        <AlertDialogHeader>
          <AlertDialogIcon />
          <AlertDialogTitle>Delete record</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete this record?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Delete</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
  },
  {
    id: "sheet",
    name: "Sheet",
    category: "Organisms",
    description: "Slide-in side panel. Use instead of Dialog for detail views anchored to an edge of the screen.",
    preview: (
      <Sheet>
        <SheetTrigger><Button variant="outline">Open sheet</Button></SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Record Summary</SheetTitle>
            <SheetDescription>Quick view of the selected record.</SheetDescription>
          </SheetHeader>
          <SheetFooter><Button>Close</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    ),
    code: `import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Sheet>
      <SheetTrigger><Button variant="outline">Open sheet</Button></SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Record Summary</SheetTitle>
          <SheetDescription>Quick view of the selected record.</SheetDescription>
        </SheetHeader>
        <SheetFooter><Button>Close</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`,
  },
  {
    id: "table",
    name: "Table",
    category: "Organisms",
    description: "Tabular data display with sortable columns and row selection.",
    preview: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Alex Baker</TableCell>
            <TableCell className="text-muted-foreground">alex@zoho.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Riya Jain</TableCell>
            <TableCell className="text-muted-foreground">riya@zoho.com</TableCell>
            <TableCell>Member</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
    code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alex Baker</TableCell>
          <TableCell>alex@zoho.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
  },
  {
    id: "list",
    name: "List",
    category: "Organisms",
    description: "Structured vertical list of data rows. Use Table when sortable columns and bulk selection are needed.",
    preview: (
      <List
        className="w-full max-w-sm"
        items={[
          { id: "1", title: "Contact Form", subText: "Report", badge: { label: "Active" }, avatarText: "CF", meta: "3 uses" },
          { id: "2", title: "Invoice Approval", subText: "Workflow", badge: { label: "Draft", colour: "warning" }, avatarText: "IA", meta: "14 days ago" },
        ]}
      />
    ),
    code: `import { List } from "@/components/ui/list"

export function Example() {
  return (
    <List
      items={[
        { id: "1", title: "Contact Form", subText: "Report", badge: { label: "Active" }, avatarText: "CF", meta: "3 uses" },
        { id: "2", title: "Invoice Approval", subText: "Workflow", badge: { label: "Draft", colour: "warning" }, avatarText: "IA", meta: "14 days ago" },
      ]}
    />
  )
}`,
  },
]

export const COMPONENT_CATEGORIES: ComponentCategory[] = ["Atoms", "Molecules", "Organisms"]
