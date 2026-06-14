export default function Logo({ className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <h1
        className="font-display text-brand-gold tracking-luxury-wide uppercase"
        style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 300 }}
      >
        Elatō Celebré
      </h1>
      <div
        className="mx-auto mt-1 mb-1"
        style={{
          height: "1px",
          width: "60px",
          background: "linear-gradient(90deg, transparent, #9E7519, transparent)",
        }}
      />
      <p
        className="font-body text-brand-accent tracking-luxury uppercase"
        style={{ fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.25em" }}
      >
        Premium Ice Cream Experience
      </p>
    </div>
  );
}