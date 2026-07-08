"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* ─── Variant-aware context ─── */
type PopupAlertVariant = "alert" | "success" | "info" | "warning"

const AlertDialogVariantContext = React.createContext<PopupAlertVariant>("alert")

function useAlertDialogVariant() {
  return React.useContext(AlertDialogVariantContext)
}

/* ─── Root ─── */
function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/* ─── Trigger ─── */
function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/* ─── Portal ─── */
function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/* ─── Close ─── */
function AlertDialogClose({ ...props }: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
}

/* ─── Overlay / Backdrop ─── */
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/* ─── Content (Popup container) ─── */
function AlertDialogContent({
  className,
  variant = "alert",
  children,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  variant?: PopupAlertVariant
}) {
  return (
    <AlertDialogVariantContext.Provider value={variant}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          data-variant={variant}
          className={cn(
            "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 flex w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--cds-radius-r)] border border-[var(--cds-neutral-border-low)] bg-white text-foreground shadow-lg duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPortal>
    </AlertDialogVariantContext.Provider>
  )
}

/* ─── Header (icon + title + description area) ─── */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col items-center gap-3.5 px-5 pt-10 pb-5 text-center",
        className
      )}
      {...props}
    />
  )
}

/* ─── Status Icon / Media ─── */
const statusIconVariants = cva(
  "mb-1 flex items-center justify-center",
  {
    variants: {
      variant: {
        alert: "",
        success: "",
        info: "",
        warning: "",
      },
    },
    defaultVariants: {
      variant: "alert",
    },
  }
)

function AlertDialogIcon({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: PopupAlertVariant
}) {
  const contextVariant = useAlertDialogVariant()
  const resolvedVariant = variant || contextVariant

  return (
    <div
      data-slot="alert-dialog-icon"
      className={cn(statusIconVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      {children || <DefaultStatusIcon variant={resolvedVariant} />}
    </div>
  )
}

/* ─── Default SVG Status Icons (matching Figma) ─── */
function DefaultStatusIcon({ variant }: { variant: PopupAlertVariant }) {
  switch (variant) {
    case "alert":
      return (
        <svg width="57" height="37" viewBox="0 0 57 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28.5" cy="18.5" rx="28.5" ry="17.5" fill="#F2F5F8" />
          <circle cx="28.5" cy="18.5" r="17.5" fill="white" stroke="#E71F43" strokeWidth="1.5" />
          <circle cx="28.5" cy="28" r="1" fill="#E71F43" />
          <rect x="23" y="15" width="11" height="11" rx="1" fill="#E71F43" fillOpacity="0.15" stroke="#E71F43" strokeWidth="1.5" />
          <line x1="21" y1="13" x2="36" y2="13" stroke="#E71F43" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M26 10L28.5 7L31 10" stroke="#E71F43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="47" cy="32" r="2.5" fill="white" stroke="#E71F43" strokeWidth="1.2" />
          <circle cx="7" cy="3" r="1.5" fill="white" stroke="#E71F43" strokeWidth="1.2" />
        </svg>
      )
    case "success":
      return (
        <svg width="57" height="37" viewBox="0 0 57 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28.5" cy="18.5" rx="28.5" ry="17.5" fill="#F2F5F8" />
          <circle cx="28.5" cy="18.5" r="17.5" fill="white" stroke="#05B801" strokeWidth="1.5" />
          <circle cx="28.5" cy="28" r="1" fill="#05B801" />
          <path d="M21 18.5L26 23.5L36 13.5" stroke="#05B801" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" fillOpacity="0.5" />
          <circle cx="47" cy="32" r="2.5" fill="white" stroke="#05B801" strokeWidth="1.2" />
          <circle cx="7" cy="3" r="1.5" fill="white" stroke="#05B801" strokeWidth="1.2" />
        </svg>
      )
    case "info":
      return (
        <svg width="57" height="37" viewBox="0 0 57 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28.5" cy="18.5" rx="28.5" ry="17.5" fill="#F2F5F8" />
          <circle cx="28.5" cy="18.5" r="17.5" fill="white" stroke="#295BF9" strokeWidth="1.5" />
          <circle cx="28.5" cy="28" r="1" fill="#295BF9" />
          <rect x="26" y="15" width="5" height="10" rx="1" fill="#295BF9" fillOpacity="0.15" stroke="#295BF9" strokeWidth="1.5" />
          <rect x="26" y="10" width="5" height="5" rx="1" fill="#295BF9" fillOpacity="0.15" />
          <circle cx="47" cy="32" r="2.5" fill="white" stroke="#295BF9" strokeWidth="1.2" />
          <circle cx="7" cy="3" r="1.5" fill="white" stroke="#295BF9" strokeWidth="1.2" />
        </svg>
      )
    case "warning":
      return (
        <svg width="57" height="39" viewBox="0 0 57 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28.5" cy="20.5" rx="28.5" ry="17.5" fill="#F2F5F8" />
          <path d="M8 35L28.5 3L49 35H8Z" fill="white" stroke="#FC6340" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="28.5" cy="30" r="2" fill="#FC6340" />
          <rect x="26" y="15" width="5" height="10" rx="1" fill="#FC6340" fillOpacity="0.15" stroke="#FC6340" strokeWidth="1.5" />
          <rect x="26" y="10" width="5" height="5" rx="1" fill="#FC6340" fillOpacity="0.15" />
          <circle cx="47" cy="34" r="2.5" fill="white" stroke="#FC6340" strokeWidth="1.2" />
          <circle cx="5" cy="4" r="1.5" fill="white" stroke="#FC6340" strokeWidth="1.2" />
        </svg>
      )
  }
}

/* ─── Backward-compat alias ─── */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <AlertDialogIcon className={className} {...props} />
}

/* ─── Title ─── */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-[var(--cds-text-h5)] font-medium leading-[var(--cds-leading-h5)] text-[var(--cds-neutral-text-bold)]",
        className
      )}
      {...props}
    />
  )
}

