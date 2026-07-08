"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BreadcrumbDropdownOption {
  label: string
  selected?: boolean
  href?: string
  onClick?: () => void
}

export interface BreadcrumbDropdownGroup {
  groupLabel?: string
  options: BreadcrumbDropdownOption[]
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-[6px]",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  href,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      data-slot="breadcrumb-link"
      className={cn(
        "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal text-[#696c74] hover:text-[#37383c] transition-colors cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal text-[#000000]",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal text-[#696c74] select-none",
        className
      )}
      {...props}
    >
      {children ?? "/"}
    </li>
  )
}

// ─── Dropdown Item ────────────────────────────────────────────────────────────

interface BreadcrumbDropdownItemProps {
  label: string
  /** Simple flat list of options (use either `options` or `groups`, not both) */
  options?: BreadcrumbDropdownOption[]
  /** Grouped options (use either `options` or `groups`, not both) */
  groups?: BreadcrumbDropdownGroup[]
  className?: string
}

function BreadcrumbDropdownItem({
  label,
  options,
  groups,
  className,
}: BreadcrumbDropdownItemProps) {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Position the dropdown portal relative to the trigger
  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      zIndex: 9999,
    })
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const handleToggle = () => {
    updatePosition()
    setOpen((v) => !v)
  }

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-[6px] font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal text-[#37383c] hover:text-[#000000] transition-colors focus:outline-none"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "w-[14px] h-[14px] transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown overlay via portal */}
      {open && createPortal(
        <div
          role="listbox"
          style={dropdownStyle}
          className="min-w-[140px] w-max rounded-[var(--cds-radius-r,6px)] bg-white border border-[#d5d6d9] shadow-[0px_12px_16px_0px_rgba(38,40,43,0.08),0px_2px_2px_0px_rgba(5,5,6,0.05)]"
        >
          {/* Simple list */}
          {options && !groups && (
            <div className="p-[10px] flex flex-col gap-[1px]">
              {options.map((opt, i) => (
                <DropdownListItem key={i} option={opt} onSelect={() => setOpen(false)} />
              ))}
            </div>
          )}

          {/* Grouped list */}
          {groups && (
            <div className="py-[10px] flex flex-col">
              {groups.map((group, gi) => (
                <div key={gi}>
                  {group.groupLabel && (
                    <div className="px-[10px] py-[4px]">
                      <span className="font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal text-[#9ea0a7]">
                        {group.groupLabel}
                      </span>
                    </div>
                  )}
                  <div className="px-[10px] pb-[10px] flex flex-col gap-[1px]">
                    {group.options.map((opt, oi) => (
                      <DropdownListItem key={oi} option={opt} onSelect={() => setOpen(false)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── Internal dropdown list item ──────────────────────────────────────────────

function DropdownListItem({
  option,
  onSelect,
}: {
  option: BreadcrumbDropdownOption
  onSelect: () => void
}) {
  return (
    <div
      role="option"
      aria-selected={option.selected}
      onClick={() => {
        option.onClick?.()
        onSelect()
      }}
      className={cn(
        "flex items-center justify-between gap-[10px] px-[10px] py-[9px] rounded-[var(--cds-radius-r,6px)] cursor-pointer",
        option.selected
          ? "bg-[#f7f9fd]"
          : "bg-white hover:bg-[#f7f9fd]"
      )}
    >
      <span
        className={cn(
          "font-['Zoho_Puvi'] text-[14px] leading-[18px] font-normal whitespace-nowrap",
          option.selected ? "text-[#000000]" : "text-[#696c74]"
        )}
      >
        {option.label}
      </span>
      {option.selected && (
        <Check className="w-[14px] h-[14px] text-[#696c74] shrink-0" />
      )}
    </div>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbDropdownItem,
}
