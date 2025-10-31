import { AppShell } from "@/components/AppShell";
import { ChecklistConfigurator } from "@/components/ChecklistConfigurator";

export default function ChecklistsPage() {
  return (
    <AppShell>
      <h1>Configuração de Checklists ISO</h1>
      <ChecklistConfigurator />
    </AppShell>
  );
}
