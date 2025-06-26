"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

// Affiliate niches with icons
const AFFILIATE_NICHES = [
  { name: "Tech & Gadgets", icon: "📱" },
  { name: "Health & Wellness", icon: "💪" },
  { name: "Personal Finance & Investing", icon: "💰" },
  { name: "Home Improvement & DIY", icon: "🏠" },
  { name: "Beauty & Skincare", icon: "💄" },
  { name: "Online Learning & E-Learning Tools", icon: "🎓" },
  { name: "Sustainable & Eco-Friendly Products", icon: "🌱" },
  { name: "Gaming & Esports", icon: "🎮" },
  { name: "Pet Care & Products", icon: "🐾" },
  { name: "Travel & Outdoor Gear", icon: "🌍" }
];

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

export default function AffiliateSidebar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add "All" category at the start
  const categories = [{ name: "All", icon: "🔍" }, ...AFFILIATE_NICHES];

  useEffect(() => {
    async function fetchDeals() {
      try {
        // Use a valid default query instead of empty string
        const defaultQuery = "shoes";
        const res = await fetch(`/api/affiliate-search?query=${defaultQuery}`);
        const data = await res.json();
        console.log("Fetched products on mount:", data); // Debug log
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch default deals:", err);
        setProducts([]);
      }
    }
    fetchDeals();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setProducts([]);
    try {
      const res = await fetch(`/api/affiliate-search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      console.log("Fetched products on search:", data); // Debug log
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setProducts([]);
    }
    setLoading(false);
  }

  // Improved filter: case-insensitive match between product niche and selectedCategory
  const filteredProducts =
    Array.isArray(products)
      ? selectedCategory === "All"
        ? products
        : products.filter(
            (p) =>
              p.niche?.toLowerCase() === selectedCategory.toLowerCase()
          )
      : [];

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
    </aside>
  );
}
