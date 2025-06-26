"use server";

import { AFFILIATE_NICHES } from "@/app/constants/affiliate-niches";

export interface Product {
  title: string;
  imageUrl: string;
  price?: string;
  link: string;
  source: "Amazon" | "eBay" | "Google Search";
  isSponsored: boolean;
  snippet?: string;
  niche?: string;
  nicheIcon?: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
}

function classifyNiche(title: string, snippet: string = ""): { name: string; icon: string } {
  const text = (title + " " + snippet).toLowerCase();
  for (const niche of AFFILIATE_NICHES) {
    if (niche.keywords.some(keyword => text.includes(keyword))) {
      return { name: niche.name, icon: niche.icon };
    }
  }
  return { name: "Uncategorized", icon: "❓" };
}

function extractPrice(item: any): string | undefined {
  if (item.pagemap?.offer?.[0]?.price) {
    return item.pagemap.offer[0].price;
  }
  const priceRegex = /\$\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/;
  const snippet = item.snippet ?? "";
  const match = snippet.match(priceRegex);
  return match ? match[0] : undefined;
}

function addAmazonAffiliateTag(link: string, tag?: string) {
  return tag && link.includes("amazon.com")
    ? link + (link.includes("?") ? "&" : "?") + `tag=${tag}`
    : link;
}

function addEbayPartnerId(link: string, partnerId?: string) {
  return partnerId && link.includes("ebay.com")
    ? link + (link.includes("?") ? "&" : "?") + `campid=${partnerId}`
    : link;
}

export async function searchAffiliateProducts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResult> {
  const products: Product[] = [];
  let total = 0;
  const encodedQuery = encodeURIComponent(query);

  const googleApiKey = process.env.GOOGLE_CSE_API_KEY;
  const googleEngineId = process.env.NEXT_PUBLIC_CSE_ID;
  const amazonAssociateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID;
  const ebayPartnerId = process.env.NEXT_PUBLIC_EBAY_PARTNER_ID;

  if (!googleApiKey || !googleEngineId) {
    console.warn("Missing Google API key or Engine ID");
    return { products, total };
  }

  try {
    const googleResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&key=${googleApiKey}&cx=${googleEngineId}`,
      { next: { revalidate: 3600 } }
    );

    if (!googleResponse.ok) {
      console.error(
        "Google Custom Search API error:",
        googleResponse.status,
        googleResponse.statusText
      );
      return { products, total };
    }

    const googleData = await googleResponse.json();

    total = parseInt(googleData.searchInformation?.totalResults ?? "0", 10);

    if (Array.isArray(googleData.items)) {
      for (const item of googleData.items) {
        const imageUrl =
          item.pagemap?.cse_image?.[0]?.src ||
          item.pagemap?.cse_thumbnail?.[0]?.src ||
          "";

        let link = item.link ?? "#";
        let source: Product["source"] = "Google Search";

        if (link.includes("amazon.com")) {
          link = addAmazonAffiliateTag(link, amazonAssociateId);
          source = "Amazon";
        } else if (link.includes("ebay.com")) {
          link = addEbayPartnerId(link, ebayPartnerId);
          source = "eBay";
        }

        const classification = classifyNiche(item.title ?? "", item.snippet ?? "");
        const price = extractPrice(item);
        const snippet = item.snippet;

        products.push({
          title: item.title ?? "Untitled Product",
          imageUrl,
          price,
          link,
          source,
          isSponsored: source !== "Google Search",
          snippet,
          niche: classification.name,
          nicheIcon: classification.icon,
        });
      }
    }
  } catch (error) {
    console.error("Google Custom Search API error:", error);
  }

  // Paginate results after fetching all (Google returns max ~10 per request)
  const start = (page - 1) * limit;
  const end = start + limit;
  return { products: products.slice(start, end), total };
}
