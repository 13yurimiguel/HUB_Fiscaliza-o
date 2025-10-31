import { AppShell } from "@/components/AppShell";
import { ReportBuilder } from "@/components/ReportBuilder";
import { listProjects } from "@/services/api/projects";
import { listReportTemplates } from "@/services/api/reports";

export default async function ReportsPage() {
  const [templates, projects] = await Promise.all([listReportTemplates(), listProjects()]);
  const template = templates[0];
  const project = projects[0];

  return (
    <AppShell>
      <h1>Gerador de Relatórios</h1>
      {!template || !project ? (
        <p>Cadastre pelo menos um projeto e um modelo de relatório para começar.</p>
      ) : (
        <ReportBuilder template={template} projectId={project.id} />
      )}
    </AppShell>
  );
}
