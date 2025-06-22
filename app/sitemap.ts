import type { MetadataRoute } from "next"

// Define a type for the video data we expect from the API
interface YouTubeVideoSnippet {
  title: string
  description: string
  publishedAt: string
  thumbnails: {
    high: {
      url: string
    }
  }
  channelTitle: string
}

interface YouTubeVideoItem {
  id: string
  snippet: YouTubeVideoSnippet
}

// Helper function to fetch trending videos
async function getTrendingVideosForSitemap(): Promise<YouTubeVideoItem[]> {
  try {
    // Fetch from your existing API route
    const response = await fetch(
      `${process.env.VERCEL_URL || "https://trendifyhub.vercel.app"}/api/trending?country=US&lang=en`,
      {
        // Revalidate data every 24 hours (86400 seconds)
        next: { revalidate: 86400 },
      },
    )

    if (!response.ok) {
      console.error(`Failed to fetch trending videos for sitemap: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    return Array.isArray(data.items) ? data.items : []
  } catch (error) {
    console.error("Error fetching trending videos for sitemap:", error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://trendifyhub.vercel.app"
  const videos = await getTrendingVideosForSitemap()

  const videoEntries = videos.map((video) => {
    // Note: YouTube API 'snippet' part does not include duration directly.
    // For a real application, you would fetch 'contentDetails' part for accurate duration.
    // Here, we use a placeholder duration.
    const dummyDuration = 300 // Example: 5 minutes

    return {
      url: `${baseUrl}/videos/${video.id}`, // Assuming you have a dynamic route for individual videos
      lastModified: video.snippet.publishedAt,
      changeFrequency: "daily",
      priority: 0.9,
      video: {
        thumbnail_loc: video.snippet.thumbnails.high.url,
        title: video.snippet.title,
        description: video.snippet.description,
        content_loc: `https://www.youtube.com/watch?v=${video.id}`,
        player_loc: `https://www.youtube.com/embed/${video.id}`,
        duration: dummyDuration,
        publication_date: video.snippet.publishedAt,
      },
    }
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...videoEntries,
  ]
}
