import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "../../hooks/useWindowSize";

const pageTitles = {
  "/": "Dashboard",
  "/categories": "Categories",
  "/items": "Menu Items",
  "/hero": "Hero Slides",
};

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const title = pageTitles[location.pathname] || "Admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5EFE4" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile topbar — only renders on mobile */}
        {isMobile && (
          <header style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "13px 16px",
            background: "#1A0E00",
            borderBottom: "1px solid rgba(196,163,90,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none", border: "none",
                color: "#C4A35A", cursor: "pointer",
                padding: "4px", display: "flex", alignItems: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1rem", fontWeight: 500,
              letterSpacing: "0.1em", color: "#C4A35A",
              textTransform: "uppercase",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              Elatō — {title}
            </p>
          </header>
        )}

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}