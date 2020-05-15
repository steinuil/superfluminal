import React from 'react';
import { hot } from 'react-hot-loader/root';

import { history, store } from '../Store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Layout } from './Layout';

const Root = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout />
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
