"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

function makeClient() {
  // Create an HTTP link to the GraphQL API
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/",
  });

  // Middleware to add the authorization token to headers
  const authLink = setContext((_, { headers }) => {
    // Retrieve the session token from cookies
    const token = Cookies.get('session-token');

    // Return the headers with the authorization token if available
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Create a new Apollo Client instance with SSR support
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            // Use SSRMultipartLink for handling server-side rendering
            new SSRMultipartLink({
              stripDefer: true, // Strips @defer directives
            }),
            authLink.concat(httpLink), // Add the auth link before the HTTP link
          ])
        : authLink.concat(httpLink), // Client-side link chain
  });
}

// Wrapper component to provide Apollo Client to the React component tree
export function ApolloWrapper({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
