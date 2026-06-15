import { useQuery } from "@tanstack/react-query";
import client from "../api/client";

const SLUG = import.meta.env.VITE_RESTAURANT_SLUG;

export default function DashboardPage() {
  // Fetch categories with items included to get real counts
  const { data: categories } = useQuery({
    queryKey: ["dashboard-categories"],
    queryFn: async () => {
      const { data } = await client.get(`/categories/${SLUG}?include_items=true`);
      return data;
    },
  });

  const { data: hero } = useQuery({
    queryKey: ["dashboard-hero"],
    queryFn: async () => {
      const { data } = await client.get(`/hero/${SLUG}`);
      return data;
    },
  });

  const totalItems = categories?.reduce((acc, c) => acc + (c.items?.length || 0), 0) ?? "—";
  const totalCats = categories?.length ?? "—";
  const totalSlides = hero?.length ?? "—";

  const stats = [
    { label: "Categories", value: totalCats },
    { label: "Menu Items", value: totalItems },
    { label: "Hero Slides", value: totalSlides },
    { label: "Status", value: "Live" },
  ];

  return (
    <div style={{ padding: "clamp(20px, 4vw, 40px) clamp(16px, 4vw, 36px)" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.22em", color: "#9E7519", textTransform: "uppercase", marginBottom: "5px",
        }}>
          Welcome Back
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 500, color: "#1A0E00",
        }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px", marginBottom: "32px",
      }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{
            background: "#FBF5E8",
            border: "1px solid rgba(90,55,10,0.1)",
            borderRadius: "4px", padding: "20px",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.18em", color: "#9E7519", textTransform: "uppercase", marginBottom: "8px",
            }}>
              {label}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 500, color: "#1A0E00",
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{
        background: "#FBF5E8", border: "1px solid rgba(90,55,10,0.1)",
        borderRadius: "4px", padding: "22px",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.16em", color: "#6B4A18", textTransform: "uppercase", marginBottom: "14px",
        }}>
          Quick Actions
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            { href: "/categories", label: "Manage Categories" },
            { href: "/items", label: "Manage Menu Items" },
            { href: "/hero", label: "Manage Hero Slides" },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
              color: "#6B4A18", border: "1px solid rgba(90,55,10,0.2)",
              borderRadius: "3px", padding: "8px 16px", textDecoration: "none",
            }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}