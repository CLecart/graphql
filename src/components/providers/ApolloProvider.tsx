"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import React from "react";

const httpLink = createHttpLink({
  uri: "https://zone01normandie.org/api/graphql-engine/v1/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ networkError }) => {
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    localStorage.removeItem("jwt_token");
    client.clearStore();
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export function resetApolloCache() {
  client.resetStore();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "jwt_token") {
      resetApolloCache();
    }
  });
}

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
