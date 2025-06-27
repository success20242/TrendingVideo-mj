import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2261833870173099"
      data-ad-slot="YOUR_SLOT_ID"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
