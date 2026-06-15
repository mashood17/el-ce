const IGIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const WAIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.58rem",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#9E7519",
  marginBottom: "6px",
};

const value = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.78rem",
  fontWeight: 400,
  color: "#3D2200",
  lineHeight: 1.7,
  letterSpacing: "0.01em",
};

export default function Footer({ restaurant }) {
  const year = new Date().getFullYear();
  const ig = restaurant?.instagram?.replace("@", "") || "elato.in";
  const wa = restaurant?.whatsapp || "9731400313";

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(90,55,10,0.15)",
        background: "#E8D4A8",
        padding: "48px 32px 28px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Main row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "36px 48px",
            marginBottom: "36px",
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 500,
                letterSpacing: "0.16em",
                color: "#1A0E00",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Elatō Celebré
            </p>
            <p style={{ ...value, fontSize: "0.72rem", color: "#6B4A18" }}>
              Premium Ice Cream Experience
            </p>
          </div>

          {/* Location */}
          <div>
            <p style={label}>Location</p>
            <p style={value}>
              Panemangalore, Narikombu<br />
              Karnataka – 574231
            </p>
          </div>

          {/* Contact */}
          <div>
            <p style={label}>Contact</p>
            <p style={value}>
              {restaurant?.phone_primary || "9731400313"}<br />
              {restaurant?.phone_secondary || "9686077485"}
            </p>
          </div>

          {/* Hours */}
          <div>
            <p style={label}>Hours</p>
            <p style={value}>
              Mon – Sat &nbsp; 11 AM – 11 PM<br />
              Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 11 AM – 10 PM
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(90,55,10,0.2), transparent)",
            marginBottom: "20px",
          }}
        />

        {/* ── Bottom row ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              color: "rgba(61,34,0,0.45)",
              letterSpacing: "0.12em",
            }}
          >
            © {year} Elatō Celebré. All rights reserved.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                color: "#6B4A18",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.2s ease",
              }}
            >
              <IGIcon />
              @{ig}
            </a>
            <a
              href={`https://wa.me/91${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                color: "#6B4A18",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.2s ease",
              }}
            >
              <WAIcon />
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}