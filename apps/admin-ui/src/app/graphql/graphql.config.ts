import { APOLLO_OPTIONS, ApolloOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClient } from '@angular/common/http';

export function createApollo(httpLink: HttpLink): ApolloOptions {
  return {
    link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  };
}

export const GraphQLProviders = [
  {
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink],
  },
];