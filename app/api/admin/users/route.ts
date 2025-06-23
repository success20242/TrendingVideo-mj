import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/firebase"
import { authOptions } from "@/lib/auth"
import type { FirebaseFirestore } from "firebase-admin/firestore"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Not an admin" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const emailFilter = searchParams.get("email")
    const roleFilter = searchParams.get("role")
    const subscriptionStatusFilter = searchParams.get("subscriptionStatus")

    // Pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    let usersRef: FirebaseFirestore.Query = db.collection("users")

    // Apply filters
    if (emailFilter) {
      usersRef = usersRef.where("email", ">=", emailFilter).where("email", "<=", emailFilter + "\uf8ff")
    }
    if (roleFilter && roleFilter !== "all") {
      usersRef = usersRef.where("role", "==", roleFilter)
    }
    if (subscriptionStatusFilter && subscriptionStatusFilter !== "all") {
      usersRef = usersRef.where("subscriptionStatus", "==", subscriptionStatusFilter)
    }

    // Get total count before applying pagination limits
    const totalSnapshot = await usersRef.get()
    const totalUsers = totalSnapshot.size

    // Apply pagination
    const paginatedSnapshot = await usersRef.limit(limit).offset(offset).get()

    const users = paginatedSnapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      role: doc.data().role,
      subscriptionStatus: doc.data().subscriptionStatus,
    }))

    return NextResponse.json({ users, totalUsers, page, limit }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users for admin:", error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 })
  }
}
