import React from 'react';
import { mapChangeEv } from '../EventHelpers';
import { createUseStyles } from 'react-jss';
import { c } from '../ClassNames';

interface StyleProps {
  inline?: boolean;
}

const useStyles = createUseStyles({
  input: {
    display: 'block',
    padding: '8px 10px',
    fontSize: '1rem',
    width: (props: StyleProps) => (props.inline ? 'auto' : '100%'),
    minWidth: 0,
  },
});

interface Props {
  id?: string;
  className?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inline?: boolean;
}

export const TextInput: React.FC<Props> = ({
  id,
  className,
  type,
  value,
  onChange,
  required,
  inline,
}) => {
  const styles = useStyles({ inline });
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
