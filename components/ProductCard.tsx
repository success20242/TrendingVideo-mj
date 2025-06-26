"use client";
import React from "react";

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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform">
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit"
      >
        <div className="text-xs text-gray-500 mb-2">
          <span>{product.nicheIcon}</span>{" "}
          <strong>{product.niche}</strong> • {product.source}
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
      </a>
    </div>
  );
}
