import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import HeroSlider from "../components/hero/HeroSlider";
import CategorySection from "../components/menu/CategorySection";
import ItemModal from "../components/modal/ItemModal";
import { useRestaurant } from "../hooks/useRestaurant";
import { useCategories } from "../hooks/useCategories";

export default function MenuPage() {
  const { data: restaurant } = useRestaurant();
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="min-h-screen elato-pattern">
      <HeroSlider />

      <div>
        <div style={{ textAlign: "center", padding: "52px 24px 36px" }}>
        <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 500,
            color: "#1A0E00",
            letterSpacing: "0.06em",
        }}>
            Our Menu
        </h2>
        <div style={{
            width: "32px", height: "1.5px",
            background: "#9E7519", opacity: 0.65,
            margin: "14px auto 0",
        }} />
        </div>

        {/* Menu */}
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 60px" }}>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "#6B4A18",
                  fontWeight: 400,
                }}
              >
                Preparing the menu…
              </p>
            </motion.div>
          )}

          {isError && (
            <div className="text-center py-16">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#6B4A18" }}>
                Unable to load menu. Please try again.
              </p>
            </div>
          )}

          {categories?.map((category, index) => (
            <CategorySection key={category.id} category={category} index={index} />
          ))}
        </main>
      </div>

      <Footer restaurant={restaurant} />
      <ItemModal />
    </div>
  );
}