/**
 * Authentifie l'utilisateur via l'API Zone01 et stocke le JWT dans localStorage.
 * @param email - Email ou login
 * @param password - Mot de passe
 * @returns Le JWT si succès, sinon null
 */
export async function loginForm({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string | null> {
  const credentials = btoa(`${email}:${password}`);

  try {
    const response = await fetch(
      "https://zone01normandie.org/api/auth/signin",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) return null;

    const jwt = await response.json();
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt_token", jwt);
    }
    return jwt;
  } catch (error) {
    return null;
  }
}
