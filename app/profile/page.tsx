"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserProfile {
  email: string
  role: string
  subscriptionStatus: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "loading") return // Do nothing while session is loading

    if (!session) {
      // If not authenticated, redirect to login
      router.push("/login")
      return
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user")
        const data = await res.json()

        if (!res.ok) {
          setError(data.message || "Failed to fetch user profile.")
          setUserProfile(null)
        } else {
          setUserProfile(data)
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("An unexpected error occurred while fetching profile.")
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }) // Redirect to login page after logout
  }

  if (status === "loading" || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>No profile data available. Please log in.</p>
        <Link href="/login" className="text-blue-500 hover:underline ml-2">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        <div className="space-y-4">
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Role:</strong> {userProfile.role}
          </p>
          <p>
            <strong>Subscription Status:</strong>{" "}
            <span
              className={`font-semibold ${
                userProfile.subscriptionStatus === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {userProfile.subscriptionStatus.charAt(0).toUpperCase() + userProfile.subscriptionStatus.slice(1)}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
