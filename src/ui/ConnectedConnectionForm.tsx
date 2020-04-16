import React, { useState } from 'react';
import { useToggle } from '../hooks/UseToggle';
import { createUseStyles } from 'react-jss';
import { ConnectionForm } from './ConnectionForm';
import { store } from '../Store';
import { socket_uri } from '../actions/socket';

const useStyles = createUseStyles({
  container: {
    width: '400px',
  },
});

interface Props {
  onDismiss: () => void;
}

export const ConnectedConnectionForm: React.FC<Props> = () => {
  const initialUri = localStorage.getItem('autoconnect');
  const initialPassword = localStorage.getItem('password');

  const [uri, setUri] = useState(initialUri || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [autoConnect, toggleAutoConnect] = useToggle(initialUri !== null);

  const handleSubmit = () => {
    if (autoConnect) {
      localStorage.setItem('autoconnect', uri);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('autoconnect');
      localStorage.removeItem('password');
    }

    store.dispatch(socket_uri({ uri, password }));
  };

  const styles = useStyles();

  return (
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
  );
};
