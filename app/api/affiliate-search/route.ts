import { searchAffiliateProducts } from "@/app/actions/affiliate-search";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    // Parse page and limit query params with defaults
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
    const limit = limitParam ? Math.max(parseInt(limitParam, 10), 1) : 10;

    const results = await searchAffiliateProducts(query, page, limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in affiliate-search API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate products." },
      { status: 500 }
    );
  }
}
