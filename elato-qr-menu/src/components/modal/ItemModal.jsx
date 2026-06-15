import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import useMenuStore from "../../store/useMenuStore";
import VegIndicator from "../menu/VegIndicator";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.22, ease: "easeIn" } },
};

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ItemModal() {
  const { selectedItem, isModalOpen, closeItem } = useMenuStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const item = selectedItem;

  return (
    <AnimatePresence>
      {isModalOpen && item && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.28 }}
            onClick={closeItem}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(26,14,0,0.6)",
              backdropFilter: "blur(5px)",
            }}
          />

          <motion.div
            key="modal"
            variants={prefersReducedMotion ? {} : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              insetInline: 0,
              bottom: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            className="md:items-center md:inset-0"
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "480px",
                background: "#F0DFB8",
                borderRadius: "16px 16px 0 0",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 -8px 60px rgba(44,26,0,0.18)",
              }}
              className="md:rounded-sm"
            >
              {/* Close */}
              <button
                onClick={closeItem}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  padding: "6px",
                  color: "#6B4A18",
                  background: "rgba(235,216,183,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s ease",
                }}
              >
                <CloseIcon />
              </button>

              {/* Image */}
              {item.image_url ? (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    borderRadius: "16px 16px 0 0",
                  }}
                  className="md:rounded-t-sm"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    background: "#E5CFA0",
                    borderRadius: "16px 16px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.25em",
                      color: "#9E7519",
                      textTransform: "uppercase",
                      fontWeight: 400,
                    }}
                  >
                    Elatō Celebré
                  </p>
                </div>
              )}

              {/* Content */}
              <div style={{ padding: "24px 28px 32px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <VegIndicator isVeg={item.is_veg} />
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.55rem",
                      fontWeight: 600,
                      color: "#1A0E00",
                      lineHeight: 1.15,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.name}
                  </h2>
                </div>

                {item.description && (
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 400,
                      color: "#6B4A18",
                      lineHeight: 1.7,
                      marginBottom: "20px",
                      paddingLeft: "20px",
                    }}
                  >
                    {item.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(90,55,10,0.14)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.28em",
                      color: "#9E7519",
                      textTransform: "uppercase",
                    }}
                  >
                    Price
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.7rem",
                      fontWeight: 600,
                      color: "#6B3E00",
                      letterSpacing: "0.02em",
                    }}
                  >
                    ₹{item.price % 1 === 0 ? Math.floor(item.price) : item.price}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}