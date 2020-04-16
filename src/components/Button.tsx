import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    display: 'block',
    width: '100%',
    fontSize: '1rem',
    padding: '8px 10px',
    backgroundColor: 'white',
  },
});

interface Props {
  id?: string;
  type: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({
  id,
  type,
  onClick,
  children,
  disabled,
}) => {
  const styles = useStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      id={id}
      className={styles.button}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
