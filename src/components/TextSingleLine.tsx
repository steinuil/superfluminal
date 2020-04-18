import React from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

interface StyleProps {
  bold?: boolean;
  center?: boolean;
  fontSize?: string;
}

const useStyles = createUseStyles({
  cont: {
    fontSize: (props: StyleProps) => props.fontSize || '16px',
    transform: `translateY(.415em)`,
    '&::before': {
      content: '""',
      marginTop: '-13px',
      display: 'block',
      height: 0,
    },
  },
  text: {
    display: 'block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: (props: StyleProps) => (props.bold ? 'bold' : undefined),
    textAlign: (props: StyleProps) => (props.center ? 'center' : undefined),
  },
});

interface Props {
  className?: string;
  bold?: boolean;
  center?: boolean;
  fontSize?: string;
}

export const TextSingleLine: React.FC<Props> = ({
  className,
  children,
  bold,
  center,
  fontSize,
}) => {
  const styles = useStyles({ bold, center, fontSize });

  return (
    <div className={c(styles.cont, className)}>
      <span className={styles.text}>{children}</span>
    </div>
  );
};
