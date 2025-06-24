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
  const googleEngineId = process.env.NEXT_PUBLIC_CSE_ID // Updated to NEXT_PUBLIC_CSE_ID

  if (googleApiKey && googleEngineId) {
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleEngineId}&q=${encodedQuery}`
    try {
      const res = await fetch(googleSearchUrl)
      if (res.ok) {
        const data = await res.json()
        data.items?.forEach((item: any) => {
          products.push({
            title: item.title,
            imageUrl: item.pagemap?.cse_thumbnail?.[0]?.src || "/placeholder.svg?height=64&width=64",
            link: item.link,
            source: "Google Search",
            isSponsored: false, // Google CSE results are not inherently sponsored by us
          })
        })
      } else {
        console.error("Google CSE API error:", res.status, res.statusText)
      }
    } catch (error) {
      console.error("Error fetching from Google CSE:", error)
    }
  } else {
    console.warn("Google CSE API keys are not configured. Skipping Google search.")
  }

  // 2. Amazon Affiliate Link
  const amazonAssociateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID
  if (amazonAssociateId) {
    products.push({
      title: `Shop "${query}" on Amazon`,
      imageUrl: "/placeholder.svg?height=64&width=64", // Placeholder image for direct links
      link: `https://www.amazon.com/s?k=${encodedQuery}&tag=${amazonAssociateId}`,
      source: "Amazon",
      isSponsored: true,
    })
  } else {
    console.warn("Amazon Associate ID is not configured. Skipping Amazon link.")
  }

  // 3. eBay Affiliate Link
  const ebayPartnerId = process.env.NEXT_PUBLIC_EBAY_PARTNER_ID
  if (ebayPartnerId) {
    products.push({
      title: `Shop "${query}" on eBay`,
      imageUrl: "/placeholder.svg?height=64&width=64", // Placeholder image for direct links
      link: `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}&_trkparms=${ebayPartnerId}`, // Simplified for direct URL
      source: "eBay",
      isSponsored: true,
    })
  } else {
    console.warn("eBay Partner ID is not configured. Skipping eBay link.")
  }

  return products
}
