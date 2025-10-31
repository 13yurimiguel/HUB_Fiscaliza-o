describe("Fluxo crítico - geração de relatório", () => {
  it("permite navegar até relatórios e exportar", () => {
    cy.visit("/reports");
    cy.contains("Gerador de Relatórios");
    cy.contains("Exportar PDF").should("be.disabled");

    cy.window().then((win) => {
      win.sessionStorage.setItem(
        "useRBAC.role",
        JSON.stringify({ state: { role: "admin" }, version: 0 })
      );
    });

    cy.reload();
    cy.contains("Exportar PDF").should("not.be.disabled").click();
  });
});
