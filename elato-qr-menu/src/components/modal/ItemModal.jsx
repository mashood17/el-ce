import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import useMenuStore from "../../store/useMenuStore";
import VegIndicator from "../menu/VegIndicator";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ItemModal() {
  const { selectedItem, isModalOpen, closeItem } = useMenuStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const item = selectedItem;

  return (
    <AnimatePresence>
      {isModalOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(44,26,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={closeItem}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            variants={prefersReducedMotion ? {} : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center"
          >
            <div
              className="relative w-full md:max-w-lg md:mx-auto"
              style={{
                background: "#EBD8B7",
                borderRadius: "20px 20px 0 0",
                maxHeight: "92vh",
                overflowY: "auto",
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeItem}
                className="absolute top-4 right-4 z-10 p-2 text-brand-accent hover:text-brand-gold transition-colors"
                aria-label="Close"
              >
                <CloseIcon />
              </button>

              {/* Image */}
              {item.image_url ? (
                <div className="w-full" style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "20px 20px 0 0" }}
                  />
                </div>
              ) : (
                <div
                  className="w-full flex items-center justify-center"
                  style={{
                    aspectRatio: "4/3",
                    background: "#EEDDBF",
                    borderRadius: "20px 20px 0 0",
                  }}
                >
                  <span
                    className="font-display text-brand-accent tracking-luxury uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Elatō Celebré
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-6">
                <div className="flex items-start gap-3 mb-3">
                  <VegIndicator isVeg={item.is_veg} size={16} />
                  <h2
                    className="font-display text-brand-dark flex-1"
                    style={{ fontSize: "1.5rem", fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {item.name}
                  </h2>
                </div>

                {item.description && (
                  <p
                    className="font-body text-brand-accent mb-6"
                    style={{ fontSize: "0.85rem", lineHeight: 1.7, paddingLeft: "24px" }}
                  >
                    {item.description}
                  </p>
                )}

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(158,117,25,0.2)" }}
                >
                  <span
                    className="font-body text-brand-accent tracking-luxury uppercase"
                    style={{ fontSize: "0.6rem" }}
                  >
                    Price
                  </span>
                  <span
                    className="font-display text-brand-gold"
                    style={{ fontSize: "1.6rem", fontWeight: 500 }}
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