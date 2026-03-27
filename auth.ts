import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/patient');
      
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
  }
})
