import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
  description:
    "Watch trending YouTube videos by country and unlock exclusive Amazon & 3kings boutique deals. Subscribe for premium access!",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    url: "https://trendifyhub.vercel.app/",
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon & 3kings boutique deals. Subscribe for premium access!",
    images: [
      {
        url: "https://i.imgur.com/pAzcBnV.png",
        width: 600,
        height: 600,
        alt: "TrendifyTube Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://trendifyhub.vercel.app/",
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon & 3kings boutique deals. Subscribe for premium access!",
    images: ["https://i.imgur.com/pAzcBnV.png"],
  },
  // New meta tag for article author
  article: {
    authors: ["https://www.facebook.com/share/14E1rQ9My1r/"],
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
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-L6CN6PWBZ0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-L6CN6PWBZ0', { page_path: window.location.pathname });
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2261833870173099"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
