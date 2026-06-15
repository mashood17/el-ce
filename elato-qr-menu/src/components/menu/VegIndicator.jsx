export default function VegIndicator({ isVeg }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      style={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: isVeg ? "rgba(45,110,30,0.55)" : "rgba(160,45,35,0.5)",
        flexShrink: 0,
        marginTop: "6px",
      }}
    />
  );
}