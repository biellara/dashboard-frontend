import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  // URL do seu backend FastAPI/Strawberry configurada anteriormente
  uri: '/graphql', 
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});