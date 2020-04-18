import React from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

interface StyleProps {
  padding?: string;
  spacing: string;
}

const useStyles = createUseStyles({
  stack: {
    padding: (props: StyleProps) => props.padding,
    width: '100%',
    '& > *:not(:last-child)': {
      marginBottom: (props: StyleProps) => props.spacing,
    },
  },
});

interface Props {
  className?: string;
  padding?: string;
  spacing: string;
}

export const Stack: React.FC<Props> = ({
  className,
  padding,
  spacing,
  children,
}) => {
  const styles = useStyles({ padding, spacing });

  return <div className={c(styles.stack, className)}>{children}</div>;
};
