"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

export default function AppLayout({ children } : {
  children: React.ReactNode
}) {
  return (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
  )
}