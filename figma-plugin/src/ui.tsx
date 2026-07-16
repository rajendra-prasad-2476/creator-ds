/**
 * ui.tsx — Plugin UI (runs in a browser iframe inside Figma)
 *
 * Flow:
 *  1. Receives the component registry from main.ts (name → key mapping)
 *  2. User pastes a React screen file (JSX/TSX)
 *  3. UI parses the JSX, resolves each component via COMPONENT_MAP + registry
 *  4. Sends a "place-components" message to main.ts
 *  5. Shows result feedback
 */

import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { parse } from "@babel/parser"
import type { Node, JSXOpeningElement, StringLiteral, JSXExpressionContainer } from "@babel/types"
import { COMPONENT_MAP } from "./component-map"
import type { ComponentEntry, PlaceNode, FigmaTreeNode, FigmaFrameNode, FigmaTextNode, FigmaInstanceNode } from "./main"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Registry {
  [figmaName: string]: { key: string; id: string }  // figmaName → { component key, node id }
}

interface ResolvedNode {
  reactName: string
  figmaName: string
  componentKey: string
  nodeId: string
  variantProps: Record<string, string>
}

interface ParseResult {
  resolved: ResolvedNode[]
  unresolved: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// JSX Parser
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Lightweight recursive AST walker (replaces @babel/traverse — browser-safe)
// ─────────────────────────────────────────────────────────────────────────────

function walkAST(node: Node | null | undefined, onJSXOpen: (n: JSXOpeningElement) => void) {
  if (!node || typeof node !== "object") return
  if (node.type === "JSXOpeningElement") onJSXOpen(node as JSXOpeningElement)
  for (const val of Object.values(node as unknown as Record<string, unknown>)) {
    if (Array.isArray(val)) val.forEach(child => walkAST(child as Node, onJSXOpen))
    else if (val && typeof val === "object" && "type" in val) walkAST(val as Node, onJSXOpen)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// JSX Parser
// ─────────────────────────────────────────────────────────────────────────────

function parseJSX(code: string, registry: Registry): ParseResult {
  const resolved: ResolvedNode[] = []
  const unresolved: string[] = []

  let ast
  try {
    ast = parse(code, { sourceType: "module", plugins: ["jsx", "typescript"] })
  } catch (e) {
    throw new Error(`JSX parse error: ${(e as Error).message}`)
  }

  walkAST(ast as unknown as Node, (jsxNode) => {
    const nameNode = jsxNode.name
    if (nameNode.type !== "JSXIdentifier") return

    const reactName = nameNode.name
    if (!reactName || reactName[0] !== reactName[0].toUpperCase()) return

    // Skip known wrappers and layout templates — they have no Figma library equivalent
    const SKIP = new Set([
      // React / provider wrappers
      "Fragment", "React", "StrictMode",
      // DS wrappers
      "TooltipProvider", "TooltipTrigger",
      "RadioGroup", "TabsList", "TabsTrigger", "TabsContent",
      "SelectTrigger", "SelectContent", "SelectItem", "SelectValue", "SelectGroup",
      "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem",
      "DropdownMenuLabel", "DropdownMenuSeparator",
      "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage",
      "BreadcrumbSeparator", "BreadcrumbDropdownItem",
      "CardHeader", "CardContent", "CardFooter", "CardTitle", "CardDescription",
      "SheetContent", "SheetHeader", "SheetTitle", "SheetDescription",
      "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription",
      // Page-level layout templates
      "CardGridTemplate", "TabbedSectionsTemplate", "SplitPanelTemplate",
      "LinkCategoryTemplate", "BreadcrumbDetailTemplate", "BillingTemplate",
    ])
    // Also skip by suffix pattern — custom screen shells / layout wrappers
    const SKIP_SUFFIXES = ["Shell", "Layout", "Wrapper", "Container", "Frame", "Provider", "Context"]
    if (SKIP.has(reactName) || SKIP_SUFFIXES.some(s => reactName.endsWith(s))) return

    const mapEntry = COMPONENT_MAP[reactName]
    if (!mapEntry) {
      if (!unresolved.includes(reactName)) unresolved.push(reactName)
      return
    }

    const match = findKey(registry, mapEntry.figmaName)
    if (!match) {
      if (!unresolved.includes(reactName)) unresolved.push(reactName)
      return
    }

    const variantProps: Record<string, string> = {}
    for (const attr of jsxNode.attributes) {
      if (attr.type !== "JSXAttribute") continue
      if (attr.name.type !== "JSXIdentifier") continue

      const propName = attr.name.name
      const propMapping = mapEntry.props[propName]
      if (!propMapping) continue

      let rawValue: string | null = null
      if (attr.value === null) rawValue = "true"
      else if (attr.value?.type === "StringLiteral") rawValue = (attr.value as StringLiteral).value
      else if (attr.value?.type === "JSXExpressionContainer") {
        const expr = (attr.value as JSXExpressionContainer).expression
        if (expr.type === "StringLiteral") rawValue = expr.value
        else if (expr.type === "BooleanLiteral") rawValue = String(expr.value)
        else if (expr.type === "Identifier") rawValue = expr.name
      }
      if (rawValue === null) continue

      const figmaValue = propMapping.values[rawValue] ?? propMapping.values["*"]
      if (figmaValue) variantProps[propMapping.figmaProp] = figmaValue
    }

    resolved.push({ reactName, figmaName: mapEntry.figmaName, componentKey: match.key, nodeId: match.id, variantProps })
  })

  return { resolved, unresolved }
}

/** Case-insensitive fuzzy match: Figma name → { key, id } */
function findKey(registry: Registry, figmaName: string): { key: string; id: string } | undefined {
  // 1. Exact
  if (registry[figmaName]) return registry[figmaName]

  // 2. Strip trailing ✦
  const stripped = figmaName.replace(/\s*✦\s*$/, "").trim()
  for (const [name, entry] of Object.entries(registry)) {
    if (name.replace(/\s*✦\s*$/, "").trim() === stripped) return entry
  }

  // 3. Registry name starts with stripped lookup name
  for (const [name, entry] of Object.entries(registry)) {
    if (name.toLowerCase().startsWith(stripped.toLowerCase())) return entry
  }

  // 4. CamelCase-aware keyword split
  //    "StatusBadge_Base ✦" → ["status","badge"]
  //    "TopBar_Base ✦"      → ["top","bar"]
  const stopWords = new Set(["base", "core"])
  const keywords = stripped
    .replace(/([A-Z])/g, " $1")
    .replace(/[_✦]/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w))

  if (keywords.length === 0) return undefined

  const allMatch = Object.entries(registry).filter(([name]) => {
    const flat = name.toLowerCase().replace(/[_\s✦]/g, "")
    const spaced = name.toLowerCase()
    return keywords.every(kw => flat.includes(kw) || spaced.includes(kw))
  })

  if (allMatch.length === 1) return allMatch[0][1]

  const withBase = allMatch.find(([name]) => name.toLowerCase().includes("base"))
  if (withBase) return withBase[1]

  const scored = Object.entries(registry)
    .map(([name, entry]) => {
      const flat = name.toLowerCase().replace(/[_\s✦]/g, "")
      const hits = keywords.filter(kw => flat.includes(kw)).length
      return { entry, hits }
    })
    .filter(r => r.hits > 0)
    .sort((a, b) => b.hits - a.hits)

  return scored[0]?.entry
}

// ─────────────────────────────────────────────────────────────────────────────
// Full JSX → Figma tree builder
// ─────────────────────────────────────────────────────────────────────────────

// ── Token resolution ──────────────────────────────────────────────────────────

const SPACE: Record<string, number> = {
  "--cds-space-0":0,"--cds-space-1":1,"--cds-space-2":2,"--cds-space-4":4,
  "--cds-space-6":6,"--cds-space-8":8,"--cds-space-12":12,"--cds-space-16":16,
  "--cds-space-20":20,"--cds-space-24":24,"--cds-space-32":32,"--cds-space-40":40,
  "--cds-space-48":48,"--cds-gap-tight":4,"--cds-gap-small":8,"--cds-gap-default":12,
  "--cds-gap-medium":16,"--cds-gap-large":24,
  "--cds-padding-card":16,"--cds-padding-section-h":24,"--cds-padding-section-v":16,
  "--cds-radius-null":0,"--cds-radius-xs":2,"--cds-radius-s":4,
  "--cds-radius-r":6,"--cds-radius-l":10,"--cds-radius-full":999,
}
const FONT_SIZE: Record<string, number> = {
  "--cds-text-h1":29,"--cds-text-h2":26,"--cds-text-h3":23,"--cds-text-h4":22,
  "--cds-text-h5":20,"--cds-text-h6":18,"--cds-text-p1":16,"--cds-text-p2":14,
  "--cds-text-p3":12,"--cds-text-p4":11,
}
const LINE_HEIGHT: Record<string, number> = {
  "--cds-leading-h1":38,"--cds-leading-h2":34,"--cds-leading-h3":30,"--cds-leading-h4":29,
  "--cds-leading-h5":26,"--cds-leading-h6":24,"--cds-leading-p1":21,"--cds-leading-p2":18,
  "--cds-leading-p3":15,"--cds-leading-p4":14,
}
const HEAD_DEFAULTS: Record<string, { size: number; weight: number; lh: number }> = {
  h1:{size:29,weight:700,lh:38}, h2:{size:26,weight:700,lh:34}, h3:{size:23,weight:600,lh:30},
  h4:{size:22,weight:600,lh:29}, h5:{size:20,weight:600,lh:26}, h6:{size:18,weight:600,lh:24},
  p:{size:14,weight:400,lh:18},  span:{size:14,weight:400,lh:18}, li:{size:14,weight:400,lh:18},
  label:{size:14,weight:400,lh:18}, a:{size:14,weight:400,lh:18},
}

function resolvePx(v: string): number {
  if (!v) return 0
  const m = v.match(/var\((--cds-[^,)]+)/)
  if (m) return SPACE[m[1].trim()] ?? 0
  const p = v.match(/^(\d+(?:\.\d+)?)px$/)
  if (p) return parseFloat(p[1])
  const n = v.match(/^(\d+(?:\.\d+)?)$/)
  if (n) return parseFloat(n[1])
  return 0
}
function resolveFontSize(v: string): number {
  const m = v.match(/var\((--cds-[^,)]+)/)
  if (m) return FONT_SIZE[m[1].trim()] ?? resolvePx(v)
  return resolvePx(v)
}
function resolveLineHeight(v: string): number {
  const m = v.match(/var\((--cds-[^,)]+)/)
  if (m) return LINE_HEIGHT[m[1].trim()] ?? resolvePx(v)
  return resolvePx(v)
}

// ── Style extractor ───────────────────────────────────────────────────────────

interface RStyle {
  display?:string; flexDirection?:string; gap?:number
  pt?:number; pb?:number; pl?:number; pr?:number; pad?:number
  marginBottom?:number
  w?:number; maxW?:number; bg?:string; color?:string
  fontSize?:number; fontWeight?:number; lineHeight?:number
  textAlign?:string; borderRadius?:number
}

function extractStyle(attrs: any[]): RStyle {
  const s: RStyle = {}
  for (const a of attrs) {
    if (a.type !== "JSXAttribute" || a.name?.name !== "style") continue
    if (a.value?.type !== "JSXExpressionContainer") continue
    const obj = a.value.expression
    if (obj.type !== "ObjectExpression") continue
    for (const prop of obj.properties) {
      if (prop.type !== "ObjectProperty") continue
      const key: string = prop.key.name ?? prop.key.value ?? ""
      let v: string | null = null
      if (prop.value.type === "StringLiteral") v = prop.value.value
      else if (prop.value.type === "NumericLiteral") v = String(prop.value.value)
      else if (prop.value.type === "TemplateLiteral" && prop.value.expressions.length === 0)
        v = prop.value.quasis[0]?.value.raw ?? null
      if (v === null) continue
      switch (key) {
        case "display": s.display = v; break
        case "flexDirection": s.flexDirection = v; break
        case "gap": s.gap = resolvePx(v); break
        case "padding": s.pad = resolvePx(v); break
        case "paddingTop": s.pt = resolvePx(v); break
        case "paddingBottom": s.pb = resolvePx(v); break
        case "paddingLeft": s.pl = resolvePx(v); break
        case "paddingRight": s.pr = resolvePx(v); break
        case "width": s.w = resolvePx(v); break
        case "maxWidth": s.maxW = resolvePx(v); break
        case "marginBottom": s.marginBottom = resolvePx(v); break
        case "margin": {
          // Parse CSS shorthand to get bottom value
          const parts = v.trim().split(/\s+/)
          if (parts.length >= 3) s.marginBottom = resolvePx(parts[2])
          else if (parts.length === 2) s.marginBottom = resolvePx(parts[0])
          else if (parts.length === 1) s.marginBottom = resolvePx(parts[0])
          break
        }
        case "backgroundColor": case "background": s.bg = v; break
        case "color": s.color = v; break
        case "fontSize": s.fontSize = resolveFontSize(v); break
        case "fontWeight": s.fontWeight = parseInt(v) || 400; break
        case "lineHeight": s.lineHeight = resolveLineHeight(v); break
        case "textAlign": s.textAlign = v; break
        case "borderRadius": s.borderRadius = resolvePx(v); break
      }
    }
    break
  }
  return s
}

// ── Text content extractor ────────────────────────────────────────────────────

function extractText(children: any[]): string {
  return children.map(c => {
    if (c.type === "JSXText") return c.value.replace(/\s+/g, " ").trim()
    if (c.type === "JSXExpressionContainer") {
      const e = c.expression
      if (e.type === "StringLiteral") return e.value
      if (e.type === "TemplateLiteral" && e.expressions.length === 0)
        return e.quasis[0]?.value.raw ?? ""
    }
    return ""
  }).filter(Boolean).join(" ").trim()
}

// ── Component prop extractor (same logic as parseJSX) ────────────────────────

function extractVariantProps(attrs: any[], mapEntry: { props: Record<string, { figmaProp: string; values: Record<string, string> }> }) {
  const vp: Record<string, string> = {}
  for (const a of attrs) {
    if (a.type !== "JSXAttribute" || a.name?.type !== "JSXIdentifier") continue
    const pm = mapEntry.props[a.name.name]
    if (!pm) continue
    let rv: string | null = null
    if (a.value === null) rv = "true"
    else if (a.value?.type === "StringLiteral") rv = a.value.value
    else if (a.value?.type === "JSXExpressionContainer") {
      const e = a.value.expression
      if (e.type === "StringLiteral") rv = e.value
      else if (e.type === "BooleanLiteral") rv = String(e.value)
    }
    if (rv) {
      const fv = pm.values[rv] ?? pm.values["*"]
      if (fv) vp[pm.figmaProp] = fv
    }
  }
  return vp
}

// ── SKIP helpers (same as parseJSX) ──────────────────────────────────────────

const SKIP_SET = new Set([
  "Fragment","React","StrictMode","TooltipProvider","TooltipTrigger",
  "RadioGroup","TabsList","TabsTrigger","TabsContent",
  "SelectTrigger","SelectContent","SelectItem","SelectValue","SelectGroup",
  "DropdownMenuTrigger","DropdownMenuContent","DropdownMenuItem","DropdownMenuLabel","DropdownMenuSeparator",
  "BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbDropdownItem",
  "CardHeader","CardContent","CardFooter","CardTitle","CardDescription",
  "SheetContent","SheetHeader","SheetTitle","SheetDescription",
  "DialogContent","DialogHeader","DialogTitle","DialogDescription",
  "CardGridTemplate","TabbedSectionsTemplate","SplitPanelTemplate",
  "LinkCategoryTemplate","BreadcrumbDetailTemplate","BillingTemplate",
])
const SKIP_SFX = ["Shell","Layout","Wrapper","Container","Frame","Provider","Context"]
function shouldSkip(name: string) { return SKIP_SET.has(name) || SKIP_SFX.some(s => name.endsWith(s)) }

// ── Recursive JSX element → FigmaTreeNode ─────────────────────────────────────

const TEXT_TAGS = new Set(["h1","h2","h3","h4","h5","h6","p","span","label","a","strong","em","b","i"])
const FRAME_TAGS = new Set(["div","section","article","main","header","footer","nav","aside","ul","ol"])

function jsxElemToNode(elem: any, registry: Registry, depth = 0): FigmaTreeNode | null {
  if (!elem || elem.type !== "JSXElement" || depth > 12) return null
  const op = elem.openingElement
  if (!op || op.name?.type !== "JSXIdentifier") return null
  const tag: string = op.name.name
  const kids: any[] = elem.children ?? []
  const s = extractStyle(op.attributes)

  // ── uppercase = DS component or skipped wrapper ──────────────────────────
  if (tag[0] === tag[0].toUpperCase()) {
    if (shouldSkip(tag)) {
      // Descend through skipped wrappers transparently
      const jsxKids = kids.filter((c: any) => c.type === "JSXElement")
      if (jsxKids.length === 1) return jsxElemToNode(jsxKids[0], registry, depth + 1)
      if (jsxKids.length > 1) {
        const children = jsxKids.map((c: any) => jsxElemToNode(c, registry, depth + 1)).filter(Boolean) as FigmaTreeNode[]
        return children.length === 0 ? null : { type:"frame", name: tag, layoutMode:"VERTICAL", gap:16,
          paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, children } as FigmaFrameNode
      }
      return null
    }
    const mapEntry = COMPONENT_MAP[tag]
    if (mapEntry) {
      const match = findKey(registry, mapEntry.figmaName)
      if (match) {
        const variantProps = extractVariantProps(op.attributes, mapEntry)
        // Apply hardcoded defaults so components don't render with unexpected variant
        if (tag === "Button" && !variantProps["Variant"]) variantProps["Variant"] = "Primary"
        if (tag === "Badge"  && !variantProps["Variant"]) variantProps["Variant"] = "Default"
        if (tag === "Toggle" && !variantProps["Variant"]) variantProps["Variant"] = "Fill"
        return { type:"instance", name: tag, componentKey: match.key, nodeId: match.id, variantProps } as FigmaInstanceNode
      }
    }
    // Unknown DS component — descend
    const jsxKids = kids.filter((c: any) => c.type === "JSXElement")
    const children = jsxKids.map((c: any) => jsxElemToNode(c, registry, depth + 1)).filter(Boolean) as FigmaTreeNode[]
    return children.length === 0 ? null : { type:"frame", name: tag, layoutMode:"VERTICAL", gap:12,
      paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, children } as FigmaFrameNode
  }

  // ── text elements ─────────────────────────────────────────────────────────
  if (TEXT_TAGS.has(tag)) {
    const content = extractText(kids)
    if (!content) return null
    const def = HEAD_DEFAULTS[tag] ?? HEAD_DEFAULTS.p
    return { type:"text", name: tag, content,
      fontSize:  s.fontSize  ?? def.size,
      fontWeight:s.fontWeight ?? def.weight,
      lineHeight:s.lineHeight ?? def.lh,
      color: s.color ?? (tag === "a" ? "var(--cds-primary-text-default)" : tag.startsWith("h") ? "var(--cds-huegrey-text-dark)" : "var(--cds-huegrey-text-default)"),
    } as FigmaTextNode
  }

  // ── li ─────────────────────────────────────────────────────────────────────
  if (tag === "li") {
    const content = extractText(kids)
    if (content) return { type:"text", name:"li", content:`• ${content}`, fontSize:s.fontSize??14,
      fontWeight:s.fontWeight??400, lineHeight:s.lineHeight??18, color:s.color??"var(--cds-huegrey-text-dark)" } as FigmaTextNode
    const children = kids.filter((c:any) => c.type==="JSXElement").map((c:any) => jsxElemToNode(c,registry,depth+1)).filter(Boolean) as FigmaTreeNode[]
    return children.length === 0 ? null : { type:"frame",name:"li",layoutMode:"HORIZONTAL",gap:s.gap??8,
      paddingTop:0,paddingBottom:0,paddingLeft:0,paddingRight:0,children } as FigmaFrameNode
  }

  // ── layout frames ─────────────────────────────────────────────────────────
  if (FRAME_TAGS.has(tag)) {
    const isRow = s.display === "flex" && s.flexDirection !== "column"
    const layoutMode: "HORIZONTAL"|"VERTICAL" = (s.display === "flex" && isRow) ? "HORIZONTAL" : "VERTICAL"
    const pad = s.pad ?? 0
    const children: FigmaTreeNode[] = []
    let inferredGap = 0  // derive from children's marginBottom when no explicit gap

    for (const c of kids) {
      if (c.type === "JSXElement") {
        const childStyle = extractStyle(c.openingElement?.attributes ?? [])
        const n = jsxElemToNode(c, registry, depth + 1)
        if (n) {
          children.push(n)
          if (childStyle.marginBottom && childStyle.marginBottom > inferredGap)
            inferredGap = childStyle.marginBottom
        }
      } else if (c.type === "JSXText") {
        const t = c.value.replace(/\s+/g," ").trim()
        if (t) children.push({ type:"text", name:"text", content:t, fontSize:14, fontWeight:400,
          lineHeight:18, color:"var(--cds-huegrey-text-dark)" } as FigmaTextNode)
      } else if (c.type === "JSXExpressionContainer") {
        // Try to detect static array.map() and render items
        const expr = c.expression
        if (expr?.type === "CallExpression" &&
            expr.callee?.type === "MemberExpression" &&
            expr.callee.property?.name === "map" &&
            expr.callee.object?.type === "ArrayExpression" &&
            expr.arguments?.[0]?.type === "ArrowFunctionExpression") {
          const items: any[] = expr.callee.object.elements ?? []
          const arrowBody = expr.arguments[0].body
          if (arrowBody?.type === "JSXElement" && items.length > 0) {
            // Render one instance of the template per array item
            for (const item of items) {
              const itemText = item?.type === "StringLiteral" ? item.value : null
              if (itemText) {
                // If the template is a li, create a bullet text node
                const liTag = arrowBody.openingElement?.name?.name
                if (liTag === "li") {
                  children.push({ type:"text", name:"li", content:`• ${itemText}`,
                    fontSize:14, fontWeight:400, lineHeight:18,
                    color:"var(--cds-huegrey-text-dark)" } as FigmaTextNode)
                } else {
                  const n = jsxElemToNode(arrowBody, registry, depth + 1)
                  if (n) children.push(n)
                }
              }
            }
          } else {
            // Non-static map — placeholder frame
            children.push({ type:"frame", name:"List (×n)", layoutMode:"VERTICAL", gap:8,
              paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, children:[] } as FigmaFrameNode)
          }
        }
      }
    }
    if (children.length === 0 && !s.bg) return null
    return {
      type:"frame", name: tag, layoutMode,
      gap: s.gap ?? inferredGap,
      paddingTop:    s.pt ?? pad,
      paddingBottom: s.pb ?? pad,
      paddingLeft:   s.pl ?? pad,
      paddingRight:  s.pr ?? pad,
      width: s.maxW ?? s.w ?? undefined,
      bgColor: s.bg ?? undefined,
      children,
    } as FigmaFrameNode
  }

  return null
}

// ── Find the JSX return value in the screen file ───────────────────────────

function findReturnJSX(ast: any): any | null {
  let found: any = null
  function walk(n: any) {
    if (!n || typeof n !== "object" || found) return
    if (n.type === "ReturnStatement" &&
        (n.argument?.type === "JSXElement" || n.argument?.type === "JSXFragment")) {
      found = n.argument; return
    }
    for (const v of Object.values(n)) {
      if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === "object" && "type" in (v as object)) walk(v)
    }
  }
  walk(ast)
  return found
}

// ── Entry point ────────────────────────────────────────────────────────────

function buildFigmaTree(code: string, registry: Registry): FigmaTreeNode | null {
  let ast: any
  try { ast = parse(code, { sourceType: "module", plugins: ["jsx", "typescript"] }) }
  catch (e) { throw new Error(`Parse error: ${(e as Error).message}`) }

  const returnJSX = findReturnJSX(ast)
  if (!returnJSX) return null

  if (returnJSX.type === "JSXFragment") {
    const children = returnJSX.children
      .filter((c: any) => c.type === "JSXElement")
      .map((c: any) => jsxElemToNode(c, registry, 0))
      .filter(Boolean) as FigmaTreeNode[]
    return { type:"frame", name:"Screen", layoutMode:"VERTICAL", gap:16,
      paddingTop:24, paddingBottom:24, paddingLeft:24, paddingRight:24,
      bgColor:"#FFFFFF", children } as FigmaFrameNode
  }

  const root = jsxElemToNode(returnJSX, registry, 0)
  if (!root) return null
  if (root.type !== "frame") {
    return { type:"frame", name:"Screen", layoutMode:"VERTICAL", gap:16,
      paddingTop:24, paddingBottom:24, paddingLeft:24, paddingRight:24,
      bgColor:"#FFFFFF", children:[root] } as FigmaFrameNode
  }
  return root
}

// ─────────────────────────────────────────────────────────────────────────────
// App component
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [registry, setRegistry]           = useState<Registry>({})
  const [registryCount, setRegistryCount] = useState<number | null>(null)
  const [code, setCode]                   = useState("")
  const [parseResult, setParseResult]     = useState<ParseResult | null>(null)
  const [parseError, setParseError]       = useState<string | null>(null)
  const [figmaTree, setFigmaTree]         = useState<FigmaTreeNode | null>(null)
  const [status, setStatus]               = useState<{ ok: number; fail: number } | null>(null)
  const [placing, setPlacing]             = useState(false)
  const [tab, setTab]                     = useState<"generate" | "browse">("generate")
  const [search, setSearch]               = useState("")

