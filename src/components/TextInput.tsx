import React from 'react';
import { mapChangeEv } from '../EventHelpers';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

const useStyles = createUseStyles({
  input: {
    display: 'block',
    padding: '8px 10px',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
});

interface Props {
  id?: string;
  className?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const TextInput: React.FC<Props> = ({
  id,
  className,
  type,
  value,
  onChange,
  required,
}) => {
  const styles = useStyles();
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={mapChangeEv(onChange)}
      required={required}
      className={c(styles.input, className)}
    />
  );
};
