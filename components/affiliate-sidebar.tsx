"use client";

import { useState } from "react";

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
    <aside style={{ padding: 16, width: 320, background: "#f9f9f9" }}>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search trending products..."
          style={{ width: "70%", padding: 8, marginRight: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: 8, borderRadius: 4 }}>
          Search
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {!loading && products.length === 0 && <div>No deals found.</div>}
      {products.map(product => (
        <div key={product.link} style={{ marginBottom: 24, background: "#fff", padding: 10, borderRadius: 6, boxShadow: "0 1px 4px #0001" }}>
          <div>
            <span style={{ fontSize: 22 }}>{product.nicheIcon}</span>{" "}
            <strong>{product.niche}</strong> | <small>{product.source}</small>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            <img src={product.imageUrl} alt={product.title} style={{ width: "100%", borderRadius: 4, margin: "8px 0" }} />
            <div style={{ fontWeight: "bold" }}>{product.title}</div>
          </a>
          {product.price && <div style={{ color: "#2a9d8f", fontWeight: 600 }}>Price: {product.price}</div>}
          {product.snippet && <div style={{ fontStyle: "italic", color: "#555" }}>{product.snippet}</div>}
        </div>
      ))}
    </aside>
  );
}
