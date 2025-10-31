import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "hub-fiscalizacao",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "local-secret",
      issuer: process.env.KEYCLOAK_ISSUER || "http://localhost:8080/realms/hub"
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "roles" in profile) {
        token.roles = (profile as Record<string, unknown>).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.roles) {
        session.user = {
          ...session.user,
          roles: token.roles as string[]
        } as typeof session.user & { roles?: string[] };
      }
      return session;
    }
  }
};

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);
