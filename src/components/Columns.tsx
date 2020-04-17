import React from 'react';
import { createUseStyles } from 'react-jss';

interface StyleProps {
  spacing: string;
}

const useStyles = createUseStyles({
  column: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: (props: StyleProps) => props.spacing,
    },
  },
});

interface Props {
  spacing: string;
}

export const Columns: React.FC<Props> = ({ spacing, children }) => {
  const styles = useStyles({ spacing });

  return <div className={styles.column}>{children}</div>;
};
