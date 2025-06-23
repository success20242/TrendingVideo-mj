import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/firebase" // Use @/lib/firebase for App Router
import { authOptions } from "@/lib/auth" // Import authOptions from lib/auth

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const userEmail = session.user?.email

    if (!userEmail) {
      return NextResponse.json({ message: "User email not found in session." }, { status: 400 })
    }

    const usersRef = db.collection("users")
    const snapshot = await usersRef.where("email", "==", userEmail).get()

    if (snapshot.empty) {
      return NextResponse.json({ message: "User not found in database." }, { status: 404 })
    }

    const userData = snapshot.docs[0].data()

    return NextResponse.json(
      {
        email: userData.email,
        role: userData.role,
        subscriptionStatus: userData.subscriptionStatus,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 })
  }
}
