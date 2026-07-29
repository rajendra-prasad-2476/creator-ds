import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon, Plus, Search, X } from "lucide-react"

/* ── Search context (used by SelectItem to filter itself) ────────────────── */
const SelectSearchContext = React.createContext<string>("")

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn(
        // First group sits flush; subsequent groups get 10 px top gap
        "[&:not(:first-child)]:mt-[10px]",
        className
      )}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

/* ── Trigger ─────────────────────────────────────────────────────────────── */
function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & { size?: "sm" | "default" }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        // Base — 36 px height, CDS radius-r, full width
        "flex h-[36px] w-full items-center justify-between gap-[8px]",
        "rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)]",
        "bg-white px-[11px] outline-none select-none transition-colors",
        // Typography — P2 Regular
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[var(--cds-huegrey-text-dark)]",
        // Placeholder text colour
        "data-placeholder:text-[var(--cds-huegrey-text-fairish)]",
        // Hover
        "hover:border-[var(--cds-primary-border-default)]",
        // Open (active) state — blue border + primary shadow
        "data-[popup-open]:border-[var(--cds-primary-border-default)]",
        "data-[popup-open]:shadow-[var(--cds-shadow-primary-minimal)]",
        // Focus ring
        "focus-visible:border-[var(--cds-primary-border-default)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--cds-primary-border-default)]/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
        // Error
        "aria-invalid:border-[var(--cds-error-border-default)]",
        "aria-invalid:bg-[var(--cds-error-surface-subtle)]",
        "aria-invalid:hover:border-[var(--cds-error-border-default)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="shrink-0 size-[14px] text-[var(--cds-huegrey-text-default)]" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

/* ── Dropdown popup ──────────────────────────────────────────────────────── */
function SelectContent({
  className,
  children,
  searchable = false,
  searchPlaceholder = "Search…",
  onCreate,
  createLabel = "Create",
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    searchable?: boolean
    searchPlaceholder?: string
    /** When provided, renders a Create footer button. Called with the current search query (or empty string). */
    onCreate?: (value: string) => void
    /** Label for the Create button. Defaults to "Create". */
    createLabel?: string
  }) {
  const [query, setQuery] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)

  // Focus the search input without triggering a page scroll
  React.useEffect(() => {
    if (searchable && searchRef.current) {
      searchRef.current.focus({ preventScroll: true })
    }
  }, [])

  // When the search input is focused, capture keydown events at the document
  // level so that any parent focus-trap (e.g. Sheet/Dialog) cannot swallow
  // printable characters before they reach this input.
  React.useEffect(() => {
    if (!searchable) return
    function handleCapture(e: KeyboardEvent) {
      if (
        document.activeElement === searchRef.current &&
        e.key !== "Escape" &&
        e.key !== "Tab"
      ) {
        e.stopImmediatePropagation()
      }
    }
    document.addEventListener("keydown", handleCapture, { capture: true })
    return () => {
      document.removeEventListener("keydown", handleCapture, { capture: true })
    }
  }, [searchable])

  return (
    <SelectSearchContext.Provider value={query}>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          alignItemWithTrigger={alignItemWithTrigger}
          className="isolate z-50"
        >
          <SelectPrimitive.Popup
            data-slot="select-content"
            className={cn(
              // Base
              "relative isolate z-50 flex flex-col",
              "w-(--anchor-width) min-w-36 max-h-(--available-height)",
              "rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-minimal)]",
              "bg-white shadow-[var(--cds-shadow-base)]",
              "origin-(--transform-origin)",
              // Animation
              "duration-100",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "data-[align-trigger=true]:animate-none",
              className
            )}
            data-align-trigger={alignItemWithTrigger}
            {...props}
          >
            {/* Search input */}
            {searchable && (
              <div className="px-[10px] pt-[10px] pb-[6px]">
                <div className="relative flex items-center">
                  <Search className="absolute left-[8px] size-[14px] shrink-0 text-[var(--cds-huegrey-text-default)] pointer-events-none" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                      // Stop the Select from capturing keystrokes for typeahead/navigation
                      // (only allow Escape to bubble so the popup can close)
                      if (e.key !== "Escape") {
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                      }
                    }}
                    onKeyDownCapture={e => {
                      // Capture phase: prevent the Select / Dialog focus-trap from
                      // swallowing printable characters before they reach this input
                      if (e.key !== "Escape" && e.key !== "Tab") {
                        e.stopPropagation()
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "h-[30px] w-full rounded-[var(--cds-radius-s)] border border-[var(--cds-huegrey-border-fairish)]",
                      "bg-white pl-[28px] pr-[28px] outline-none",
                      "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] text-[var(--cds-huegrey-text-dark)]",
                      "placeholder:text-[var(--cds-huegrey-text-fairish)]",
                      "focus:border-[var(--cds-primary-border-default)]",
                    )}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-[8px] text-[var(--cds-huegrey-text-default)] hover:text-[var(--cds-huegrey-text-dark)]"
                    >
                      <X className="size-[12px]" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable list */}
            <div className="overflow-y-auto p-[10px] flex flex-col gap-px">
              <SelectScrollUpButton />
              <SelectPrimitive.List>{children}</SelectPrimitive.List>
              <SelectScrollDownButton />
            </div>

            {/* Create footer — Dropdown_Bottom_Link from Figma */}
            {onCreate && (
              <div className="border-t border-[var(--cds-huegrey-border-minimal)]">
                <button
                  type="button"
                  onMouseDown={e => {
                    // Prevent blur on search input before firing onClick
                    e.preventDefault()
                  }}
                  onClick={() => {
                    onCreate(query)
                    setQuery("")
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-[6px] px-[10px] py-[9px]",
                    "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
                    "text-[var(--cds-primary-text-default)] hover:bg-[var(--cds-secondary-surface-subtle-hover)]",
                    "rounded-b-[var(--cds-radius-r)] outline-none focus-visible:bg-[var(--cds-secondary-surface-subtle-hover)]",
                  )}
                >
                  <Plus className="size-[14px] shrink-0" />
                  <span>{createLabel}</span>
                  {query && (
                    <span className="truncate max-w-[140px]">&#8220;{query}&#8221;</span>
                  )}
                </button>
              </div>
            )}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectSearchContext.Provider>
  )
}

