import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useHeroSlides } from "../../hooks/useHeroSlides";

const INTERVAL = 5000;

const FALLBACK_SLIDES = [];

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const ornamentVariant = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1, scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function HeroSlider() {
  const { data: slides } = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const prefersReducedMotion = useReducedMotion();

  const images = slides?.length ? slides.map((s) => s.image_url) : FALLBACK_SLIDES;

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(advance, INTERVAL);
    return () => clearInterval(timer);
  }, [advance]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /*
   * Height strategy:
   * Mobile  → 100svh (small viewport height — excludes browser chrome on iOS/Android)
   *            Falls back to 100dvh, then 100vh for older browsers.
   * Desktop → clamp(480px, 80vh, 900px) — generous but not full screen.
   */
  const heroHeight = isMobile
    ? "35vh"
    : "80vh";

  /*
   * Content alignment:
   * Mobile  → centered vertically so nothing is cut off top or bottom.
   * Desktop → bottom-aligned with pb padding for editorial look.
   */
  const contentAlign = isMobile
    ? {
        justifyContent: "center",
        paddingBottom: "0",
        paddingTop: "0",
        }
    : {
        justifyContent: "flex-end",
        paddingBottom: "72px",
        paddingTop: "0",
        };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        height: heroHeight,
        // CSS fallback chain for browsers that don't support svh
        ...(isMobile && {
          // base fallback
        }),
      }}
      // Use a style tag approach for svh support — inline style wins
    >
      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <motion.img
            src={images[current]}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading={current === 0 ? "eager" : "lazy"}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay — heavier on mobile for text legibility */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: isMobile
            ? "linear-gradient(to bottom, rgba(10,5,0,0.35) 0%, rgba(10,5,0,0.25) 30%, rgba(10,5,0,0.6) 70%, rgba(10,5,0,0.85) 100%)"
            : "linear-gradient(to bottom, rgba(10,5,0,0.15) 0%, rgba(10,5,0,0.08) 30%, rgba(10,5,0,0.55) 70%, rgba(10,5,0,0.82) 100%)",
        }}
      />

      {/* Brand content */}
      <motion.div
        style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? "20px 20px" : "0 24px",
          ...contentAlign,
        }}
        variants={prefersReducedMotion ? {} : heroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={prefersReducedMotion ? {} : heroItem}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? "0.58rem" : "clamp(0.52rem, 1.2vw, 0.65rem)",
            letterSpacing: "0.32em",
            color: "#C4A35A",
            textTransform: "uppercase",
            marginBottom: isMobile ? "14px" : "12px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Premium Ice Cream Experience
        </motion.p>

        {/* Brand name */}
        <motion.h1
          variants={prefersReducedMotion ? {} : heroItem}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            /*
             * Mobile: smaller size so "ELATŌ CELEBRÉ" fits on one line
             * if possible, or wraps cleanly on two without overflow.
             */
            fontSize: isMobile
                ? "clamp(1.6rem, 9vw, 2.4rem)"
                : "clamp(2.4rem, 8vw, 5rem)",
            fontWeight: 500,
            letterSpacing: isMobile ? "0.16em" : "0.2em",
            color: "#FAF0DC",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: isMobile ? "8px" : "16px",
            textShadow: "0 1px 30px rgba(0,0,0,0.4)",
          }}
        >
          Elatō Celebré
        </motion.h1>

        {/* Ornament */}
        <motion.div
          variants={prefersReducedMotion ? {} : ornamentVariant}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: isMobile ? "8px" : "14px",
            transformOrigin: "center",
          }}
        >
          <div style={{ width: isMobile ? "36px" : "50px", height: "1px", background: "rgba(196,163,90,0.55)" }} />
          <div style={{ width: "4px", height: "4px", background: "#C4A35A", transform: "rotate(45deg)" }} />
          <div style={{ width: isMobile ? "36px" : "50px", height: "1px", background: "rgba(196,163,90,0.55)" }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={prefersReducedMotion ? {} : heroItem}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: isMobile ? "0.9rem" : "clamp(0.82rem, 2vw, 1.05rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(250,240,220,0.9)",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: isMobile ? "280px" : "420px",
            textShadow: "0 1px 20px rgba(0,0,0,0.35)",
          }}
        >
          Where Every Scoop Is A Celebration Of Flavour And Finesse
        </motion.p>

        {/* Scroll cue — only on desktop */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            style={{
              marginTop: "32px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "6px",
            }}
          >
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.5rem", letterSpacing: "0.28em",
              color: "rgba(196,163,90,0.75)", textTransform: "uppercase",
            }}>
              Our Menu
            </p>
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <path d="M7 0v13M1 8l6 8 6-8"
                  stroke="rgba(196,163,90,0.75)" strokeWidth="1.1"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Slide dots */}
      <div style={{
        position: "absolute", zIndex: 30,
        bottom: isMobile ? "24px" : "16px",
        right: "20px",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            animate={{
              width: i === current ? 18 : 4,
              background: i === current ? "#C4A35A" : "rgba(196,163,90,0.3)",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              height: "2px", border: "none", padding: 0,
              cursor: "pointer", borderRadius: "1px",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}