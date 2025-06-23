"use client"

import { useEffect, useState } from "react"
// Removed useSession and useRouter imports as authentication is removed
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"

export default function PayPalButtonClient() {
  // Removed useSession and useRouter hooks
  // const { data: session, status } = useSession()
  // const router = useRouter()
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  // isPremium is now a client-side state, not backed by any authentication or backend.
  // It will be managed via localStorage for demonstration.
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Load PayPal SDK if not already loaded
    // No session check needed as authentication is removed
    if (!paypalLoaded) {
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
                // Set client-side premium status
                localStorage.setItem("isPremium", "true")
                setIsPremium(true)
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
  }, [paypalLoaded]) // Removed session, status from dependency array

  // Simulate premium status for demonstration purposes
  useEffect(() => {
    // This will now be the only source for isPremium status
    setIsPremium(localStorage.getItem("isPremium") === "true")
  }, [])

  if (isPremium) {
    return <div className="text-green-500 font-semibold mb-6">👑 Premium Features Unlocked!</div>
  }

  // Always show the PayPal button if not premium
  return (
    <div className="flex justify-center">
      <div id="paypal-button-container" className="my-6"></div>
    </div>
  )
}
