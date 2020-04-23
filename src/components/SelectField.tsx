import React from 'react';
import { createUseStyles } from 'react-jss';
import { useId } from '../hooks/UseId';
import { SelectOption, Select } from './Select';
import { FieldLabel } from './FieldLabel';

const useStyles = createUseStyles({
  label: {
    display: 'block',
    marginBottom: '8px',
  },
});

interface Props<T> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  modified?: boolean;
}

export function SelectField<T extends string = string>({
  label,
  value,
  onChange,
  options,
  modified,
}: Props<T>) {
  const styles = useStyles();

  const id = useId('select');

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        <FieldLabel modified={modified}>{label}</FieldLabel>
      </label>
      <Select<T> id={id} value={value} onChange={onChange} options={options} />
    </div>
  );
}
