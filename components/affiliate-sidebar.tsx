"use client";
import { useState, useEffect } from "react";

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

interface AffiliateSidebarProps {
  videoTitle?: string;
  videoTags?: string[];
}

export default function AffiliateSidebar({ videoTitle, videoTags }: AffiliateSidebarProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDefaultDeals() {
      const res = await fetch('/api/affiliate-search?query=');
      const data = await res.json();
      setProducts(data);
    }
    fetchDefaultDeals();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setProducts([]);
    const res = await fetch(`/api/affiliate-search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  return (
    <aside style={{ padding: 16, width: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
          Best Deals on Trending Products
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search trending products..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button type="submit" style={{
          padding: "8px 12px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#2a9d8f",
          color: "#fff",
          cursor: "pointer"
        }}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {!loading && products.length === 0 && <div>No deals found.</div>}

      {products.map(product => (
        <div
          key={product.link}
          style={{
            marginBottom: 24,
            background: "#fff",
            padding: 12,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              <span>{product.nicheIcon}</span> <strong>{product.niche}</strong> • {product.source}
            </div>

            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "contain",
                  borderRadius: 4,
                  margin: "8px 0",
                  background: "#f4f4f4",
                }}
              />
            )}

            <div style={{
              fontWeight: "bold",
              fontSize: 14,
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {product.title}
            </div>

            {product.price && (
              <div style={{ color: "#2a9d8f", fontWeight: 600, fontSize: 13 }}>
                {product.price}
              </div>
            )}

            {product.snippet && (
              <div style={{
                fontStyle: "italic",
                color: "#555",
                fontSize: 12,
                marginTop: 4
              }}>
                {product.snippet}
              </div>
            )}
          </a>
        </div>
      ))}
    </aside>
  );
}
