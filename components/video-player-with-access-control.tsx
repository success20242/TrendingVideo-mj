"use client"

import { useEffect, useState } from "react"

interface VideoPlayerProps {
  videoId: string
  title: string
  // Optional: allow passing a locked message or custom unlock action in the future
  lockedMessage?: string
  onUnlock?: () => void
}

export default function VideoPlayerWithAccessControl({
  videoId,
  title,
  lockedMessage,
  onUnlock,
}: VideoPlayerProps) {
  const [isPremium, setIsPremium] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    // Check localStorage for premium status
    const premiumStatus = localStorage.getItem("isPremium") === "true"
    setIsPremium(premiumStatus)
    setLoadingStatus(false)
  }, [])

  // Optional: Add a visual loading indicator instead of static text
  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center w-full h-60 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-lg animate-pulse">
        <svg className="w-7 h-7 animate-spin mr-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#888" strokeWidth="4" opacity="0.3" />
          <path fill="#888" d="M4 12a8 8 0 018-8v8z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        Loading access...
      </div>
    )
  }

  return (
    <div id="video-wrapper" className="aspect-video w-full mb-6">
      {isPremium ? (
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-60 bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold text-lg rounded-lg">
          <p className="mb-4">
            {lockedMessage || "🔒 This content is locked."}
          </p>
          <button
            onClick={() => {
              localStorage.setItem("isPremium", "true")
              setIsPremium(true)
              if (onUnlock) onUnlock()
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Unlock Premium Content
          </button>
        </div>
      )}
    </div>
  )
}
