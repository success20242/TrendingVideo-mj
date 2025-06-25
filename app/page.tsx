import TrendingVideo from "../trending-video"
import AffiliateSidebar from "@/components/affiliate-sidebar"

export default function Page() {
  // Updated video title
  const videoTitle = "Welcome to TrendifyTube"
  const videoTags = ["Brawl Stars", "Starr Park"]

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 320, flexShrink: 0, borderRight: "1px solid #eee", minHeight: "100vh" }}>
        <AffiliateSidebar videoTitle={videoTitle} videoTags={videoTags} />
      </div>
      <div style={{ flex: 1 }}>
        <TrendingVideo />
      </div>
    </div>
  )
}