/* ── Group label (Optgroup head) ───────────────────────────────────────────── */
function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        // Matches Figma OptgroupHead: 18 px tall, P2 Regular, muted fairish grey
        "flex h-[18px] items-center px-[10px]",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal",
        "text-[var(--cds-huegrey-text-fairish)]",
        className
      )}
      {...props}
    />
  )
}

/* ── List item ───────────────────────────────────────────────────────────── */
function SelectItem({ className, children, value, ...props }: SelectPrimitive.Item.Props) {
  const query = React.useContext(SelectSearchContext)

  // Filter: if search is active, hide non-matching items
  if (query) {
    const itemText =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.filter(c => typeof c === "string").join("")
          : String(value ?? "")
    if (!itemText.toLowerCase().includes(query.toLowerCase())) return null
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={value}
      className={cn(
        // Base — matches List_Vertical_Core from Figma
        "relative flex w-full cursor-default items-center gap-[8px]",
        "rounded-[var(--cds-radius-r)] px-[10px] py-[9px]",
        "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
        "text-[var(--cds-huegrey-text-dark)] select-none outline-none",
        // Hover / focus
        "focus:bg-[var(--cds-secondary-surface-subtle-hover)]",
        // Selected
        "data-selected:bg-[var(--cds-secondary-surface-subtle)]",
        // Disabled
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="flex size-[14px] shrink-0 items-center justify-center" />
        }
      >
        {/* Tick — 10 px to match Figma's Tick Small icon */}
        <svg
          className="size-[10px] text-[var(--cds-primary-surface-default)]"
          viewBox="0 0 10 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 4l3 3 5-6" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

/* ── Separator ───────────────────────────────────────────────────────────── */
function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-[10px] my-[6px] h-px bg-[var(--cds-huegrey-border-low)]",
        className
      )}
      {...props}
    />
  )
}

/* ── Scroll arrows ───────────────────────────────────────────────────────── */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "flex w-full cursor-default items-center justify-center bg-white py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-[14px] text-[var(--cds-huegrey-text-default)]" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "flex w-full cursor-default items-center justify-center bg-white py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-[14px] text-[var(--cds-huegrey-text-default)]" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
