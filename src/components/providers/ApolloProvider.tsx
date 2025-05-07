"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";

const httpLink = createHttpLink({
  uri: "https://zone01normandie.org/api/graphql-engine/v1/graphql",
});

const authLink = setContext((_, { headers }) => {
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

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/**
 * Fournit le client Apollo à l'ensemble de l'application.
 * À utiliser en haut de l'arbre React pour activer Apollo Client.
 * @param children - Composants enfants React
 */
export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
