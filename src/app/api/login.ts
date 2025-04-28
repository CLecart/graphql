// Fonction de connexion utilisateur via l'API Zone01
// Utilise l'authentification Basic et stocke le JWT dans localStorage
export async function loginForm({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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
    console.error("Login error:", error);
    return null;
  }
}
