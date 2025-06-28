"use client";

import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Footer from "@/components/footer";
import GoogleSearchEmbed from "@/components/google-search-embed";

// Updated royalty-free background music tracks with real URLs from Bensound
const backgroundTracks = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
  },
  {
    id: 2,
    title: "Sunny",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
  },
  {
    id: 3,
    title: "Creative Minds",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
  },
];

// Sample tags for filtering
const availableTags = [
  "music",
  "comedy",
  "gaming",
  "news",
  "education",
  "sports",
  "technology",
];

const VIDEOS_PER_PAGE = 6;

// Helper to extract the correct YouTube video ID for each video object
function getVideoId(video) {
  if (!video) return "";
  if (typeof video.id === "string") return video.id;
  if (video.id && typeof video.id.videoId === "string") return video.id.videoId;
  return String(video.id || "");
}

export default function TrendingVideo() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [canAutoplay, setCanAutoplay] = useState(true);

  // Inline expansion state for video
  const [expandedVideoId, setExpandedVideoId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);

  // Background music carousel states
  const [bgTrackIndex, setBgTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    setIsPremium(localStorage.getItem("isPremium") === "true");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", String(newMode));
      return newMode;
    });
  };

  const togglePremium = () => {
    setIsPremium((prev) => {
      const newStatus = !prev;
      localStorage.setItem("isPremium", String(newStatus));
      return newStatus;
    });
  };

  // Fetch videos
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/trending", {
          params: { country: selectedCountry, lang: selectedLanguage },
        });
        // Add tags to each video
        const videosWithTags = (Array.isArray(response.data.items)
          ? response.data.items
          : []
        ).map((video) => ({
          ...video,
          tags: extractTags(video),
        }));
        setVideos(videosWithTags);
      } catch (error) {
        console.error("Error fetching trending videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, [selectedCountry, selectedLanguage]);

  // Simple tag extraction from title (for demo)
  const extractTags = (video) => {
    const title = typeof video?.snippet?.title === "string" ? video.snippet.title.toLowerCase() : "";
    return availableTags.filter((tag) => title.includes(tag));
  };

  // Filter videos by selectedTag
  const filteredVideos =
    selectedTag === "all"
      ? videos
      : videos.filter((video) => Array.isArray(video.tags) && video.tags.includes(selectedTag));

  // Pagination for filtered videos
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE);

  // Auto-reset to first page on tag/country/language filter change
  useEffect(() => {
    setPage(1);
    setExpandedVideoId(null);
  }, [selectedTag, selectedCountry, selectedLanguage]);

  // Background music controls
  const playNextTrack = () => {
    setBgTrackIndex((prev) => (prev + 1) % backgroundTracks.length);
  };
  const playPrevTrack = () => {
    setBgTrackIndex((prev) =>
      (prev - 1 + backgroundTracks.length) % backgroundTracks.length
    );
  };

  // Auto play bg music on track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        // Autoplay might fail due to browser policies
      });
    }
  }, [bgTrackIndex]);

  // Detect if browser allows autoplay muted videos (once on mount)
  useEffect(() => {
    const testVideo = document.createElement("video");
    testVideo.muted = true;
    const playPromise = testVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setCanAutoplay(true))
        .catch(() => setCanAutoplay(false));
    }
  }, []);

  // Soundwave animation SVG component
  const SoundWave = () => (
    <svg
      className="inline-block ml-2 w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="6"
        width="2"
        height="8"
        rx="1"
        className="origin-bottom animate-soundwave"
      />
      <rect
        x="6"
        y="4"
        width="2"
        height="12"
        rx="1"
        className="origin-bottom animate-soundwave delay-75"
      />
      <rect
        x="10"
        y="7"
        width="2"
        height="6"
        rx="1"
        className="origin-bottom animate-soundwave delay-150"
      />
      <rect
        x="14"
        y="3"
        width="2"
        height="14"
        rx="1"
        className="origin-bottom animate-soundwave delay-225"
      />
    </svg>
  );

  // SEO & Social meta heads (international best practices, adsense acceptable)
  const siteTitle = "Trending Video | TrendifyTube";
  const siteDescription = "Watch what's trending worldwide. Explore the hottest videos, shop smarter, and enjoy music with TrendifyTube.";
  const siteUrl = "https://yourdomain.com/"; // Replace with your production URL
  const siteImage = "https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png";
  const siteLocale = "en_US";

  // Responsive/modal video studio state
  const [showModal, setShowModal] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);

  // Open video modal studio
  const openModal = (video) => {
    setModalVideo(video);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };
  // Close video modal studio
  const closeModal = () => {
    setShowModal(false);
    setModalVideo(null);
    document.body.style.overflow = "";
  };

  // Handle escape key for modal close
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="trending, video, youtube, viral, music, comedy, gaming, news, sports, technology, education, shop, amazon, shoes, boutique" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta httpEquiv="Content-Language" content={siteLocale} />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:site_name" content="TrendifyTube" />
        <meta property="og:locale" content={siteLocale} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />

        {/* WhatsApp/Instagram use Open Graph tags */}

        {/* Adsense & monetization */}
        <meta name="google-site-verification" content="G68a3mRZtGTDKcAOHvC2YFHpGavV38TRiQCNQgH2rE0" />
        {/* Replace the content with your actual Google site verification token */}
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-800 dark:to-gray-900 px-6 pt-6 pb-20 transition-colors duration-300 relative">
        <style>{`
          @keyframes soundwave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.5); }
          }
          .animate-soundwave {
            animation: soundwave 1s ease-in-out infinite;
            transform-origin: bottom;
          }
          .delay-75 { animation-delay: 0.075s; }
          .delay-150 { animation-delay: 0.15s; }
          .delay-225 { animation-delay: 0.225s; }

          .video-iframe-wrapper {
            position: relative;
            cursor: pointer;
            height: 240px;
            overflow: hidden;
            background-color: #000;
            border-radius: 0.75rem;
            transition: height 0.4s cubic-bezier(.68,-0.55,.27,1.55);
          }
          .video-iframe-wrapper.expanded {
            height: 60vh !important;
            min-height: 380px;
            z-index: 10;
            box-shadow: 0 4px 32px 0 rgba(0,0,0,0.33);
          }
          .fallback-gif {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            object-fit: cover;
            border-radius: 0.75rem;
            pointer-events: none;
            user-select: none;
            opacity: 1;
            transition: opacity 0.3s ease;
          }
          .video-iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0.75rem;
            transition: opacity 0.3s ease;
          }
          .expand-btn {
            position: absolute;
            bottom: 1em;
            right: 1em;
            background: rgba(0,0,0,0.69);
            color: #fff;
            border: none;
            border-radius: 0.7em;
            padding: 0.5em 1.6em;
            font-size: 1.04em;
            cursor: pointer;
            z-index: 2;
            opacity: 0.86;
            transition: opacity 0.18s;
          }
          .expand-btn:hover {
            opacity: 1;
            background: rgba(0,0,0,0.92);
          }
          .collapse-btn {
            position: absolute;
            top: 0.8em;
            right: 1em;
            background: rgba(0,0,0,0.79);
            color: #fff;
            border: none;
            border-radius: 0.7em;
            padding: 0.37em 1.2em;
            font-size: 1em;
            cursor: pointer;
            z-index: 2;
            opacity: 0.84;
            transition: opacity 0.18s;
          }
          .collapse-btn:hover {
            opacity: 1;
            background: rgba(0,0,0,0.99);
          }
          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            z-index: 1000;
            inset: 0;
            background: rgba(0,0,0,0.87);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal-content {
            position: relative;
            width: 95vw;
            max-width: 540px;
            background: #18181b;
            border-radius: 1.3em;
            padding: 1.1em 0.7em 1.5em 0.7em;
            box-shadow: 0 8px 44px 0 rgba(0,0,0,0.45);
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 90vh;
          }
          @media (max-width: 600px) {
            .modal-content {
              width: 99vw;
              max-width: 99vw;
              padding: 0.2em 0.1em 0.7em 0.1em;
            }
          }
          .modal-close-btn {
            position: absolute;
            top: 0.75em;
            right: 1.11em;
            background: rgba(0,0,0,0.65);
            color: #fff;
            border: none;
            border-radius: 0.7em;
            padding: 0.3em 1.3em;
            font-size: 1.3em;
            cursor: pointer;
            z-index: 2;
            opacity: 0.94;
            transition: opacity 0.18s;
          }
          .modal-close-btn:hover {
            opacity: 1;
            background: rgba(0,0,0,0.99);
          }
        `}</style>

        <div className="fixed top-0 left-0 w-full bg-black text-white py-2 text-center text-sm z-50 animate-pulse">
          📢 Now Trending Worldwide — Refresh for updates
        </div>

        <div className="fixed bottom-0 right-4 z-40 animate-floatEmoji pointer-events-none">
          <div className="text-3xl animate-bounce">🔥</div>
          <div className="text-3xl animate-bounce delay-200">😂</div>
          <div className="text-3xl animate-bounce delay-400">👍</div>
          <div className="text-3xl animate-bounce delay-600">💯</div>
        </div>

        <header className="text-center mb-8 max-w-5xl mx-auto relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1529101091764-c3526daf38fe')] bg-cover bg-center opacity-10 rounded-3xl"></div>
          <img
            src="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
            alt="TrendifyTube Logo"
            className="mx-auto w-44 h-44 mb-6 drop-shadow-xl hover:scale-110 transition-transform duration-300 relative z-10"
          />
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white relative z-10 flex justify-center items-center">
            Trending Video
            <SoundWave />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-2 relative z-10">
            🔥 Watch What's Hot. Shop What's Smarter.
          </p>

          <div className="flex justify-center gap-3 mt-6 flex-wrap items-center relative z-10">
            <select
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="p-2 rounded border dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={selectedCountry}
              aria-label="Select country"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AE">United Arab Emirates</option>
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
              className="p-2 rounded border dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={selectedLanguage}
              aria-label="Select language"
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

            <select
              onChange={(e) => setSelectedTag(e.target.value)}
              className="p-2 rounded border dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={selectedTag}
              aria-label="Filter videos by tag"
            >
              <option value="all">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>

            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-700 transition"
            >
              {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <button
              onClick={togglePremium}
              className="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              {isPremium ? "👑 Premium Active" : "🔓 Activate Premium"}
            </button>
          </div>

          {isPremium && (
            <div className="text-green-500 font-semibold mt-3 relative z-10 animate-pulse">
              👑 Premium Features Unlocked!
            </div>
          )}
        </header>

        <GoogleSearchEmbed />

        {loading ? (
          <div className="text-center text-gray-700 dark:text-gray-300 mt-10 animate-pulse">
            Loading videos...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300 mt-10">
            No videos found for selected tag. Try changing your filters.
          </div>
        ) : (
          <>
            {/* Video grid: only show 6 per page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedVideos.map((video, idx) => {
                const videoId = getVideoId(video);
                const locked = !isPremium && ((page-1)*VIDEOS_PER_PAGE + idx) >= 3;
                const isHovered = hoveredVideoId === videoId;
                const isExpanded = expandedVideoId === videoId;

                // Fallback GIF/thumbnail URL fallback for hover preview:
                const gifFallbackUrl = video?.snippet?.thumbnails?.medium?.url || "";

                // Defensive: ensure snippet, title, and channelTitle exist
                const title = typeof video?.snippet?.title === "string"
                  ? video.snippet.title
                  : "[No Title]";
                const channelTitle = typeof video?.snippet?.channelTitle === "string"
                  ? video.snippet.channelTitle
                  : "[No Channel Title]";

                return (
                  <div
                    key={videoId}
                    className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transition-all duration-300`}
                    onMouseEnter={() => setHoveredVideoId(videoId)}
                    onMouseLeave={() => setHoveredVideoId(null)}
                    aria-label={title}
                  >
                    {locked ? (
                      <div className="flex items-center justify-center h-60 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-bold rounded-xl">
                        🔒 Subscribe to unlock
                      </div>
                    ) : (
                      <div
                        className={`video-iframe-wrapper`}
                        tabIndex={0}
                        style={{ cursor: "pointer" }}
                        title="Tap to expand"
                        aria-label="Tap to expand"
                        onClick={() => openModal(video)}
                      >
                        {canAutoplay ? (
                          <iframe
                            className="video-iframe group-hover:scale-[1.02] transition-transform duration-200"
                            src={
                              isHovered
                                ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`
                                : `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`
                            }
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            frameBorder="0"
                            tabIndex={-1}
                            aria-hidden="true"
                          />
                        ) : (
                          // Fallback to static image if autoplay is blocked
                          <img
                            src={gifFallbackUrl}
                            alt={`Preview thumbnail for ${title}`}
                            className="fallback-gif"
                            loading="lazy"
                          />
                        )}
                        {/* Show overlay play/expand icon */}
                        <button
                          className="expand-btn"
                          aria-label="Expand video"
                        >
                          📺 Expand to Watch
                        </button>
                      </div>
                    )}

                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                        {title}
                        <SoundWave />
                      </h2>
                      {!locked && (
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {channelTitle}
                        </p>
                      )}
                      <a
                        href={`https://www.amazon.com/s?k=${encodeURIComponent(
                          title
                        )}&tag=qualitygood0d-21`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-sm text-blue-600 hover:underline"
                      >
                        🛍️ Shop related products on Amazon
                      </a>
                      <a
                        href="https://www.facebook.com/share/14E1rQ9My1r/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-600 hover:underline"
                      >
                        👞 Explore stylish shoes from 3Kings Boutique on Facebook
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-8 items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-indigo-200 text-indigo-800 font-semibold rounded disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-200">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-indigo-200 text-indigo-800 font-semibold rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Video Modal Studio */}
        {showModal && modalVideo && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            style={{ zIndex: 1000 }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button onClick={closeModal} className="modal-close-btn" aria-label="Close modal">
                ✖
              </button>
              <iframe
                className="w-full rounded-lg"
                style={{ height: "40vw", maxHeight: "60vh", minHeight: "240px" }}
                src={`https://www.youtube.com/embed/${getVideoId(modalVideo)}?autoplay=1&controls=1&mute=0&rel=0&modestbranding=1`}
                title={typeof modalVideo?.snippet?.title === "string" ? modalVideo.snippet.title : "[No Title]"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
              <div className="mt-4 w-full text-center">
                <h2 className="text-white text-lg font-bold">{typeof modalVideo?.snippet?.title === "string" ? modalVideo.snippet.title : "[No Title]"}</h2>
                <p className="text-gray-300">{typeof modalVideo?.snippet?.channelTitle === "string" ? modalVideo.snippet.channelTitle : "[No Channel Title]"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Background music carousel */}
        <section className="fixed bottom-20 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-72 text-center">
          <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
            🎵 Background Music
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {backgroundTracks[bgTrackIndex].title} — {backgroundTracks[bgTrackIndex].artist}
          </p>
          <audio ref={audioRef} controls className="w-full mt-2" preload="auto">
            <source src={backgroundTracks[bgTrackIndex].url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="flex justify-between mt-3">
            <button
              onClick={playPrevTrack}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              aria-label="Previous track"
            >
              ◀
            </button>
            <button
              onClick={playNextTrack}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              aria-label="Next track"
            >
              ▶
            </button>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 text-center mt-14 shadow-md max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            👟 Partnered with 3Kings Boutique
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Discover top-quality imported shoes. Visit their store on Facebook.
          </p>
          <a
            href="https://www.facebook.com/share/14E1rQ9My1r/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Shop 3Kings Boutique
          </a>
        </section>

        <Footer />
      </div>
    </>
  );
}
