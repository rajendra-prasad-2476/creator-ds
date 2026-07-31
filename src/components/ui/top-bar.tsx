import * as React from "react"
import { cn } from "@/lib/utils"

/* ─── Creator Logo Icon ─── */
function CreatorLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="24"
      height="24"
      viewBox="0 0 24 23.0645"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4901 0C13.3014 0 14.0717 0.315028 14.6512 0.894531L18.244 4.50391C18.5169 4.77711 18.517 5.22395 18.244 5.49707L12.2166 11.5322L18.244 17.5674C18.517 17.8405 18.517 18.2874 18.244 18.5605L14.6346 22.1699C14.0634 22.7493 13.3017 23.0644 12.4822 23.0645C11.6627 23.0645 10.9006 22.7494 10.3211 22.1699L0.204896 12.0293C-0.0682986 11.7561 -0.0682986 11.3084 0.204896 11.0352L10.3299 0.894531C10.9094 0.31506 11.6705 3.48416e-05 12.4901 0ZM12.4901 1.40723C12.0513 1.40726 11.6371 1.58142 11.3309 1.8877L1.69513 11.5322L11.3231 21.1768C11.6294 21.483 12.0435 21.6572 12.4822 21.6572C12.9208 21.6571 13.3342 21.4828 13.6404 21.1768L16.7537 18.0635L10.7264 12.0293C10.4532 11.7561 10.4533 11.3084 10.7264 11.0352L16.7537 5L13.6492 1.8877C13.3429 1.57311 12.9288 1.40723 12.4901 1.40723ZM20.2303 6.72754C20.4206 6.72754 20.5949 6.80129 20.7274 6.93359L23.1121 9.32617C24.2959 10.51 24.2959 12.448 23.1121 13.6318L20.7274 16.0244C20.5949 16.1567 20.4206 16.2305 20.2303 16.2305C20.0402 16.2304 19.8665 16.1566 19.7342 16.0244L15.6942 11.9756C15.421 11.7024 15.421 11.2556 15.6942 10.9824L19.7342 6.93359C19.8665 6.80144 20.0484 6.72765 20.2303 6.72754ZM17.1844 11.4785L20.2303 14.5254L22.118 12.6377C22.7554 12.0003 22.7554 10.9578 22.118 10.3203L20.2303 8.43262L17.1844 11.4785Z"
        fill="white"
      />
    </svg>
  )
}

/* ─── Bento / Grid Icon ─── */
function BentoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.59961 12.7998C2.4796 12.7998 3.2002 13.5204 3.2002 14.4004C3.19998 15.2802 2.47946 16 1.59961 16C0.719924 15.9998 0.000219964 15.2801 0 14.4004C0 13.5205 0.719789 12.8 1.59961 12.7998ZM8 12.7998C8.87989 12.7999 9.59961 13.5205 9.59961 14.4004C9.59939 15.2801 8.87975 15.9999 8 16C7.12015 16 6.39963 15.2802 6.39941 14.4004C6.39941 13.5204 7.12001 12.7998 8 12.7998ZM14.3994 12.7998C15.2794 12.7998 16 13.5204 16 14.4004C15.9998 15.2802 15.2793 16 14.3994 16C13.5198 15.9998 12.8 15.2801 12.7998 14.4004C12.7998 13.5205 13.5196 12.8 14.3994 12.7998ZM1.59961 6.40039C2.47959 6.40039 3.20018 7.12001 3.2002 8C3.2002 8.88 2.4796 9.59961 1.59961 9.59961C0.719789 9.59941 0 8.87988 0 8C1.32626e-05 7.12013 0.719797 6.40059 1.59961 6.40039ZM8 6.40039C8.87988 6.40051 9.5996 7.12008 9.59961 8C9.59961 8.87993 8.87989 9.59949 8 9.59961C7.12001 9.59961 6.39941 8.88 6.39941 8C6.39943 7.12001 7.12002 6.40039 8 6.40039ZM14.3994 6.40039C15.2794 6.40039 16 7.12001 16 8C16 8.88 15.2794 9.59961 14.3994 9.59961C13.5196 9.59938 12.7998 8.87986 12.7998 8C12.7998 7.12015 13.5196 6.40062 14.3994 6.40039ZM1.59961 0C2.47947 0 3.19998 0.719787 3.2002 1.59961C3.2002 2.47961 2.4796 3.2002 1.59961 3.2002C0.719789 3.2 0 2.47949 0 1.59961C0.00021301 0.719909 0.719919 0.000199912 1.59961 0ZM8 0C8.88341 0.000117846 9.5994 0.716206 9.59961 1.59961C9.59961 2.48319 8.88354 3.20008 8 3.2002C7.11636 3.2002 6.39941 2.48327 6.39941 1.59961C6.39963 0.716133 7.11649 0 8 0ZM14.3994 0C15.2793 0 15.9998 0.719787 16 1.59961C16 2.47961 15.2794 3.2002 14.3994 3.2002C13.5196 3.19997 12.7998 2.47947 12.7998 1.59961C12.8 0.719926 13.5197 0.000227612 14.3994 0Z"
        fill="white"
      />
    </svg>
  )
}

