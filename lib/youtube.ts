interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

interface YouTubeThumbnails {
  default: YouTubeThumbnail
  medium: YouTubeThumbnail
  high: YouTubeThumbnail
  standard?: YouTubeThumbnail
  maxres?: YouTubeThumbnail
}

interface YouTubeSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: YouTubeThumbnails
  channelTitle: string
  tags?: string[]
  categoryId: string
  liveBroadcastContent: string
  defaultLanguage?: string
  localized: {
    title: string
    description: string
  }
  defaultAudioLanguage?: string
}

interface YouTubeVideoItem {
  kind: string
  etag: string
  id: string
  snippet: YouTubeSnippet
}

interface YouTubeApiResponse {
  kind: string
  etag: string
  items: YouTubeVideoItem[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

export async function fetchVideoDetails(videoId: string): Promise<YouTubeVideoItem | null> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API Key (YOUTUBE_API_KEY) is not set.")
    throw new Error("YouTube API Key is not configured.")
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      const errorText = await res.text()
      console.error(
        `YouTube API returned an error for video ${videoId}: ${res.status} ${res.statusText} - ${errorText}`,
      )
      throw new Error(`Failed to fetch video details: ${res.statusText}`)
    }

    const data: YouTubeApiResponse = await res.json()
    return data.items && data.items.length > 0 ? data.items[0] : null
  } catch (error) {
    console.error(`Error fetching video details for ${videoId}:`, error)
    return null
  }
}

export async function fetchTrendingVideoIds(maxResults = 10): Promise<string[]> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API Key (YOUTUBE_API_KEY) is not set.")
    return []
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${apiKey}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`YouTube API returned an error for trending videos: ${res.status} ${res.statusText} - ${errorText}`)
      return []
    }
    const data: YouTubeApiResponse = await res.json()
    return data.items ? data.items.map((item) => item.id) : []
  } catch (error) {
    console.error("Error fetching trending video IDs:", error)
    return []
  }
}
