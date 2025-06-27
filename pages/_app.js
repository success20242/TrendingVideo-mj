import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Google AdSense script: placed once, async, in head */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2261833870173099"
          crossOrigin="anonymous"
        ></script>
        {/* Publisher meta tag for Google */}
        <meta name="google-adsense-account" content="ca-pub-2261833870173099" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
