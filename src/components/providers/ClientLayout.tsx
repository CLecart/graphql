"use client";

import { ApolloProviderWrapper } from "./ApolloProvider";

/**
 * Fournit le layout client avec le provider Apollo à l'ensemble de l'application.
 * À utiliser pour englober tous les composants nécessitant Apollo Client côté client.
 * @param children - Composants enfants React
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProviderWrapper>{children}</ApolloProviderWrapper>;
}
