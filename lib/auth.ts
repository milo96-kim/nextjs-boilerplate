// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

const authSecret = process.env.AUTH_SECRET
const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET

if (!authSecret) {
  throw new Error("Missing required AUTH_SECRET environment variable")
}

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing required AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET")
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
})
