import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Modal2 } from '../components/Modal';
import { ConnectionForm } from './ConnectionForm';
import { useToggle } from '../hooks/UseToggle';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Store';
import useAppDispatch from '../hooks/UseAppDispatch';
import {
  clearCredentials,
  ConnectionCredentials,
  updateCredentials,
} from '../redux/Credentials';
import { ConnectionStatus } from '../redux/ConnectionStatus';
import { synapseConnect } from '../redux/Synapse';

const useStyles = createUseStyles({
  container: {
    maxWidth: '400px',
    width: '100%',
  },
});

export const ConnectionOverlay = () => {
  const credentials = useSelector<AppState, ConnectionCredentials | null>(
    (s) => s.credentials
  );

  const [uri, setUri] = useState(credentials?.uri || '');
  const [password, setPassword] = useState(credentials?.password || '');
  const [autoConnect, toggleAutoConnect] = useToggle(uri !== '');

  const connectionStatus = useSelector<AppState, ConnectionStatus>(
    (s) => s.connectionStatus
  );
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (autoConnect) {
      dispatch(updateCredentials({ uri, password }));
    } else {
      dispatch(clearCredentials());
    }

    dispatch(synapseConnect({ uri, password }));
  };

  const isOpen = connectionStatus !== 'CONNECTED';

  const styles = useStyles();

  return (
    <Modal2 isOpen={isOpen}>
      {connectionStatus === 'NOT_CONNECTED' ? (
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
      ) : connectionStatus === 'CONNECTING' ? (
        'Loading...'
      ) : null}
    </Modal2>
  );
};
