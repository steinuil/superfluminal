import React, { useRef } from 'react';

import { makeStore } from '../Store';
import { Provider } from 'react-redux';
import { Layout } from './Layout';

const Root = () => {
  const store = useRef(makeStore());

  return (
    <Provider store={store.current}>
      <Layout />
    </Provider>
  );
};

export default Root;
