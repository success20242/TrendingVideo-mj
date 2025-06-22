export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 px-6 pt-6 pb-20 flex flex-col items-center justify-center">
      <div className="text-center mb-8 max-w-5xl mx-auto">
        <img
          src="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
          alt="TrendifyTube Logo"
          className="mx-auto w-48 h-48 mb-6 opacity-75 animate-pulse"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-pulse">Loading Video...</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">
          Please wait while we fetch the video details.
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="aspect-video w-full mb-6 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-blue-200 dark:bg-blue-600 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-green-200 dark:bg-green-600 rounded w-1/2"></div>
      </div>
    </div>
  )
}
