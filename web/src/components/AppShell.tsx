"use client";

import Link from "next/link";
import { ChangeEvent, ReactNode, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRBAC } from "@/store/rbac";

export function AppShell({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { role, setRole } = useRBAC();

  useEffect(() => {
    // Trigger hydration of persisted RBAC role
    // @ts-expect-error - persist property is injected by middleware
    useRBAC.persist?.rehydrate?.();
  }, []);

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as typeof role);
  };

  return (
    <div>
      <header>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <strong>HUB Fiscalização</strong>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5f5" }}>
              Monitoramento de obras com governança ISO
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {status === "authenticated" ? (
              <>
                <span>
                  {session?.user?.name} — {role.toUpperCase()}
                </span>
                <select value={role} onChange={handleRoleChange} aria-label="Selecionar papel">
                  <option value="admin">Admin</option>
                  <option value="engenheiro">Engenheiro</option>
                  <option value="fiscal">Fiscal</option>
                </select>
                <button className="button" onClick={() => signOut()}>Sair</button>
              </>
            ) : (
              <button className="button" onClick={() => signIn()}>Entrar</button>
            )}
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <Link href="/projects">Obras</Link>
            </li>
            <li>
              <Link href="/reports">Relatórios</Link>
            </li>
            <li>
              <Link href="/checklists">Checklists ISO</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
