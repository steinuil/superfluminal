import React from 'react';
import { createUseStyles } from 'react-jss';
import { TextInput } from './TextInput';
import { useId } from '../hooks/UseId';
import { FieldLabel } from './FieldLabel';

const useStyles = createUseStyles({
  label: {
    display: 'block',
    marginBottom: '8px',
  },
});

interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  modified?: boolean;
}

export const TextField: React.FC<Props> = ({
  label,
  type,
  value,
  onChange,
  required,
  modified,
}) => {
  const styles = useStyles();

  const id = useId('text-field', []);

  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        <FieldLabel modified={modified}>{label}</FieldLabel>
      </label>
      <TextInput
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
