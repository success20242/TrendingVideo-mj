"use client";
import React from "react";

// Expanded source list for future extensibility
type AffiliateSource = "Amazon" | "eBay" | "Walmart" | "AliExpress" | "Google Search" | "Other";

interface Product {
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

export default function ProductCard({ product }: { product: Product }) {
  // Color code for each affiliate source (add more as needed)
  const sourceColors: Record<AffiliateSource, string> = {
    Amazon: "bg-yellow-100 text-yellow-800",
    eBay: "bg-blue-100 text-blue-700",
    Walmart: "bg-blue-50 text-blue-900",
    AliExpress: "bg-red-100 text-red-700",
    "Google Search": "bg-gray-100 text-gray-700",
    Other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform">
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit"
      >
        <div className="flex items-center text-xs text-gray-500 mb-2">
          {product.nicheIcon && (
            <span className="mr-1">{product.nicheIcon}</span>
          )}
          <strong className="mr-1">{product.niche}</strong>
          {/* Show a colored badge for the affiliate source */}
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${sourceColors[product.source]}`}
          >
            {product.source}
          </span>
        </div>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-28 object-contain rounded bg-gray-100 mb-2"
          />
        )}

        <div className="font-bold text-sm truncate mb-1">{product.title}</div>

        {product.price && (
          <div className="text-green-600 font-semibold text-sm">
            {product.price}
          </div>
        )}

        {product.snippet && (
          <div className="italic text-xs text-gray-600 mt-1">
            {product.snippet}
          </div>
        )}

        {/* Optionally: Indicate if this is a sponsored/affiliate listing */}
        {product.isSponsored && (
          <div className="mt-2 text-[11px] text-teal-600 font-semibold">
            Affiliate Link
          </div>
        )}
      </a>
    </div>
  );
}
