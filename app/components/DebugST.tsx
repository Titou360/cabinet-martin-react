"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DebugST() {
  useEffect(() => {
    console.log("ST count:", ScrollTrigger.getAll().length);
  }, []);

  return null;
}
