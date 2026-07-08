import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list flex",
  {
    variants: {
      variant: {
        // DS Figma spec — underline indicator, horizontal tab bar
        line: "items-center gap-[var(--cds-space-20)] bg-transparent",
        // Legacy pill/segment style
        default: [
          "inline-flex w-fit items-center justify-center rounded-lg p-[3px]",
          "bg-muted text-muted-foreground",
          "group-data-horizontal/tabs:h-8",
          "group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "line",
    },
  }
)

function TabsList({
  className,
  variant = "line",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "cursor-pointer select-none outline-none transition-colors",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        // ── LINE VARIANT (Figma DS default) ──────────────────────────────────
        // Stack: label row on top, indicator below
        "group-data-[variant=line]/tabs-list:flex",
        "group-data-[variant=line]/tabs-list:flex-col",
        "group-data-[variant=line]/tabs-list:items-center",
        // Gap between label and indicator (= "bottom padding" in Figma, default 6 px)
        "group-data-[variant=line]/tabs-list:gap-[var(--cds-space-6)]",
        // Typography — P2
        "group-data-[variant=line]/tabs-list:text-[length:var(--cds-text-p2)]",
        "group-data-[variant=line]/tabs-list:leading-[var(--cds-leading-p2)]",
        "group-data-[variant=line]/tabs-list:font-normal",
        "group-data-[variant=line]/tabs-list:whitespace-nowrap",
        // Colors — default state
        "group-data-[variant=line]/tabs-list:text-[color:var(--cds-huegrey-text-bold)]",
        "group-data-[variant=line]/tabs-list:hover:text-[color:var(--cds-huegrey-text-dark)]",
        // Colors — active state
        "group-data-[variant=line]/tabs-list:data-active:text-[color:var(--cds-primary-text-default)]",
        "group-data-[variant=line]/tabs-list:data-active:hover:text-[color:var(--cds-primary-surface-default-hover)]",
        // Disabled
        "group-data-[variant=line]/tabs-list:disabled:pointer-events-none",
        "group-data-[variant=line]/tabs-list:disabled:opacity-50",
        // Focus ring
        "group-data-[variant=line]/tabs-list:focus-visible:rounded-[var(--cds-radius-s)]",
        "group-data-[variant=line]/tabs-list:focus-visible:outline-2",
        "group-data-[variant=line]/tabs-list:focus-visible:outline-offset-2",
        "group-data-[variant=line]/tabs-list:focus-visible:outline-[var(--cds-primary-surface-default)]",

        // ── DEFAULT VARIANT (legacy pill) ────────────────────────────────────
        "group-data-[variant=default]/tabs-list:relative",
        "group-data-[variant=default]/tabs-list:inline-flex",
        "group-data-[variant=default]/tabs-list:h-[calc(100%-1px)]",
        "group-data-[variant=default]/tabs-list:flex-1",
        "group-data-[variant=default]/tabs-list:items-center",
        "group-data-[variant=default]/tabs-list:justify-center",
        "group-data-[variant=default]/tabs-list:gap-1.5",
        "group-data-[variant=default]/tabs-list:rounded-md",
        "group-data-[variant=default]/tabs-list:border",
        "group-data-[variant=default]/tabs-list:border-transparent",
        "group-data-[variant=default]/tabs-list:px-1.5",
        "group-data-[variant=default]/tabs-list:py-0.5",
        "group-data-[variant=default]/tabs-list:text-sm",
        "group-data-[variant=default]/tabs-list:font-medium",
        "group-data-[variant=default]/tabs-list:whitespace-nowrap",
        "group-data-[variant=default]/tabs-list:text-foreground/60",
        "group-data-[variant=default]/tabs-list:hover:text-foreground",
        "group-data-[variant=default]/tabs-list:focus-visible:border-ring",
        "group-data-[variant=default]/tabs-list:focus-visible:ring-[3px]",
        "group-data-[variant=default]/tabs-list:focus-visible:ring-ring/50",
        "group-data-[variant=default]/tabs-list:focus-visible:outline-1",
        "group-data-[variant=default]/tabs-list:focus-visible:outline-ring",
        "group-data-[variant=default]/tabs-list:disabled:pointer-events-none",
        "group-data-[variant=default]/tabs-list:disabled:opacity-50",
        "group-data-[variant=default]/tabs-list:data-active:bg-background",
        "group-data-[variant=default]/tabs-list:data-active:text-foreground",
        "group-data-[variant=default]/tabs-list:data-active:shadow-sm",
        "group-data-[variant=default]/tabs-list:dark:text-muted-foreground",
        "group-data-[variant=default]/tabs-list:dark:hover:text-foreground",
        "group-data-[variant=default]/tabs-list:dark:data-active:border-input",
        "group-data-[variant=default]/tabs-list:dark:data-active:bg-input/30",
        "group-data-[variant=default]/tabs-list:dark:data-active:text-foreground",

        className
      )}
      {...props}
    >
      {/* Label row: text and optional leading/trailing icons */}
      <span className="flex items-center gap-[var(--cds-gap-small)]">
        {children}
      </span>
      {/* Underline indicator — always in layout (preserves height), visible only when active.
          Hidden entirely in the pill (default) variant. */}
      <span
        aria-hidden
        className={cn(
          "group-data-[variant=default]/tabs-list:hidden",
          "h-px w-full rounded-[var(--cds-radius-full)]",
          "bg-[var(--cds-primary-surface-default)]",
          "opacity-0 transition-opacity duration-150",
          // Show when the parent trigger element has [data-active]
          "[[data-active]_&]:opacity-100",
        )}
      />
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
