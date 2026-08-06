import * as React from "react"
import { Highlight, themes } from "prism-react-renderer"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

/** Dark, always-on code surface with copy-to-clipboard — used in the Components doc pages. */
export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={cn(
        "relative rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)] overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute top-[var(--cds-space-8)] right-[var(--cds-space-8)] z-10",
          "flex items-center justify-center size-7 rounded-[var(--cds-radius-s)]",
          "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
          "transition-colors"
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <Highlight code={code.trim()} language={language} theme={themes.nightOwl}>
        {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              preClassName,
              "m-0 overflow-x-auto p-[var(--cds-padding-card)] text-[length:var(--cds-text-p3)] leading-[var(--cds-leading-p3)]"
            )}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
