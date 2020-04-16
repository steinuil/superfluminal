import React from 'react';
import { createUseStyles } from 'react-jss';

interface StyleProps {
  padding?: string;
  spacing: string;
}

const useStyles = createUseStyles({
  stack: {
    padding: (props: StyleProps) => props.padding,
    width: '100%',
    boxSizing: 'border-box',
    '& > *:not(:last-child)': {
      marginBottom: (props: StyleProps) => props.spacing,
    },
  },
});

interface Props {
  padding?: string;
  spacing: string;
}

export const Stack: React.FC<Props> = ({ padding, spacing, children }) => {
  const styles = useStyles({ padding, spacing });

  return <div className={styles.stack}>{children}</div>;
};
