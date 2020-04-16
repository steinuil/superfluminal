import React from 'react';
import { preventDefault } from '../EventHelpers';
import { createUseStyles } from 'react-jss';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Stack } from '../components/Stack';
import { CheckboxField } from '../components/CheckboxField';

const useStyles = createUseStyles({
  form: {
    backgroundColor: '#393939',
  },
});

interface Props {
  uri: string;
  setUri: (uri: string) => void;
  password: string;
  setPassword: (password: string) => void;
  autoConnect: boolean;
  toggleAutoConnect: () => void;
  onSubmit: () => void;
}

export const ConnectionForm: React.FC<Props> = ({
  uri,
  password,
  autoConnect,
  setUri,
  setPassword,
  toggleAutoConnect,
  onSubmit,
}) => {
  const styles = useStyles();

  return (
    <form className={styles.form} onSubmit={preventDefault(onSubmit)}>
      <Stack spacing="16px" padding="16px">
        <TextField
          label="Server URI"
          type="url"
          value={uri}
          onChange={setUri}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <CheckboxField
          label="Autoconnect to this server"
          checked={autoConnect}
          onChange={toggleAutoConnect}
        />
        <Button type="submit">Connect</Button>
      </Stack>
    </form>
  );
};
