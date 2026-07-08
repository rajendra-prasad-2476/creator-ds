import * as React from "react";
import { cn } from "@/lib/utils";

type ContentSwitcherSize = "xs" | "sm" | "base" | "lg";
type ContentSwitcherVariant = "fill" | "fill-minimal";

interface ContentSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  value?: string;
  onValueChange?: (value: string) => void;
  /** Controls height and text density. Defaults to "base". */
  size?: ContentSwitcherSize;
  /**
   * "fill"         — solid primary active state (use on white/light surfaces)
   * "fill-minimal" — subtle active state (use on already-coloured surfaces)
   */
  variant?: ContentSwitcherVariant;
}

const sizeConfig: Record<
  ContentSwitcherSize,
  { height: string; fontSize: string; lineHeight: string; paddingX: string }
> = {
  xs:   { height: "h-[26px]", fontSize: "text-[length:var(--cds-text-p4)]", lineHeight: "leading-[var(--cds-leading-p4)]", paddingX: "px-3" },
  sm:   { height: "h-[32px]", fontSize: "text-[length:var(--cds-text-p3)]", lineHeight: "leading-[var(--cds-leading-p3)]", paddingX: "px-3" },
  base: { height: "h-[36px]", fontSize: "text-[length:var(--cds-text-p2)]", lineHeight: "leading-[var(--cds-leading-p2)]", paddingX: "px-4" },
  lg:   { height: "h-[40px]", fontSize: "text-[length:var(--cds-text-p1)]", lineHeight: "leading-[var(--cds-leading-p1)]", paddingX: "px-4" },
};

const ContentSwitcher = React.forwardRef<HTMLDivElement, ContentSwitcherProps>(
  (
    {
      className,
      items,
      value,
      onValueChange,
      size = "base",
      variant = "fill",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value ?? items[0]);
    const selected = value !== undefined ? value : internalValue;

    React.useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    const handleSelect = (item: string) => {
      if (value === undefined) setInternalValue(item);
      onValueChange?.(item);
    };

    const { height, fontSize, lineHeight, paddingX } = sizeConfig[size];

    const containerBorder =
      variant === "fill"
        ? "border border-[var(--cds-primary-border-default)]"
        : "border border-[var(--cds-huegrey-border-minimal)]";

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex items-stretch rounded-[var(--cds-radius-r)] overflow-hidden",
          height,
          containerBorder,
          className
        )}
        {...props}
      >
        {items.map((item, idx) => {
          const isSelected = selected === item;
          const isLast = idx === items.length - 1;

          const segmentColors =
            variant === "fill"
              ? isSelected
                ? "bg-[var(--cds-primary-surface-default)] text-[var(--cds-white)]"
                : "bg-transparent text-[var(--cds-primary-text-default)] hover:bg-[var(--cds-primary-surface-subtle)]"
              : isSelected
              ? "bg-[var(--cds-primary-surface-subtle-hover)] text-[var(--cds-primary-text-default)]"
              : "bg-transparent text-[var(--cds-huegrey-text-default)] hover:bg-[var(--cds-huegrey-surface-low)]";

          const divider =
            !isLast &&
            (variant === "fill"
              ? "border-r border-[var(--cds-primary-border-minimal)]"
              : "border-r border-[var(--cds-huegrey-border-minimal)]");

          return (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              aria-pressed={isSelected}
              className={cn(
                "flex flex-1 items-center justify-center whitespace-nowrap",
                "font-['Zoho_Puvi'] font-normal transition-colors cursor-pointer",
                fontSize,
                lineHeight,
                paddingX,
                segmentColors,
                divider
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    );
  }
);

ContentSwitcher.displayName = "ContentSwitcher";

export { ContentSwitcher };
export type { ContentSwitcherSize, ContentSwitcherVariant };