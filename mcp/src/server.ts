/**
 * server.ts — Creator DS MCP Server
 *
 * Exposes 7 tools that AI agents (Copilot, Cursor, Claude, Codex, Windsurf) can call at
 * code-generation time so they always produce DS-compliant screens:
 *
 *   list_components           → all 42 DS components with import paths + categories
 *   get_component             → full usage info for one component
 *   find_tokens               → search --cds-* design tokens by keyword / group
 *   list_templates            → all 6 page templates with use-cases
 *   creator_coding_guidelines → full AGENTS.md hard rules as structured text
 *   list_screens              → all registered feature screens with source paths
 *   validate_component_usage  → static lint of a code snippet against DS rules
 *
 * Supported AI tools:
 *   GitHub Copilot (VS Code) · Claude (Anthropic) · Cursor · OpenAI Codex · Windsurf
 *
 * Run:   npx tsx mcp/src/server.ts
 * Build: cd mcp && npm run build && node dist/server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

import {
  listComponents,
  getComponent,
  listTemplates,
  getTemplate,
  listScreens,
} from "./creator-ds.js"
import { findTokens, listTokenGroups, TOKENS } from "./tokens.js"

// ─── Server init ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "Creator DS",
  version: "0.2.0",
})

// ─── Tool: list_components ────────────────────────────────────────────────────

server.registerTool(
  "list_components",
  {
    description:
      "List all available components in the Creator Design System. " +
      "Returns name, import path, category (Atom/Molecule/Organism), and primary use-case. " +
      "ALWAYS call this before generating any screen to know which components exist.",
    annotations: { readOnlyHint: true },
  },
  async () => {
    const components = listComponents()
    const atoms = components.filter(c => c.category === "Atom")
    const molecules = components.filter(c => c.category === "Molecule")
    const organisms = components.filter(c => c.category === "Organism")

    const format = (c: ReturnType<typeof listComponents>[0]) =>
      `- **${c.name}** (${c.importPath}) — ${c.useFor}`

    return {
      content: [
        {
          type: "text",
          text: `# Creator DS Components (${components.length} total)

Import path base: \`@/components/ui/<component-name>\`

## Atoms (${atoms.length})
${atoms.map(format).join("\n")}

## Molecules (${molecules.length})
${molecules.map(format).join("\n")}

## Organisms (${organisms.length})
${organisms.map(format).join("\n")}

Use \`get_component\` to get props, variants, and usage rules for any specific component.`,
        },
      ],
    }
  }
)

// ─── Tool: get_component ─────────────────────────────────────────────────────

server.registerTool(
  "get_component",
  {
    description:
      "Get complete usage details for a specific Creator DS component: " +
      "props, variants, sizes, anti-patterns, and import path. " +
      "Use this before using any component to ensure correct API usage.",
    inputSchema: {
      name: z.string().describe("Component name, e.g. 'Button', 'Dialog', 'Toggle'"),
    },
    annotations: { readOnlyHint: true },
  },
  async ({ name }) => {
    const component = getComponent(name)
    if (!component) {
      const all = listComponents().map(c => c.name).join(", ")
      return {
        content: [
          {
            type: "text",
            text: `No Creator DS component named \`${name}\` found.\n\nAvailable components: ${all}\n\nUse \`list_components\` to browse all components.`,
          },
        ],
      }
    }

    const lines: string[] = [
      `# ${component.name}`,
      ``,
      `**Category:** ${component.category}`,
      `**Import:** \`import { ${component.name} } from "${component.importPath}"\``,
      `**File:** src/components/ui/${component.file}`,
      ``,
      `## Use for`,
      component.useFor,
    ]

    if (component.neverUse) {
      lines.push(``, `## ❌ Never use this instead of`, component.neverUse)
    }
    if (component.variants?.length) {
      lines.push(``, `## Variants`, component.variants.map(v => `- ${v}`).join("\n"))
    }
    if (component.sizes?.length) {
      lines.push(``, `## Sizes`, component.sizes.map(s => `- ${s}`).join("\n"))
    }
    if (component.props?.length) {
      lines.push(``, `## Key props`, component.props.map(p => `- \`${p}\``).join("\n"))
    }
    if (component.notes) {
      lines.push(``, `## Notes`, component.notes)
    }

    lines.push(
      ``,
      `## Design token usage`,
      `Always use \`--cds-*\` CSS custom properties for all colors, spacing, and radius.`,
      `Never hardcode hex values. Use \`find_tokens\` to look up the right token.`
    )

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    }
  }
)

// ─── Tool: find_tokens ────────────────────────────────────────────────────────

server.registerTool(
  "find_tokens",
  {
    description:
      "Search Creator DS design tokens (--cds-* CSS custom properties) by keyword, group, or value. " +
      "Examples: 'primary blue', 'error red', 'border', 'spacing 16', 'radius', 'shadow'. " +
      "Always use tokens — never hardcode hex, rgb(), or pixel values for colors/spacing/radius.",
    inputSchema: {
      query: z
        .string()
        .describe(
          "Search term — color name, semantic intent (primary/success/error/warning), property type (border/surface/text), or size"
        ),
      group: z
        .string()
        .optional()
        .describe(
          `Filter by group. Available groups: ${listTokenGroups().join(", ")}`
        ),
    },
    annotations: { readOnlyHint: true },
  },
  async ({ query, group }) => {
    let results = findTokens(query)
    if (group) {
      results = results.filter(t => t.group === group)
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No tokens found for query "${query}"${group ? ` in group "${group}"` : ""}.\n\nAvailable groups: ${listTokenGroups().join(", ")}\n\nTotal tokens available: ${TOKENS.length}`,
          },
        ],
      }
    }

    const byGroup = results.reduce<Record<string, typeof results>>((acc, t) => {
      ;(acc[t.group] ??= []).push(t)
      return acc
    }, {})

    const text = Object.entries(byGroup)
      .map(([grp, tokens]) => {
        const rows = tokens.map(t => `  \`${t.name}\` → \`${t.value}\` — ${t.description}`).join("\n")
        return `### ${grp}\n${rows}`
      })
      .join("\n\n")

    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} token(s) for "${query}":\n\n${text}\n\n> Usage: \`color: var(${results[0].name})\``,
        },
      ],
    }
  }
)

// ─── Tool: list_templates ──────────────────────────────────────────────────────

server.registerTool(
  "list_templates",
  {
    description:
      "List all 6 Creator DS page templates. " +
      "ALWAYS check templates before composing a screen from scratch — " +
      "if a template covers the layout, import and use it instead of building from raw components.",
    annotations: { readOnlyHint: true },
  },
  async () => {
    const templates = listTemplates()
    const lines = templates.map(t =>
      `## ${t.name}\n- **Import:** \`import ${t.name} from "${t.importPath}"\`\n- **Pattern:** ${t.pattern}\n- **Use when:** ${t.useWhen}${t.props ? `\n- **Props:** ${t.props.map(p => `\`${p}\``).join(", ")}` : ""}`
    )

    return {
      content: [
        {
          type: "text",
          text: `# Creator DS Page Templates (${templates.length})\n\nDo NOT copy-paste template bodies — import and extend via props.\n\n${lines.join("\n\n")}`,
        },
      ],
    }
  }
)

// ─── Tool: creator_coding_guidelines ──────────────────────────────────────────

server.registerTool(
  "creator_coding_guidelines",
  {
    description:
      "Get the full Creator DS coding rules (from AGENTS.md). " +
      "These are hard constraints — any violation must be rejected. " +
      "Call this at the start of any screen generation task.",
    annotations: { readOnlyHint: true },
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: `# Creator DS — Non-Negotiable Coding Rules

## 1. Component source
- **ONLY** use components from \`src/components/ui/\`. Import path: \`@/components/ui/<component-name>\`.
- Never compose raw \`<div>\`, \`<button>\`, \`<input>\`, or \`<span>\` when a DS component exists.

## 2. Font
- The **only** permitted font is \`'Zoho Puvi'\`.
- Never use Inter, Roboto, system-ui, or any other typeface.
- Font is set globally via \`--cds-font-family-default\`. Do NOT override on individual elements.

## 3. Colors — use tokens only
- Use \`--cds-*\` CSS custom properties for every color.
- ✅ \`color: var(--cds-primary-text-default)\`
- ❌ \`color: #0D4EF2\` or \`color: blue\`

## 4. Spacing & radius — use tokens only
- Use \`--cds-space-*\` and \`--cds-gap-*\` / \`--cds-padding-*\` for all spacing.
- Use \`--cds-radius-*\` for all border radii.
- Never write arbitrary pixel values inline.

## 5. Page structure — mandatory shell
Every full-page screen MUST use this shell:
\`\`\`tsx
<div className="flex flex-col h-screen">
  <TopBar />
  <div className="flex flex-1 overflow-hidden">
    <LeftNav />
    <main className="flex-1 overflow-y-auto p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">
      {/* page content */}
    </main>
  </div>
