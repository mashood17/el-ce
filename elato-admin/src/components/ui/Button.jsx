export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    letterSpacing: "0.04em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const sizes = {
    sm: { fontSize: "0.75rem", padding: "6px 14px", borderRadius: "3px" },
    md: { fontSize: "0.82rem", padding: "9px 20px", borderRadius: "3px" },
    lg: { fontSize: "0.88rem", padding: "12px 28px", borderRadius: "3px" },
  };

  const variants = {
    primary: {
      background: "#9E7519",
      color: "#FAF0DC",
    },
    secondary: {
      background: "transparent",
      color: "#6B4A18",
      border: "1px solid rgba(90,55,10,0.3)",
    },
    danger: {
      background: "transparent",
      color: "#8B2500",
      border: "1px solid rgba(139,37,0,0.3)",
    },
    ghost: {
      background: "transparent",
      color: "#6B4A18",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...className }}
    >
      {children}
    </button>
  );
}