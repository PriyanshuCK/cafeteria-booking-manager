import type { NextAuthConfig } from "next-auth";
import { getUser } from "./app/lib/data";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdminDashboard = nextUrl.pathname.startsWith("/admin");
      const isOnRoot = nextUrl.pathname === "/";

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isOnAdminDashboard) {
        if (isLoggedIn && auth?.user?.email) {
          const user = await getUser(auth?.user?.email);
          if (user?.is_admin) {
            return true;
          }
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return false;
      } else if (isOnRoot) {
        if (isLoggedIn && auth?.user?.email) {
          const user = await getUser(auth?.user?.email);
          if (user?.is_admin) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
