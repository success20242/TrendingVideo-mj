/** @type {import('next-sitemap').IConfig} */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trendifyhub.vercel.app"

/* Helper — fetches trending video IDs and details for the sitemap */
async function getTrendingVideos(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${apiKey}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error("Failed to fetch trending videos: HTTP", res.status)
      return []
    }
    const data = await res.json()
    return Array.isArray(data.items)
      ? data.items.map((i) => ({
          id: i.id,
          title: i.snippet?.title || "Trending video",
          description: i.snippet?.description || "Trending YouTube video",
          thumbnail: i.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${i.id}/mqdefault.jpg`,
          publishedAt: i.snippet?.publishedAt || new Date().toISOString(),
        }))
      : []
  } catch (err) {
    console.error("Error fetching trending videos for sitemap:", err)
    return []
  }
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },

  additionalPaths: async (config) => {
    const videos = await getTrendingVideos()
    return videos.map((video) => ({
      loc: `/watch/${video.id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
      video: [
        {
          title: video.title,
          description: video.description,
          thumbnail_loc: video.thumbnail,
          player_loc: `https://www.youtube.com/embed/${video.id}`,
          publication_date: video.publishedAt,
        },
      ],
    }))
  },
}
