"use client";

import { useState, useEffect } from "react";

/**
 * Retourne true si le thème actuel est "dark".
 * Écoute les changements via MutationObserver sur data-theme.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let mounted = true;
    const get = () =>
      document.documentElement.getAttribute("data-theme") === "dark";

    const observer = new MutationObserver(() => {
      if (mounted) setIsDark(get());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Lecture initiale différée pour éviter le setState synchrone dans l'effet
    queueMicrotask(() => {
      if (mounted) setIsDark(get());
    });

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return isDark;
}
