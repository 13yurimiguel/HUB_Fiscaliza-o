import { AppShell } from "@/components/AppShell";
import { getProjectDetail } from "@/services/api/projects";
import Image from "next/image";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { project, activities, photos, schedule } = await getProjectDetail(id);

  return (
    <AppShell>
      <h1>{project.name}</h1>
      <p>
        {project.location} • Início {new Date(project.startDate).toLocaleDateString("pt-BR")} • Status: {" "}
        {project.status.replace("_", " ")}
      </p>

      <section className="card">
        <h2>Cronograma</h2>
        {schedule.length ? (
          <ul>
            {schedule.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.milestone}</strong> — Previsto {new Date(entry.plannedDate).toLocaleDateString("pt-BR")}{" "}
                {entry.actualDate ? `| Realizado ${new Date(entry.actualDate).toLocaleDateString("pt-BR")}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum marco registrado ainda.</p>
        )}
      </section>

      <section className="card">
        <h2>Fotos de Campo</h2>
        {photos.length ? (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {photos.map((photo) => (
              <figure key={photo.id}>
                <Image src={photo.url} alt={photo.description} width={320} height={200} style={{ width: "100%", height: "auto" }} />
                <figcaption>{photo.description}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p>Sem registros fotográficos para esta obra.</p>
        )}
      </section>

      <section className="card">
        <h2>Atividades</h2>
        {activities.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Atividade</th>
                <th style={{ textAlign: "left" }}>Responsável</th>
                <th style={{ textAlign: "left" }}>Progresso</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>{activity.responsible}</td>
                  <td>{activity.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Sem atividades registradas para esta obra.</p>
        )}
      </section>
    </AppShell>
  );
}
