import localFont from "next/font/local"

export const fontPrimary = localFont({
  src: [{ path: "../public/fonts/SangBleu-Sunrise.ttf", style: "normal" }],
  display: "swap",
  variable: "--font-primary",
})
