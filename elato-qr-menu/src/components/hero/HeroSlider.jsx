import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroSlides } from "../../hooks/useHeroSlides";

const INTERVAL = 4000;

// Fallback slides if API hasn't loaded
const FALLBACK_SLIDES = [
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1400&q=80",
  "https://images.unsplash.com/photo-1567206563114-c179706a56b4?w=1400&q=80",
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1400&q=80",
];

export default function HeroSlider() {
  const { data: slides, isLoading } = useHeroSlides();
  const [current, setCurrent] = useState(0);

  const images = slides?.length
    ? slides.map((s) => s.image_url)
    : FALLBACK_SLIDES;

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(advance, INTERVAL);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(200px, 33vh, 85vh)" }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[current]}
            alt="Elatō Celebré"
            className="w-full h-full object-cover"
            loading={current === 0 ? "eager" : "lazy"}
          />
          {/* Minimal dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 100%)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-500"
            style={{
              width: i === current ? "24px" : "6px",
              height: "2px",
              background: i === current ? "#EBD8B7" : "rgba(235,216,183,0.4)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}