import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/firebase"
import { authOptions } from "@/lib/auth"

// PUT handler for updating a user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin role
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Not an admin" }, { status: 403 })
  }

  const userId = params.id
  const { role, subscriptionStatus } = await req.json()

  if (!userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 })
  }

  try {
    const userRef = db.collection("users").doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    const updateData: { role?: string; subscriptionStatus?: string } = {}
    if (role) updateData.role = role
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus

    await userRef.update(updateData)

    return NextResponse.json({ message: "User updated successfully!" }, { status: 200 })
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    return NextResponse.json({ message: "Internal server error during user update." }, { status: 500 })
  }
}

// DELETE handler for deleting a user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin role
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Not an admin" }, { status: 403 })
  }

  const userId = params.id

  if (!userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 })
  }

  try {
    await db.collection("users").doc(userId).delete()
    return NextResponse.json({ message: "User deleted successfully!" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    return NextResponse.json({ message: "Internal server error during user deletion." }, { status: 500 })
  }
}
