"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Footer from "@/components/footer"
import { useSession, signOut } from "next-auth/react" // Add this import
import Link from "next/link"

export default function TrendingVideo() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [darkMode, setDarkMode] = useState(false)

  // Use useSession to get user's session data
  const { data: session, status } = useSession()
  const isPremium = session?.user?.subscriptionStatus === "active"
  const isOwner = session?.user?.role === "admin" // Assuming 'admin' role for owner

  // Load dark mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
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
      setLoading(true) // Set loading to true before fetching
      try {
        const response = await axios.get("/api/trending", {
          params: { country: selectedCountry, lang: selectedLanguage },
        })
        setVideos(Array.isArray(response.data.items) ? response.data.items : [])
      } catch (error) {
        console.error("Error fetching trending videos:", error)
        setVideos([]) // Ensure videos is an empty array on error
      } finally {
        setLoading(false) // Always set loading to false after attempt
      }
    }

    fetchTrendingVideos()
  }, [selectedCountry, selectedLanguage])

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

        <div className="flex justify-center gap-4 my-4 flex-wrap items-center">
          <select
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            value={selectedCountry}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AE">United Arab Emirates</option> {/* Added UAE */}
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
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="yo">Yoruba</option>
          </select>

          <button
            onClick={toggleDarkMode}
            className="ml-4 px-4 py-2 rounded bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          {status === "authenticated" ? (
            <>
              <Link
                href="/profile"
                className="ml-4 px-4 py-2 rounded bg-blue-600 dark:bg-blue-700 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
              >
                My Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="ml-4 px-4 py-2 rounded bg-red-600 dark:bg-red-700 text-white font-semibold hover:bg-red-700 dark:hover:bg-red-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-4 px-4 py-2 rounded bg-green-600 dark:bg-green-700 text-white font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition"
            >
              Login
            </Link>
          )}
        </div>

        {status === "loading" ? (
          <div className="text-gray-500 dark:text-gray-400 text-center my-6">Checking subscription status...</div>
        ) : (
          <>
            {!isPremium && !isOwner && (
              <div className="flex justify-center">
                <div id="paypal-button-container" className="my-6"></div>
              </div>
            )}
            {(isPremium || isOwner) && (
              <div className="text-green-500 font-semibold mb-6">👑 Premium Features Unlocked!</div>
            )}
          </>
        )}
      </header>

      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">Loading videos...</div>
      ) : (
        <>
          {!loading && videos.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300">
              No videos found. Please check your API key or try a different region/language.
            </div>
          ) : null}

          {videos.length > 0 && (
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
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

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
    </div>
  )
}
