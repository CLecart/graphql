"use client";

import { ApolloProviderWrapper } from "./ApolloProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProviderWrapper>{children}</ApolloProviderWrapper>;
}
