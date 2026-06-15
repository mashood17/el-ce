import { motion } from "framer-motion";
import MenuItem from "./MenuItem";

// Category section reveal
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// Heading line expands from left
const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Stagger container for menu items
const listContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function CategoryHeading({ name }) {
  return (
    <div style={{ marginBottom: "28px" }}>
     
      <motion.h2
        variants={listItem}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)",
          fontWeight: 500,
          color: "#1A0E00",
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          marginBottom: "12px",
        }}
      >
        {name}
      </motion.h2>
      <motion.div
        variants={lineVariants}
        style={{
          width: "28px",
          height: "1.5px",
          background: "#9E7519",
          opacity: 0.7,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

function PillHeading({ name }) {
  return (
    <motion.div
      variants={sectionVariants}
      className="flex items-center gap-3"
      style={{ marginBottom: "20px" }}
    >
      <motion.div
        variants={lineVariants}
        style={{
          height: "1px",
          flex: 1,
          background: "linear-gradient(90deg, rgba(90,55,10,0.25), transparent)",
          transformOrigin: "left center",
        }}
      />
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.3em",
          color: "#5A3710",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </h2>
      <motion.div
        variants={lineVariants}
        style={{
          height: "1px",
          flex: 1,
          background: "linear-gradient(90deg, transparent, rgba(90,55,10,0.25))",
          transformOrigin: "right center",
        }}
      />
    </motion.div>
  );
}

// Animated wrapper for each menu item row
function AnimatedMenuItem({ children }) {
  return (
    <motion.div variants={listItem}>
      {children}
    </motion.div>
  );
}

export default function CategorySection({ category, index }) {
  const activeItems = category.items?.filter((i) => i.is_active) ?? [];
  if (activeItems.length === 0) return null;

  const imageRight = index % 2 === 0;
  const hasImage = true;

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      style={{ marginBottom: "72px" }}
    >
      {/* ══ DESKTOP with image ══ */}
      {hasImage ? (
        <motion.div
          className="hidden lg:flex"
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          style={{
            flexDirection: imageRight ? "row" : "row-reverse",
            gap: "64px",
            alignItems: "stretch",
            minHeight: "440px",
          }}
        >
          {/* Content */}
          <div
            style={{
              flex: "0 0 54%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CategoryHeading name={category.name} />
            <motion.div variants={listContainer}>
              {activeItems.map((item) => (
                <AnimatedMenuItem key={item.id}>
                  <MenuItem item={item} />
                </AnimatedMenuItem>
              ))}
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            style={{ flex: "0 0 42%", position: "relative" }}
            variants={{
              hidden: { opacity: 0, x: imageRight ? 24 : -24 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
              },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "440px",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(44,26,0,0.14), 0 4px 16px rgba(44,26,0,0.08)",
              }}
            >
              {category.image_url ? (
                <motion.img
                    src={category.image_url}
                    alt={category.name}
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    loading="lazy"
                    onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.querySelector(".img-placeholder").style.display = "flex";
                    }}
                />
                ) : null}
                <div
                className="img-placeholder"
                style={{
                    display: "none",
                    position: "absolute",
                    inset: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "12px",
                    background: "linear-gradient(135deg, #E8D4A8 0%, #DFC99A 100%)",
                }}
                >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(158,117,25,0.4)" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5-4 4-3-2-4 4"/>
                </svg>
                <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    color: "rgba(158,117,25,0.5)",
                    textTransform: "uppercase",
                    fontStyle: "italic",
                }}>
                    {category.name}
                </p>
                </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(158,117,25,0.07) 0%, transparent 55%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        /* ══ DESKTOP no image ══ */
        <div className="hidden lg:block">
          <PillHeading name={category.name} />
          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ maxWidth: "560px", margin: "0 auto" }}
          >
            {activeItems.map((item) => (
              <AnimatedMenuItem key={item.id}>
                <MenuItem item={item} />
              </AnimatedMenuItem>
            ))}
          </motion.div>
        </div>
      )}

      {/* ══ MOBILE ══ */}
      <div className="lg:hidden">
        <PillHeading name={category.name} />
        <motion.div
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {activeItems.map((item) => (
            <AnimatedMenuItem key={item.id}>
              <MenuItem item={item} />
            </AnimatedMenuItem>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}