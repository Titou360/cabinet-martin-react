// app/lib/gsapClient.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGSAP() {
  // Toujours safe (SSR)
  if (typeof window === "undefined") return;
  if (registered) return;

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

// ✅ IMPORTANT : on enregistre dès que le module est chargé côté client
ensureGSAP();

export { gsap, ScrollTrigger };
