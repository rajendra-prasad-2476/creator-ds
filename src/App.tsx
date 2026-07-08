import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Atom, Combine, Component, Palette, LayoutTemplate, Layers } from "lucide-react";
import { TopBar } from "@/components/ui/top-bar";
import { FoundationSection } from "@/sections/FoundationSection";
import { AtomsSection } from "@/sections/AtomsSection";
import { MoleculesSection } from "@/sections/MoleculesSection";
import { OrganismsSection } from "@/sections/OrganismsSection";
import { TemplatesSection } from "@/sections/TemplatesSection";
import { FeatureDashboardSection } from "@/sections/FeatureDashboardSection";

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <TopBar docTitle="CTS Design System" docVersion="v1.0" docType="HTML" userInitials="RJ" />

        <main className="mx-auto max-w-7xl px-8 py-8">
          <div className="mb-8">
            <h2 className="text-[var(--cds-text-h2)] font-semibold leading-[var(--cds-leading-h2)] text-foreground mb-2">
              Component Documentation
            </h2>
            <p className="text-[var(--cds-text-p1)] leading-[var(--cds-leading-p1)] text-muted-foreground">
              All UI components from the CTS Design System, organized by Atomic Design methodology.
              Extracted from Figma and built with Shadcn/ui + Tailwind CSS.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> 31 Components</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--cds-success-surface-default)]" /> 1,646 Design Tokens</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--cds-warning-surface-default)]" /> 3 Themes (Creator, QEngine, Bookings)</span>
            </div>
          </div>

          <Tabs defaultValue="foundation" className="w-full">
            <TabsList className="mb-8 h-auto flex-wrap">
              <TabsTrigger value="foundation" className="gap-1.5">
                <Palette className="h-4 w-4" /> Foundation
              </TabsTrigger>
              <TabsTrigger value="atoms" className="gap-1.5">
                <Atom className="h-4 w-4" /> Atoms
                <Badge variant="subtle" className="ml-1 text-[10px] h-5 px-1.5">14</Badge>
              </TabsTrigger>
              <TabsTrigger value="molecules" className="gap-1.5">
                <Combine className="h-4 w-4" /> Molecules
                <Badge variant="subtle" className="ml-1 text-[10px] h-5 px-1.5">10</Badge>
              </TabsTrigger>
              <TabsTrigger value="organisms" className="gap-1.5">
                <Component className="h-4 w-4" /> Organisms
                <Badge variant="subtle" className="ml-1 text-[10px] h-5 px-1.5">12</Badge>
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-1.5">
                <LayoutTemplate className="h-4 w-4" /> Templates
                <Badge variant="subtle" className="ml-1 text-[10px] h-5 px-1.5">8</Badge>
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-1.5">
                <Layers className="h-4 w-4" /> Features
                <Badge variant="subtle" className="ml-1 text-[10px] h-5 px-1.5">1</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foundation">
              <FoundationSection />
            </TabsContent>

            <TabsContent value="atoms">
              <AtomsSection />
            </TabsContent>

            <TabsContent value="molecules">
              <MoleculesSection />
            </TabsContent>

            <TabsContent value="organisms">
              <OrganismsSection />
            </TabsContent>

            <TabsContent value="templates">
              <TemplatesSection />
            </TabsContent>

            <TabsContent value="features">
              <FeatureDashboardSection />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-8 py-6 mt-12">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-sm text-muted-foreground">
            <p>CTS Design System — Built from Figma with Shadcn/ui + Tailwind CSS</p>
            <p>Font: Zoho Puvi • Theme: Creator</p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;