import TrendingVideo from "./trending-video";
import AffiliateSidebar from "@/components/affiliate-sidebar";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: "1px solid #eee",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <AffiliateSidebar />
      </div>
      <div
        style={{
          flex: 1,
          boxSizing: "border-box",
          // Optionally, add padding here if you want space around TrendingVideo
          // padding: 24,
        }}
      >
        <TrendingVideo />
      </div>
    </div>
  );
}
