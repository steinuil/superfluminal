import React from 'react';
import { createUseStyles } from 'react-jss';
import { mapChangeEv } from '../EventHelpers';
import { c } from '../ClassNames';

interface StyleProps {
  inline?: boolean;
}

const useStyles = createUseStyles({
  select: {
    display: 'block',
    padding: '8px 10px',
    fontSize: '1rem',
    width: (props: StyleProps) => (props.inline ? 'auto' : '100%'),
  },
});

export interface SelectOption<T> {
  name?: string;
  value: T;
}

interface Props<T> {
  id?: string;
  className?: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  inline?: boolean;
}

export function Select<T extends string = string>({
  id,
  className,
  value,
  onChange,
  options,
  inline,
}: Props<T>) {
  const styles = useStyles({ inline });

  return (
    <select
      id={id}
      value={value}
      onChange={mapChangeEv<T>(onChange)}
      className={c(styles.select, className)}
    >
      {options.map(({ name, value }) => (
        <option key={value} value={value}>
          {name === undefined ? value : name}
        </option>
      ))}
    </select>
  );
}
