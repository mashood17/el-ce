import { motion } from "framer-motion";
import MenuItem from "./MenuItem";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CategorySection({ category }) {
  const activeItems = category.items?.filter((i) => i.is_active) ?? [];
  if (activeItems.length === 0) return null;

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="mb-12"
    >
      {/* Category Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div
            style={{
              height: "1px",
              flex: 1,
              background: "linear-gradient(90deg, rgba(158,117,25,0.5), transparent)",
            }}
          />
          <h2
            className="font-display text-brand-gold tracking-luxury uppercase text-center"
            style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)", fontWeight: 400 }}
          >
            {category.name}
          </h2>
          <div
            style={{
              height: "1px",
              flex: 1,
              background: "linear-gradient(90deg, transparent, rgba(158,117,25,0.5))",
            }}
          />
        </div>
      </div>

      {/* Items */}
      <div>
        {activeItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  );
}