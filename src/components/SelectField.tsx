import React from 'react';
import { createUseStyles } from 'react-jss';
import { TextSingleLine } from './TextSingleLine';
import { useId } from '../hooks/UseId';
import { SelectOption, Select } from './Select';

const useStyles = createUseStyles({
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
});

interface Props<T> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
}

export function SelectField<T extends string = string>({
  label,
  value,
  onChange,
  options,
}: Props<T>) {
  const styles = useStyles();

  const id = useId('select');

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        <TextSingleLine>{label}</TextSingleLine>
      </label>
      <Select<T> id={id} value={value} onChange={onChange} options={options} />
    </div>
  );
}
