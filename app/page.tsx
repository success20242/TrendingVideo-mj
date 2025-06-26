'use client';

import TrendingVideo from "./trending-video"; 
import AffiliateSidebar from "@/components/affiliate-sidebar";
import { useState } from "react";

export default function Page() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      maxWidth: "100%",
      overflowX: "hidden"
    }}>
      {/* Sidebar - hidden on mobile */}
      {showSidebar && (
        <div style={{
          width: 320,
          flexShrink: 0,
          borderRight: "1px solid #eee",
          background: "#f9f9f9"
        }}>
          <AffiliateSidebar />
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "16px" }}>
        {/* Toggle button for mobile */}
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            fontSize: 14,
            border: "1px solid #ddd",
            borderRadius: 4,
            background: "#fff",
            display: "none",
          }}
          className="toggle-btn"
        >
          {showSidebar ? "Hide" : "Show"} Deals
        </button>

        <TrendingVideo />
      </div>

      {/* Media query styling for toggle button */}
      <style>{`
        @media (max-width: 768px) {
          .toggle-btn {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
