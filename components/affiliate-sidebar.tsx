"use client"

import { useEffect, useState } from "react"
// Removed direct import of searchAffiliateProducts as it's a server action
import { Card, CardContent } from "@/components/ui/card"
import { SidebarHeader, SidebarContent } from "@/components/ui/sidebar"

interface Product {
  title: string
  link: string
  imageUrl: string
  snippet?: string
  isSponsored?: boolean
  source: string // Added source to the Product interface
}

export function AffiliateSidebar({ videoTitle, videoTags }: { videoTitle: string; videoTags: string[] }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(videoTitle || videoTags[0] || "")

  useEffect(() => {
    const queryToUse = videoTitle || videoTags[0] || ""
    if (!queryToUse) {
      setProducts([])
      setLoading(false)
      return
    }

    const cacheKey = `affiliate_${queryToUse}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      setProducts(JSON.parse(cached))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    // Fetch from the new API route
    fetch(`/api/affiliate-search?query=${encodeURIComponent(queryToUse)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((res) => {
        setProducts(res)
        localStorage.setItem(cacheKey, JSON.stringify(res))
      })
      .catch((err) => {
        console.error("Error fetching affiliate products:", err)
        setError("Failed to fetch products. Please try again later.")
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [videoTitle, videoTags])

  return (
    <>
      <SidebarHeader>
        <h3 className="text-lg font-semibold text-center">Shop Deals</h3>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading deals...</p>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deals found.</p>
        ) : (
          <div className="grid gap-3">
            {products.map((p) => (
              <Card key={p.link} className="w-full bg-background text-foreground shadow-sm">
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  <CardContent className="p-2">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={p.title}
                        className="w-full h-24 object-contain mb-2 rounded-md"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 flex items-center justify-center mb-2 text-gray-500 rounded-md">
                        No Image
                      </div>
                    )}
                    <p className="text-sm font-medium line-clamp-2">{p.title}</p>
                    {p.snippet && <p className="text-xs text-muted-foreground line-clamp-2">{p.snippet}</p>}
                    <span className="text-xs text-blue-500 hover:underline mt-1 block">View on {p.source}</span>
                    {(p.isSponsored || p.source === "Google Search") && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Sponsored</span>
                    )}
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground italic mt-6 p-2">
          As an affiliate, we may earn from qualifying purchases.
        </p>
      </SidebarContent>
    </>
  )
}
