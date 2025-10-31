import { apiGet } from "./client";

export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

const fallbackUsers: User[] = [
  { id: "1", name: "Ana Fiscal", email: "ana.fiscal@example.com", roles: ["fiscal"] },
  { id: "2", name: "Bruno Engenheiro", email: "bruno.engenheiro@example.com", roles: ["engenheiro"] },
  { id: "3", name: "Clara Admin", email: "clara.admin@example.com", roles: ["admin"] },
];

export async function listUsers(): Promise<User[]> {
  try {
    return await apiGet<User[]>("/users");
  } catch (error) {
    console.warn("Usando usuários de fallback", error);
    return fallbackUsers;
  }
}
