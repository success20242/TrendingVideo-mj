"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Head from "next/head"

export default function TrendingVideo() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [darkMode, setDarkMode] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  // Load dark mode preference & premium status on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const premiumStatus = localStorage.getItem("isPremium") === "true"
    setIsPremium(premiumStatus)
  }, [])

  // Toggle dark mode & save preference
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      localStorage.setItem("darkMode", newMode)
      return newMode
    })
  }

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            part: "snippet",
            chart: "mostPopular",
            maxResults: 12,
            regionCode: selectedCountry,
            hl: selectedLanguage,
            key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
          },
        })
        setVideos(response.data.items)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching trending videos:", error)
        setLoading(false)
      }
    }

    fetchTrendingVideos()
  }, [selectedCountry, selectedLanguage])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`
    script.async = true
    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createSubscription: (data, actions) =>
              actions.subscription.create({
                plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
              }),
            onApprove: (data) => {
              alert("Subscription completed! ID: " + data.subscriptionID)
              localStorage.setItem("isPremium", "true")
              setIsPremium(true) // update state instantly
            },
          })
          .render("#paypal-button-container")
      }
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-6 transition-colors duration-300">
      <Head>
        <title>🔥 TrendifyTube - Viral Videos + Smart Shopping</title>
        <meta
          name="description"
          content="Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trendify12.vercel.app" />
        <meta property="og:title" content="🔥 TrendifyTube - Viral Videos + Smart Shopping" />
        <meta
          property="og:description"
          content="Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://trendify12.vercel.app" />
        <meta name="twitter:title" content="🔥 TrendifyTube - Viral Videos + Smart Shopping" />
        <meta
          name="twitter:description"
          content="Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!"
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N68WW63XZ4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N68WW63XZ4', { page_path: window.location.pathname });
            `,
          }}
        />
      </Head>

      <header className="text-center mb-8">
        <img
          src="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
          alt="Logo"
          className="mx-auto w-40 h-40 mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Trending Video</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">🔥 Watch What's Hot. Shop What's Smarter.</p>

        <div className="flex justify-center gap-4 my-4 flex-wrap items-center">
          <select
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            value={selectedCountry}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="NG">Nigeria</option>
            <option value="IN">India</option>
            <option value="FR">France</option>
            <option value="BR">Brazil</option>
            <option value="DE">Germany</option>
            <option value="JP">Japan</option>
            <option value="RU">Russia</option>
            <option value="ZA">South Africa</option>
            <option value="EG">Egypt</option>
            <option value="PH">Philippines</option>
            <option value="ID">Indonesia</option>
            <option value="KR">South Korea</option>
          </select>

          <select
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            value={selectedLanguage}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ko">Korean</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
            <option value="yo">Yoruba</option>
          </select>

          <button
            onClick={toggleDarkMode}
            className="ml-4 px-4 py-2 rounded bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        {!isPremium && <div id="paypal-button-container" className="my-6"></div>}
        {isPremium && <div className="text-green-500 font-semibold mb-6">👑 Premium Features Unlocked!</div>}
      </header>

      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">Loading videos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => {
            const locked = !isPremium && idx >= 3 // lock videos after first 3 for non-premium

            return (
              <div
                key={video.id}
                className="relative bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-colors duration-300"
              >
                {locked ? (
                  <div className="flex items-center justify-center w-full h-60 bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold text-lg">
                    🔒 Subscribe to unlock
                  </div>
                ) : (
                  <iframe
                    className="w-full h-60"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.snippet.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{video.snippet.title}</h2>
                  {!locked && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.snippet.channelTitle}</p>
                  )}
                  <a
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(video.snippet.title)}&tag=qualitygood0d-21`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Shop related products on Amazon
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
