/**
 * main.ts — Figma plugin sandbox
 *
 * Handles two modes:
 *  1. "place-components"  — flat list of DS component instances (quick place)
 *  2. "build-layout"      — full JSX tree → frames + text + component instances
 */

figma.showUI(__html__, { width: 520, height: 720, title: "Creator DS → Canvas" })

// ─────────────────────────────────────────────────────────────────────────────
// Shared types (imported by ui.tsx via `import type`)
// ─────────────────────────────────────────────────────────────────────────────

export interface ComponentEntry { name: string; key: string; id: string }
export interface PlaceNode {
  componentKey: string; nodeId: string
  variantProps: Record<string, string>; reactName: string
}
export type FigmaTreeNode = FigmaFrameNode | FigmaTextNode | FigmaInstanceNode
export interface FigmaFrameNode {
  type: "frame"; name: string
  layoutMode: "HORIZONTAL" | "VERTICAL" | "NONE"
  gap: number; paddingTop: number; paddingBottom: number; paddingLeft: number; paddingRight: number
  bgColor?: string; width?: number; minWidth?: number; children: FigmaTreeNode[]
}
export interface FigmaTextNode {
  type: "text"; name: string; content: string
  fontSize: number; fontWeight: number; lineHeight: number; color: string
}
export interface FigmaInstanceNode {
  type: "instance"; name: string
  componentKey: string; nodeId: string; variantProps: Record<string, string>
}

// ─────────────────────────────────────────────────────────────────────────────
// Color helpers
// ─────────────────────────────────────────────────────────────────────────────

const CDS_HEX: Record<string, string> = {
  "--cds-huegrey-text-dark": "#26282B", "--cds-huegrey-text-default": "#696C74",
  "--cds-huegrey-text-bold": "#37383C", "--cds-huegrey-border-default": "#696C74",
  "--cds-huegrey-surface-low": "#EFF0F1", "--cds-huegrey-surface-subtle": "#FAFAFA",
  "--cds-primary-text-default": "#0D4EF2", "--cds-primary-surface-default": "#0D4EF2",
  "--cds-primary-surface-subtle": "#F5F8FE", "--cds-primary-surface-minimal": "#C0D1FC",
  "--cds-secondary-surface-default": "#1E2E59", "--cds-secondary-surface-default-hover": "#182649",
  "--cds-success-text-default": "#078841", "--cds-error-text-default": "#CC1914",
  "--cds-warning-text-default": "#D25704", "--cds-white": "#FFFFFF", "--cds-black": "#000000",
  "--background": "#FFFFFF", "--foreground": "#25272C",
  "--muted": "#F5F5F5", "--muted-foreground": "#6C6D71", "--border": "#E5E5E7",
}

