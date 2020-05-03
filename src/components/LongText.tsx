import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  text: {
    wordBreak: 'break-word',
  },
});

interface Props {}

export const LongText: React.FC<Props> = ({ children }) => {
  const styles = useStyles();

  return <div className={styles.text}>{children}</div>;
};