</div>
\`\`\`
Never skip TopBar or LeftNav. Never put navigation inside <main>.

## 6. Navigation between screens
Use \`useNavigation()\` from \`@/screens/navigation\` for ALL navigation.
Never use href, window.location, or console.log for navigation.
\`\`\`tsx
const { navigate, goBack, canGoBack, params } = useNavigation()
navigate("target-screen-id", { optionalParams })
\`\`\`

## 7. Key component rules (common anti-patterns)
| Intent | Use | Never use |
|--------|-----|-----------|
| Destructive confirmation | \`AlertDialog\` | \`Dialog\`, \`window.confirm()\` |
| Semantic on/off with colour | \`Toggle\` | custom switch or \`Switch\` |
| Plain binary on/off | \`Switch\` | \`Toggle\`, custom \`<div>\` |
| Form field | \`Label\` + \`Input\` | raw \`<input>\` |
| Trailing action on input | \`InputSuffix\` | raw wrapper + button |
| Leading context on input | \`InputPrefix\` | raw \`<span>\` + input |
| Both sides | \`InputAffixed\` | two spans flanking input |
| Slide-in panel | \`Sheet\` | \`Dialog\` |
| Status pill | \`StatusBadge\` | hand-composed Badge+icon |
| Toast message | \`Sonner\` | raw div alert banner |
| Multi-tag input | \`TagInput\` | raw input + chip divs |
| Scrim/overlay | \`Blanket\` | custom scrim div |
| Chip/pill label | \`Tag\` | styled span/div |
| Card-style radio | \`RadioCard\` in \`RadioGroup\` | custom card div |
| View toggle (same data) | \`ContentSwitcher\` | \`Tabs\` |
| Section navigation | \`Tabs\` | \`ContentSwitcher\` |

## 8. Badge variant rule
Only \`"prominent"\` and \`"subtle"\` are valid Badge variants. Never use secondary/outline/default.

## 9. Tailwind color classes — FORBIDDEN
Never use \`text-blue-500\`, \`bg-red-100\`, etc.
All colour must come from \`--cds-*\` tokens via \`var()\`.

## 10. Missing components — use placeholder comment
These are not built yet. Add a TODO comment, do NOT stub with custom code:
Spinner, Skeleton, EmptyState, InlineAlert, FormField, Pagination,
StatCard, DatePicker, Accordion, FileUpload, Stepper, CommandPalette
Comment format: \`{/* TODO: replace with <ComponentName /> once built — ds-parity P1 */}\``,
        },
      ],
    }
  }
)

