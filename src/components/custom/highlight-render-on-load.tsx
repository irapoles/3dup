"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function HighlightRenderOnLoad() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`asset-${highlight}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-primary", "ring-offset-2", "rounded-lg");
    const t = setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary", "ring-offset-2", "rounded-lg");
    }, 4000);
    return () => clearTimeout(t);
  }, [highlight]);

  return null;
}
