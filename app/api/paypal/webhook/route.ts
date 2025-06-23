import { NextResponse } from "next/server"
import { db } from "@/lib/firebase" // Use @/lib/firebase for App Router

export async function POST(req: Request) {
  try {
    const event = await req.json()

    // For example, handle subscription activation event from PayPal webhook
    if (event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriberEmail = event.resource.subscriber.email_address

      const usersRef = db.collection("users")
      const snapshot = await usersRef.where("email", "==", subscriberEmail).get()

      if (snapshot.empty) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      const userDoc = snapshot.docs[0]
      await userDoc.ref.update({ subscriptionStatus: "active" })

      return NextResponse.json({ message: "Subscription status updated" }, { status: 200 })
    }

    return NextResponse.json({ message: "Unhandled event type" }, { status: 400 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
