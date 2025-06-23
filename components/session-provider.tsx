"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

/**
 * Global NextAuth SessionProvider wrapper for App-Router.
 * - Keeps Pages-router `_app.tsx` unchanged.
 */
export default function AppSessionProvider({
  children,
}: {
  children: ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
