import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      if (allowedEmails.includes(user.email || '')) {
        return true;
      }
      return false; // Access denied
    },
  },
  pages: {
    signIn: '/login',
  },
})
