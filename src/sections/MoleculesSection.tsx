import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbDropdownItem } from "@/components/ui/breadcrumb";
import { ContentSwitcher } from "@/components/ui/content-switcher";
import { Notes } from "@/components/ui/notes";
import { InputSuffix } from "@/components/ui/input-suffix";
import { InputPrefix } from "@/components/ui/input-prefix";
import { InputAffixed } from "@/components/ui/input-affixed";
import { TagInput } from "@/components/ui/tag-input";
import { MoreHorizontal, Settings, User, LogOut, CreditCard, Keyboard, Phone, Copy, Search, ArrowRight, Globe, ChevronDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, RichTooltipContent } from "@/components/ui/tooltip";

/* Small stateful sub-component so the showcase can use useState */
function CreatableSelectDemo() {
  const [tags, setTags] = React.useState(["Creator", "QEngine", "Bookings"])
  const [value, setValue] = React.useState("")
  return (
    <Select value={value} onValueChange={(v) => v && setValue(v)}>
      <SelectTrigger><SelectValue placeholder="Select or create a tag" /></SelectTrigger>
      <SelectContent
        searchable
        searchPlaceholder="Search or type a new tag…"
        createLabel="Create tag"
        onCreate={(val) => {
          const name = val.trim() || `Tag ${tags.length + 1}`
          if (!tags.includes(name)) setTags(prev => [...prev, name])
        }}
      >
        {tags.map(t => (
          <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function MoleculesSection() {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Card>
        <CardHeader>
          <CardTitle>Breadcrumbs</CardTitle>
          <CardDescription>Navigation breadcrumbs showing the current page hierarchy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Default – Size 2 */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Default – Size 4 */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Category</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Default – Size 6 */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Electronics</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Laptops</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Gaming</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product Name</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* With Dropdown – Size 2 (dropdown on first item) */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbDropdownItem
                  label="Home"
                  options={[
                    { label: "Dashboard", selected: true },
                    { label: "Overview" },
                  ]}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* With Dropdown – Size 4 (dropdown on second item) */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbDropdownItem
                  label="Products"
                  options={[
                    { label: "Electronics", selected: true },
                    { label: "Clothing" },
                    { label: "Furniture" },
                  ]}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Laptops</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product Name</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* With Grouped Dropdown – Size 6 (dropdown on third item) */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbDropdownItem
                  label="Electronics"
                  groups={[
                    {
                      groupLabel: "Devices",
                      options: [
                        { label: "Laptops", selected: true },
                        { label: "Phones" },
                      ],
                    },
                    {
                      groupLabel: "Accessories",
                      options: [
                        { label: "Keyboards" },
                        { label: "Monitors" },
                      ],
                    },
                  ]}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Laptops</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Gaming</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product Name</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </CardContent>
      </Card>

      {/* Content Switcher */}
      <Card>
        <CardHeader>
          <CardTitle>Content Switcher</CardTitle>
          <CardDescription>
            Segmented control for toggling between 2–6 mutually exclusive views. Use above the content region it controls, never inside navbars.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Fill — all sizes */}
          <div className="space-y-2">
            <p className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)] font-medium">Fill — sizes</p>
            <div className="flex flex-wrap items-center gap-4">
              <ContentSwitcher size="xs"   variant="fill" items={["Grid", "List"]} />
              <ContentSwitcher size="sm"   variant="fill" items={["Grid", "List"]} />
              <ContentSwitcher size="base" variant="fill" items={["Grid", "List"]} />
              <ContentSwitcher size="lg"   variant="fill" items={["Grid", "List"]} />
            </div>
          </div>

          {/* Fill Minimal — all sizes */}
          <div className="space-y-2">
            <p className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)] font-medium">Fill Minimal — sizes</p>
            <div className="flex flex-wrap items-center gap-4">
              <ContentSwitcher size="xs"   variant="fill-minimal" items={["Grid", "List"]} />
              <ContentSwitcher size="sm"   variant="fill-minimal" items={["Grid", "List"]} />
              <ContentSwitcher size="base" variant="fill-minimal" items={["Grid", "List"]} />
              <ContentSwitcher size="lg"   variant="fill-minimal" items={["Grid", "List"]} />
            </div>
          </div>

          {/* Segment counts */}
          <div className="space-y-2">
            <p className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)] font-medium">Fill — segment counts</p>
            <div className="flex flex-col gap-3">
              <ContentSwitcher items={["Grid", "List"]} />
              <ContentSwitcher items={["All", "Active", "Inactive"]} />
              <ContentSwitcher items={["Day", "Week", "Month", "Year"]} />
              <ContentSwitcher items={["Jan", "Feb", "Mar", "Apr", "May"]} />
              <ContentSwitcher items={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} />
            </div>
          </div>

          {/* Fill Minimal — segment counts */}
          <div className="space-y-2">
            <p className="text-[length:var(--cds-text-p3)] text-[color:var(--cds-huegrey-text-default)] font-medium">Fill Minimal — segment counts</p>
            <div className="flex flex-col gap-3">
              <ContentSwitcher variant="fill-minimal" items={["Grid", "List"]} />
              <ContentSwitcher variant="fill-minimal" items={["All", "Active", "Inactive"]} />
              <ContentSwitcher variant="fill-minimal" items={["Day", "Week", "Month", "Year"]} />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Tabbed navigation for switching between content panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">Overview</TabsTrigger>
              <TabsTrigger value="tab2">Analytics</TabsTrigger>
              <TabsTrigger value="tab3">Reports</TabsTrigger>
              <TabsTrigger value="tab4">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 border rounded-[var(--cds-radius-r)]">
              <p className="text-sm text-muted-foreground">Overview content goes here. This tab displays a summary of key metrics.</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4 p-4 border rounded-[var(--cds-radius-r)]">
              <p className="text-sm text-muted-foreground">Analytics content with charts and data visualizations.</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4 p-4 border rounded-[var(--cds-radius-r)]">
              <p className="text-sm text-muted-foreground">Reports section for generating and viewing reports.</p>
            </TabsContent>
            <TabsContent value="tab4" className="mt-4 p-4 border rounded-[var(--cds-radius-r)]">
              <p className="text-sm text-muted-foreground">Notification settings and history.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Input Dropdown / Select */}
      <Card>
        <CardHeader>
          <CardTitle>Input Dropdown</CardTitle>
          <CardDescription>36 px trigger — Default · Hover · Active · Selected · Disabled · Error · Success. Pass <code>searchable</code> to enable in-list search. Pass <code>onCreate</code> for a creatable dropdown with a Create footer button.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Product</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="qengine">QEngine</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Country (searchable)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent searchable searchPlaceholder="Search countries…">
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tag (creatable)</Label>
            <CreatableSelectDemo />
          </div>
          <div className="space-y-2">
            <Label>Region (grouped / optgroup)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Asia Pacific</SelectLabel>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Americas</SelectLabel>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="br">Brazil</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Select disabled>
              <SelectTrigger><SelectValue placeholder="Disabled select" /></SelectTrigger>
              <SelectContent><SelectItem value="x">X</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tag Input */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Input</CardTitle>
          <CardDescription>Type and press Enter or comma to add tags. Backspace on empty input removes the last tag. Supports error, disabled, and maxTags limit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Technologies</Label>
            <TagInput defaultValue={["React", "TypeScript"]} placeholder="Add technology…" />
          </div>
          <div className="space-y-2">
            <Label>Tags (max 4)</Label>
            <TagInput defaultValue={["Creator", "QEngine"]} placeholder="Add tag…" maxTags={4} />
          </div>
          <div className="space-y-2">
            <Label>Error state</Label>
            <TagInput defaultValue={["invalid-tag"]} placeholder="Add tag…" error />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <TagInput defaultValue={["locked-tag"]} placeholder="Add tag…" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Input OTP */}
      <Card>
        <CardHeader>
          <CardTitle>Input OTP</CardTitle>
          <CardDescription>36 px individually-bordered cells \u2014 Default \u00b7 Active \u00b7 Filled \u00b7 Error \u00b7 Success \u00b7 Disabled. Pass <code>state</code> on InputOTPGroup for semantic colours.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>6-Digit OTP (default)</Label>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label>4-Digit PIN (error)</Label>
            <InputOTP maxLength={4} defaultValue="3221">
              <InputOTPGroup state="error">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label>4-Digit PIN (success)</Label>
            <InputOTP maxLength={4} defaultValue="3221">
              <InputOTPGroup state="success">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <InputOTP maxLength={4} disabled>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
      </Card>

      {/* Input Prefixed / Suffixed / Affixed — legacy raw compositions replaced by DS components below */}

      {/* Input Prefix */}
      <Card>
        <CardHeader>
          <CardTitle>Input Prefix</CardTitle>
          <CardDescription>
            A text field with a leading interactive CTA (icon, text) and an optional
            trailing icon / clear button. Use{" "}
            <code>showClear</code> when the field has a value.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          {/* Text prefix */}
          <div className="space-y-2">
            <Label>URL</Label>
            <InputPrefix
              prefixLabel="https://"
              placeholder="example.com"
              trailingIcon={<Globe />}
            />
          </div>

          {/* Icon + label prefix */}
          <div className="space-y-2">
            <Label>Search</Label>
            <InputPrefix
              prefixIcon={<Search />}
              prefixLabel="Search"
              prefixTrailingIcon={<ChevronDown />}
              placeholder="Type to search…"
              trailingIcon={<Search />}
              onTrailingClick={() => {}}
            />
          </div>

          {/* With clear (has value) */}
          <div className="space-y-2">
            <Label>Phone number</Label>
            <InputPrefix
              prefixLabel="+91"
              defaultValue="98765 43210"
              showClear
              onClear={() => {}}
            />
          </div>

          {/* Error state */}
          <div className="space-y-2">
            <Label>Error</Label>
            <InputPrefix
              status="error"
              prefixLabel="$"
              placeholder="Invalid amount"
              trailingIcon={<Search />}
            />
          </div>

          {/* Error with value */}
          <div className="space-y-2">
            <Label>Error after</Label>
            <InputPrefix
              status="error"
              prefixLabel="$"
              defaultValue="-999"
              showClear
              onClear={() => {}}
            />
          </div>

          {/* Success */}
          <div className="space-y-2">
            <Label>Success</Label>
            <InputPrefix
              status="success"
              prefixLabel="$"
              defaultValue="250.00"
              showClear
              onClear={() => {}}
            />
          </div>

          {/* Disabled */}
          <div className="space-y-2">
            <Label>Disabled</Label>
            <InputPrefix
              disabled
              prefixLabel="https://"
              placeholder="Unavailable"
              trailingIcon={<Globe />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Input Suffix */}
      <Card>
        <CardHeader>
          <CardTitle>Input Suffix</CardTitle>
          <CardDescription>
            A text field with a trailing interactive CTA (icon, text, or clear). Use{" "}
            <code>showClear</code> when the field has a value.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          {/* Default — text + icon CTA */}
          <div className="space-y-2">
            <Label>Copy link</Label>
            <InputSuffix
              placeholder="https://example.com"
              suffixIcon={<Copy />}
              suffixLabel="Copy"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Icon-only CTA */}
          <div className="space-y-2">
            <Label>Search</Label>
            <InputSuffix
              placeholder="Search…"
              suffixIcon={<Search />}
              onSuffixClick={() => {}}
            />
          </div>

          {/* Text-only CTA */}
          <div className="space-y-2">
            <Label>Go to page</Label>
            <InputSuffix
              placeholder="Page number"
              type="number"
              suffixLabel="Go"
              suffixIcon={<ArrowRight />}
              onSuffixClick={() => {}}
            />
          </div>

          {/* Selected — clear button */}
          <div className="space-y-2">
            <Label>With value (clear)</Label>
            <InputSuffix
              defaultValue="zoho.com"
              showClear
              onClear={() => {}}
            />
          </div>

          {/* Error state */}
          <div className="space-y-2">
            <Label>Error</Label>
            <InputSuffix
              status="error"
              placeholder="Invalid domain"
              suffixLabel="Retry"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Success state — clear shown */}
          <div className="space-y-2">
            <Label>Success</Label>
            <InputSuffix
              status="success"
              defaultValue="rajendra@zoho.com"
              showClear
              onClear={() => {}}
            />
          </div>

          {/* Disabled */}
          <div className="space-y-2">
            <Label>Disabled</Label>
            <InputSuffix
              disabled
              placeholder="Unavailable"
              suffixLabel="Action"
              onSuffixClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Input Affixed */}
      <Card>
        <CardHeader>
          <CardTitle>Input Affixed</CardTitle>
          <CardDescription>
            A text field with a leading CTA on the left AND a trailing CTA on the
            right. The right CTA always stays grey — only the left CTA + input
            adopt error / success colours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-sm">
          {/* Currency + unit */}
          <div className="space-y-2">
            <Label>Currency amount</Label>
            <InputAffixed
              prefixIcon={<ArrowRight />}
              prefixLabel="USD"
              placeholder="0.00"
              suffixLabel=".00"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Country code + extension */}
          <div className="space-y-2">
            <Label>Phone number</Label>
            <InputAffixed
              prefixLabel="+91"
              prefixTrailingIcon={<ChevronDown />}
              onPrefixClick={() => {}}
              placeholder="98765 43210"
              suffixIcon={<Phone />}
              suffixLabel="Call"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Error — left + input get error; right stays default */}
          <div className="space-y-2">
            <Label>Error</Label>
            <InputAffixed
              status="error"
              prefixLabel="$"
              placeholder="Invalid amount"
              suffixLabel="Add"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Success */}
          <div className="space-y-2">
            <Label>Success</Label>
            <InputAffixed
              status="success"
              prefixLabel="$"
              defaultValue="250.00"
              suffixLabel="Add"
              onSuffixClick={() => {}}
            />
          </div>

          {/* Disabled */}
          <div className="space-y-2">
            <Label>Disabled</Label>
            <InputAffixed
              disabled
              prefixLabel="USD"
              placeholder="Unavailable"
              suffixLabel=".00"
              onSuffixClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Popover */}
      <Card>
        <CardHeader>
          <CardTitle>Popover</CardTitle>
          <CardDescription>Floating content panel anchored to a trigger.</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger><Button variant="outline">Open Popover</Button></PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Dimensions</h4>
                <p className="text-xs text-muted-foreground">Set the dimensions for the layer.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label className="text-xs">Width</Label><Input placeholder="100%" /></div>
                  <div className="space-y-1"><Label className="text-xs">Height</Label><Input placeholder="auto" /></div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Dropdown Menu */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Menu</CardTitle>
          <CardDescription>Context menu with actions and sub-items.</CardDescription>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger><Button variant="outline"><MoreHorizontal className="mr-2 h-4 w-4" /> Actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /> Billing</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuItem><Keyboard className="mr-2 h-4 w-4" /> Shortcuts</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes / Alerts</CardTitle>
          <CardDescription>Status messages with semantic variants (Info, Success, Warning, Error, Neutral).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-w-lg">
          <Notes variant="info" title="Information">This is an informational message for the user.</Notes>
          <Notes variant="success" title="Success">Operation completed successfully.</Notes>
          <Notes variant="warning" title="Warning">Please review before proceeding.</Notes>
          <Notes variant="error" title="Error">Something went wrong. Please try again.</Notes>
          <Notes variant="neutral" title="Note">A general note for the user's reference.</Notes>
          <Notes variant="info" title="With CTA" cta={{ label: "Learn more", onClick: () => {} }}>Notes can include an optional bottom CTA bar for a contextual action.</Notes>
          <Notes variant="warning" title="With leading icon CTA" cta={{ label: "Review settings", leadingIcon: undefined, onClick: () => {} }}>Use the cta prop to surface a hyperlink-style call-to-action.</Notes>
        </CardContent>
      </Card>

      {/* ─── Tooltip ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltip</CardTitle>
          <CardDescription>
            Small floating label on hover. Non-interactive — use Popover for clickable content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TooltipProvider>

            {/* Simple tooltip — positions */}
            <div>
              <p className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] mb-3 font-medium uppercase tracking-wide">
                Simple — positions
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                 {(["top", "bottom", "left", "right"] as const).map((side) => (
                  <Tooltip key={side}>
                    <TooltipTrigger>
                      <Button variant="outline" size="sm" className="capitalize">{side}</Button>
                    </TooltipTrigger>
                    <TooltipContent side={side}>Tooltip label</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Simple tooltip — with icons */}
            <div>
              <p className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] mb-3 font-medium uppercase tracking-wide">
                Simple — with icons
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">Leading icon</Button>
                  </TooltipTrigger>
                  <TooltipContent
                    leadingIcon={<Info className="size-full" />}
                  >
                    With left icon
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">Trailing icon</Button>
                  </TooltipTrigger>
                  <TooltipContent
                    trailingIcon={<ArrowRight className="size-full" />}
                  >
                    With right icon
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">Both icons</Button>
                  </TooltipTrigger>
                  <TooltipContent
                    leadingIcon={<Info className="size-full" />}
                    trailingIcon={<ArrowRight className="size-full" />}
                  >
                    Both icons
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Rich tooltip — Text type */}
            <div>
              <p className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] mb-3 font-medium uppercase tracking-wide">
                Rich — Text
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">Hover me</Button>
                  </TooltipTrigger>
                  <RichTooltipContent heading="Feature overview">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non dolor vel nulla accumsan congue.
                  </RichTooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm">With heading icon</Button>
                  </TooltipTrigger>
                  <RichTooltipContent
                    heading="AI Summary"
                    headingIcon={<Info className="size-full" />}
                    side="bottom"
                  >
                    Zia analyses your data and surfaces insights automatically.
                  </RichTooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Rich tooltip — List type */}
            <div>
              <p className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] mb-3 font-medium uppercase tracking-wide">
                Rich — List
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="sm">Numbered list</Button>
                </TooltipTrigger>
                <RichTooltipContent
                  heading="Steps to get started"
                  contentType="list"
                  listItems={[
                    "Create a new application",
                    "Configure your data sources",
                    "Design your forms and reports",
                    "Set up roles and permissions",
                    "Publish and share with your team",
                  ]}
                  side="right"
                />
              </Tooltip>
            </div>

            {/* Rich tooltip — Table type */}
            <div>
              <p className="text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-default)] mb-3 font-medium uppercase tracking-wide">
                Rich — Table
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="sm">Key / value table</Button>
                </TooltipTrigger>
                <RichTooltipContent
                  heading="Record details"
                  contentType="table"
                  tableRows={[
                    { label: "Status", value: "Active" },
                    { label: "Owner", value: "rajendra.prasad" },
                    { label: "Created", value: "2026-07-10" },
                    { label: "Version", value: "v1.4.0" },
                  ]}
                  side="right"
                />
              </Tooltip>
            </div>

          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
          <CardDescription>Brief notification messages that appear temporarily. Uses Sonner library.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Toast notifications are triggered programmatically via the <code className="bg-muted px-1 rounded text-xs">toast()</code> function from Sonner.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => {}}>Default Toast</Button>
            <Button variant="outline" size="sm" onClick={() => {}}>Success Toast</Button>
            <Button variant="outline" size="sm" onClick={() => {}}>Error Toast</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
