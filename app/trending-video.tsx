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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [bgTrackIndex, isMusicPlaying]);

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

  // ... rest of your component JSX remains unchanged ...
}
