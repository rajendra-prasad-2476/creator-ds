/**
 * vite.lib.config.ts
 *
 * Separate Vite config for building Creator DS as an npm library.
 * Run:  npm run build:lib
 *
 * Output:
 *   dist/index.js        — ESM bundle (for Figma Make + modern bundlers)
 *   dist/index.cjs       — CommonJS bundle (legacy compatibility)
 *   dist/index.d.ts      — TypeScript declarations (via vite-plugin-dts)
 *   dist/styles.css      — All CDS tokens + Tailwind styles (import separately)
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"
import path from "path"

// External packages — consumers must have these as their own dependencies.
// Figma Make pre-bundles react/react-dom, so we mark them external.
// Also externalise every package that ships a CJS main + ESM .mjs exports;
// bundling them would cause Rollup to emit `dynamic require("react")` which
// is illegal in an ES-module output and breaks Figma Make's Vite host.
const external = [
  // ── React (always external — Figma Make pre-bundles these) ──────────────
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",

  // ── Base UI (CJS package.json type but ships .mjs per sub-path) ─────────
  /^@base-ui\/react(\/.*)?$/,

  // ── Primitive libraries that internally `require('react')` ──────────────
  "sonner",
  "next-themes",
  "input-otp",

  // ── Utility / styling libs consumers are expected to have ────────────────
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "lucide-react",
]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Generate TypeScript declarations into dist/
    dts({
      include: ["src/index.ts", "src/components/ui/**/*.tsx", "src/lib/**/*.ts"],
      outDir: "dist",
      tsconfigPath: "./tsconfig.lib.json",
      rollupTypes: true,        // bundle all .d.ts into a single dist/index.d.ts
      insertTypesEntry: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prefer the ESM (.mjs) entry of dual-format packages (e.g. @base-ui/react).
    // This prevents Rollup from picking the CJS entry and emitting
    // `dynamic require("react")` into the ES-module output.
    conditions: ["import", "module", "browser", "default"],
  },

  build: {
    // Output into dist/ directory
    outDir: "dist",
    // Don't clear the whole dist/ on every build — let each entry manage itself
    emptyOutDir: true,

    // Library mode — Vite bundles src/index.ts as an importable library
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "CreatorDS",               // UMD global name (for CDN usage)
      formats: ["es", "cjs"],          // ESM + CJS
      fileName: (format) =>
        format === "es" ? "index.js" : "index.cjs",
    },

    rollupOptions: {
      external,
      output: {
        // Keep each component in its own chunk when tree-shaking
        preserveModules: false,
        // Named exports only — no default export at bundle level
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
      },
    },

    // Generate sourcemaps for easier debugging inside Figma Make
    sourcemap: true,
    // Minify for production npm bundle — Vite 8 uses oxc, not esbuild
    minify: "oxc",

    // Target modern environments (Figma Make runs Chromium)
    target: "es2020",
  },
})