/* ─── Description ─── */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-[var(--cds-text-b2)] leading-[var(--cds-leading-b2)] text-[var(--cds-neutral-text-default)]",
        className
      )}
      {...props}
    />
  )
}

/* ─── Footer ─── */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex items-center justify-center gap-2.5 border-t border-[var(--cds-neutral-border-low)] bg-white px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

/* ─── Action Button ─── */
const actionVariantStyles: Record<PopupAlertVariant, string> = {
  alert: "!bg-[var(--cds-error-surface-default)] !text-white hover:!bg-[var(--cds-error-surface-default)]/90 !border-transparent",
  success: "!bg-[var(--cds-success-surface-default)] !text-white hover:!bg-[var(--cds-success-surface-default)]/90 !border-transparent",
  info: "!bg-[var(--cds-primary-surface-bold)] !text-white hover:!bg-[var(--cds-primary-surface-bold)]/90 !border-transparent",
  warning: "!bg-[var(--cds-warning-surface-default)] !text-white hover:!bg-[var(--cds-warning-surface-default)]/90 !border-transparent",
}

function AlertDialogAction({
  className,
  alertVariant,
  children,
  ...props
}: Omit<AlertDialogPrimitive.Close.Props, "render"> & {
  alertVariant?: PopupAlertVariant
}) {
  const contextVariant = useAlertDialogVariant()
  const resolvedVariant = alertVariant || contextVariant

  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      render={
        <Button
          className={cn(
            "min-w-[117px] rounded-[var(--cds-radius-s)]",
            actionVariantStyles[resolvedVariant],
            className
          )}
        />
      }
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Close>
  )
}

/* ─── Cancel Button ─── */
function AlertDialogCancel({
  className,
  children,
  ...props
}: Omit<AlertDialogPrimitive.Close.Props, "render">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={
        <Button
          variant="outline"
          className={cn(
            "min-w-[117px] rounded-[var(--cds-radius-s)] border-[var(--cds-neutral-border-default)]",
            className
          )}
        />
      }
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Close>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}

export type { PopupAlertVariant }
