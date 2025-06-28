"use server";

import { AFFILIATE_NICHES } from "@/app/constants/affiliate-niches";

// Add more sources as you expand affiliate programs.
export type AffiliateSource = "Amazon" | "eBay" | "Walmart" | "AliExpress" | "Google Search" | "Other";

export interface Product {
  title: string;
  imageUrl: string;
  price?: string;
  link: string;
  source: AffiliateSource;
  isSponsored: boolean;
  snippet?: string;
  niche?: string;
  nicheIcon?: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
}

// Flexible niche detection with arrays of keywords per niche.
// Add as many keywords as you want for each niche in your AFFILIATE_NICHES constant.
function classifyNiche(title: string, snippet: string = ""): { name: string; icon: string } {
  const text = (title + " " + snippet).toLowerCase();
  for (const niche of AFFILIATE_NICHES) {
    if (niche.keywords.some((keyword: string) => text.includes(keyword))) {
      return { name: niche.name, icon: niche.icon };
    }
  }
  return { name: "Uncategorized", icon: "❓" };
}

function extractPrice(item: any): string | undefined {
  // Try to extract price from Google pagemap or from the snippet.
  if (item.pagemap?.offer?.[0]?.price) {
    return item.pagemap.offer[0].price;
  }
  const priceRegex = /\$\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/;
  const snippet = item.snippet ?? "";
  const match = snippet.match(priceRegex);
  return match ? match[0] : undefined;
}

// Append your affiliate/tracking IDs to URLs for each partner.
function addAmazonAffiliateTag(link: string, tag?: string) {
  return tag && link.includes("amazon.com")
    ? link + (link.includes("?") ? "&" : "?") + `tag=${tag}`
    : link;
}

function addEbayPartnerId(link: string, partnerId?: string) {
  // For best tracking, use the eBay rover URL format.
  return partnerId && link.includes("ebay.com")
    ? `https://rover.ebay.com/rover/1/711-53200-19255-0/1?campid=${partnerId}&toolid=10001&mpre=${encodeURIComponent(link)}`
    : link;
}

function addWalmartAffiliateId(link: string, affiliateId?: string) {
  // Walmart affiliate links can be complex, but this is a simple example:
  return affiliateId && link.includes("walmart.com")
    ? link + (link.includes("?") ? "&" : "?") + `affp1=${affiliateId}`
    : link;
}

function addAliExpressAffiliateId(link: string, affiliateId?: string) {
  // AliExpress affiliate param example (might vary by network):
  return affiliateId && link.includes("aliexpress.com")
    ? link + (link.includes("?") ? "&" : "?") + `aff_short_key=${affiliateId}`
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
  const walmartAffiliateId = process.env.NEXT_PUBLIC_WALMART_AFFILIATE_ID;
  const aliexpressAffiliateId = process.env.NEXT_PUBLIC_ALIEXPRESS_AFFILIATE_ID;

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
        let source: AffiliateSource = "Google Search";

        // Recognize and process various affiliate programs.
        if (link.includes("amazon.com")) {
          link = addAmazonAffiliateTag(link, amazonAssociateId);
          source = "Amazon";
        } else if (link.includes("ebay.com")) {
          link = addEbayPartnerId(link, ebayPartnerId);
          source = "eBay";
        } else if (link.includes("walmart.com")) {
          link = addWalmartAffiliateId(link, walmartAffiliateId);
          source = "Walmart";
        } else if (link.includes("aliexpress.com")) {
          link = addAliExpressAffiliateId(link, aliexpressAffiliateId);
          source = "AliExpress";
        } else {
          source = "Google Search";
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
