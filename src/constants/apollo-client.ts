import { ApolloClient, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

const restLink = new RestLink({ 
    uri: "http://localhost:3001",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
 });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink
});


export default client;