// ─── Tool: list_screens ────────────────────────────────────────────────────────

server.registerTool(
  "list_screens",
  {
    description:
      "List all screens registered in the Creator DS feature registry. " +
      "Use screen IDs when calling navigate() between screens. " +
      "Use source paths to understand existing implementations before generating new screens.",
    annotations: { readOnlyHint: true },
  },
  async () => {
    const screens = listScreens()

    const byFeature = screens.reduce<Record<string, typeof screens>>((acc, s) => {
      const key = `Feature ${s.featureId} — ${s.featureName}`
      ;(acc[key] ??= []).push(s)
      return acc
    }, {})

    const text = Object.entries(byFeature)
      .map(([feature, ss]) => {
        const rows = ss
          .map(s => `  - **${s.screenName}** (id: \`"${s.screenId}"\`) → ${s.sourcePath}`)
          .join("\n")
        return `### ${feature}\n${rows}`
      })
      .join("\n\n")

    return {
      content: [
        {
          type: "text",
          text: `# Creator DS Registered Screens (${screens.length} total)\n\nUse these screen IDs in \`navigate("screen-id")\` calls.\n\n${text}\n\n> New screens go in \`src/screens/<feature-slug>/<ScreenName>.tsx\` and MUST be added to \`src/screens/feature-registry.tsx\`.`,
        },
      ],
    }
  }
)

// ─── Tool: validate_component_usage ───────────────────────────────────────────

