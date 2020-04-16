import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import query from 'query-string';

// import store, { create, history } from './storeOld';
import { history, store } from './Store';
// import '../scss/main.scss';
// import 'bootstrap/scss/bootstrap.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';
import { socket_uri, socket_update, SOCKET_STATE } from './actions/socket';
import { search_criteria } from './searchOld';

import Connection from './ui/connection';
import { Layout } from './ui/Layout';

Set.prototype.difference = function (set) {
  var diff = new Set(this);
  for (var v of set) {
    diff.delete(v);
  }
  return diff;
};

export function initialize(uri) {
  store.dispatch(socket_uri(uri));
  store.dispatch(socket_update(SOCKET_STATE.CONNECTING));
  ws_init(
    uri,
    () => {
      const qs = query.parse(window.location.search);
      store.dispatch(socket_update(SOCKET_STATE.CONNECTED));
      store.dispatch(filter_subscribe('torrent', search_criteria(qs.s)));
      store.dispatch(filter_subscribe('server'));
    },
    () => {
      store.dispatch(
        socket_update(SOCKET_STATE.DISCONNECTED, 'You were disconnected.')
      );
    }
  );
}

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