function cssToRgb(raw: string | undefined): RGB | undefined {
  if (!raw) return undefined
  const varMatch = raw.match(/var\((--[^,)]+)/)
  const hex = varMatch ? CDS_HEX[varMatch[1].trim()] : raw.trim()
  if (!hex?.startsWith("#")) return undefined
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Font loading
// ─────────────────────────────────────────────────────────────────────────────

const LOADED = new Set<string>()
async function loadFont(weight: number): Promise<FontName> {
  const zStyle = weight >= 700 ? "Bold" : weight >= 600 ? "Semi Bold" : "Regular"
  const iStyle = weight >= 700 ? "Bold" : weight >= 600 ? "Semi Bold" : "Regular"
  const zKey = `ZP:${zStyle}`
  if (!LOADED.has(zKey)) {
    try { await figma.loadFontAsync({ family: "Zoho Puvi", style: zStyle }); LOADED.add(zKey) } catch { /* not available */ }
  }
  if (LOADED.has(zKey)) return { family: "Zoho Puvi", style: zStyle }
  const iKey = `I:${iStyle}`
  if (!LOADED.has(iKey)) { await figma.loadFontAsync({ family: "Inter", style: iStyle }); LOADED.add(iKey) }
  return { family: "Inter", style: iStyle }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component instance helper
// ─────────────────────────────────────────────────────────────────────────────

async function makeInstance(componentKey: string, nodeId: string, variantProps: Record<string, string>): Promise<InstanceNode | null> {
  let inst: InstanceNode | null = null
  try { inst = (await figma.importComponentByKeyAsync(componentKey)).createInstance() } catch {
    try {
      const local = await figma.getNodeByIdAsync(nodeId)
      if (local?.type === "COMPONENT") inst = (local as ComponentNode).createInstance()
    } catch { return null }
  }
  if (!inst) return null
  if (Object.keys(variantProps).length) { try { inst.setProperties(variantProps) } catch { /* ok */ } }
  return inst
}

// ─────────────────────────────────────────────────────────────────────────────
// Recursive Figma node creator
// ─────────────────────────────────────────────────────────────────────────────

async function createFigmaNode(node: FigmaTreeNode): Promise<SceneNode | null> {
  if (node.type === "frame") {
    const frame = figma.createFrame()
    frame.name = node.name
    const bg = cssToRgb(node.bgColor)
    frame.fills = bg ? [{ type: "SOLID", color: bg }] : []
    frame.strokes = []
    frame.clipsContent = false
    if (node.layoutMode !== "NONE") {
      frame.layoutMode = node.layoutMode
      frame.itemSpacing = node.gap
      frame.paddingTop = node.paddingTop; frame.paddingBottom = node.paddingBottom
      frame.paddingLeft = node.paddingLeft; frame.paddingRight = node.paddingRight
      frame.primaryAxisSizingMode = "AUTO"
      frame.counterAxisSizingMode = "AUTO"
    }
    for (const child of node.children) {
      const c = await createFigmaNode(child)
      if (c) frame.appendChild(c)
    }
    if (node.width !== undefined) {
      frame.resize(node.width, Math.max(frame.height, 1))
      frame.counterAxisSizingMode = "FIXED"
    }
    if (node.minWidth !== undefined) frame.minWidth = node.minWidth
    return frame
  }

  if (node.type === "text") {
    if (!node.content.trim()) return null
    const font = await loadFont(node.fontWeight).catch(() => ({ family: "Inter", style: "Regular" }))
    const text = figma.createText()
    text.name = node.name
    text.fontName = font
    text.fontSize = node.fontSize
    text.lineHeight = { value: node.lineHeight, unit: "PIXELS" }
    text.characters = node.content.trim()
    const color = cssToRgb(node.color)
    text.fills = color ? [{ type: "SOLID", color }] : [{ type: "SOLID", color: { r: 0.149, g: 0.157, b: 0.169 } }]
    return text
  }

  if (node.type === "instance") {
    const inst = await makeInstance(node.componentKey, node.nodeId, node.variantProps)
    if (inst) inst.name = node.name
    return inst
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry scan on startup
// ─────────────────────────────────────────────────────────────────────────────

async function buildRegistry(): Promise<ComponentEntry[]> {
  const entries: ComponentEntry[] = []
  await figma.loadAllPagesAsync()
  figma.root.findAll((n: BaseNode) => {
    if (n.type === "COMPONENT") { const c = n as ComponentNode; entries.push({ name: c.name, key: c.key, id: c.id }) }
    return false
  })
  return entries
}
buildRegistry().then(entries => figma.ui.postMessage({ type: "registry-ready", entries }))

// ─────────────────────────────────────────────────────────────────────────────
// Message handler
// ─────────────────────────────────────────────────────────────────────────────

figma.ui.onmessage = async (msg: { type: string; [k: string]: unknown }) => {

  if (msg.type === "place-components") {
    const nodes = msg.nodes as PlaceNode[]
    if (!nodes?.length) { figma.notify("No components to place.", { error: true }); return }
    const placed: SceneNode[] = []; let fail = 0, cx = 0
    for (const node of nodes) {
      const inst = await makeInstance(node.componentKey, node.nodeId, node.variantProps)
      if (!inst) { fail++; continue }
      inst.x = cx; inst.y = 0; inst.name = node.reactName
      figma.currentPage.appendChild(inst)
      cx += inst.width + 24; placed.push(inst)
    }
    figma.currentPage.selection = placed
    figma.viewport.scrollAndZoomIntoView(placed)
    figma.notify(fail ? `Placed ${placed.length}, failed ${fail}.` : `Placed ${placed.length} ✓`)
    figma.ui.postMessage({ type: "place-done", placed: placed.length, failed: fail })
  }

  if (msg.type === "build-layout") {
    const tree = msg.tree as FigmaTreeNode[]
    if (!tree?.length) { figma.notify("Nothing to build.", { error: true }); return }
    const placed: SceneNode[] = []; let fail = 0, cx = 0
    for (const node of tree) {
      const fn = await createFigmaNode(node).catch(() => null)
      if (!fn) { fail++; continue }
      fn.x = cx; fn.y = 0
      figma.currentPage.appendChild(fn)
      cx += fn.width + 48; placed.push(fn)
    }
    figma.currentPage.selection = placed
    figma.viewport.scrollAndZoomIntoView(placed)
    figma.notify(fail ? `Built. ${fail} node(s) failed.` : `Layout built ✓`)
    figma.ui.postMessage({ type: "place-done", placed: placed.length, failed: fail })
  }

  if (msg.type === "close") figma.closePlugin()
}
