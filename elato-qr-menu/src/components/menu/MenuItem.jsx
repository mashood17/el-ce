import { motion } from "framer-motion";
import VegIndicator from "./VegIndicator";
import useMenuStore from "../../store/useMenuStore";

export default function MenuItem({ item }) {
  const openItem = useMenuStore((s) => s.openItem);

  return (
    <motion.div
      whileTap={{ scale: 0.994 }}
      onClick={() => openItem(item)}
      className="group cursor-pointer"
      style={{
        padding: "14px 0",
        borderBottom: "1px solid rgba(90,55,10,0.14)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {/* Left */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <VegIndicator isVeg={item.is_veg} />
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.22rem",
              fontWeight: 600,
              color: "#1A0E00",
              lineHeight: 1.25,
              letterSpacing: "0.01em",
              transition: "color 0.2s ease",
            }}
            className="group-hover:text-amber-800"
          >
            {item.name}
          </h3>
        </div>
        {item.description && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 400,
              color: "#6B4A18",
              lineHeight: 1.6,
              paddingLeft: "20px",
              letterSpacing: "0.01em",
            }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div style={{ flexShrink: 0, paddingTop: "1px" }}>
        <span
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "#6B3E00",
            letterSpacing: "0.02em",
            display: "block",
          }}
        >
          ₹{item.price % 1 === 0 ? Math.floor(item.price) : item.price}
        </span>
      </div>
    </motion.div>
  );
}