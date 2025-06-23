import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/firebase" // Use @/lib/firebase for App Router
import bcrypt from "bcryptjs"

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { email, password } = credentials

        // Fetch user from Firestore
        const usersRef = db.collection("users")
        const snapshot = await usersRef.where("email", "==", email).get()

        if (snapshot.empty) return null

        const userDoc = snapshot.docs[0]
        const userData = userDoc.data()

        const valid = await bcrypt.compare(password, userData.passwordHash)
        if (!valid) return null

        return {
          id: userDoc.id,
          email: userData.email,
          role: userData.role || "user",
          subscriptionStatus: userData.subscriptionStatus || "inactive",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.subscriptionStatus = user.subscriptionStatus
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.subscriptionStatus = token.subscriptionStatus
      return session
    },
  },
  pages: { signIn: "/login" },
}

// This is needed for the App Router's route.ts file
export default NextAuth(authOptions)
