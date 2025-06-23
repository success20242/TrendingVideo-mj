import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchVideoDetails } from "@/lib/youtube"
import Footer from "@/components/footer" // Assuming Footer component exists

interface WatchPageProps {
  params: {
    videoId: string
  }
}

// Generate dynamic metadata for each video page
export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const video = await fetchVideoDetails(params.videoId)

  if (!video) {
    return {
      title: "Video Not Found",
      description: "The requested video could not be found.",
    }
  }

  const title = video.snippet.title
  const description = video.snippet.description
  const thumbnailUrl = video.snippet.thumbnails.high.url
  const uploadDate = video.snippet.publishedAt.split("T")[0] // YYYY-MM-DD

  return {
    title: `${title} | TrendifyTube`,
    description: description,
    openGraph: {
      type: "video.other",
      url: `https://trendifyhub.vercel.app/watch/${params.videoId}`,
      title: title,
      description: description,
      images: [
        {
          url: thumbnailUrl,
          width: video.snippet.thumbnails.high.width,
          height: video.snippet.thumbnails.high.height,
          alt: title,
        },
      ],
      // Video specific Open Graph tags
      videos: {
        url: `https://www.youtube.com/embed/${params.videoId}`,
        secureUrl: `https://www.youtube.com/embed/${params.videoId}`,
        type: "application/x-shockwave-flash", // Common type for YouTube embeds
        width: 1280, // Example width
        height: 720, // Example height
      },
      publishedTime: uploadDate,
    },
    twitter: {
      card: "player", // Use 'player' card for embedded videos
      site: "@trendifyhub", // Replace with your Twitter handle if available
      title: title,
      description: description,
      images: [thumbnailUrl],
      creator: video.snippet.channelTitle,
      player: {
        url: `https://www.youtube.com/embed/${params.videoId}`,
        width: 1280,
        height: 720,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://trendifyhub.vercel.app/watch/${params.videoId}`,
    },
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const video = await fetchVideoDetails(params.videoId)

  if (!video) {
    notFound() // Render 404 page if video is not found
  }

  const title = video.snippet.title
  const description = video.snippet.description
  const thumbnailUrl = video.snippet.thumbnails.high.url
  const uploadDate = video.snippet.publishedAt.split("T")[0] // YYYY-MM-DD

  // Structured data for VideoObject
  const videoStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: description,
    thumbnailUrl: [thumbnailUrl], // Changed to array
    uploadDate: uploadDate,
    embedUrl: `https://www.youtube.com/embed/${params.videoId}`,
    contentUrl: `https://trendifyhub.vercel.app/watch/${params.videoId}`, // Keeping canonical URL for contentUrl
    duration: "PT1M30S", // Placeholder: You might need to fetch actual duration if available
    interactionCount: "0", // Placeholder: You might need to fetch actual view count
    expires: "2029-12-31T23:59:59+00:00", // Placeholder: Set an appropriate expiry date
    publisher: {
      // Added publisher information
      "@type": "Organization",
      name: "TrendifyTube",
      logo: {
        "@type": "ImageObject",
        url: "https://trendifyhub.vercel.app/logo.png", // Ensure this path is correct
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 px-6 pt-6 pb-20 transition-colors duration-300">
      <header className="text-center mb-8 max-w-5xl mx-auto">
        <img
          src="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
          alt="TrendifyTube Logo"
          className="mx-auto w-48 h-48 mb-6 drop-shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Trending Video</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">🔥 Watch What's Hot. Shop What's Smarter.</p>
      </header>

      <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h1>
        <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${params.videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h2>
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-6">{description}</p>
        <a
          href={`https://www.amazon.com/s?k=${encodeURIComponent(title)}&tag=qualitygood0d-21`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-sm text-blue-600 hover:underline"
        >
          🛍️ Shop related products on Amazon
        </a>
        <a
          href="https://www.facebook.com/share/14E1rQ9My1r/"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1 text-sm text-green-600 hover:underline"
        >
          👞 Explore stylish shoes from 3Kings Boutique on Facebook
        </a>
      </main>

      <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">👟 Partnered with 3Kings Boutique</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover top-quality imported shoes. Visit their store on Facebook.
        </p>
        <a
          href="https://www.facebook.com/share/14E1rQ9My1r/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Shop 3Kings Boutique
        </a>
      </section>

      <Footer />

      {/* Structured Data for VideoObject */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }} />
    </div>
  )
}
