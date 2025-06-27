/** @type {import('next-sitemap').IConfig} */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trendifyhub.vercel.app"

/* Helper — fetches a handful of trending IDs for the sitemap */
async function getTrendingVideoIds(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY
  /* Fallback: if key missing, return empty list so the build still succeeds */
  if (!apiKey) return []

  const url = `https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${apiKey}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error("Failed to fetch trending videos: HTTP", res.status)
      return []
    }
    const data = await res.json()
    return Array.isArray(data.items) ? data.items.map((i) => i.id) : []
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

  /* Append dynamic watch pages */
  additionalPaths: async (config) => {
    const ids = await getTrendingVideoIds()
    return ids.map((videoId) => ({
      loc: `/watch/${videoId}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
      /* Basic video:video block – extend if you need more fields */
      video: [
        {
          title: "Trending video",
          thumbnail_loc: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          player_loc: `https://www.youtube.com/embed/${videoId}`,
        },
      ],
    }))
  },
}
