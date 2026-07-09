import { Button, SplitButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioCard } from "@/components/ui/radio-card";
import { Tag } from "@/components/ui/tag";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStatus,
  AvatarGroup,
  AvatarGroupCount,
  AVATAR_COLORS,
} from "@/components/ui/avatar";
import type { AvatarColor } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bold,
  Italic,
  Underline,
  Info,
  Plus,
  Search,
  Mail,
  Star,
  Heart,
  ArrowRight,
  Download,
  Trash2,
  Edit,
  MoreHorizontal,
  Settings,
  Bell,
  Check,
  AlertTriangle,
} from "lucide-react";

export function AtomsSection() {
  return (
    <div className="space-y-8">
      {/* Button */}
      <Card>
        <CardHeader>
          <CardTitle>Button</CardTitle>
          <CardDescription>
            Primary Button — 8 style variants × 4 sizes. Also includes Split Button, Icon Button (square), and Circle Icon Button.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Fill (default) */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Fill <span className="font-normal opacity-60">— primary CTA, use once per section</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="xs">Button</Button>
              <Button size="sm">Button</Button>
              <Button>Button</Button>
              <Button size="lg">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Border (outline) */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Border <span className="font-normal opacity-60">— secondary actions</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="outline" size="xs">Button</Button>
              <Button variant="outline" size="sm">Button</Button>
              <Button variant="outline">Button</Button>
              <Button variant="outline" size="lg">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Minimal Border (ghost) */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Minimal Border <span className="font-normal opacity-60">— tertiary, low-emphasis</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="ghost" size="xs">Button</Button>
              <Button variant="ghost" size="sm">Button</Button>
              <Button variant="ghost">Button</Button>
              <Button variant="ghost" size="lg">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Minimal Fill (subtle) */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Minimal Fill <span className="font-normal opacity-60">— soft emphasis, inline actions</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="subtle" size="xs">Button</Button>
              <Button variant="subtle" size="sm">Button</Button>
              <Button variant="subtle">Button</Button>
              <Button variant="subtle" size="lg">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Link */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Link <span className="font-normal opacity-60">— text-only, inline navigation</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="link" size="xs">Button</Button>
              <Button variant="link" size="sm">Button</Button>
              <Button variant="link">Button</Button>
              <Button variant="link" size="lg">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Hyperlink */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Hyperlink <span className="font-normal opacity-60">— underlined inline link</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="hyperlink" size="xs">Button</Button>
              <Button variant="hyperlink" size="sm">Button</Button>
              <Button variant="hyperlink">Button</Button>
            </div>
          </div>
          <Separator />

          {/* Secondary (HueGrey) + Destructive */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Secondary (HueGrey) &amp; Destructive</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="secondary" size="xs">Button</Button>
              <Button variant="secondary" size="sm">Button</Button>
              <Button variant="secondary">Button</Button>
              <Button variant="secondary" size="lg">Button</Button>
              <Button variant="destructive" size="sm">Delete</Button>
              <Button variant="destructive"><Trash2 /> Delete</Button>
            </div>
          </div>
          <Separator />

          {/* With Icons */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">With Icons</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button><Mail /> Email</Button>
              <Button variant="outline"><Download /> Download</Button>
              <Button variant="ghost"><Plus /> New Record</Button>
              <Button variant="subtle"><Settings /> Settings</Button>
              <Button variant="link"><ArrowRight /> View All</Button>
            </div>
          </div>
          <Separator />

          {/* Disabled states */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Disabled</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button disabled>Fill</Button>
              <Button variant="outline" disabled>Border</Button>
              <Button variant="ghost" disabled>Minimal Border</Button>
              <Button variant="subtle" disabled>Minimal Fill</Button>
              <Button variant="secondary" disabled>Secondary</Button>
            </div>
          </div>
          <Separator />

          {/* Split Button — Primary */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Split Button — Primary <span className="font-normal opacity-60">— all 4 styles × 4 sizes</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton size="xs">Button</SplitButton>
              <SplitButton size="sm">Button</SplitButton>
              <SplitButton>Button</SplitButton>
              <SplitButton size="lg">Button</SplitButton>
            </div>
            <div className="flex flex-wrap items-end gap-3 mt-3">
              <SplitButton variant="outline" size="sm">Button</SplitButton>
              <SplitButton variant="outline">Button</SplitButton>
              <SplitButton variant="ghost">Button</SplitButton>
              <SplitButton variant="subtle">Button</SplitButton>
            </div>
          </div>
          <Separator />

          {/* Split Button — Semantic Intents */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Split Button — Semantic Intents <span className="font-normal opacity-60">— Fill / Border / Minimal Border / Minimal Fill</span></p>
            {/* Secondary */}
            <p className="text-[11px] text-muted-foreground/60 mt-2 mb-1">Secondary</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="secondary">Button</SplitButton>
              <SplitButton intent="secondary" variant="outline">Button</SplitButton>
              <SplitButton intent="secondary" variant="ghost">Button</SplitButton>
              <SplitButton intent="secondary" variant="subtle">Button</SplitButton>
            </div>
            {/* Success */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Success</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="success">Button</SplitButton>
              <SplitButton intent="success" variant="outline">Button</SplitButton>
              <SplitButton intent="success" variant="ghost">Button</SplitButton>
              <SplitButton intent="success" variant="subtle">Button</SplitButton>
            </div>
            {/* Info */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Info</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="info">Button</SplitButton>
              <SplitButton intent="info" variant="outline">Button</SplitButton>
              <SplitButton intent="info" variant="ghost">Button</SplitButton>
              <SplitButton intent="info" variant="subtle">Button</SplitButton>
            </div>
            {/* Warning */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Warning</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="warning">Button</SplitButton>
              <SplitButton intent="warning" variant="outline">Button</SplitButton>
              <SplitButton intent="warning" variant="ghost">Button</SplitButton>
              <SplitButton intent="warning" variant="subtle">Button</SplitButton>
            </div>
            {/* Error */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Error</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="error">Button</SplitButton>
              <SplitButton intent="error" variant="outline">Button</SplitButton>
              <SplitButton intent="error" variant="ghost">Button</SplitButton>
              <SplitButton intent="error" variant="subtle">Button</SplitButton>
            </div>
            {/* HueGrey */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">HueGrey</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton intent="huegrey">Button</SplitButton>
              <SplitButton intent="huegrey" variant="outline">Button</SplitButton>
              <SplitButton intent="huegrey" variant="ghost">Button</SplitButton>
              <SplitButton intent="huegrey" variant="subtle">Button</SplitButton>
            </div>
            {/* Disabled */}
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Disabled (all intents inherit opacity-40)</p>
            <div className="flex flex-wrap items-end gap-3">
              <SplitButton disabled>Primary</SplitButton>
              <SplitButton intent="secondary" disabled>Secondary</SplitButton>
              <SplitButton intent="success" disabled>Success</SplitButton>
              <SplitButton intent="warning" disabled>Warning</SplitButton>
              <SplitButton intent="error" disabled>Error</SplitButton>
              <SplitButton intent="huegrey" disabled>HueGrey</SplitButton>
            </div>
          </div>
          <Separator />

          {/* Icon Button — Square */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Icon Button — Square <span className="font-normal opacity-60">— Primary × 4 styles × 4 sizes</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="icon-xs"><Plus /></Button>
              <Button size="icon-sm"><Plus /></Button>
              <Button size="icon"><Plus /></Button>
              <Button size="icon-lg"><Plus /></Button>
              <Button variant="outline" size="icon-sm"><Search /></Button>
              <Button variant="outline" size="icon"><Settings /></Button>
              <Button variant="ghost" size="icon-sm"><Edit /></Button>
              <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
              <Button variant="subtle" size="icon"><Bell /></Button>
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Semantic intents — Fill (default size)</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button intent="secondary" size="icon"><Plus /></Button>
              <Button intent="success" size="icon"><Check /></Button>
              <Button intent="info" size="icon"><Info /></Button>
              <Button intent="warning" size="icon"><AlertTriangle /></Button>
              <Button intent="error" size="icon"><Trash2 /></Button>
              <Button intent="huegrey" size="icon"><MoreHorizontal /></Button>
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Semantic intents — Border (outline)</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button intent="secondary" variant="outline" size="icon"><Plus /></Button>
              <Button intent="success" variant="outline" size="icon"><Check /></Button>
              <Button intent="info" variant="outline" size="icon"><Info /></Button>
              <Button intent="warning" variant="outline" size="icon"><AlertTriangle /></Button>
              <Button intent="error" variant="outline" size="icon"><Trash2 /></Button>
              <Button intent="huegrey" variant="outline" size="icon"><MoreHorizontal /></Button>
            </div>
          </div>
          <Separator />

          {/* Circle Icon Button */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Circle Icon Button <span className="font-normal opacity-60">— Primary × 4 styles × 4 sizes</span></p>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="circle-xs"><Plus /></Button>
              <Button size="circle-sm"><Plus /></Button>
              <Button size="circle"><Plus /></Button>
              <Button size="circle-lg"><Plus /></Button>
              <Button variant="outline" size="circle-sm"><Search /></Button>
              <Button variant="outline" size="circle"><Settings /></Button>
              <Button variant="ghost" size="circle-sm"><Edit /></Button>
              <Button variant="ghost" size="circle"><MoreHorizontal /></Button>
              <Button variant="subtle" size="circle"><Bell /></Button>
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Semantic intents — Fill</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button intent="secondary" size="circle"><Plus /></Button>
              <Button intent="success" size="circle"><Check /></Button>
              <Button intent="info" size="circle"><Info /></Button>
              <Button intent="warning" size="circle"><AlertTriangle /></Button>
              <Button intent="error" size="circle"><Trash2 /></Button>
              <Button intent="huegrey" size="circle"><MoreHorizontal /></Button>
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-3 mb-1">Semantic intents — Border (outline)</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button intent="secondary" variant="outline" size="circle"><Plus /></Button>
              <Button intent="success" variant="outline" size="circle"><Check /></Button>
              <Button intent="info" variant="outline" size="circle"><Info /></Button>
              <Button intent="warning" variant="outline" size="circle"><AlertTriangle /></Button>
              <Button intent="error" variant="outline" size="circle"><Trash2 /></Button>
              <Button intent="huegrey" variant="outline" size="circle"><MoreHorizontal /></Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Toggle</CardTitle>
          <CardDescription>A two-state button that can be toggled on or off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Toggle underline"><Underline className="h-4 w-4" /></Toggle>
          </div>
          <div className="flex items-center gap-2">
            <Toggle aria-label="Star"><Star className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Heart"><Heart className="h-4 w-4" /></Toggle>
          </div>
        </CardContent>
      </Card>

      {/* Input Text */}
      <Card>
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>Single-line text input — all DS states.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="default-input">Default</Label>
            <Input id="default-input" placeholder="Enter text..." />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-fairish)" }}>Helper text</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="filled-input">Filled</Label>
            <Input id="filled-input" defaultValue="rajendra.prasad@zoho.com" />
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="search-input">Search (with icon)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cds-huegrey-text-fairish)" }} />
              <Input id="search-input" placeholder="Search..." className="pl-9" />
            </div>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="error-input">Error</Label>
            <Input id="error-input" status="error" defaultValue="invalid-email" />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>Enter a valid email address.</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="success-input">Success</Label>
            <Input id="success-input" status="success" defaultValue="rajendra.prasad@zoho.com" />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>Email verified.</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="disabled-input" style={{ color: "var(--cds-huegrey-text-fairish)" }}>Disabled</Label>
            <Input id="disabled-input" placeholder="Not editable" disabled />
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="disabled-filled-input" style={{ color: "var(--cds-huegrey-text-fairish)" }}>Disabled (with content)</Label>
            <Input id="disabled-filled-input" defaultValue="locked@zoho.com" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Input TextArea */}
      <Card>
        <CardHeader>
          <CardTitle>Input TextArea</CardTitle>
          <CardDescription>Multi-line text input — all DS states.</CardDescription>
        </CardHeader>
        <CardContent className="max-w-md space-y-4">
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-default">Default</Label>
            <Textarea id="textarea-default" placeholder="Type your message here..." />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-fairish)" }}>Helper text</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-filled">Filled</Label>
            <Textarea id="textarea-filled" defaultValue="This is some filled content that the user has already typed into the textarea field." />
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-error">Error</Label>
            <Textarea id="textarea-error" status="error" placeholder="Something went wrong..." />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-error-text-default)" }}>This field is required.</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-success">Success</Label>
            <Textarea id="textarea-success" status="success" defaultValue="Looks great!" />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-success-text-default)" }}>Saved successfully.</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-disabled" style={{ color: "var(--cds-huegrey-text-fairish)" }}>Disabled</Label>
            <Textarea id="textarea-disabled" placeholder="Not editable" disabled />
            <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-fairish)" }}>This field is locked.</p>
          </div>
          <div className="space-y-[var(--cds-gap-small)]">
            <Label htmlFor="textarea-disabled-filled" style={{ color: "var(--cds-huegrey-text-fairish)" }}>Disabled (with content)</Label>
            <Textarea id="textarea-disabled-filled" defaultValue="Read-only content that cannot be edited." disabled />
          </div>
        </CardContent>
      </Card>

      {/* Input CheckBox */}
      <Card>
        <CardHeader>
          <CardTitle>Input CheckBox</CardTitle>
          <CardDescription>14 px checkbox — Default · Checked · Indeterminate · Disabled · Error states.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="cb-1" />
            <Label htmlFor="cb-1" className="font-normal">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-2" defaultChecked />
            <Label htmlFor="cb-2" className="font-normal">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-3" indeterminate />
            <Label htmlFor="cb-3" className="font-normal">Indeterminate</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-4" disabled />
            <Label htmlFor="cb-4" className="font-normal text-muted-foreground">Disabled</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-5" disabled defaultChecked />
            <Label htmlFor="cb-5" className="font-normal text-muted-foreground">Disabled + Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-6" aria-invalid />
            <Label htmlFor="cb-6" className="font-normal">Error</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-7" aria-invalid defaultChecked />
            <Label htmlFor="cb-7" className="font-normal">Error + Checked</Label>
          </div>
        </CardContent>
      </Card>

      {/* Input Radio */}
      <Card>
        <CardHeader>
          <CardTitle>Input Radio</CardTitle>
          <CardDescription>14 px radio — Default · Checked · Disabled · Error states.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="opt-a" className="space-y-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="opt-a" id="radio-a" />
              <Label htmlFor="radio-a" className="font-normal">Option A (checked)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="opt-b" id="radio-b" />
              <Label htmlFor="radio-b" className="font-normal">Option B</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="opt-c" id="radio-c" />
              <Label htmlFor="radio-c" className="font-normal">Option C</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="opt-d" id="radio-d" disabled />
              <Label htmlFor="radio-d" className="font-normal text-muted-foreground">Disabled</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Radio Card */}
      <Card>
        <CardHeader>
          <CardTitle>Radio Card</CardTitle>
          <CardDescription>Selectable card tiles for mutually-exclusive choices. Use inside a RadioGroup.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="card-a" className="space-y-2 max-w-sm">
            <RadioCard value="card-a" label="Option A" description="Short description text that explains this choice in more detail." />
            <RadioCard value="card-b" label="Option B" description="Short description text that explains this choice in more detail." />
            <RadioCard value="card-c" label="Option C (disabled)" description="This option is currently unavailable." disabled />
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Tag / Chip */}
      <Card>
        <CardHeader>
          <CardTitle>Tag / Chip</CardTitle>
          <CardDescription>Dismissible tag pill — 4 style variants × 2 sizes. Use <code>closeable</code> + <code>onClose</code> for interactive chips.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-[6px]">
            <Tag>Creator</Tag>
            <Tag>QEngine</Tag>
            <Tag>Bookings</Tag>
          </div>
          <div className="flex flex-wrap gap-[6px]">
            <Tag variant="default" closeable onClose={() => {}}>Default ×</Tag>
            <Tag variant="bold" closeable onClose={() => {}}>Bold ×</Tag>
            <Tag variant="outlined" closeable onClose={() => {}}>Outlined ×</Tag>
            <Tag variant="ghost" closeable onClose={() => {}}>Ghost ×</Tag>
          </div>
          <div className="flex flex-wrap gap-[6px] items-center">
            <Tag size="base">Base (26 px)</Tag>
            <Tag size="small">Small (18 px)</Tag>
            <Tag size="small" closeable onClose={() => {}}>Small ×</Tag>
          </div>
          <div className="flex flex-wrap gap-[6px]">
            <Tag disabled>Disabled</Tag>
            <Tag disabled closeable onClose={() => {}}>Disabled ×</Tag>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Switch (Toggle)</CardTitle>
          <CardDescription>Toggle switch for on/off states.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-1">Notifications</Label>
            <Switch id="sw-1" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-2">Dark Mode</Label>
            <Switch id="sw-2" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-3" className="text-muted-foreground">Disabled</Label>
            <Switch id="sw-3" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Displays user identity as an image, initials, or icon placeholder. 4 sizes · 3 shapes · 14 placeholder colours · status indicator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Sizes */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-subtle)] mb-3 font-medium">Sizes — 36 px · 24 px · 16 px · 14 px</p>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">xl / 36px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">lg / 24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="sm"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">sm / 16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xs"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">xs / 14px</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shapes */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-subtle)] mb-3 font-medium">Shapes — circle · squircle · minimal</p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl" shape="circle"><AvatarFallback color="primary">AB</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">circle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl" shape="squircle"><AvatarFallback color="cardinal">AB</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">squircle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl" shape="minimal"><AvatarFallback color="biceblue">AB</AvatarFallback></Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">minimal</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status indicator */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-subtle)] mb-3 font-medium">Status indicator (active / online)</p>
            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                  <AvatarStatus />
                </Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">xl</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg">
                  <AvatarFallback color="tekhelete">AB</AvatarFallback>
                  <AvatarStatus />
                </Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">lg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback color="seagreen">AB</AvatarFallback>
                  <AvatarStatus />
                </Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xs">
                  <AvatarFallback color="cardinal">AB</AvatarFallback>
                  <AvatarStatus />
                </Avatar>
                <span className="text-[10px] text-[var(--cds-neutral-text-subtle)]">xs</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Placeholder colours */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-subtle)] mb-3 font-medium">Placeholder colours (14 total)</p>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(AVATAR_COLORS) as AvatarColor[]).map((col) => (
                <div key={col} className="flex flex-col items-center gap-1.5">
                  <Avatar size="xl" shape="circle">
                    <AvatarFallback color={col}>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-[9px] text-[var(--cds-neutral-text-subtle)] capitalize">{col}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Avatar group */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-subtle)] mb-3 font-medium">Avatar group (stacked)</p>
            <AvatarGroup>
              <Avatar size="xl"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
              <Avatar size="xl"><AvatarFallback color="cardinal">RJ</AvatarFallback></Avatar>
              <Avatar size="xl"><AvatarFallback color="tekhelete">AM</AvatarFallback></Avatar>
              <Avatar size="xl"><AvatarFallback color="seagreen">PK</AvatarFallback></Avatar>
              <AvatarGroupCount className="text-[11px]">+4</AvatarGroupCount>
            </AvatarGroup>
          </div>

        </CardContent>
      </Card>

      {/* Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Badge</CardTitle>
          <CardDescription>Status indicators and labels with semantic colors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prominent (filled) */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-default)] mb-2 font-medium">Prominent</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge colour="primary" variant="prominent">Primary</Badge>
              <Badge colour="success" variant="prominent">Success</Badge>
              <Badge colour="warning" variant="prominent">Warning</Badge>
              <Badge colour="error" variant="prominent">Error</Badge>
              <Badge colour="pumpkin" variant="prominent">Pumpkin</Badge>
              <Badge colour="wine" variant="prominent">Wine</Badge>
              <Badge colour="mustard" variant="prominent">Mustard</Badge>
              <Badge colour="lawn" variant="prominent">Lawn</Badge>
              <Badge colour="lime" variant="prominent">Lime</Badge>
              <Badge colour="aqua" variant="prominent">Aqua</Badge>
              <Badge colour="indigo" variant="prominent">Indigo</Badge>
              <Badge colour="lavender" variant="prominent">Lavender</Badge>
              <Badge colour="lilac" variant="prominent">Lilac</Badge>
            </div>
          </div>
          {/* Subtle with Border */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-default)] mb-2 font-medium">Subtle with Border</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge colour="primary" variant="subtle">Primary</Badge>
              <Badge colour="success" variant="subtle">Success</Badge>
              <Badge colour="warning" variant="subtle">Warning</Badge>
              <Badge colour="error" variant="subtle">Error</Badge>
              <Badge colour="pumpkin" variant="subtle">Pumpkin</Badge>
              <Badge colour="wine" variant="subtle">Wine</Badge>
              <Badge colour="mustard" variant="subtle">Mustard</Badge>
              <Badge colour="lawn" variant="subtle">Lawn</Badge>
              <Badge colour="lime" variant="subtle">Lime</Badge>
              <Badge colour="aqua" variant="subtle">Aqua</Badge>
              <Badge colour="indigo" variant="subtle">Indigo</Badge>
              <Badge colour="lavender" variant="subtle">Lavender</Badge>
              <Badge colour="lilac" variant="subtle">Lilac</Badge>
            </div>
          </div>
          {/* Sizes */}
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-default)] mb-2 font-medium">Sizes (16px / 14px / 12px / 11px)</p>
            <div className="flex flex-wrap items-end gap-2">
              <Badge colour="primary" variant="prominent" size="lg">Large 16px</Badge>
              <Badge colour="primary" variant="prominent" size="md">Medium 14px</Badge>
              <Badge colour="primary" variant="prominent" size="sm">Small 12px</Badge>
              <Badge colour="primary" variant="prominent" size="xs">XSmall 11px</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* StatusBadge */}
      <Card>
        <CardHeader>
          <CardTitle>StatusBadge</CardTitle>
          <CardDescription>Semantic status pill — locks the status → colour + icon + label mapping so every screen renders a state identically. Built on <code>Badge</code>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-default)] mb-2 font-medium">Statuses</p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="configured" />
              <StatusBadge status="not-configured" />
              <StatusBadge status="error" />
              <StatusBadge status="pending" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--cds-neutral-text-default)] mb-2 font-medium">Custom label</p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="error" label="Failed" />
              <StatusBadge status="pending" label="In review" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Indicator</CardTitle>
          <CardDescription>Linear progress bars showing completion status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2"><Label className="text-xs">0%</Label><Progress value={0} /></div>
          <div className="space-y-2"><Label className="text-xs">25%</Label><Progress value={25} /></div>
          <div className="space-y-2"><Label className="text-xs">50%</Label><Progress value={50} /></div>
          <div className="space-y-2"><Label className="text-xs">75%</Label><Progress value={75} /></div>
          <div className="space-y-2"><Label className="text-xs">100%</Label><Progress value={100} /></div>
        </CardContent>
      </Card>

      {/* Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Slider</CardTitle>
          <CardDescription>Range slider for numeric value selection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label className="text-xs">Default (50)</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Range</Label>
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

      {/* Separator */}
      <Card>
        <CardHeader>
          <CardTitle>Separator</CardTitle>
          <CardDescription>Visual divider between content sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm">Content above</p>
            <Separator className="my-4" />
            <p className="text-sm">Content below</p>
          </div>
          <div className="flex items-center gap-4 h-5">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Center</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </CardContent>
      </Card>

      {/* Tooltip */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltip</CardTitle>
          <CardDescription>Informational popup on hover.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Tooltip><TooltipTrigger><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger><TooltipContent>This is a tooltip</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger><Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent side="right">More information</TooltipContent></Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
