import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import MenuPage from "./pages/MenuPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false },
  },
});

function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#1A0E00",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      {/* Top ornament */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        style={{
          width: "48px",
          height: "1px",
          background: "#C4A35A",
          marginBottom: "28px",
        }}
      />

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2rem, 8vw, 3.2rem)",
          fontWeight: 300,
          letterSpacing: "0.28em",
          color: "#F5EDD8",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: "16px",
        }}
      >
        Elatō Celebré
      </motion.h1>

      {/* Ornament divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div style={{ width: "40px", height: "1px", background: "rgba(196,163,90,0.5)" }} />
        <div style={{ width: "4px", height: "4px", background: "#C4A35A", transform: "rotate(45deg)" }} />
        <div style={{ width: "40px", height: "1px", background: "rgba(196,163,90,0.5)" }} />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(196,163,90,0.7)",
          letterSpacing: "0.06em",
          textAlign: "center",
          maxWidth: "280px",
        }}
      >
        Premium Ice Cream Experience
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: "48px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#C4A35A",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onDone={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/:slug" element={<MenuPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </QueryClientProvider>
  );
}