import { AppShell } from "@/components/AppShell";
import { ProjectHighlights } from "@/components/ProjectHighlights";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <AppShell>
      <h1>Visão Geral</h1>
      <p>
        Acompanhe o portfólio de obras, gere relatórios personalizados e configure checklists ISO para garantir a
        conformidade das fiscalizações.
      </p>
      <Suspense fallback={<p>Carregando indicadores...</p>}>
        <ProjectHighlights />
      </Suspense>
    </AppShell>
  );
}
