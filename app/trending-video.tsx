"use client";

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
  const [fullscreenVideoId, setFullscreenVideoId] = useState(null);

  // Background music carousel states
  const [bgTrackIndex, setBgTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Load preferences from localStorage and initialize audio play/pause
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    setIsPremium(localStorage.getItem("isPremium") === "true");

    const storedMusic = localStorage.getItem("isMusicPlaying");
    const shouldPlay = storedMusic !== "false";
    setIsMusicPlaying(shouldPlay);
    if (audioRef.current) {
      if (shouldPlay) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, []);

  // Escape key closes fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFullscreenVideoId(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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

  // Toggle background music playback and sync with localStorage
  const toggleMusic = () => {
    const newStatus = !isMusicPlaying;
    setIsMusicPlaying(newStatus);
    localStorage.setItem("isMusicPlaying", String(newStatus));
    if (audioRef.current) {
      if (newStatus) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Fetch trending videos based on country and language
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/trending", {
          params: { country: selectedCountry, lang: selectedLanguage },
        });
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

  const extractTags = (video) => {
    const title = video.snippet.title.toLowerCase();
    return availableTags.filter((tag) => title.includes(tag));
  };

  const filteredVideos =
    selectedTag === "all"
      ? videos
      : videos.filter((video) => video.tags.includes(selectedTag));

  const playNextTrack = () => {
    setBgTrackIndex((prev) => (prev + 1) % backgroundTracks.length);
  };

  const playPrevTrack = () => {
    setBgTrackIndex((prev) =>
      (prev - 1 + backgroundTracks.length) % backgroundTracks.length
    );
  };

  // Whenever track changes or music playing state changes, reload audio and play/pause accordingly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [bgTrackIndex, isMusicPlaying]);

  // Check autoplay support for videos
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

  // Open fullscreen modal with given video ID
  const openFullscreen = (videoId) => {
    setFullscreenVideoId(videoId);
  };

  // Close fullscreen modal
  const closeFullscreen = () => {
    setFullscreenVideoId(null);
  };

  // Get video data for the fullscreen modal
  const fullscreenVideo = videos.find((v) => v.id === fullscreenVideoId);

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      {/* Dark mode toggle */}
      <button onClick={toggleDarkMode} style={{ marginBottom: 12 }}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {/* Premium toggle */}
      <button onClick={togglePremium} style={{ marginLeft: 8, marginBottom: 12 }}>
        {isPremium ? "Disable Premium" : "Enable Premium"}
      </button>

      {/* Music Controls */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={toggleMusic}>
          {isMusicPlaying ? "Pause Music" : "Play Music"}
        </button>
        <button onClick={playPrevTrack} style={{ marginLeft: 8 }}>
          Prev Track
        </button>
        <button onClick={playNextTrack} style={{ marginLeft: 8 }}>
          Next Track
        </button>
        <span style={{ marginLeft: 12 }}>
          Now Playing: {backgroundTracks[bgTrackIndex].title} by {backgroundTracks[bgTrackIndex].artist}
        </span>
      </div>

      {/* Audio element for background music */}
      <audio ref={audioRef} loop preload="auto" key={backgroundTracks[bgTrackIndex].url}>
        <source src={backgroundTracks[bgTrackIndex].url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Tag filter */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="tag-select">Filter by tag: </label>
        <select
          id="tag-select"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="all">All</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Videos list */}
      {loading ? (
        <p>Loading videos...</p>
      ) : filteredVideos.length === 0 ? (
        <p>No videos found for selected filters.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => openFullscreen(video.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") openFullscreen(video.id);
              }}
              style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: darkMode ? "#222" : "#fff",
                color: darkMode ? "#eee" : "#000",
              }}
              aria-label={`Open fullscreen video: ${video.snippet.title}`}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                style={{ width: "100%", height: "auto" }}
              />
              <div style={{ padding: "8px" }}>
                <h3 style={{ margin: "8px 0", fontSize: "1rem" }}>
                  {video.snippet.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: darkMode ? "#ccc" : "#555" }}>
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreenVideoId && fullscreenVideo && (
        <div
          className="fullscreen-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Playing video: ${fullscreenVideo.snippet.title}`}
          onClick={closeFullscreen}
          tabIndex={-1}
        >
          <button
            className="fullscreen-close-btn"
            aria-label="Close fullscreen video"
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreen();
            }}
          >
            ×
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${fullscreenVideo.id}?autoplay=1&controls=1`}
            title={fullscreenVideo.snippet.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
      <GoogleSearchEmbed />

      <style>{`
        .fullscreen-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }
        .fullscreen-modal iframe {
          width: 90vw;
          height: 80vh;
          border-radius: 0.5rem;
          box-shadow: 0 0 20px rgba(0,0,0,0.7);
        }
        .fullscreen-close-btn {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background: white;
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transition: background-color 0.2s ease;
        }
        .fullscreen-close-btn:hover {
          background: #eee;
        }
      `}</style>
    </div>
  );
}
