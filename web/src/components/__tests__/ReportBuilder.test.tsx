import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReportBuilder } from "@/components/ReportBuilder";
import { saveReport } from "@/services/api/reports";
import { exportReportToDocx, exportReportToPdf } from "@/services/reporting/exporters";
import { useRBAC } from "@/store/rbac";

jest.mock("@/services/api/reports", () => ({
  saveReport: jest.fn(),
}));

jest.mock("@/services/reporting/exporters", () => ({
  exportReportToPdf: jest.fn(() => Promise.resolve(new Blob(["pdf"]))),
  exportReportToDocx: jest.fn(() => Promise.resolve(new Blob(["docx"]))),
}));

jest.mock("@/store/rbac", () => ({
  useRBAC: jest.fn().mockReturnValue({ role: "admin", setRole: jest.fn() }),
  rolePermissions: {
    admin: ["generate_reports", "configure_iso", "view_projects", "edit_projects"],
    engenheiro: ["view_projects"],
    fiscal: ["view_projects"],
  },
}));

describe("ReportBuilder", () => {
  const template = {
    id: "template-1",
    title: "Relatório de Fiscalização",
    sections: [
      { id: "context", title: "Contexto", content: "Situação atual" },
      { id: "risks", title: "Riscos", content: "Sem riscos" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "URL", {
      value: {
        createObjectURL: jest.fn(() => "blob:url"),
        revokeObjectURL: jest.fn(),
      },
      writable: true,
    });
  });

  it("permite atualizar conteúdo e salvar", async () => {
    (useRBAC as jest.Mock).mockReturnValue({ role: "admin", setRole: jest.fn() });
    render(<ReportBuilder template={template} projectId="project-1" />);

    fireEvent.change(screen.getByLabelText("Contexto"), {
      target: { value: "Contexto atualizado" },
    });
    fireEvent.click(screen.getByText("Salvar rascunho"));

    await waitFor(() => {
      expect(saveReport).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "project-1",
          templateId: "template-1",
        })
      );
    });
  });

  it("bloqueia ações quando o papel não possui permissão", () => {
    (useRBAC as jest.Mock).mockReturnValue({ role: "fiscal", setRole: jest.fn() });
    const { container } = render(<ReportBuilder template={template} projectId="project-1" />);

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
    expect(screen.getByText(/não possui permissão/i)).toBeInTheDocument();
  });

  it("exporta PDF", async () => {
    (useRBAC as jest.Mock).mockReturnValue({ role: "admin", setRole: jest.fn() });
    render(<ReportBuilder template={template} projectId="project-1" />);

    fireEvent.click(screen.getByText("Exportar PDF"));

    await waitFor(() => {
      expect(exportReportToPdf).toHaveBeenCalled();
    });
  });
});
