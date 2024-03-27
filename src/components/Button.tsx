import React, { ReactNode } from 'react';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

interface StyleProps {
  inline?: boolean;
}

const useStyles = createUseStyles({
  button: {
    display: 'block',
    width: (props: StyleProps) => (props.inline ? 'auto' : '100%'),
    fontSize: '1rem',
    padding: '8px 10px',
    backgroundColor: 'white',
  },
});

interface Props {
  id?: string;
  className?: string;
  type: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  inline?: boolean;
  children?: ReactNode;
}

export const Button = ({
  id,
  className,
  type,
  onClick,
  disabled,
  inline,
  children,
}: Props) => {
  const styles = useStyles({ inline });

  return (
    <button
      type={type}
      onClick={onClick}
      id={id}
      className={c(styles.button, className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
