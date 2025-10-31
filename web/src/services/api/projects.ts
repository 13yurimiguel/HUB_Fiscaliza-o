import { apiGet, apiGraphQL } from "./client";

export type Project = {
  id: string;
  name: string;
  status: "planejado" | "em_execucao" | "concluido";
  budget: number;
  location: string;
  startDate: string;
  endDate?: string;
};

export type ProjectActivity = {
  id: string;
  title: string;
  responsible: string;
  progress: number;
};

export type ProjectPhoto = {
  id: string;
  url: string;
  description: string;
  createdAt: string;
};

export type ProjectScheduleEntry = {
  id: string;
  milestone: string;
  plannedDate: string;
  actualDate?: string;
};

const fallbackProjects: Project[] = [
  {
    id: "obra-ponte",
    name: "Duplicação da Ponte Central",
    status: "em_execucao",
    budget: 12000000,
    location: "Vitória - ES",
    startDate: "2024-02-01",
    endDate: undefined,
  },
  {
    id: "hospital-municipal",
    name: "Construção do Hospital Municipal",
    status: "planejado",
    budget: 45000000,
    location: "Serra - ES",
    startDate: "2024-06-15",
    endDate: undefined,
  },
  {
    id: "creche-bairro",
    name: "Ampliação da Creche Bairro Feliz",
    status: "concluido",
    budget: 3500000,
    location: "Cariacica - ES",
    startDate: "2023-01-10",
    endDate: "2024-01-05",
  },
];

const fallbackDetail = {
  project: fallbackProjects[0],
  activities: [
    { id: "act-1", title: "Montagem de vigas", responsible: "Eng. Carolina", progress: 65 },
    { id: "act-2", title: "Vistoria de fundações", responsible: "Fiscal João", progress: 100 },
  ],
  photos: [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1581090464777-5cbf41e0bb96",
      description: "Concretagem das bases",
      createdAt: "2024-03-18",
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      description: "Montagem das estruturas metálicas",
      createdAt: "2024-04-02",
    },
  ],
  schedule: [
    { id: "milestone-1", milestone: "Projeto Executivo", plannedDate: "2024-02-10", actualDate: "2024-02-12" },
    { id: "milestone-2", milestone: "Instalação de pilares", plannedDate: "2024-04-05", actualDate: undefined },
  ],
};

export async function listProjects(): Promise<Project[]> {
  try {
    return await apiGet<Project[]>("/projects");
  } catch (error) {
    console.warn("Usando projetos de fallback devido a erro na API", error);
    return fallbackProjects;
  }
}

export async function getProjectDetail(projectId: string): Promise<{
  project: Project;
  activities: ProjectActivity[];
  photos: ProjectPhoto[];
  schedule: ProjectScheduleEntry[];
}> {
  const query = /* GraphQL */ `
    query ProjectDetail($projectId: ID!) {
      project(id: $projectId) {
        id
        name
        status
        budget
        location
        startDate
        endDate
      }
      projectActivities(projectId: $projectId) {
        id
        title
        responsible
        progress
      }
      projectPhotos(projectId: $projectId) {
        id
        url
        description
        createdAt
      }
      projectSchedule(projectId: $projectId) {
        id
        milestone
        plannedDate
        actualDate
      }
    }
  `;

  try {
    return await apiGraphQL(query, { projectId }).then((response) => {
      const { project, projectActivities, projectPhotos, projectSchedule } = response as Record<string, unknown>;
      return {
        project: project as Project,
        activities: projectActivities as ProjectActivity[],
        photos: projectPhotos as ProjectPhoto[],
        schedule: projectSchedule as ProjectScheduleEntry[],
      };
    });
  } catch (error) {
    console.warn("Usando detalhes de fallback devido a erro na API", error);
    const fallback = projectId === fallbackDetail.project.id
      ? fallbackDetail
      : {
          ...fallbackDetail,
          project: fallbackProjects.find((project) => project.id === projectId) ?? fallbackDetail.project,
        };
    return fallback;
  }
}
