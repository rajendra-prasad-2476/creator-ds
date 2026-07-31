"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Tag } from "@/components/ui/tag"

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled tag list */
  value?: string[]
  /** Initial tags (uncontrolled) */
  defaultValue?: string[]
  /** Fired whenever the tag list changes */
  onChange?: (tags: string[]) => void
  /** Placeholder shown when no tags and input is empty */
  placeholder?: string
  disabled?: boolean
  /** Renders the field in error state (red border + bg) */
  error?: boolean
  /** id forwarded to the inner text input (for Label association) */
  id?: string
  /** Maximum number of tags. No limit by default. */
  maxTags?: number
}

/**
 * TagInput — a text field that lets users build a list of tags by typing and
 * pressing Enter (or comma). Existing tags render as dismissible Tag chips.
 *
 * Usage:
 * ```tsx
 * const [tags, setTags] = useState(["React", "TypeScript"])
 * <TagInput value={tags} onChange={setTags} placeholder="Add technology…" />
 * ```
 *
 * Keyboard shortcuts:
 * - Enter / , — confirm the typed value as a new tag
 * - Backspace on empty input — removes the last tag
 */
const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onChange,
      placeholder = "Add tag…",
      disabled = false,
      error = false,
      id,
      className,
      maxTags,
      ...props
    },
    ref
  ) => {
    const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
    const [inputValue, setInputValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const tags = controlledValue ?? internalTags

    function updateTags(next: string[]) {
      setInternalTags(next)
      onChange?.(next)
    }

    function commitTag(raw: string) {
      const trimmed = raw.trim().replace(/,+$/, "")
      if (!trimmed) return
      if (tags.includes(trimmed)) { setInputValue(""); return }
      if (maxTags !== undefined && tags.length >= maxTags) return
      updateTags([...tags, trimmed])
      setInputValue("")
    }

    function removeTag(tag: string) {
      updateTags(tags.filter(t => t !== tag))
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        commitTag(inputValue)
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags[tags.length - 1])
      }
    }

    const atLimit = maxTags !== undefined && tags.length >= maxTags

    return (
      <div
        ref={ref}
        className={cn(
          // Container mirrors SelectTrigger / Input height & border tokens
          "flex min-h-[36px] w-full flex-wrap items-center gap-[6px]",
          "rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)]",
          "bg-[var(--cds-white)] px-[11px] py-[5px] cursor-text transition-colors",
          // Focus ring
          "focus-within:border-[var(--cds-primary-border-default)]",
          "focus-within:shadow-[var(--cds-shadow-primary-minimal)]",
          // Error
          error && "border-[var(--cds-error-border-default)] bg-[var(--cds-error-surface-subtle)]",
          // Disabled
          disabled && "opacity-50 cursor-not-allowed bg-[var(--cds-huegrey-surface-subtle-hover)]",
          className
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
        {...props}
      >
        {/* Existing tags */}
        {tags.map(tag => (
          <Tag
            key={tag}
            closeable
            onClose={() => removeTag(tag)}
            disabled={disabled}
          >
            {tag}
          </Tag>
        ))}

        {/* Text input — hidden once maxTags is reached */}
        {!atLimit && (
          <input
            ref={inputRef}
            id={id}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => commitTag(inputValue)}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-[80px] bg-transparent outline-none",
              "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)]",
              "text-[var(--cds-huegrey-text-dark)]",
              "placeholder:text-[var(--cds-huegrey-text-fairish)]",
              "disabled:cursor-not-allowed",
            )}
          />
        )}
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export { TagInput }
