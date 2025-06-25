"use client";

import { useState } from "react";

// You may need to import your Product type and make an API call to your server action
// For this example, let's assume you have an /api/affiliate-search route set up

export default function AffiliateSidebar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/affiliate-search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  return (
    <aside>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search trending products..."
          style={{ width: "80%", marginRight: 8 }}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {!loading && products.length === 0 && <div>No deals found.</div>}
      {products.map(product => (
        <div key={product.link} style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 24 }}>{product.nicheIcon}</span>
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            <img src={product.imageUrl} alt={product.title} style={{ width: 100 }} />
            <div>{product.title}</div>
          </a>
          {product.price && <div><strong>Price:</strong> {product.price}</div>}
          {product.snippet && <div><em>{product.snippet}</em></div>}
          <div style={{ color: "#888" }}>{product.niche} | {product.source}</div>
        </div>
      ))}
    </aside>
  );
}
