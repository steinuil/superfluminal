import React from 'react';
import { hot } from 'react-hot-loader/root';

import { store } from '../Store';
import { Provider } from 'react-redux';
import { Layout } from './Layout';

const Root = () => (
  <Provider store={store}>
    <Layout />
  </Provider>
);

export default hot(Root);
