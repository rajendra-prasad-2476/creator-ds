## Package Installation

**CRITICAL**: You MUST explicitly install every package listed below as a direct dependency, exactly as written.

Rules:
- Even if a package is already available as a transitive dependency (i.e., installed by another package), you MUST still add it as a direct dependency. Transitive availability does NOT count as installed.
- Use the **exact** package name shown. Packages with similar names are **different packages** and are NOT interchangeable. Never substitute one for another.
- This applies to your `import` statements too: import from these exact package names.
- Do not skip any package. Do not reorder, rename, or omit any entry.

Add the following to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@creator-kit/creator-ds-react": "1.1.0"
  }
}
```

## Step 1 — Import styles once at the app root

```tsx
import "@creator-kit/creator-ds-react/styles"
```

This single import provides:
- All `--cds-*` CSS custom property tokens (colors, spacing, radius, shadows, typography)
- Zoho Puvi font-face declarations (all weights 100–950)
- Tailwind CSS base layer resets

**Place this in your top-level `App.tsx` or `main.tsx`. Never import it inside individual components.**

## Step 2 — Importing components

```tsx
import { Button, Input, Card, Select, Toggle, Badge } from "@creator-kit/creator-ds-react"
```

All 42 DS components are named exports from the package root. See `guidelines/components.md` for the full list.

## Step 3 — Required page shell

Every full-page screen MUST wrap content in this shell. Never skip `TopBar` or `LeftNav`.

```tsx
import { TopBar, LeftNav } from "@creator-kit/creator-ds-react"

export default function MyScreen() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto p-[var(--cds-padding-section-v)]_[var(--cds-padding-section-h)]">
          {/* page content here */}
        </main>
      </div>
    </div>
  )
}
```

Rules:
- `TopBar` is always at the top — never omit it
- `LeftNav` is always on the left — never omit it
- Page content always goes inside `<main>`
- Never put navigation inside `<main>`

## Step 4 — TypeScript support
The package ships with full `.d.ts` declarations (35KB). All props are typed.
