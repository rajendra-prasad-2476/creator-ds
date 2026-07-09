import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, XCircle, Circle, type LucideIcon } from "lucide-react";

const notesVariants = cva(
  "flex flex-col rounded-[var(--cds-radius-r)] border overflow-hidden",
  {
    variants: {
      variant: {
        info: "border-[var(--cds-info-border-low-hover)] bg-[var(--cds-info-surface-subtle)]",
        success: "border-[var(--cds-success-border-low-hover)] bg-[var(--cds-success-surface-subtle)]",
        warning: "border-[var(--cds-warning-border-low-hover)] bg-[var(--cds-warning-surface-subtle)]",
        error: "border-[var(--cds-error-border-low-hover)] bg-[var(--cds-error-surface-subtle)]",
        neutral: "border-[var(--cds-huegrey-border-minimal)] bg-[var(--cds-huegrey-surface-subtle)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  neutral: Circle,
};

const titleColorMap: Record<string, string> = {
  info: "text-[var(--cds-info-text-default)]",
  success: "text-[var(--cds-success-text-default)]",
  warning: "text-[var(--cds-warning-text-default)]",
  error: "text-[var(--cds-error-text-default)]",
  neutral: "text-[var(--cds-huegrey-text-dark)]",
};

const iconColorMap: Record<string, string> = {
  info: "text-[var(--cds-info-text-default)]",
  success: "text-[var(--cds-success-text-default)]",
  warning: "text-[var(--cds-warning-text-default)]",
  error: "text-[var(--cds-error-text-default)]",
  neutral: "text-[var(--cds-huegrey-text-default)]",
};

const ctaBorderMap: Record<string, string> = {
  info: "border-[var(--cds-info-border-low-hover)]",
  success: "border-[var(--cds-success-border-low-hover)]",
  warning: "border-[var(--cds-warning-border-low-hover)]",
  error: "border-[var(--cds-error-border-low-hover)]",
  neutral: "border-[var(--cds-huegrey-border-minimal)]",
};

export interface NotesCta {
  label: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onClick?: () => void;
}

export interface NotesProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notesVariants> {
  title?: string;
  icon?: LucideIcon;
  cta?: NotesCta;
}

const Notes = React.forwardRef<HTMLDivElement, NotesProps>(
  ({ className, variant = "info", title, icon, cta, children, ...props }, ref) => {
    const v = variant ?? "info";
    const Icon = icon ?? iconMap[v];

    return (
      <div ref={ref} className={cn(notesVariants({ variant }), className)} {...props}>
        {/* Content */}
        <div className="flex items-start gap-[10px] p-[14px]">
          <Icon className={cn("size-[14px] mt-[2px] shrink-0", iconColorMap[v])} />
          <div className="flex flex-col gap-[var(--cds-gap-small)] flex-1 min-w-0">
            {title && (
              <p
                className={cn(
                  "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-semibold",
                  titleColorMap[v]
                )}
              >
                {title}
              </p>
            )}
            <div className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-huegrey-text-bold)]">
              {children}
            </div>
          </div>
        </div>

        {/* CTA bar */}
        {cta && (
          <div className={cn("flex items-center px-[14px] py-[10px] border-t", ctaBorderMap[v])}>
            <button
              type="button"
              onClick={cta.onClick}
              className={cn(
                "flex items-center gap-[var(--cds-gap-tight)] text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal hover:underline",
                titleColorMap[v]
              )}
            >
              {cta.leadingIcon && <cta.leadingIcon className="size-[14px] shrink-0" />}
              {cta.label}
              {cta.trailingIcon && <cta.trailingIcon className="size-[14px] shrink-0" />}
            </button>
          </div>
        )}
      </div>
    );
  }
);
Notes.displayName = "Notes";

export { Notes, notesVariants };