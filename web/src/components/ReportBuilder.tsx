"use client";

import { useEffect, useMemo, useState } from "react";
import { ReportTemplate, saveReport } from "@/services/api/reports";
import { exportReportToDocx, exportReportToPdf } from "@/services/reporting/exporters";
import { rolePermissions, useRBAC } from "@/store/rbac";
import { AssistantChat } from "./AssistantChat";
import { listIsoMetadata } from "@/services/api/iso";
import { requestReportSuggestion } from "@/services/api/assistant";

interface ReportBuilderProps {
  template: ReportTemplate;
  projectId: string;
}

export function ReportBuilder({ template, projectId }: ReportBuilderProps) {
  const [sections, setSections] = useState(template.sections);
  const [status, setStatus] = useState<string | null>(null);
  const [isoChecklist, setIsoChecklist] = useState<{ id: string; clause: string; description: string; mandatory: boolean }[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<Record<string, boolean>>({});
  const [conversationId] = useState(
    () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `conversation-${Date.now()}`)
  );
  const { role } = useRBAC();
  const canGenerate = rolePermissions[role].includes("generate_reports");

  useEffect(() => {
    let isMounted = true;
    listIsoMetadata()
      .then((items) => {
        if (isMounted) {
          setIsoChecklist(items);
        }
      })
      .catch((error) => {
        console.warn("Falha ao carregar checklist ISO", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleContentChange = (sectionId: string, content: string) => {
    setSections((current) =>
      current.map((section) => (section.id === sectionId ? { ...section, content } : section))
    );
  };

  const handleSave = async () => {
    try {
      await saveReport({
        projectId,
        templateId: template.id,
        sections: sections.map(({ id, content }) => ({ id, content })),
      });
      setStatus("Relatório salvo com sucesso!");
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleExport = async (format: "pdf" | "docx") => {
    const exporter = format === "pdf" ? exportReportToPdf : exportReportToDocx;
    const blob = await exporter(template.title, sections.map(({ title, content }) => ({ title, content })));
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.title}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const assistantContext = useMemo(() => {
    const description = sections
      .map((section) => `${section.title}: ${section.content.slice(0, 280)}`)
      .join("\n");

    return {
      worksite: {
        name: template.title,
        status: "Elaboração de relatório",
        description,
      },
      checklists: isoChecklist.map((item) => ({
        title: item.clause,
        status: item.mandatory ? "obrigatório" : "opcional",
        non_conformities: [],
      })),
      photos: [],
    };
  }, [isoChecklist, sections, template.title]);

  const handleSuggestion = async (sectionId: string, sectionTitle: string, currentContent: string) => {
    setSuggestionsLoading((prev) => ({ ...prev, [sectionId]: true }));
    setStatus(null);
    try {
      const suggestion = await requestReportSuggestion({
        conversation_id: conversationId,
        report_section: sectionTitle,
        summary: currentContent,
        context: assistantContext,
      });

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                content: section.content
                  ? `${section.content}\n\n${suggestion.suggestion}`
                  : suggestion.suggestion,
              }
            : section
        )
      );
      setStatus(`Sugestão aplicada à seção "${sectionTitle}".`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setSuggestionsLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  return (
    <div className="card">
      <h2>{template.title}</h2>
      <p>Customize os blocos abaixo antes de gerar o relatório final.</p>
      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: "1.5rem" }}>
          <label htmlFor={`section-${section.id}`} style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            {section.title}
          </label>
          <textarea
            id={`section-${section.id}`}
            value={section.content}
            onChange={(event) => handleContentChange(section.id, event.target.value)}
            rows={4}
            style={{ width: "100%", padding: "1rem", borderRadius: "8px", border: "1px solid #cbd5f5" }}
          />
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              className="button"
              onClick={() => handleSuggestion(section.id, section.title, section.content)}
              disabled={suggestionsLoading[section.id]}
            >
              {suggestionsLoading[section.id] ? "Consultando..." : "Inserir sugestão do assistente"}
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="button" onClick={handleSave} disabled={!canGenerate}>
          Salvar rascunho
        </button>
        <button className="button" onClick={() => handleExport("pdf")} disabled={!canGenerate}>
          Exportar PDF
        </button>
        <button className="button" onClick={() => handleExport("docx")} disabled={!canGenerate}>
          Exportar DOCX
        </button>
      </div>
      {!canGenerate && <p style={{ color: "#ef4444" }}>Seu papel não possui permissão para gerar relatórios.</p>}
      {status && <p>{status}</p>}
      <AssistantChat conversationId={conversationId} context={assistantContext} />
    </div>
  );
}
