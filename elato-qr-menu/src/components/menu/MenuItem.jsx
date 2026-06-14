import { motion } from "framer-motion";
import VegIndicator from "./VegIndicator";
import useMenuStore from "../../store/useMenuStore";

export default function MenuItem({ item }) {
  const openItem = useMenuStore((s) => s.openItem);

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={() => openItem(item)}
      className="flex items-center justify-between py-4 cursor-pointer group"
      style={{ borderBottom: "1px solid rgba(158,117,25,0.12)" }}
    >
      {/* Left: Name + Description */}
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <VegIndicator isVeg={item.is_veg} />
          <h3
            className="font-display text-brand-dark group-hover:text-brand-gold transition-colors duration-300"
            style={{ fontSize: "1rem", fontWeight: 400, lineHeight: 1.3 }}
          >
            {item.name}
          </h3>
        </div>
        {item.description && (
          <p
            className="font-body text-brand-accent"
            style={{ fontSize: "0.72rem", lineHeight: 1.5, paddingLeft: "22px" }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Right: Price */}
      <div className="text-right flex-shrink-0">
        <span
          className="font-display text-brand-gold"
          style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "0.02em" }}
        >
          ₹{item.price % 1 === 0 ? Math.floor(item.price) : item.price}
        </span>
      </div>
    </motion.div>
  );
}