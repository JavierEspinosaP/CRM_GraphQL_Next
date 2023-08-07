// import { HttpLink, InMemoryCache, ApolloLink, ApolloClient } from "@apollo/client";
// import {
//   NextSSRInMemoryCache,
//   NextSSRApolloClient,
// } from "@apollo/experimental-nextjs-app-support/ssr";
// import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
// import { setContext } from '@apollo/client/link/context';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
// });

// const authLink = setContext((_, { headers }) => {
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: 'Holaaaa',
//     }
//   }
// });

// export const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// });


// export const { getClient } = registerApolloClient(() => {
//   return new NextSSRApolloClient({
//     connectToDevTools: true,
//     cache: new NextSSRInMemoryCache(),
//     link: authLink.concat(httpLink)
//   });
// });