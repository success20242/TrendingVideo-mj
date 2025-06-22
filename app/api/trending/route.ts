import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const country = searchParams.get("country") ?? "US"
  const lang = searchParams.get("lang") ?? "en"
  // Use YOUTUBE_API_KEY for server-side calls to keep it secure
  const apiKey = "AIzaSyCFrrddr9RQq911gWauyne7v1EgmyAchdQ"

  if (!apiKey) {
    console.error("YouTube API Key (YOUTUBE_API_KEY) is not set.")
    return NextResponse.json({ error: "YouTube API Key is not configured." }, { status: 500 })
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=${country}&hl=${lang}&key=${apiKey}`

  try {
    console.log(`Fetching YouTube trending videos for country: ${country}, language: ${lang}`)
    // For debugging: console.log("Using API Key (last 5 chars):", apiKey.slice(-5));

    const res = await fetch(url)

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`YouTube API returned an error: ${res.status} ${res.statusText} - ${errorText}`)
      return NextResponse.json({ error: `Failed to fetch videos: ${res.statusText}` }, { status: res.status })
    }

    const data = await res.json()
    console.log("YouTube API response data:", JSON.stringify(data, null, 2)) // Log full response

    return NextResponse.json({ items: Array.isArray(data.items) ? data.items : [] })
  } catch (e) {
    console.error("Error fetching trending videos from YouTube API:", e)
    return NextResponse.json({ error: "Internal server error while fetching videos." }, { status: 500 })
  }
}
