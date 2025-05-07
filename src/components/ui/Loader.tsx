import React from "react";

/**
 * Loader réutilisable et accessible.
 * @param label - Texte pour l'accessibilité (aria-label)
 * @param size - Taille du loader (en px)
 */
export default function Loader({
  label = "Loading...",
  size = 16,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-primary border-t-transparent"
        style={{ width: size, height: size }}
        role="status"
        aria-label={label}
      ></div>
      <span className="mt-2 text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
