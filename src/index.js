import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './ui/Root';

Set.prototype.difference = function (set) {
  var diff = new Set(this);
  for (var v of set) {
    diff.delete(v);
  }
  return diff;
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// navigator.registerProtocolHandler(
//   'magnet',
//   window.location.origin + '/add-torrent/%s',
//   'Open magnet link with receptor'
// );

Notification && Notification.requestPermission();