/* ─── Chevron Down Icon ─── */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      width="14"
      height="14"
      viewBox="0 0 9.625 5.572"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.158751 0.138291C0.362152 -0.05381 0.682769 -0.0446495 0.87487 0.158751L4.8125 4.32801L8.75013 0.158751C8.94223 -0.0446495 9.26285 -0.05381 9.46625 0.138291C9.66965 0.330391 9.67881 0.651008 9.48671 0.854409L5.18079 5.41362C5.08509 5.51495 4.95187 5.57237 4.8125 5.57237C4.67313 5.57237 4.53991 5.51495 4.44421 5.41362L0.138291 0.854409C-0.05381 0.651008 -0.0446495 0.330391 0.158751 0.138291Z"
        fill="white"
      />
    </svg>
  )
}

/* ─── User Avatar ─── */
function TopBarAvatar({ initials = "RJ", className }: { initials?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white text-xs font-medium select-none",
        className
      )}
    >
      {initials}
    </div>
  )
}

/* ─── Default Creator logo slot ─── */
function DefaultLogoSlot() {
  return (
    <div className="flex items-center gap-2">
      <CreatorLogoIcon />
      <span
        className="text-white text-[18px] font-normal leading-5 whitespace-nowrap"
        style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
      >
        Creator
      </span>
    </div>
  )
}

/* ─── TopBar ─── */
export interface TopBarProps {
  /**
   * Custom logo / brand slot rendered on the left.
   * Defaults to the Creator logo + "Creator" wordmark.
   * Pass any ReactNode — an <img>, an SVG, or a composed element.
   *
   * @example
   * // Replace with your product logo
   * <TopBar logo={<img src="/crm-logo.svg" height={24} alt="Zoho CRM" />} />
   *
   * // Logo + product name
   * <TopBar logo={<><MyLogo /><span className="text-white text-lg">CRM</span></>} />
   */
  logo?: React.ReactNode
  /** When set, replaces the workspace selector with documentation context info */
  docTitle?: string
  docVersion?: string
  docType?: string
  workspaceName?: string
  userInitials?: string
  className?: string
}

export function TopBar({
  logo,
  docTitle,
  docVersion = "v1.0",
  docType = "HTML",
  workspaceName = "All Organizations",
  userInitials = "RJ",
  className,
}: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "sticky top-0 z-50 flex h-12 w-full items-center justify-between px-4",
        "bg-[var(--cds-primary-surface-bold)]",
        className
      )}
    >
      {/* Left: Logo — custom or Creator default */}
      {logo ?? <DefaultLogoSlot />}

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {docTitle ? (
          /* Documentation context info */
          <div className="flex items-center gap-2">
            <span
              className="text-white text-[14px] leading-[18px] whitespace-nowrap"
              style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
            >
              {docTitle}
            </span>
            <span
              className="text-[11px] font-medium leading-[14px] whitespace-nowrap px-[6px] py-[2px] rounded-[4px]"
              style={{
                backgroundColor: "rgba(192, 209, 252, 0.15)",
                color: "#C0D1FC",
                fontFamily: "'Zoho Puvi', sans-serif",
              }}
            >
              {docVersion}
            </span>
            <span
              className="text-[11px] font-medium leading-[14px] whitespace-nowrap px-[6px] py-[2px] rounded-[4px]"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Zoho Puvi', sans-serif",
              }}
            >
              {docType}
            </span>
          </div>
        ) : (
          /* Workspace Selector */
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-[4px] px-2 py-[9px] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ backgroundColor: "#1e2e59" }}
          >
            <span
              className="text-white text-[14px] leading-[18px] whitespace-nowrap"
              style={{ fontFamily: "'Zoho Puvi', sans-serif" }}
            >
              {workspaceName}
            </span>
            <ChevronDownIcon />
          </button>
        )}

        {/* Separator */}
        <div
          className="h-[18px] w-px shrink-0"
          style={{ backgroundColor: "rgba(192, 209, 252, 0.3)" }}
        />

        {/* Avatar */}
        <TopBarAvatar initials={userInitials} />

        {/* Bento / App Switcher */}
        <button
          type="button"
          className="flex items-center justify-center rounded-[4px] p-2 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ backgroundColor: "var(--cds-primary-surface-bold, #041644)" }}
        >
          <BentoIcon />
        </button>
      </div>
    </header>
  )
}
