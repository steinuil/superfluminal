import React from 'react';
import { createUseStyles } from 'react-jss';

interface StyleProps {
  bold?: boolean;
  center?: boolean;
}

const useStyles = createUseStyles({
  container: {
    lineHeight: '1em',
    whiteSpace: 'nowrap',
    fontWeight: (props: StyleProps) => (props.bold ? 'bold' : undefined),
    textAlign: (props: StyleProps) => (props.center ? 'center' : undefined),
  },
});

interface Props {
  bold?: boolean;
  center?: boolean;
}

export const TextSingleLine: React.FC<Props> = ({ children, bold, center }) => {
  const styles = useStyles({ bold, center });

  return <div className={styles.container}>{children}</div>;
};
