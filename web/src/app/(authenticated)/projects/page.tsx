import { AppShell } from "@/components/AppShell";
import { listProjects } from "@/services/api/projects";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <AppShell>
      <h1>Obras</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {projects.map((project) => (
          <article key={project.id} className="card">
            <header>
              <h2>{project.name}</h2>
              <small>{new Date(project.startDate).toLocaleDateString("pt-BR")}</small>
            </header>
            <p>Status: {project.status.replace("_", " ")}</p>
            <p>Orçamento: R$ {project.budget.toLocaleString("pt-BR")}</p>
            <p>Localização: {project.location}</p>
            <Link href={`/projects/${project.id}`} className="button" style={{ marginTop: "1rem", display: "inline-block" }}>
              Acompanhar obra
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
