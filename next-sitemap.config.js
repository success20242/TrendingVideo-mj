import fetch from 'node-fetch';  // if you need to polyfill fetch

/** @type {import('next-sitemap').IConfig} */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trendifyhub.vercel.app";

async function getTrendingVideos(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing YOUTUBE_API_KEY in environment variables.");
    return [];
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ Failed to fetch trending videos. HTTP status:", res.status);
      return [];
    }

    const data = await res.json();

    return Array.isArray(data.items)
      ? data.items.map((i) => ({
          id: i.id,
          title: i.snippet?.title || "Trending video",
          description: i.snippet?.description || "Trending YouTube video",
          thumbnail_loc:
            i.snippet?.thumbnails?.medium?.url ||
            `https://i.ytimg.com/vi/${i.id}/mqdefault.jpg`,
          publishedAt: i.snippet?.publishedAt || new Date().toISOString(),
        }))
      : [];
  } catch (err) {
    console.error("❌ Error fetching videos:", err);
    return [];
  }
}

const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  additionalPaths: async (config) => {
    const videos = await getTrendingVideos();

    return videos.map((video) => ({
      loc: `/watch/${video.id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: video.publishedAt,
      alternateRefs: [], // optional for multi-language sites
      video: [
        {
          "video:thumbnail_loc": video.thumbnail_loc,
          "video:title": video.title,
          "video:description": video.description,
          "video:player_loc": `https://www.youtube.com/embed/${video.id}`,
          "video:publication_date": video.publishedAt,
        },
      ],
    }));
  },
};

export default config;
