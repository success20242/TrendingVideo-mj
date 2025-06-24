"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchAffiliateProducts } from "@/app/actions/affiliate-search"

interface AffiliateSidebarProps {
  videoTitle: string
  videoTags: string[]
}

interface Product {
  title: string
  imageUrl: string
  price?: string
  link: string
  source: "Amazon" | "eBay" | "Google Search"
  isSponsored: boolean
}

export function AffiliateSidebar({ videoTitle, videoTags }: AffiliateSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState(videoTitle || videoTags[0] || "")
  const [products, setProducts] = React.useState<Product[]>([])
  const [cachedQuery, setCachedQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSearch = React.useCallback(
    async (query: string) => {
      if (!query || query === cachedQuery) return // Prevent redundant searches

      setLoading(true)
      setError(null)

      // Try to load from cache first
      const cached = localStorage.getItem(`affiliate_${query}`)
      if (cached) {
        setProducts(JSON.parse(cached))
        setCachedQuery(query)
        setLoading(false)
        return
      }

      try {
        // Use the existing server action to fetch products
        const results = await searchAffiliateProducts(query)
        setProducts(results)
        setCachedQuery(query)
        localStorage.setItem(`affiliate_${query}`, JSON.stringify(results)) // Cache the results
      } catch (err) {
        console.error("Error fetching affiliate products:", err)
        setError("Failed to fetch products. Please try again later.")
        setProducts([])
      } finally {
        setLoading(false)
      }
    },
    [cachedQuery],
  ) // Include cachedQuery in dependency array

  React.useEffect(() => {
    if (videoTitle || videoTags.length > 0) {
      handleSearch(videoTitle || videoTags[0])
    }
  }, [videoTitle, videoTags, handleSearch])

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader>
        <h2 className="text-xl font-semibold text-center">Product Deals</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch(searchQuery)
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          <Input
            id="product-search"
            placeholder="Search products..."
            className="pl-8 bg-background text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="sr-only">
            Search
          </Button>
        </form>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading products...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">No related products found.</div>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {products.map((product, index) => (
                  <SidebarMenuItem key={index}>
                    <Card className="w-full bg-background text-foreground shadow-sm">
                      <CardContent className="p-2 flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium line-clamp-2">{product.title}</CardTitle>
                          {product.price && <p className="text-xs text-muted-foreground mt-1">{product.price}</p>}
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline mt-1 block"
                          >
                            View on {product.source}
                          </a>
                          {(product.isSponsored || product.source === "Google Search") && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Sponsored</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <p className="mt-6 text-xs text-gray-500 italic p-2">As an affiliate, we may earn from qualifying purchases.</p>
    </div>
  )
}
