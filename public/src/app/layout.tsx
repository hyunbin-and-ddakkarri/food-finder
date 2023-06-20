"use client";
import './globals.css'
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache()
});
import { Open_Sans } from 'next/font/google'
const font = Open_Sans({ subsets: ['latin'] })

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head></head>
            <body className={font.className}>
                <ApolloProvider client={client}>
                    {children}
                </ApolloProvider>
            </body>
        </html>
    );
}
