import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tileVariants = cva(
  "flex flex-col items-center justify-center gap-2 rounded-[var(--cds-radius-l)] border p-6 text-center transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-border bg-card hover:bg-accent hover:border-primary/30",
        active: "border-primary bg-[var(--cds-primary-surface-subtle)] text-primary",
        muted: "border-border bg-muted/50 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TileProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tileVariants> {}

const Tile = React.forwardRef<HTMLDivElement, TileProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(tileVariants({ variant }), className)} {...props} />
  )
);
Tile.displayName = "Tile";

const TileIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-10 w-10 items-center justify-center rounded-[var(--cds-radius-r)] bg-primary/10 text-primary", className)} {...props} />
  )
);
TileIcon.displayName = "TileIcon";

const TileTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  )
);
TileTitle.displayName = "TileTitle";

const TileDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
);
TileDescription.displayName = "TileDescription";

export { Tile, TileIcon, TileTitle, TileDescription, tileVariants };