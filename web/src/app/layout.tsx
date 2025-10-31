import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "HUB Fiscalização",
  description: "Portal de acompanhamento de obras com relatórios e checklists.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
