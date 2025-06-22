import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
  description:
    "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    url: "https://trendify12.vercel.app",
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
    images: [
      {
        url: "https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "TrendifyTube Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://trendify12.vercel.app",
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
    images: ["https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-968KK8V6LJ" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-968KK8V6LJ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
