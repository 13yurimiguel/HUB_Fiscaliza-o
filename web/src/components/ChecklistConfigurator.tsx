"use client";

import { useEffect, useState } from "react";
import { IsoChecklistItem, listIsoMetadata, updateIsoChecklist } from "@/services/api/iso";
import { rolePermissions, useRBAC } from "@/store/rbac";

export function ChecklistConfigurator() {
  const [items, setItems] = useState<IsoChecklistItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const { role } = useRBAC();
  const canConfigure = rolePermissions[role].includes("configure_iso");

  useEffect(() => {
    listIsoMetadata().then(setItems).catch((error) => setStatus(error.message));
  }, []);

  const toggleMandatory = (itemId: string) => {
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, mandatory: !item.mandatory } : item))
    );
  };

  const handleSave = async () => {
    try {
      await updateIsoChecklist(items);
      setStatus("Checklist atualizado com sucesso!");
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="card">
      <h2>Checklist ISO</h2>
      <p>Ative os itens que devem ser auditados obrigatoriamente pelas equipes de fiscalização.</p>
      <ul style={{ maxHeight: "360px", overflow: "auto", padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <strong>{item.clause}</strong>
              <p style={{ margin: 0 }}>{item.description}</p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={item.mandatory}
                onChange={() => toggleMandatory(item.id)}
                disabled={!canConfigure}
              />
              Obrigatório
            </label>
          </li>
        ))}
      </ul>
      <button className="button" onClick={handleSave} disabled={!canConfigure}>
        Salvar checklist
      </button>
      {!canConfigure && <p style={{ color: "#ef4444" }}>Apenas administradores podem alterar os checklists.</p>}
      {status && <p>{status}</p>}
    </div>
  );
}
