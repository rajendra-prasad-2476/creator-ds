import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

/** Figma sizes: 36 px · 24 px · 16 px · 14 px */
export type AvatarSize = "xl" | "lg" | "sm" | "xs"

/** Border-radius shape for the avatar container */
export type AvatarShape = "circle" | "squircle" | "minimal"

/** Placeholder background palette (used by AvatarFallback solid colour avatars) */
export type AvatarColor =
  | "primary"
  | "cardinal"
  | "tekhelete"
  | "caribbean"
  | "avocado"
  | "russet"
  | "penred"
  | "mardigrass"
  | "biceblue"
  | "seagreen"
  | "gold"
  | "brown"
  | "black"
  | "disabled"

// ─── Placeholder colour map ───────────────────────────────────────────────────

export const AVATAR_COLORS: Record<AvatarColor, { bg: string; text: string }> = {
  primary:    { bg: "#0D4EF2", text: "#ffffff" },
  cardinal:   { bg: "#C33149", text: "#ffffff" },
  tekhelete:  { bg: "#46268D", text: "#ffffff" },
  caribbean:  { bg: "#007F8B", text: "#ffffff" },
  avocado:    { bg: "#5B7A1F", text: "#ffffff" },
  russet:     { bg: "#8C4A2F", text: "#ffffff" },
  penred:     { bg: "#CC1914", text: "#ffffff" },
  mardigrass: { bg: "#9B2F8A", text: "#ffffff" },
  biceblue:   { bg: "#016DAA", text: "#ffffff" },
  seagreen:   { bg: "#1A7D5B", text: "#ffffff" },
  gold:       { bg: "#CC8C00", text: "#ffffff" },
  brown:      { bg: "#795548", text: "#ffffff" },
  black:      { bg: "#25272C", text: "#ffffff" },
  disabled:   { bg: "#C5C5C7", text: "#6C6D71" },
}

// ─── Border-radius helpers ────────────────────────────────────────────────────

/** Returns the Tailwind rounded class for a given shape + size combination */
function shapeClass(shape: AvatarShape, size: AvatarSize): string {
  if (shape === "circle") return "rounded-full"
  if (shape === "squircle") return size === "xl" || size === "lg" ? "rounded-[6px]" : "rounded-[4px]"
  return "rounded-[2px]" // minimal
}

/** Pixel dimension for each size token */
const SIZE_PX: Record<AvatarSize, string> = {
  xl: "size-9",    // 36 px
  lg: "size-6",    // 24 px
  sm: "size-4",    // 16 px
  xs: "size-3.5",  // 14 px
}

/** Font size for initials inside each avatar size */

// ─── Avatar root ─────────────────────────────────────────────────────────────

function Avatar({
  className,
  size = "xl",
  shape = "circle",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: AvatarSize
  shape?: AvatarShape
}) {
  const rounded = shapeClass(shape, size)
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 select-none",
        "after:absolute after:inset-0 after:border after:border-[var(--cds-neutral-border-low,#EFF0F1)] after:mix-blend-darken after:pointer-events-none",
        SIZE_PX[size],
        rounded,
        `after:${rounded}`,
        className
      )}
      {...props}
    />
  )
}

// ─── Avatar image ─────────────────────────────────────────────────────────────

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover overflow-hidden rounded-[inherit]", className)}
      {...props}
    />
  )
}

// ─── Avatar fallback (initials / icon) ───────────────────────────────────────

function AvatarFallback({
  className,
  color,
  ...props
}: AvatarPrimitive.Fallback.Props & { color?: AvatarColor }) {
  const palette = color ? AVATAR_COLORS[color] : undefined
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-[inherit]",
        "bg-[var(--cds-neutral-surface-low,#EFF0F1)] text-[var(--cds-neutral-text-default,#4A4B51)]",
        // Size-driven font sizes via group data attrs
        "group-data-[size=xl]/avatar:text-[14px]",
        "group-data-[size=lg]/avatar:text-[11px]",
        "group-data-[size=sm]/avatar:text-[6px]",
        "group-data-[size=xs]/avatar:text-[6px]",
        className
      )}
      style={
        palette
          ? { backgroundColor: palette.bg, color: palette.text, fontFamily: "'Zoho Puvi', sans-serif" }
          : undefined
      }
      {...props}
    />
  )
}

// ─── Avatar status indicator (online / active) ───────────────────────────────

function AvatarStatus({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-status"
      className={cn(
        "absolute bottom-0 right-0 z-10 flex items-center justify-center rounded-full",
        "bg-[#09A654] ring-[1.5px] ring-white",
        // Size scales with avatar size via group data attrs
        "group-data-[size=xl]/avatar:size-[10px]",
        "group-data-[size=lg]/avatar:size-[8px]",
        "group-data-[size=sm]/avatar:size-[6px] group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=xs]/avatar:size-[5px] group-data-[size=xs]/avatar:[&>svg]:hidden",
        className
      )}
      {...props}
    >
      {/* white tick mark */}
      <svg width="6" height="5" viewBox="0 0 6 5" fill="none" aria-hidden>
        <path d="M0.5 2.5L2 4L5.5 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// ─── Avatar group ─────────────────────────────────────────────────────────────

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

// ─── Avatar group count ───────────────────────────────────────────────────────

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "bg-[var(--cds-neutral-surface-low,#EFF0F1)] text-[var(--cds-neutral-text-default,#4A4B51)]",
        "text-[11px] ring-2 ring-background",
        // Mirror Avatar sizes
        "size-9 group-has-data-[size=lg]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:size-4 group-has-data-[size=xs]/avatar-group:size-3.5",
        className
      )}
      {...props}
    />
  )
}

// ─── AvatarBadge kept for backward compatibility ──────────────────────────────

/** @deprecated Use AvatarStatus instead */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2",
        "group-data-[size=xl]/avatar:size-2.5",
        "group-data-[size=lg]/avatar:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
