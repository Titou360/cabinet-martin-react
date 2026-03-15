import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "Cabinet Martin M&A — Expert en financement et subventions CEE";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette
const NAVY  = "#1B2A47";
const GOLD  = "#AE894A";
const WHITE = "#F9F5EC";

export default async function OGImage() {
  // Police serif via Google Fonts (fallback robuste pour l'edge runtime)
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2"
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: NAVY,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bruit de texture subtil (cercles décoratifs) */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(174,137,74,0.08) 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(174,137,74,0.06) 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Ligne dorée en haut */}
        <div
          style={{
            width: "100%",
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
            display: "flex",
          }}
        />

        {/* Contenu principal */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px 80px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 28,
                height: 2,
                background: GOLD,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.22em",
                color: `rgba(249,245,236,0.6)`,
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
              }}
            >
              Cabinet Martin M&A
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: WHITE,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 8,
              display: "flex",
            }}
          >
            Accélérez vos projets
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: GOLD,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 36,
              display: "flex",
            }}
          >
            grâce aux subventions.
          </div>

          {/* Sous-titre */}
          <div
            style={{
              fontSize: 22,
              color: `rgba(249,245,236,0.65)`,
              lineHeight: 1.5,
              maxWidth: 640,
              fontFamily: "Georgia, serif",
              display: "flex",
            }}
          >
            Audit · Montage · Pilotage de dossiers CEE — Paiement à la réussite
          </div>
        </div>

        {/* Barre de stats en bas */}
        <div
          style={{
            borderTop: `1px solid rgba(249,245,236,0.12)`,
            padding: "20px 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Stats */}
          <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
            {[
              { value: "2,3 M€",  label: "Subventions obtenues" },
              { value: "0 €",     label: "Risque initial" },
              { value: "100 %",   label: "Paiement au succès" },
            ].map((stat) => (
              <div key={stat.value} style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: GOLD,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: `rgba(249,245,236,0.45)`,
                    marginTop: 4,
                    letterSpacing: "0.04em",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: 14,
              color: `rgba(249,245,236,0.35)`,
              letterSpacing: "0.08em",
              fontFamily: "Georgia, serif",
              display: "flex",
            }}
          >
            cabinetmartin-ma.fr
          </div>
        </div>

        {/* Ligne dorée en bas */}
        <div
          style={{
            width: "100%",
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
