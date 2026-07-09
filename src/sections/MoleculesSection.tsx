import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbDropdownItem } from "@/components/ui/breadcrumb";
import { ContentSwitcher } from "@/components/ui/content-switcher";
import { Notes } from "@/components/ui/notes";
import { Badge } from "@/components/ui/badge";
import { InputSuffix } from "@/components/ui/input-suffix";
import { InputPrefix } from "@/components/ui/input-prefix";
import { MoreHorizontal, Settings, User, LogOut, CreditCard, Keyboard, Phone, X, Copy, Search, ArrowRight, Globe, ChevronDown } from "lucide-react";

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
          <CardDescription>Select dropdowns for choosing from predefined options.</CardDescription>
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
            <Label>Country</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in">🇮🇳 India</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
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

      {/* Input OTP */}
      <Card>
        <CardHeader>
          <CardTitle>Input OTP</CardTitle>
          <CardDescription>One-time password input with individual digit slots.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>6-Digit OTP</Label>
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
            <Label>4-Digit PIN</Label>
            <InputOTP maxLength={4}>
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

      {/* Input Prefixed / Suffixed / Affixed */}
      <Card>
        <CardHeader>
          <CardTitle>Input Prefixed / Suffixed / Affixed</CardTitle>
          <CardDescription>Input fields with prefix, suffix, or both attached elements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Prefixed (URL)</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-[var(--cds-radius-r)] border border-r-0 border-input bg-muted text-sm text-muted-foreground">https://</span>
              <Input className="rounded-l-none" placeholder="example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Suffixed (Email)</Label>
            <div className="flex">
              <Input className="rounded-r-none" placeholder="username" />
              <span className="inline-flex items-center px-3 rounded-r-[var(--cds-radius-r)] border border-l-0 border-input bg-muted text-sm text-muted-foreground">@zoho.com</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Affixed (Phone)</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-[var(--cds-radius-r)] border border-r-0 border-input bg-muted text-sm text-muted-foreground">+91</span>
              <Input className="rounded-none border-x-0" placeholder="98765 43210" />
              <span className="inline-flex items-center px-2 rounded-r-[var(--cds-radius-r)] border border-l-0 border-input bg-muted text-muted-foreground"><Phone className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Input Number</Label>
            <Input type="number" placeholder="0" min={0} max={100} />
          </div>
        </CardContent>
      </Card>

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

      {/* Input Tag */}
      <Card>
        <CardHeader>
          <CardTitle>Input Tag</CardTitle>
          <CardDescription>Tag input for multi-value entries.</CardDescription>
        </CardHeader>
        <CardContent className="max-w-md">
          <div className="flex flex-wrap items-center gap-2 rounded-[var(--cds-radius-r)] border border-input p-2 min-h-[40px]">
            <Badge variant="subtle" className="gap-1">React <X className="h-3 w-3 cursor-pointer" /></Badge>
            <Badge variant="subtle" className="gap-1">TypeScript <X className="h-3 w-3 cursor-pointer" /></Badge>
            <Badge variant="subtle" className="gap-1">Tailwind <X className="h-3 w-3 cursor-pointer" /></Badge>
            <input className="flex-1 min-w-[80px] border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Add tag..." />
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /> Billing</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem><Keyboard className="mr-2 h-4 w-4" /> Shortcuts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
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
