'use client';

import TrendingVideo from "./trending-video"; 
import AffiliateSidebar from "@/components/affiliate-sidebar";
import { useState } from "react";

export default function Page() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        className={showSidebar ? "sidebar" : "sidebar hidden"}
        aria-hidden={!showSidebar}
        style={{
          borderRight: "1px solid #eee",
          background: "#f9f9f9",
        }}
      >
        <AffiliateSidebar />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "16px" }}>
        {/* Toggle button for mobile */}
        <button
          aria-label={showSidebar ? "Hide deals sidebar" : "Show deals sidebar"}
          onClick={() => setShowSidebar(!showSidebar)}
          className="toggle-btn"
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            fontSize: 14,
            border: "1px solid #ddd",
            borderRadius: 4,
            background: "#fff",
            display: "none",
            cursor: "pointer",
          }}
        >
          {showSidebar ? "Hide" : "Show"} Deals
        </button>

        <TrendingVideo />
      </main>

      {/* Styles */}
      <style>{`
        aside.sidebar {
          width: 320px;
          flex-shrink: 0;
          transition: width 0.3s ease, opacity 0.3s ease;
          opacity: 1;
          overflow: visible;
        }
        aside.sidebar.hidden {
          width: 0;
          opacity: 0;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .toggle-btn {
            display: inline-block;
          }
        }
      `}</style>
    </div>
  );
}
