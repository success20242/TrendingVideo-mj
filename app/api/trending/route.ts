import { NextResponse } from "next/server";

// Helper to validate country and language codes (basic, extend as needed)
const ALLOWED_COUNTRIES = [
  "US","CA","GB","AE","NG","IN","FR","BR","DE","JP","RU","ZA","EG","PH","ID","KR"
];
const ALLOWED_LANGUAGES = [
  "en","fr","es","pt","de","ja","ru","zh","ko","ar","hi","ha","ig","yo"
];

function validateCountryCode(code: string): string {
  return ALLOWED_COUNTRIES.includes(code.toUpperCase()) ? code.toUpperCase() : "US";
}
function validateLanguageCode(code: string): string {
  return ALLOWED_LANGUAGES.includes(code.toLowerCase()) ? code.toLowerCase() : "en";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const country = validateCountryCode(searchParams.get("country") ?? "US");
  const lang = validateLanguageCode(searchParams.get("lang") ?? "en");
  const maxResults = 12; // Make this configurable if needed

  // Use YOUTUBE_API_KEY for server-side calls to keep it secure
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YouTube API Key (YOUTUBE_API_KEY) is not set.");
    return NextResponse.json(
      { error: "YouTube API Key is not configured." },
      { status: 500 }
    );
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=${maxResults}&regionCode=${country}&hl=${lang}&key=${apiKey}`;

  try {
    console.log(
      `Fetching YouTube trending videos for country: ${country}, language: ${lang}`
    );

    // Use fetch with timeout to avoid hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10 seconds

    const res = await fetch(url, { signal: controller.signal });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      // Try to parse YouTube error message if possible
      let errorMessage = `Failed to fetch videos: ${res.statusText}`;
      try {
        const errJson = JSON.parse(errorText);
        if (errJson?.error?.message) {
          errorMessage += ` (${errJson.error.message})`;
        }
      } catch {}
      console.error(
        `YouTube API returned an error: ${res.status} ${res.statusText} - ${errorText}`
      );
      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      );
    }

    const data = await res.json();
    // Only log errors or suspicious data for production
    if (!Array.isArray(data.items)) {
      console.warn("YouTube API data.items is not an array:", data);
    }

    // Optionally filter out videos without required fields (robustness)
    const items = (Array.isArray(data.items) ? data.items : []).filter(
      (item) =>
        item &&
        item.id &&
        item.snippet &&
        typeof item.snippet.title === "string" &&
        typeof item.snippet.channelTitle === "string"
    );

    return NextResponse.json({ items });
  } catch (e: any) {
    if (e.name === "AbortError") {
      console.error("YouTube API request timed out.");
      return NextResponse.json(
        { error: "Upstream request timed out." },
        { status: 504 }
      );
    }
    console.error("Error fetching trending videos from YouTube API:", e);
    return NextResponse.json(
      { error: "Internal server error while fetching videos." },
      { status: 500 }
    );
  }
}
