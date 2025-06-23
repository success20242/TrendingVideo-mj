"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation" // Use next/navigation for App Router

export default function PayPalButtonClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    // Redirect if already subscribed or admin
    if (
      status === "authenticated" &&
      (session?.user?.subscriptionStatus === "active" || session?.user?.role === "admin")
    ) {
      // No need to redirect if already on the main page and subscribed
      return
    }

    // Only load PayPal SDK if not already loaded and user is not premium/owner
    if (
      !paypalLoaded &&
      status === "authenticated" &&
      !(session?.user?.subscriptionStatus === "active" || session?.user?.role === "admin")
    ) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`
      script.async = true
      script.onload = () => {
        setPaypalLoaded(true)
        if (window.paypal) {
          window.paypal
            .Buttons({
              createSubscription: (data, actions) => {
                return actions.subscription.create({
                  plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
                })
              },
              onApprove: (data, actions) => {
                alert("Subscription completed! Your access will be updated shortly.")
                // Refresh session or redirect after a short delay
                router.refresh() // Refresh the current route to update session status
              },
              onError: (err) => {
                console.error("PayPal error:", err)
                alert("PayPal transaction failed. Please try again.")
              },
            })
            .render("#paypal-button-container")
        }
      }
      document.body.appendChild(script)

      return () => {
        // Clean up the script if the component unmounts
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [session, status, paypalLoaded, router])

  if (status === "loading") {
    return <div className="text-gray-500 dark:text-gray-400 text-center my-6">Checking subscription status...</div>
  }

  if (session?.user?.subscriptionStatus === "active" || session?.user?.role === "admin") {
    return <div className="text-green-500 font-semibold mb-6">👑 Premium Features Unlocked!</div>
  }

  return (
    <div className="flex justify-center">
      <div id="paypal-button-container" className="my-6"></div>
    </div>
  )
}
