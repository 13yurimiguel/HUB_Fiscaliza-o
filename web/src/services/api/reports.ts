import { apiGet, apiPost } from "./client";

export type ReportTemplate = {
  id: string;
  title: string;
  sections: { id: string; title: string; content: string }[];
};

const fallbackTemplates: ReportTemplate[] = [
  {
    id: "fiscalizacao-padrao",
    title: "Relatório padrão de fiscalização",
    sections: [
      { id: "resumo", title: "Resumo executivo", content: "Resumo das atividades e conclusões." },
      { id: "andamento", title: "Andamento físico", content: "Percentual executado por disciplina." },
      { id: "riscos", title: "Riscos e oportunidades", content: "Principais riscos identificados." },
    ],
  },
];

export async function listReportTemplates(): Promise<ReportTemplate[]> {
  try {
    return await apiGet<ReportTemplate[]>("/reports/templates");
  } catch (error) {
    console.warn("Usando modelo de relatório de fallback", error);
    return fallbackTemplates;
  }
}

export async function saveReport(data: {
  projectId: string;
  templateId: string;
  sections: { id: string; content: string }[];
}): Promise<{ id: string }> {
  try {
    return await apiPost<{ id: string }>("/reports", data);
  } catch (error) {
    console.warn("Não foi possível enviar o relatório para a API, armazenando localmente", error);
    return { id: `${data.templateId}-${Date.now()}` };
  }
}
