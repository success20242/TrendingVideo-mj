import { searchAffiliateProducts } from "@/app/actions/affiliate-search"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required." }, { status: 400 })
  }

  try {
    const results = await searchAffiliateProducts(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in affiliate-search API route:", error)
    return NextResponse.json({ error: "Failed to fetch affiliate products." }, { status: 500 })
  }
}
