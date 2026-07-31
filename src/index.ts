/**
 * Creator Design System — React component library
 *
 * Import components:
 *   import { Button, Input, Select } from "@zoho-creator/ds-react"
 *
 * Import styles (do this once in your app root):
 *   import "@zoho-creator/ds-react/styles"
 */

// ─── Atoms ────────────────────────────────────────────────────────────────────
export { Button, SplitButton, buttonVariants } from "@/components/ui/button"
export { Input } from "@/components/ui/input"
export { Textarea } from "@/components/ui/textarea"
export { Label } from "@/components/ui/label"
export { Checkbox } from "@/components/ui/checkbox"
export {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
export { RadioCard } from "@/components/ui/radio-card"
export { Switch } from "@/components/ui/switch"
export { Toggle } from "@/components/ui/toggle"
export type { ToggleProps, ToggleSize, ToggleVariant, ToggleColor } from "@/components/ui/toggle"
export { Slider } from "@/components/ui/slider"
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
export { Badge } from "@/components/ui/badge"
export type { BadgeColour, BadgeVariant, BadgeSize, BadgeProps } from "@/components/ui/badge"
export { StatusBadge } from "@/components/ui/status-badge"
export { Blanket } from "@/components/ui/blanket"
export { Progress } from "@/components/ui/progress"
export { Separator } from "@/components/ui/separator"
export { Tag } from "@/components/ui/tag"
export {
  ProductIllustration,
} from "@/components/ui/product-illustration"
export type {
  ProductIllustrationType,
  ProductIllustrationState,
  ProductIllustrationProps,
} from "@/components/ui/product-illustration"

// ─── Molecules ────────────────────────────────────────────────────────────────
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbDropdownItem,
} from "@/components/ui/breadcrumb"
export { ContentSwitcher } from "@/components/ui/content-switcher"
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
export { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
export { Notes } from "@/components/ui/notes"
export { InputSuffix } from "@/components/ui/input-suffix"
export { InputPrefix } from "@/components/ui/input-prefix"
export { InputAffixed } from "@/components/ui/input-affixed"
export { Tile } from "@/components/ui/tile"
export { Toaster } from "@/components/ui/sonner"
export { TagInput } from "@/components/ui/tag-input"

// ─── Organisms ────────────────────────────────────────────────────────────────
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export { TopBar } from "@/components/ui/top-bar"
export type { TopBarProps } from "@/components/ui/top-bar"
export { LeftNav } from "@/components/ui/left-nav"
export type { LeftNavProps, NavItemDef, NavSectionDef } from "@/components/ui/left-nav"
export { List, ListRow } from "@/components/ui/list"
export type { ListItemData, ListSize, ListRowProps, ListProps } from "@/components/ui/list"
export {
  FullPageDialog,
} from "@/components/ui/full-page-dialog"
export type {
  FullPageDialogProps,
  FullPageDialogNavStyle,
  FullPageDialogSection,
  FullPageDialogSectionItem,
  FullPageDialogStep,
  FullPageDialogStepStatus,
} from "@/components/ui/full-page-dialog"
export { BuilderTopBar } from "@/components/ui/builder-top-bar"
export type { BuilderTopBarProps, BuilderTab } from "@/components/ui/builder-top-bar"
export { BuilderLeftNav } from "@/components/ui/builder-left-nav"
export type {
  BuilderLeftNavProps,
  BuilderNavSection,
  BuilderNavItem,
  BuilderNavItemType,
  BuilderLeftNavUser,
} from "@/components/ui/builder-left-nav"
export { BuilderShell } from "@/components/ui/builder-shell"
export type { BuilderShellProps, BuilderViewport } from "@/components/ui/builder-shell"

// ─── Theming ──────────────────────────────────────────────────────────────────
export { ThemeProvider } from "@/components/ui/theme-provider"
export type { ThemeProviderProps, ThemeTokens } from "@/components/ui/theme-provider"

// ─── Utilities ────────────────────────────────────────────────────────────────
export { cn } from "@/lib/utils"
