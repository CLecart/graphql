"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";

// ApolloProviderWrapper fournit le client Apollo à toute l'application.
// Le token JWT est récupéré depuis localStorage pour chaque requête.
const httpLink = createHttpLink({
  uri: "https://zone01normandie.org/api/graphql-engine/v1/graphql",
});

// Ajoute l'en-tête d'authentification à chaque requête Apollo
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage (only on client side)
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("jwt_token");
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Le client Apollo est configuré avec le cache en mémoire et le lien d'authentification
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Ce composant doit envelopper toute l'application pour fournir Apollo Client
export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