server.registerTool(
  "validate_component_usage",
  {
    description:
      "Lint a TSX code snippet against Creator DS rules. " +
      "Detects hardcoded colors, wrong fonts, raw HTML elements, forbidden Tailwind utilities, " +
      "and missing DS components. Returns a list of violations with fix suggestions.",
    inputSchema: {
      code: z.string().describe("TSX/TSX code snippet to validate"),
    },
    annotations: { readOnlyHint: true },
  },
  async ({ code }) => {
    const violations: Array<{ line: number; issue: string; fix: string }> = []

    const lines = code.split("\n")
    lines.forEach((line, idx) => {
      const n = idx + 1

      // 1. Hardcoded hex colors
      const hexMatches = line.match(/#[0-9a-fA-F]{3,8}\b/g)
      if (hexMatches) {
        hexMatches.forEach(hex => {
          violations.push({
            line: n,
            issue: `Hardcoded color: \`${hex}\``,
            fix: `Replace with a \`--cds-*\` token. Use \`find_tokens\` to find the matching token.`,
          })
        })
      }

      // 2. Hardcoded rgba/rgb (not inside var())
      if (/rgba?\((?![^)]*var\()/.test(line)) {
        violations.push({
          line: n,
          issue: "Hardcoded rgba()/rgb() color value",
          fix: "Replace with a --cds-* token. For overlays use var(--cds-blanket-overlay).",
        })
      }

      // 3. Wrong font family
      if (/font-family\s*:\s*(?!['"]?Zoho Puvi)/i.test(line) &&
          /font-family/i.test(line) &&
          !/--cds-font-family/.test(line)) {
        violations.push({
          line: n,
          issue: "Non-Zoho-Puvi font-family declaration",
          fix: "Remove override. Font is set globally via --cds-font-family-default.",
        })
      }

      // 4. Forbidden Tailwind color utilities
      const twColors = line.match(/(?:text|bg|border|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}/g)
      if (twColors) {
        twColors.forEach(cls => {
          violations.push({
            line: n,
            issue: `Forbidden Tailwind color utility: \`.${cls}\``,
            fix: "Use a --cds-* token with var() instead of Tailwind color utilities.",
          })
        })
      }

      // 5. Raw <button> or <input> or <textarea> (not in imports/comments)
      if (!line.trim().startsWith("//") && !line.trim().startsWith("*") && !line.includes("import")) {
        if (/<button\b(?![^>]*Button)/i.test(line)) {
          violations.push({ line: n, issue: "Raw <button> element", fix: "Use <Button> from @/components/ui/button" })
        }
        if (/<input\b(?![^>]*Input|otp)/i.test(line) && !/<InputSuffix|InputPrefix|InputAffixed|InputOTP/.test(line)) {
          violations.push({ line: n, issue: "Raw <input> element", fix: "Use <Input>, <InputSuffix>, <InputPrefix>, or <InputAffixed> from @/components/ui/" })
        }
        if (/<textarea\b/i.test(line)) {
          violations.push({ line: n, issue: "Raw <textarea> element", fix: "Use <Textarea> from @/components/ui/textarea" })
        }
        if (/<select\b/i.test(line)) {
          violations.push({ line: n, issue: "Raw <select> element", fix: "Use <Select> from @/components/ui/select" })
        }
      }

      // 6. console.log in screen files
      if (/console\.log\(/.test(line)) {
        violations.push({
          line: n,
          issue: "console.log in production screen",
          fix: "Remove all console.log() calls from screen files.",
        })
      }

      // 7. href="#" placeholder nav
      if (/href=["']#["']/.test(line)) {
        violations.push({
          line: n,
          issue: 'href="#" placeholder navigation',
          fix: "Use navigate() from useNavigation() for all screen navigation.",
        })
      }

      // 8. window.location navigation
      if (/window\.location/.test(line)) {
        violations.push({
          line: n,
          issue: "window.location navigation",
          fix: "Use navigate() from useNavigation() for all screen navigation.",
        })
      }
    })

    if (violations.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "✅ No Creator DS violations found. Code follows DS rules.",
          },
        ],
      }
    }

    const report = violations
      .map(v => `**Line ${v.line}:** ${v.issue}\n  → Fix: ${v.fix}`)
      .join("\n\n")

    return {
      content: [
        {
          type: "text",
          text: `❌ Found ${violations.length} Creator DS violation(s):\n\n${report}\n\n> Run \`creator_coding_guidelines\` for the full rule set.`,
        },
      ],
    }
  }
)

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  process.stderr.write("Creator DS MCP server running on stdio\n")
}

main().catch(err => {
  process.stderr.write(`Fatal: ${err}\n`)
  process.exit(1)
})
