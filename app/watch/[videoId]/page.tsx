import { notFound } from "next/navigation"
import { fetchVideoDetails } from "@/lib/youtube"
import type { Metadata } from "next"
import VideoPlayerWithAccessControl from "@/components/video-player-with-access-control"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { AffiliateSidebar } from "@/components/affiliate-sidebar"

interface WatchPageProps {
  params: {
    videoId: string
  }
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const videoId = params.videoId
  const video = await fetchVideoDetails(videoId)

  if (!video) {
    return {
      title: "Video Not Found",
      description: "The requested video could not be found.",
    }
  }

  return {
    title: `${video.snippet.title} | TrendifyTube`,
    description: video.snippet.description,
    openGraph: {
      type: "video.other",
      url: `https://trendifyhub.vercel.app/watch/${videoId}`,
      title: `${video.snippet.title} | TrendifyTube`,
      description: video.snippet.description,
      images: [
        {
          url: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          width: video.snippet.thumbnails.maxres?.width || video.snippet.thumbnails.high.width,
          height: video.snippet.thumbnails.maxres?.height || video.snippet.thumbnails.high.height,
          alt: video.snippet.title,
        },
      ],
      videos: [
        {
          url: `https://www.youtube.com/embed/${videoId}`,
          type: "text/html",
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "https://trendifyhub.vercel.app/",
      title: `${video.snippet.title} | TrendifyTube`,
      description: video.snippet.description,
      images: [video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const videoId = params.videoId
  const video = await fetchVideoDetails(videoId)

  if (!video) {
    notFound() // Renders Next.js's default 404 page
  }

  const videoTitle = video.snippet.title
  const videoTags = video.snippet.tags || []

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="right" collapsible="none" variant="sidebar">
        <AffiliateSidebar videoTitle={videoTitle} videoTags={videoTags} />
      </Sidebar>
      {/* The main content should be a sibling to the Sidebar, wrapped in a flex-1 container */}
      <div className="flex-1">
        <main className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">{video.snippet.title}</h1>
          <div className="aspect-video w-full mb-6">
            <VideoPlayerWithAccessControl videoId={videoId} title={video.snippet.title} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{video.snippet.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Channel: {video.snippet.channelTitle} | Published:{" "}
            {new Date(video.snippet.publishedAt).toLocaleDateString()}
          </p>
        </main>
      </div>
    </SidebarProvider>
  )
}
