import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2261833870173099"
          crossOrigin="anonymous"
        ></script>
        {/* AdSense meta tag */}
        <meta name="google-adsense-account" content="ca-pub-2261833870173099" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
