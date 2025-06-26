"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { AFFILIATE_NICHES } from "@/app/constants/affiliate-niches";

interface Product {
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

interface SearchResult {
  products: Product[];
  total: number;
}

export default function AffiliateSidebar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalResults, setTotalResults] = useState(0);

  const categories = [
    { name: "All", icon: "🔍" },
    ...AFFILIATE_NICHES,
    { name: "Uncategorized", icon: "❓" },
  ];

  async function fetchProducts(searchQuery: string, pageNumber: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/affiliate-search?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}&limit=${limit}`
      );
      const data: SearchResult = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalResults(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
      setProducts([]);
      setTotalResults(0);
    }
    setLoading(false);
  }

  useEffect(() => {
    // On mount and when page changes, fetch with default query "shoes"
    fetchProducts("shoes", page);
  }, [page]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1); // Reset page to 1 on new search
    fetchProducts(query.trim(), 1);
  }

  // Filter products by selected category (case-insensitive)
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.niche?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const totalPages = Math.ceil(totalResults / limit);

  return (
    <aside className="p-4 w-full box-border bg-gray-50">
      <div className="mb-4">
        <div className="font-bold text-lg mb-2">Best Deals on Trending Products</div>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trending products..."
            className="flex-1 p-2 border border-gray-300 rounded text-sm"
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-3 py-2 rounded text-sm"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`text-sm px-3 py-1 rounded-full border ${
                selectedCategory === name
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              <span className="mr-1">{icon}</span> {name}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-sm">Loading...</div>}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-sm text-gray-500">No deals found.</div>
      )}
      {!loading &&
        filteredProducts.map((product) => (
          <ProductCard key={product.link} product={product} />
        ))}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm pt-1">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={loading || page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </aside>
  );
}
