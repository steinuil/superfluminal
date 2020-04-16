import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Modal2 } from '../components/Modal';
import { ConnectionForm } from './ConnectionForm';
import { useToggle } from '../hooks/UseToggle';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types/Store';
import { socket_uri, socket_update, SOCKET_STATE } from '../actions/socket';
import { ws_init } from '../socket';
import { filter_subscribe } from '../actions/filter_subscribe';

const useStyles = createUseStyles({
  container: {
    width: '400px',
  },
});

interface Props {}

export const ConnectionOverlay: React.FC<Props> = ({}) => {
  const [uri, setUri] = useState(
    () => localStorage.getItem('autoconnect') || ''
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem('password') || ''
  );
  const [autoConnect, toggleAutoConnect] = useToggle(uri !== '');

  const socket = useSelector<State, State['socket']>((s) => s.socket);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (autoConnect) {
      localStorage.setItem('autoconnect', uri);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('autoconnect');
      localStorage.removeItem('password');
    }

    const fullUri = { uri, password };

    dispatch(socket_uri(fullUri));
    dispatch(socket_update(SOCKET_STATE.CONNECTING));
    ws_init(
      fullUri,
      () => {
        dispatch(socket_update(SOCKET_STATE.CONNECTED));
        dispatch(filter_subscribe('torrent', []));
        dispatch(filter_subscribe('server'));
      },
      () => {
        dispatch(
          socket_update(SOCKET_STATE.DISCONNECTED, 'You were disconnected.')
        );
      }
    );
  };

  const isOpen = socket.state !== 'SOCKET_CONNECTED';

  const styles = useStyles();

  return (
    <Modal2 isOpen={isOpen}>
      {socket.state === 'SOCKET_DISCONNECTED' ? (
        <div className={styles.container}>
          <ConnectionForm
            uri={uri}
            setUri={setUri}
            password={password}
            setPassword={setPassword}
            autoConnect={autoConnect}
            toggleAutoConnect={toggleAutoConnect}
            onSubmit={handleSubmit}
          />
        </div>
      ) : socket.state === 'SOCKET_CONNECTING' ? (
        'Loading...'
      ) : null}
    </Modal2>
  );
};
