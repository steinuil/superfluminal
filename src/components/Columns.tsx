import React, { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';
import { onKeyboardSelect } from '../EventHelpers';

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
  tabIndex?: number;
  onClick?: () => void;
}

export const Columns: React.FC<Props> = ({
  spacing,
  children,
  className,
  style,
  tabIndex,
  onClick,
}) => {
  const styles = useStyles({ spacing });

  return (
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onClick && onKeyboardSelect(onClick)}
      className={c(styles.column, className)}
      style={style}
    >
      {children}
    </div>
  );
};
