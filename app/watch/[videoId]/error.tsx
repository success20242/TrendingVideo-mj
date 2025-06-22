"use client" // Error components must be Client Components

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 px-6 pt-6 pb-20 flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We encountered an issue while loading this video. Please try again.
      </p>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Error details: {error.message}</p>
    </div>
  )
}
