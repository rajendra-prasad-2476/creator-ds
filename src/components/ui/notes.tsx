import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, Check, AlertTriangle, AlertCircle, type LucideIcon } from "lucide-react";

const notesVariants = cva(
  "flex items-start gap-3 rounded-[var(--cds-radius-r)] border p-4",
  {
    variants: {
      variant: {
        info: "border-[var(--cds-info-border-default)] bg-[var(--cds-info-surface-subtle)]",
        success: "border-[var(--cds-success-border-default)] bg-[var(--cds-success-surface-subtle)]",
        warning: "border-[var(--cds-warning-border-default)] bg-[var(--cds-warning-surface-subtle)]",
        error: "border-[var(--cds-error-border-default)] bg-[var(--cds-error-surface-subtle)]",
        neutral: "border-[var(--cds-neutral-border-low)] bg-[var(--cds-neutral-surface-subtle)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap: Record<string, LucideIcon> = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  error: AlertCircle,
  neutral: Info,
};

const textColorMap: Record<string, { title: string; body: string; icon: string }> = {
  info: {
    title: "text-[var(--cds-info-text-bold)]",
    body: "text-[var(--cds-info-text-default)]",
    icon: "text-[var(--cds-info-text-default)]",
  },
  success: {
    title: "text-[var(--cds-success-text-bold)]",
    body: "text-[var(--cds-success-text-default)]",
    icon: "text-[var(--cds-success-text-default)]",
  },
  warning: {
    title: "text-[var(--cds-warning-text-bold)]",
    body: "text-[var(--cds-warning-text-default)]",
    icon: "text-[var(--cds-warning-text-default)]",
  },
  error: {
    title: "text-[var(--cds-error-text-bold)]",
    body: "text-[var(--cds-error-text-default)]",
    icon: "text-[var(--cds-error-text-default)]",
  },
  neutral: {
    title: "text-[var(--cds-neutral-text-bold)]",
    body: "text-[var(--cds-neutral-text-default)]",
    icon: "text-[var(--cds-neutral-text-default)]",
  },
};

export interface NotesProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notesVariants> {
  title?: string;
  icon?: LucideIcon;
}

const Notes = React.forwardRef<HTMLDivElement, NotesProps>(
  ({ className, variant = "info", title, icon, children, ...props }, ref) => {
    const v = variant ?? "info";
    const Icon = icon ?? iconMap[v];
    const colors = textColorMap[v];

    return (
      <div ref={ref} className={cn(notesVariants({ variant }), className)} {...props}>
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", colors.icon)} />
        <div>
          {title && (
            <p className={cn("text-sm font-medium", colors.title)}>{title}</p>
          )}
          <div className={cn("text-sm", colors.body)}>{children}</div>
        </div>
      </div>
    );
  }
);
Notes.displayName = "Notes";

export { Notes, notesVariants };