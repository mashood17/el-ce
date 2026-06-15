export default function Input({
  label, name, type = "text", value, onChange,
  placeholder, required = false, rows, error, min,
}) {
  const inputStyle = {
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.85rem", fontWeight: 400,
    color: "#1A0E00",
    background: "#FBF5E8",
    border: `1px solid ${error ? "rgba(139,37,0,0.4)" : "rgba(90,55,10,0.2)"}`,
    borderRadius: "3px",
    padding: "10px 12px",
    outline: "none",
    transition: "border-color 0.2s ease",
    WebkitAppearance: "none",
  };

  // Prevent scroll wheel from changing number inputs
  const handleWheel = (e) => {
    if (type === "number") e.target.blur();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {label && (
        <label htmlFor={name} style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem", fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B4A18",
        }}>
          {label}
          {required && <span style={{ color: "#9E7519", marginLeft: "3px" }}>*</span>}
        </label>
      )}
      {rows ? (
        <textarea
          id={name} name={name} value={value} onChange={onChange}
          placeholder={placeholder} rows={rows}
          style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value}
          onChange={onChange} placeholder={placeholder}
          min={type === "number" ? (min ?? 0) : undefined}
          onWheel={handleWheel}
          style={inputStyle}
        />
      )}
      {error && (
        <p style={{ fontSize: "0.72rem", color: "#8B2500", fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}