  // ── Receive messages from main.ts ────────────────────────────────────────
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const msg = event.data.pluginMessage
      if (!msg) return

      if (msg.type === "registry-ready") {
        const map: Registry = {}
        for (const entry of (msg.entries as ComponentEntry[])) {
          map[entry.name] = { key: entry.key, id: entry.id }
        }
        setRegistry(map)
        setRegistryCount(msg.entries.length)
      }

      if (msg.type === "place-done") {
        setPlacing(false)
        setStatus({ ok: msg.placed, fail: msg.failed })
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  // ── Parse on code change ─────────────────────────────────────────────────
  useEffect(() => {
    setParseResult(null)
    setParseError(null)
    setFigmaTree(null)
    setStatus(null)
    if (!code.trim() || Object.keys(registry).length === 0) return
    try {
      setParseResult(parseJSX(code, registry))
      setFigmaTree(buildFigmaTree(code, registry))
    } catch (e) {
      setParseError((e as Error).message)
    }
  }, [code, registry])

  // ── Place on canvas ──────────────────────────────────────────────────────
  function handlePlace() {
    if (!parseResult && !figmaTree) return
    setPlacing(true)

    // Prefer full tree build; fall back to flat list
    if (figmaTree) {
      parent.postMessage({ pluginMessage: { type: "build-layout", tree: [figmaTree] } }, "*")
    } else if (parseResult && parseResult.resolved.length > 0) {
      const nodes: PlaceNode[] = parseResult.resolved.map((r) => ({
        componentKey: r.componentKey,
        nodeId: r.nodeId,
        variantProps: r.variantProps,
        reactName: r.reactName,
      }))
      parent.postMessage({ pluginMessage: { type: "place-components", nodes } }, "*")
    }
  }

  const resolved   = parseResult?.resolved   ?? []
  const unresolved = parseResult?.unresolved ?? []
  const canPlace   = (figmaTree !== null || resolved.length > 0) && !placing
  const isTreeMode = figmaTree !== null

  // Browse tab — filter registry by search
  const browseNames = Object.keys(registry)
    .filter(n => !search || n.toLowerCase().includes(search.toLowerCase()))
    .sort()
    .slice(0, 120)

  return (
    <div style={styles.root}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Creator DS → Canvas</span>
        {registryCount !== null && (
          <span style={styles.badge}>{registryCount} components indexed</span>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {(["generate", "browse"] as const).map(t => (
          <button
            key={t}
            style={{ ...styles.tabBtn, ...(tab === t ? styles.tabBtnActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t === "generate" ? "Generate" : "Browse components"}
          </button>
        ))}
      </div>

      {/* ── Generate tab ── */}
      {tab === "generate" && (
        <>
          <div style={styles.section}>
            <label style={styles.label}>Paste React screen code (JSX / TSX)</label>
            <textarea
              style={styles.textarea}
              placeholder={"// e.g.\nexport default function MyScreen() {\n  return (\n    <div>\n      <Button variant=\"outline\">Click</Button>\n      <Badge variant=\"success\">Active</Badge>\n    </div>\n  )\n}"}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          {parseError && (
            <div style={{ ...styles.msg, background: "#fce4e3", color: "#cc1914" }}>
              ⚠ {parseError}
            </div>
          )}

          {parseResult && !parseError && (
            <div style={styles.section}>
              {resolved.length > 0 && (
                <>
                  <label style={styles.label}>
                    ✓ {resolved.length} component{resolved.length !== 1 ? "s" : ""} resolved
                  </label>
                  <div style={styles.list}>
                    {resolved.map((r, i) => (
                      <div key={i} style={styles.listItem}>
                        <span style={styles.reactTag}>{r.reactName}</span>
                        <span style={styles.arrow}>→</span>
                        <span style={styles.figmaTag}>{r.figmaName}</span>
                        {Object.keys(r.variantProps).length > 0 && (
                          <span style={styles.props}>
                            {Object.entries(r.variantProps).map(([k, v]) => `${k}: ${v}`).join("  ·  ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {unresolved.length > 0 && (
                <div style={{ ...styles.msg, marginTop: 8, background: "#fff9f5", color: "#d25704" }}>
                  ⚠ Not matched: {unresolved.join(", ")} — check Browse tab for actual Figma names
                </div>
              )}
            </div>
          )}

          {status && (
            <div style={{
              ...styles.msg,
              background: status.fail === 0 ? "#e3fcee" : "#fce4e3",
              color:      status.fail === 0 ? "#078841" : "#cc1914",
              marginTop: 8,
            }}>
              {status.fail === 0
                ? `✓ Placed ${status.ok} component${status.ok !== 1 ? "s" : ""} on canvas`
                : `Placed ${status.ok}, failed ${status.fail}. Ensure the DS library is linked.`}
            </div>
          )}

          <div style={styles.actions}>
            <button
              style={{ ...styles.btn, ...(canPlace ? {} : styles.btnDisabled) }}
              disabled={!canPlace}
              onClick={handlePlace}
            >
              {placing ? "Building…" : isTreeMode ? "Build layout on canvas" : `Place ${resolved.length || ""} component${resolved.length !== 1 ? "s" : ""} on canvas`}
            </button>
            <button style={styles.btnSecondary} onClick={() => {
              setCode(""); setParseResult(null); setStatus(null)
            }}>
              Clear
            </button>
          </div>
        </>
      )}

      {/* ── Browse tab ── */}
      {tab === "browse" && (
        <div style={styles.section}>
          <label style={styles.label}>Search indexed Figma components</label>
          <input
            style={styles.searchInput}
            placeholder="Type to filter…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ ...styles.list, maxHeight: 440, overflowY: "auto" as const }}>
            {browseNames.length === 0 && (
              <div style={{ color: "#696c74", fontSize: 11, padding: 8 }}>No matches</div>
            )}
            {browseNames.map((name, i) => (
              <div key={i} style={{ ...styles.listItem, cursor: "default" }}>
                <span style={{ fontFamily: "'PT Mono', monospace", fontSize: 11, color: "#182649" }}>
                  {name}
                </span>
              </div>
            ))}
            {Object.keys(registry).length > 120 && !search && (
              <div style={{ color: "#696c74", fontSize: 11, padding: "4px 8px" }}>
                Showing first 120 of {Object.keys(registry).length} — use search to filter
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles (inline — no CSS file needed for a plugin)
// ─────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Zoho Puvi', system-ui, sans-serif",
    fontSize: 12,
    color: "#26282b",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: "#182649",
  },
  badge: {
    background: "#f5f8fe",
    color: "#0d4ef2",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
  },
  section: { display: "flex", flexDirection: "column", gap: 6 },
  label:   { fontWeight: 600, color: "#696c74", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  textarea: {
    width: "100%",
    height: 200,
    resize: "vertical" as const,
    fontFamily: "'PT Mono', monospace",
    fontSize: 11,
    padding: 10,
    border: "1px solid #e5e5e7",
    borderRadius: 6,
    boxSizing: "border-box" as const,
    background: "#fafafa",
    color: "#26282b",
    outline: "none",
  },
  list: { display: "flex", flexDirection: "column" as const, gap: 4 },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    background: "#f7f9fd",
    borderRadius: 4,
    flexWrap: "wrap" as const,
  },
  reactTag: {
    background: "#dde6fd",
    color: "#031648",
    borderRadius: 4,
    padding: "1px 6px",
    fontFamily: "'PT Mono', monospace",
    fontSize: 11,
  },
  figmaTag: {
    background: "#182649",
    color: "#fff",
    borderRadius: 4,
    padding: "1px 6px",
    fontFamily: "'PT Mono', monospace",
    fontSize: 11,
  },
  arrow: { color: "#696c74" },
  props:  { color: "#696c74", fontSize: 10, marginLeft: 4 },
  msg: {
    padding: "8px 10px",
    borderRadius: 6,
    fontSize: 11,
    lineHeight: "16px",
  },
  actions: { display: "flex", gap: 8, marginTop: 4 },
  btn: {
    flex: 1,
    padding: "8px 0",
    background: "#0d4ef2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontFamily: "'Zoho Puvi', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  btnDisabled: {
    background: "#c0d1fc",
    cursor: "not-allowed",
  },
  btnSecondary: {
    padding: "8px 16px",
    background: "transparent",
    color: "#696c74",
    border: "1px solid #e5e5e7",
    borderRadius: 6,
    fontFamily: "'Zoho Puvi', system-ui, sans-serif",
    fontSize: 12,
    cursor: "pointer",
  },
  tabBar: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #e5e5e7",
    marginBottom: 4,
  },
  tabBtn: {
    padding: "6px 12px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#696c74",
    fontFamily: "'Zoho Puvi', system-ui, sans-serif",
    fontSize: 12,
    cursor: "pointer",
    marginBottom: -1,
  },
  tabBtnActive: {
    color: "#0d4ef2",
    borderBottomColor: "#0d4ef2",
    fontWeight: 600,
  },
  searchInput: {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #e5e5e7",
    borderRadius: 6,
    fontFamily: "'Zoho Puvi', system-ui, sans-serif",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box" as const,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────────────────────

const root = createRoot(document.getElementById("root")!)
root.render(<App />)
