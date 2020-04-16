import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  divider: {
    height: '1px',
    width: '100%',
    backgroundColor: 'white',
  },
});

interface Props {}

export const Divider: React.FC<Props> = () => {
  const styles = useStyles();

  return <div className={styles.divider} />;
};
