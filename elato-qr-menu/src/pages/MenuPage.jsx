import { motion } from "framer-motion";
import Logo from "../components/layout/Logo";
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
    <div className="min-h-screen" style={{ background: "#EBD8B7" }}>
      {/* Hero */}
      <HeroSlider />

      {/* Logo */}
      <div className="px-6 py-8 text-center">
        <Logo />
      </div>

      {/* Tagline */}
      <div className="text-center px-8 mb-10">
        <p
          className="font-display italic text-brand-accent"
          style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)", fontWeight: 300, lineHeight: 1.8 }}
        >
          Where Every Scoop Is A Celebration Of Flavour And Finesse
        </p>
      </div>

      {/* Section Divider */}
      <div className="px-8 mb-10">
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(158,117,25,0.4), transparent)",
          }}
        />
      </div>

      {/* Menu */}
      <main className="max-w-lg mx-auto px-6 pb-8">
        {isLoading && (
          <div className="text-center py-16">
            <p
              className="font-display text-brand-accent tracking-luxury uppercase"
              style={{ fontSize: "0.7rem" }}
            >
              Loading Menu…
            </p>
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="font-body text-brand-accent" style={{ fontSize: "0.85rem" }}>
              Unable to load menu. Please try again.
            </p>
          </div>
        )}

        {categories?.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </main>

      {/* Footer */}
      <Footer restaurant={restaurant} />

      {/* Item Modal */}
      <ItemModal />
    </div>
  );
}