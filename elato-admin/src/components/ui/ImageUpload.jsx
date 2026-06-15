import { useState, useRef } from "react";
import { uploadImage } from "../../api/upload";

export default function ImageUpload({ value, onChange, folder = "general", label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setError("Only JPG, PNG, WebP, or AVIF files allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6B4A18",
        }}
      >
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div style={{ position: "relative", width: "100%", maxWidth: "240px" }}>
          <img
            src={value}
            alt="Preview"
            style={{
              width: "100%",
              aspectRatio: "4/3",
              objectFit: "cover",
              borderRadius: "3px",
              border: "1px solid rgba(90,55,10,0.15)",
              display: "block",
            }}
          />
          <button
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              background: "rgba(26,14,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              cursor: "pointer",
              color: "#FAF0DC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "1.5px dashed rgba(90,55,10,0.25)",
          borderRadius: "3px",
          padding: "20px",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          background: "rgba(235,216,183,0.3)",
          transition: "border-color 0.2s ease",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#9E7519" }}>
            Uploading…
          </p>
        ) : (
          <>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#6B4A18", marginBottom: "2px" }}>
              {value ? "Replace image" : "Click to upload"}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#9E7519" }}>
              JPG, PNG, WebP · Max 5MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#8B2500" }}>
          {error}
        </p>
      )}
    </div>
  );
}