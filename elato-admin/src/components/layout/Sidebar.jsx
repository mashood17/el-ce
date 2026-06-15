import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";

const nav = [
  {
    to: "/", label: "Dashboard",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: "/categories", label: "Categories",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h10"/></svg>,
  },
  {
    to: "/items", label: "Menu Items",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h12"/><circle cx="20" cy="18" r="2"/></svg>,
  },
  {
    to: "/hero", label: "Hero Slides",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8.5" cy="12" r="1.5"/><path d="M21 15l-5-5-4 4-3-2-4 4"/></svg>,
  },
];

function NavItems({ onClose }) {
  const logout = useAuthStore((s) => s.logout);
  const admin = useAuthStore((s) => s.admin);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <div style={{ padding: "26px 20px 20px", borderBottom: "1px solid rgba(196,163,90,0.1)", flexShrink: 0 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.1rem", fontWeight: 500,
          letterSpacing: "0.14em", color: "#C4A35A", textTransform: "uppercase",
        }}>
          Elatō Celebré
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.58rem", color: "rgba(196,163,90,0.38)",
          letterSpacing: "0.12em", marginTop: "3px",
        }}>
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "11px",
              padding: "11px 13px", borderRadius: "4px", marginBottom: "3px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem", fontWeight: isActive ? 500 : 400,
              color: isActive ? "#C4A35A" : "rgba(235,216,183,0.48)",
              background: isActive ? "rgba(196,163,90,0.1)" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s ease",
              borderLeft: isActive ? "2px solid #C4A35A" : "2px solid transparent",
            })}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(196,163,90,0.1)", flexShrink: 0 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.67rem",
          color: "rgba(196,163,90,0.32)", marginBottom: "10px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {admin?.email}
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: "none", border: "1px solid rgba(196,163,90,0.18)",
            borderRadius: "3px", padding: "8px 14px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
            color: "rgba(196,163,90,0.5)", cursor: "pointer", width: "100%",
            transition: "all 0.2s ease",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose, isMobile }) {
  // Desktop — always visible, never an overlay
  if (!isMobile) {
    return (
      <aside style={{
        width: "220px", minHeight: "100vh",
        background: "#1A0E00", flexShrink: 0,
        display: "flex", flexDirection: "column",
      }}>
        <NavItems />
      </aside>
    );
  }

  // Mobile — drawer only, hidden by default
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(26,14,0,0.6)",
              backdropFilter: "blur(3px)",
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: "240px", background: "#1A0E00",
              zIndex: 50, display: "flex", flexDirection: "column",
              boxShadow: "4px 0 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "14px", right: "14px",
                background: "rgba(196,163,90,0.1)", border: "none",
                borderRadius: "50%", width: "30px", height: "30px",
                color: "#C4A35A", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <NavItems onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}