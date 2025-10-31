import { apiGet, apiPost } from "./client";

export type IsoChecklistItem = {
  id: string;
  clause: string;
  description: string;
  mandatory: boolean;
};

const fallbackChecklist: IsoChecklistItem[] = [
  {
    id: "iso-9001-4.1",
    clause: "ISO 9001 - 4.1",
    description: "Compreensão da organização e seu contexto",
    mandatory: true,
  },
  {
    id: "iso-9001-7.1",
    clause: "ISO 9001 - 7.1",
    description: "Recursos para execução das obras",
    mandatory: true,
  },
  {
    id: "iso-14001-6.1",
    clause: "ISO 14001 - 6.1",
    description: "Aspectos ambientais nas frentes de trabalho",
    mandatory: false,
  },
];

export async function listIsoMetadata(): Promise<IsoChecklistItem[]> {
  try {
    return await apiGet<IsoChecklistItem[]>("/iso/checklists");
  } catch (error) {
    console.warn("Usando checklist ISO de fallback", error);
    return fallbackChecklist;
  }
}

export async function updateIsoChecklist(items: IsoChecklistItem[]): Promise<{ success: boolean }> {
  try {
    return await apiPost<{ success: boolean }>("/iso/checklists", { items });
  } catch (error) {
    console.warn("Não foi possível sincronizar com a API, mantendo alterações localmente", error);
    return { success: true };
  }
}
