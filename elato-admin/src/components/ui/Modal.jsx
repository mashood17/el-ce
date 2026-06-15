import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, children, width = "580px" }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(26,14,0,0.5)", backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal — full screen on mobile, centered on desktop */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              padding: "0",
            }}
            className="sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "#FBF5E8",
                borderRadius: "12px 12px 0 0",
                width: "100%",
                maxHeight: "95vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 -8px 60px rgba(26,14,0,0.2)",
              }}
              className={`sm:rounded-sm sm:max-w-[${width}]`}
            >
              {/* Header — sticky */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: "1px solid rgba(90,55,10,0.12)",
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.3rem", fontWeight: 500,
                  color: "#1A0E00", letterSpacing: "0.03em",
                }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: "rgba(90,55,10,0.07)", border: "none",
                    borderRadius: "50%", width: "32px", height: "32px",
                    cursor: "pointer", color: "#6B4A18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Body — scrollable */}
              <div style={{
                overflowY: "auto", flex: 1,
                padding: "22px",
                WebkitOverflowScrolling: "touch",
              }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}