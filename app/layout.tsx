import type React from "react";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./globals.css";

// Static Metadata for Search Engines and Social Media
export const metadata: Metadata = {
  title: "TrendifyTube",
  description: "Watch trending videos from around the world",
  generator: "v0.dev",
  metadataBase: new URL("https://trendifyhub.vercel.app"),
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
  verification: {
    google: "G68a3mRZtGTDKcAOHvC2YFHpGavV38TRiQCNQgH2rE0",
    other: {
      "fb:app_id": "612329958564700",
    },
  },
};

// Dynamic Canonical Tag Component
function CanonicalTag() {
  const pathname = usePathname();
  const canonical = `https://trendifyhub.vercel.app${pathname === "/" ? "" : pathname}`;
  return <link rel="canonical" href={canonical} />;
}

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <CanonicalTag />
      </head>
      <body>{children}</body>
    </html>
  );
}
