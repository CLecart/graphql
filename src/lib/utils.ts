import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne les classes conditionnelles avec Tailwind et clsx.
 * @param inputs - Liste de classes conditionnelles (string, object, array)
 * @returns Chaîne de classes fusionnées, optimisée pour Tailwind
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date ISO en chaîne lisible (ex: 2024-06-01T12:00:00Z → 01 Jun 2024, 12:00).
 * @param dateString - Chaîne de date ISO
 * @returns Chaîne formatée (ex: "01 Jun 2024, 12:00")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate un nombre d’XP en k (ex: 123456 → 123.5k XP).
 * @param xp - XP brut
 * @returns Chaîne formatée (ex: "123.5k XP")
 */
export function formatXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }
  return `${xp} XP`;
}
