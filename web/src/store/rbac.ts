"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Role = "admin" | "engenheiro" | "fiscal";

type RBACState = {
  role: Role;
  setRole: (role: Role) => void;
};

const persistConfig = {
  name: "useRBAC.role",
  skipHydration: true,
  ...(typeof window !== "undefined"
    ? {
        storage: createJSONStorage(() => sessionStorage),
      }
    : {}),
} as const;

export const useRBAC = create<RBACState>()(
  persist(
    (set) => ({
      role: "fiscal",
      setRole: (role) => set({ role }),
    }),
    persistConfig
  )
);

export const rolePermissions: Record<Role, string[]> = {
  admin: ["view_projects", "edit_projects", "generate_reports", "configure_iso"],
  engenheiro: ["view_projects", "edit_projects", "generate_reports"],
  fiscal: ["view_projects", "generate_reports"],
};
