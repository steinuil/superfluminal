import React, { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

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
  className?: string;
  style?: CSSProperties;
}

export const Columns: React.FC<Props> = ({
  spacing,
  children,
  className,
  style,
}) => {
  const styles = useStyles({ spacing });

  return (
    <div className={c(styles.column, className)} style={style}>
      {children}
    </div>
  );
};
