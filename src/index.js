import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache } from 'apollo-client-preset';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
// import { SubscriptionClient } from 'subscriptions-transport-ws';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const httpLink = new HttpLink({ uri: 'http://0.0.0.0:4000/graphql' });

const wsLink = new WebSocketLink({
  uri: 'ws://0.0.0.0:4000/subscriptions',
  options: {
    reconnect: true,
  },
});
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
