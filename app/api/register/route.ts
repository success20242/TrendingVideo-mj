import { NextResponse } from "next/server"
import { db } from "@/lib/firebase" // Use @/lib/firebase for App Router
import bcrypt from "bcryptjs"
import admin from "firebase-admin"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 })
  }

  try {
    const usersRef = db.collection("users")
    const snapshot = await usersRef.where("email", "==", email).get()

    if (!snapshot.empty) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await usersRef.add({
      email,
      passwordHash,
      role: "user",
      subscriptionStatus: "inactive",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error during registration." }, { status: 500 })
  }
}
