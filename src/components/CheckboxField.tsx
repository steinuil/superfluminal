import React from 'react';
import { createUseStyles } from 'react-jss';
import { useId } from '../hooks/UseId';
import { FiCheck } from 'react-icons/fi';
import { onKeyboardSelect } from '../EventHelpers';

interface StyleProps {
  checked: boolean;
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  checkbox: {
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '1.5rem',
    width: '1.5rem',
  },
  checkboxCheck: {
    height: '1.2rem',
    width: '1.2rem',
    color: 'black',
    display: (props: StyleProps) => (props.checked ? 'block' : 'none'),
  },
  label: {
    display: 'block',
  },
});

interface Props {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const CheckboxField: React.FC<Props> = ({
  label,
  checked,
  onChange,
}) => {
  const styles = useStyles({ checked });

  const id = useId('checkbox-field');

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div
        className={styles.checkbox}
        tabIndex={0}
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        onKeyDown={onKeyboardSelect(onChange)}
      >
        <FiCheck className={styles.checkboxCheck} />
      </div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
