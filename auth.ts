import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const privateRoutes = ["/"];
const publicRoutes = ["/login"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const path = request.nextUrl.pathname;

      if (publicRoutes.includes(path) && !!auth) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (privateRoutes.includes(path) && !auth) {
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      // Logged in users are authenticated, otherwise redirect to login page
      return true;
    },
  },
});
