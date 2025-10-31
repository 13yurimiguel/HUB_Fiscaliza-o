import { listProjects } from "@/services/api/projects";
import Link from "next/link";

async function fetchHighlights() {
  const projects = await listProjects();
  return projects.slice(0, 3);
}

export async function ProjectHighlights() {
  const projects = await fetchHighlights();

  if (!projects.length) {
    return <p>Nenhum projeto cadastrado ainda.</p>;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {projects.map((project) => (
        <article key={project.id} className="card">
          <header>
            <h2 style={{ marginBottom: "0.5rem" }}>{project.name}</h2>
            <small>Status: {project.status.replace("_", " ")}</small>
          </header>
          <p>Localização: {project.location}</p>
          <p>Orçamento: R$ {project.budget.toLocaleString("pt-BR")}</p>
          <Link href={`/projects/${project.id}`} className="button" style={{ display: "inline-block", marginTop: "1rem" }}>
            Ver detalhes
          </Link>
        </article>
      ))}
    </div>
  );
}

export function ProjectHighlightsSkeleton() {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card" style={{ opacity: 0.6 }}>
          <div style={{ height: "1.2rem", background: "#e2e8f0", borderRadius: "6px", marginBottom: "0.5rem" }} />
          <div style={{ height: "0.8rem", background: "#e2e8f0", borderRadius: "6px", marginBottom: "0.5rem" }} />
          <div style={{ height: "0.8rem", background: "#e2e8f0", borderRadius: "6px", width: "60%" }} />
        </div>
      ))}
    </div>
  );
}
