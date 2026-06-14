export default function VegIndicator({ isVeg, size = 14 }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        border: `1.5px solid ${isVeg ? "#2D7A1F" : "#C0392B"}`,
        borderRadius: "2px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: "50%",
          background: isVeg ? "#2D7A1F" : "#C0392B",
          display: "block",
        }}
      />
    </span>
  );
}