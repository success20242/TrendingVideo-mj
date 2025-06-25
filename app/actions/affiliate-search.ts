"use server"

export interface Product {
  title: string
  imageUrl: string
  price?: string
  link: string
  source: "Amazon" | "eBay" | "Google Search"
  isSponsored: boolean
  snippet?: string
}

export async function searchAffiliateProducts(query: string): Promise<Product[]> {
  const products: Product[] = []
  const encodedQuery = encodeURIComponent(query)

  // 1. Google Custom Search API
  const googleApiKey = process.env.GOOGLE_CSE_API_KEY
  const googleEngineId = process.env.NEXT_PUBLIC_CSE_ID

  if (!googleApiKey || !googleEngineId) {
    console.warn("Missing Google API key or Engine ID")
    return products
  }

  try {
    const googleResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&key=${googleApiKey}&cx=${googleEngineId}`,
      { next: { revalidate: 3600 } }
    )
    if (!googleResponse.ok) {
      console.error("Google Custom Search API error:", googleResponse.status, googleResponse.statusText)
      return products
    }
    const googleData = await googleResponse.json()

    if (Array.isArray(googleData.items)) {
      for (const item of googleData.items) {
        const imageUrl =
          item.pagemap?.cse_image?.[0]?.src ||
          item.pagemap?.cse_thumbnail?.[0]?.src ||
          ""

        products.push({
          title: item.title ?? "Untitled Product",
          imageUrl,
          price: undefined, // Extend with price extraction logic if available
          link: item.link ?? "#",
          source: "Google Search",
          isSponsored: false,
          snippet: item.snippet,
        })
      }
    }
  } catch (error) {
    console.error("Google Custom Search API error:", error)
  }

  // 2. Amazon Affiliate Search (placeholder)
  const amazonAssociateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID
  if (amazonAssociateId) {
    // Add logic to fetch Amazon affiliate products
  }

  // 3. eBay Affiliate Search (placeholder)
  const ebayPartnerId = process.env.NEXT_PUBLIC_EBAY_PARTNER_ID
  if (ebayPartnerId) {
    // Add logic to fetch eBay affiliate products
  }

  return products
}
