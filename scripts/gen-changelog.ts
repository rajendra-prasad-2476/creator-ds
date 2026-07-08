/**
 * Generates CHANGELOG.md from src/ds-changelog.ts (the single source of truth).
 * Run: npm run ds:changelog
 */
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { DS_VERSION, DS_CHANGELOG, type DSChangeType } from "../src/ds-changelog.ts"

const TYPE_LABEL: Record<DSChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
}
const ORDER: DSChangeType[] = ["added", "changed", "fixed"]

function render(): string {
  const lines: string[] = [
    "# Creator DS — Changelog",
    "",
    "> Generated from `src/ds-changelog.ts` — do not edit by hand. Run `npm run ds:changelog`.",
    "",
    `Current version: **v${DS_VERSION}**`,
    "",
  ]

  for (const entry of DS_CHANGELOG) {
    lines.push(`## v${entry.version} — ${entry.date}`, "")
    for (const type of ORDER) {
      const items = entry.changes.filter((c) => c.type === type)
      if (items.length === 0) continue
      lines.push(`### ${TYPE_LABEL[type]}`)
      for (const c of items) {
        const parity = c.parity ? ` _(ds-parity: ${c.parity})_` : ""
        lines.push(`- **${c.scope}** — ${c.summary}${parity}`)
      }
      lines.push("")
    }
  }

  return lines.join("\n").trimEnd() + "\n"
}

const outDir = dirname(fileURLToPath(import.meta.url))
const outFile = join(outDir, "..", "CHANGELOG.md")
writeFileSync(outFile, render(), "utf8")
console.log(`Wrote CHANGELOG.md (v${DS_VERSION}, ${DS_CHANGELOG.length} release(s))`)
