"use client";

import { useEffect } from "react";
import { ensureGSAP } from "@/app/lib/gsapClient";

export default function GSAPProvider() {
  useEffect(() => {
    ensureGSAP();
  }, []);
  return null;
}
