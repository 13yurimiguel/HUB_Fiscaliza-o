"use client";

import { useState } from "react";
import { ReportTemplate, saveReport } from "@/services/api/reports";
import { exportReportToDocx, exportReportToPdf } from "@/services/reporting/exporters";
import { rolePermissions, useRBAC } from "@/store/rbac";

interface ReportBuilderProps {
  template: ReportTemplate;
  projectId: string;
}

export function ReportBuilder({ template, projectId }: ReportBuilderProps) {
  const [sections, setSections] = useState(template.sections);
  const [status, setStatus] = useState<string | null>(null);
  const { role } = useRBAC();
  const canGenerate = rolePermissions[role].includes("generate_reports");

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
    </div>
  );
}
