import type React from "react" 
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrendifyTube",
  description: "Watch trending videos from around the world",
  generator: "v0.dev",
  openGraph: {
    title: "TrendifyTube",
    description: "Watch trending videos from around the world",
    url: "https://trendifyhub.vercel.app",
    siteName: "TrendifyTube",
    images: [
      {
        url: "https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "TrendifyTube Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendifyTube",
    description: "Watch trending videos from around the world",
    images: [
      "https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png",
    ],
  },
  other: {
    "google-site-verification": "G68a3mRZtGTDKcAOHvC2YFHpGavV38TRiQCNQgH2rE0",
    "fb:app_id": "612329958564700"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
