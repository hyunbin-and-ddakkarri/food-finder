"use client";
import './globals.css'
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

export default function AppLayout({ children } : {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <ApolloProvider client={client}>
                    {children}
                </ApolloProvider>
            </body>
        </html>
    );
}
