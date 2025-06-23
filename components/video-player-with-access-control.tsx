"use client"

import { useEffect, useState } from "react"

interface VideoPlayerProps {
  videoId: string
  title: string
}

export default function VideoPlayerWithAccessControl({ videoId, title }: VideoPlayerProps) {
  const [isPremium, setIsPremium] = useState(false)
  const [loadingPremiumStatus, setLoadingPremiumStatus] = useState(true)

  useEffect(() => {
    // Check localStorage for premium status
    const premiumStatus = localStorage.getItem("isPremium") === "true"
    setIsPremium(premiumStatus)
    setLoadingPremiumStatus(false)
  }, [])

  if (loadingPremiumStatus) {
    return (
      <div className="flex items-center justify-center w-full h-60 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-lg">
        Loading access...
      </div>
    )
  }

  return (
    <div id="video-wrapper" className="aspect-video w-full mb-6">
      {isPremium ? (
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-60 bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold text-lg rounded-lg">
          <p className="mb-4">🔒 This content is locked.</p>
          <p>
            Please{" "}
            <a href="/" className="text-blue-500 hover:underline">
              subscribe
            </a>{" "}
            to gain access.
          </p>
        </div>
      )}
    </div>
  )
}
