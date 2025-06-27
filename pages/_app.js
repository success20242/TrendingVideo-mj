import Head from "next/head";
import Script from "next/script";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>🎥 TrendifyTube — Trending YouTube & Smart Shopping Deals</title>
        <meta name="description" content="Instantly explore trending YouTube videos by country and discover relevant Amazon and 3kings boutique deals, all in one place with TrendifyTube. Enjoy entertainment, smart shopping, and premium features—tailored for a global audience." />
        <meta name="robots" content="index,follow" />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="🎥 TrendifyTube — Trending YouTube & Smart Shopping Deals" />
        <meta property="og:description" content="Instantly explore trending YouTube videos by country and discover relevant Amazon and 3kings boutique deals, all in one place with TrendifyTube. Enjoy entertainment, smart shopping, and premium features—tailored for a global audience." />
        <meta property="og:image" content="https://trendifyhub.vercel.app/logo.png" />
        <meta property="og:url" content="https://trendifyhub.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="🎥 TrendifyTube — Trending YouTube & Smart Shopping Deals" />
        <meta name="twitter:description" content="Instantly explore trending YouTube videos by country and discover relevant Amazon and 3kings boutique deals, all in one place with TrendifyTube. Enjoy entertainment, smart shopping, and premium features—tailored for a global audience." />
        <meta name="twitter:image" content="https://trendifyhub.vercel.app/logo.png" />
        <meta name="twitter:url" content="https://trendifyhub.vercel.app/" />

        {/* AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2261833870173099"
          crossOrigin="anonymous"
        ></script>
        {/* AdSense meta tag */}
        <meta name="google-adsense-account" content="ca-pub-2261833870173099" />
      </Head>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-L6CN6PWBZ0`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L6CN6PWBZ0', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
