"use client"

import type * as React from "react"
import { SessionProvider } from "next-auth/react"

/**
 * Stub SessionProvider
 *
 * – Supplies a `null` session so `useSession()` works without errors
 * – Disables all background refetches that would normally hit `/api/auth/session`
 * – No real auth / Firebase code is re-introduced.
 */
export default function AppSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider
      // no session → treat user as unauthenticated
      session={null}
      // turn off polling so NextAuth never calls the non-existent API route
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
