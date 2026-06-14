import { useRestaurant } from "../../hooks/useRestaurant";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function Footer({ restaurant }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pattern-bg mt-16 border-t" style={{ borderColor: "rgba(158,117,25,0.15)" }}>
      <div className="max-w-lg mx-auto px-6 py-12">

        {/* Brand */}
        <div className="text-center mb-10">
          <h2
            className="font-display text-brand-gold tracking-luxury-wide uppercase mb-2"
            style={{ fontSize: "1.5rem", fontWeight: 300 }}
          >
            Elatō Celebré
          </h2>
          <div
            className="mx-auto"
            style={{
              height: "1px",
              width: "50px",
              background: "linear-gradient(90deg, transparent, #9E7519, transparent)",
            }}
          />
        </div>

        {/* Info Grid */}
        <div className="space-y-6 mb-10">
          {/* Address */}
          <div className="flex gap-3">
            <MapPinIcon />
            <div>
              <p
                className="font-body text-brand-accent tracking-luxury uppercase mb-1"
                style={{ fontSize: "0.6rem" }}
              >
                Location
              </p>
              <p className="font-body text-brand-dark" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                {restaurant?.address || "Panemangalore, Narikombu, Karnataka – 574231"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-3">
            <PhoneIcon />
            <div>
              <p
                className="font-body text-brand-accent tracking-luxury uppercase mb-1"
                style={{ fontSize: "0.6rem" }}
              >
                Contact
              </p>
              <p className="font-body text-brand-dark" style={{ fontSize: "0.8rem" }}>
                {restaurant?.phone_primary}
              </p>
              {restaurant?.phone_secondary && (
                <p className="font-body text-brand-dark" style={{ fontSize: "0.8rem" }}>
                  {restaurant?.phone_secondary}
                </p>
              )}
            </div>
          </div>

          {/* Hours */}
          <div className="flex gap-3">
            <ClockIcon />
            <div>
              <p
                className="font-body text-brand-accent tracking-luxury uppercase mb-1"
                style={{ fontSize: "0.6rem" }}
              >
                Hours
              </p>
              <p className="font-body text-brand-dark" style={{ fontSize: "0.8rem" }}>
                Mon–Sat: {restaurant?.hours_weekday || "11:00 AM – 11:00 PM"}
              </p>
              <p className="font-body text-brand-dark" style={{ fontSize: "0.8rem" }}>
                Sunday: {restaurant?.hours_weekend || "11:00 AM – 10:00 PM"}
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-10">
          <a
            href={`https://instagram.com/${restaurant?.instagram?.replace("@", "") || "elato.in"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-accent hover:text-brand-gold transition-colors duration-300"
            style={{ fontSize: "0.75rem" }}
          >
            <InstagramIcon />
            <span className="font-body tracking-wider">
              {restaurant?.instagram || "@elato.in"}
            </span>
          </a>

          <a
            href={`https://wa.me/91${restaurant?.whatsapp || "9731400313"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-accent hover:text-brand-gold transition-colors duration-300"
            style={{ fontSize: "0.75rem" }}
          >
            <WhatsAppIcon />
            <span className="font-body tracking-wider">WhatsApp</span>
          </a>
        </div>

        {/* Divider */}
        <div
          className="mb-6"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(158,117,25,0.3), transparent)",
          }}
        />

        {/* Copyright */}
        <p
          className="text-center font-body text-brand-accent tracking-luxury"
          style={{ fontSize: "0.6rem" }}
        >
          © {currentYear} ELATŌ CELEBRÉ. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}