import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import { history, store } from './Store';

import { Layout } from './ui/Layout';

Set.prototype.difference = function (set) {
  var diff = new Set(this);
  for (var v of set) {
    diff.delete(v);
  }
  return diff;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// if (module.hot) {
//   module.hot.accept('./ui/main.js', () => {
//    const NextMain = require('./ui/main.js').default;
//    render(<NextMain />);
//   });
// }

// navigator.registerProtocolHandler(
//   'magnet',
//   window.location.origin + '/add-torrent/%s',
//   'Open magnet link with receptor'
// );

Notification && Notification.requestPermission();
