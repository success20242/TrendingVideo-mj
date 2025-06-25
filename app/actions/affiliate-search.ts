"use server"

interface Product {
  title: string
  imageUrl: string
  price?: string
  link: string
  source: "Amazon" | "eBay" | "Google Search"
  isSponsored: boolean
}

export async function searchAffiliateProducts(query: string): Promise<Product[]> {
  const products: Product[] = []
  const encodedQuery = encodeURIComponent(query)

  // 1. Google Custom Search API
  const googleApiKey = process.env.GOOGLE_CSE_API_KEY
  const googleEngineId = process.env.NEXT_PUBLIC_CSE_ID // Make sure this matches your .env variable!

  if (googleApiKey && googleEngineId) {
    try {
      const googleResponse = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&key=${googleApiKey}&cx=${googleEngineId}`
      )
      const googleData = await googleResponse.json()

      if (googleData.items) {
        for (const item of googleData.items) {
          products.push({
            title: item.title,
            imageUrl: item.pagemap?.cse_image?.[0]?.src || "",
            price: undefined, // You can add price extraction logic if needed
            link: item.link,
            source: "Google Search",
            isSponsored: false,
          })
        }
      }
    } catch (error) {
      console.error("Google Custom Search API error:", error)
    }
  }

  // 2. Amazon Affiliate Search (example placeholder)
  const amazonAssociateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID
  if (amazonAssociateId) {
    // Add logic to fetch Amazon affiliate products via your backend or API
    // For example, use a fetch to your affiliate service or Amazon API
  }

  // 3. eBay Affiliate Search (example placeholder)
  const ebayPartnerId = process.env.NEXT_PUBLIC_EBAY_PARTNER_ID
  if (ebayPartnerId) {
    // Add logic to fetch eBay affiliate products via API here
  }

  return products
}
