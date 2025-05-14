/**
 * Gestion centralisée des erreurs réseau/API.
 * Utilisez handleApiError pour capturer et afficher les erreurs utilisateur.
 * @param error - Erreur à traiter (Error, string, etc.)
 * @param fallbackMessage - Message par défaut si l'erreur n'est pas une instance d'Error
 * @returns Message d'erreur à afficher à l'utilisateur
 */
export function handleApiError(
  error: unknown,
  fallbackMessage = "An error occurred"
) {
  if (typeof window !== "undefined") {
    // Log uniquement côté client pour debug
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}
