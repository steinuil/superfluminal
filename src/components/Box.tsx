import React, { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

interface StyleProps {
  padding?: string;
  background?: string;
}

const useStyles = createUseStyles({
  box: {
    padding: (props: StyleProps) => props.padding,
    backgroundColor: (props: StyleProps) => props.background,
  },
});

interface Props {
  className?: string;
  style?: CSSProperties;
  padding?: string;
  background?: string;
}

export const Box: React.FC<Props> = ({
  className,
  style,
  padding,
  background,
  children,
}) => {
  const styles = useStyles({ padding, background });

  return (
    <div style={style} className={c(styles.box, className)}>
      {children}
    </div>
  );
};
