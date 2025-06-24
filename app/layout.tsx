import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrendifyTube",
  description: "Watch trending videos from around the world",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleCseId = process.env.NEXT_PUBLIC_CSE_ID

  return (
    <html lang="en">
      <body>
        {children}
        {googleCseId && <script async src={`https://cse.google.com/cse.js?cx=${googleCseId}`}></script>}
      </body>
    </html>
  )
}
