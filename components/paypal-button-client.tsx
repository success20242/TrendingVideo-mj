"use client"

import { useEffect, useState } from "react"

export default function PayPalButtonClient() {
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Check premium status from localStorage
    setIsPremium(localStorage.getItem("isPremium") === "true")

    // Load PayPal SDK if not already loaded
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
  }, [paypalLoaded])

  if (isPremium) {
    return null // Don't show PayPal button if already premium
  }

  // Always show the PayPal button if not premium
  return (
    <div className="flex justify-center">
      <div id="paypal-button-container" className="my-6"></div>
    </div>
  )
}
