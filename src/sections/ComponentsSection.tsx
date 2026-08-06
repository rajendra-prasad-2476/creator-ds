import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/ui/code-block"
import { cn } from "@/lib/utils"
import {
  COMPONENT_CATEGORIES,
  COMPONENT_REGISTRY,
  type ComponentCategory,
} from "@/sections/component-registry"

export function ComponentsSection() {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(COMPONENT_REGISTRY[0].id)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMPONENT_REGISTRY
    return COMPONENT_REGISTRY.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [query])

  const grouped = useMemo(() => {
    return COMPONENT_CATEGORIES.map((category) => ({
      category,
      items: filtered.filter((c) => c.category === category),
    })).filter((group) => group.items.length > 0)
  }, [filtered])

  const selected =
    COMPONENT_REGISTRY.find((c) => c.id === selectedId) ?? COMPONENT_REGISTRY[0]

  return (
    <div className="flex gap-[var(--cds-space-24)]">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0">
        <div className="relative mb-[var(--cds-space-16)]">
          <Search className="absolute left-[11px] top-1/2 size-3.5 -translate-y-1/2 text-[var(--cds-huegrey-text-fairish)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components…"
            className="pl-[30px]"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-260px)] pr-[var(--cds-space-12)]">
          <nav className="flex flex-col gap-[var(--cds-space-16)]">
            {grouped.map((group) => (
              <div key={group.category}>
                <p className="mb-[var(--cds-space-6)] px-[var(--cds-space-8)] text-[length:var(--cds-text-p4)] font-semibold uppercase tracking-wide text-[var(--cds-huegrey-text-fairish)]">
                  {group.category}
                </p>
                <div className="flex flex-col gap-[var(--cds-space-2)]">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "rounded-[var(--cds-radius-s)] px-[var(--cds-space-8)] py-[var(--cds-space-6)] text-left text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] transition-colors",
                        item.id === selectedId
                          ? "bg-[var(--cds-primary-surface-subtle)] font-medium text-[var(--cds-primary-text-default)]"
                          : "text-[var(--cds-huegrey-text-default)] hover:bg-[var(--cds-huegrey-surface-subtle)]"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {grouped.length === 0 && (
              <p className="px-[var(--cds-space-8)] text-[length:var(--cds-text-p3)] text-[var(--cds-huegrey-text-fairish)]">
                No components match "{query}"
              </p>
            )}
          </nav>
        </ScrollArea>
      </aside>

      {/* Detail */}
      <div className="min-w-0 flex-1">
        <div className="mb-[var(--cds-space-20)]">
          <div className="mb-[var(--cds-space-6)] flex items-center gap-[var(--cds-gap-small)]">
            <h3 className="text-[length:var(--cds-text-h3)] font-semibold leading-[var(--cds-leading-h3)] text-foreground">
              {selected.name}
            </h3>
            <CategoryBadge category={selected.category} />
          </div>
          <p className="max-w-2xl text-[length:var(--cds-text-p1)] leading-[var(--cds-leading-p1)] text-muted-foreground">
            {selected.description}
          </p>
        </div>

        <Tabs defaultValue="preview" key={selected.id}>
          <TabsList className="mb-[var(--cds-space-16)]">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div className="flex min-h-[280px] items-center justify-center rounded-[var(--cds-radius-r)] border border-[var(--cds-huegrey-border-fairish)] bg-[var(--cds-huegrey-surface-subtle)] p-[var(--cds-space-32)]">
              {selected.preview}
            </div>
          </TabsContent>

          <TabsContent value="code">
            <CodeBlock code={selected.code} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category: ComponentCategory }) {
  return (
    <Badge variant="subtle" colour="primary" size="sm">
      {category}
    </Badge>
  )
}
