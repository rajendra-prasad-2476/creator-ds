import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogIcon, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tile, TileIcon, TileTitle, TileDescription } from "@/components/ui/tile";
import { Notes } from "@/components/ui/notes";
import { TopBar } from "@/components/ui/top-bar";
import { LeftNav } from "@/components/ui/left-nav";
import { Search, Settings, Bell, Home, Users, FileText, BarChart3, Calendar, Mail, Plus, Filter, ArrowUpDown, Eye, Edit, Trash2, Database, Layers, Globe } from "lucide-react";

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
          <CardDescription>Full-screen overlay backdrop used behind modals, sheets, and dialogs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Notes variant="neutral" title="Blanket">The blanket/overlay is automatically rendered by Dialog, Sheet, and AlertDialog components as a semi-transparent backdrop.</Notes>
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
    </div>
  );
}
