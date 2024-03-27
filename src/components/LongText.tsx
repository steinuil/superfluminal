import React, { ReactNode } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  text: {
    wordBreak: 'break-word',
  },
});

interface Props {
  children?: ReactNode;
}

export function LongText({ children }: Props) {
  const styles = useStyles();

  return <div className={styles.text}>{children}</div>;
}
