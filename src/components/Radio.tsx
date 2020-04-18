import React from 'react';
import { createUseStyles } from 'react-jss';
import { useId } from '../hooks/UseId';
import { onKeyboardSelect } from '../EventHelpers';

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  radio: {
    height: '1.3rem',
    width: '1.3rem',
    backgroundColor: 'white',
    borderRadius: '50%',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    height: '.8rem',
    width: '.8rem',
    backgroundColor: 'black',
    borderRadius: '50%',
  },
});

interface Props {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Radio: React.FC<Props> = ({ label, checked, onChange }) => {
  const styles = useStyles();

  const id = useId('radio');

  return (
    <div className={styles.container}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
        id={id}
      />
      <div
        className={styles.radio}
        tabIndex={0}
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        onKeyDown={onKeyboardSelect(onChange)}
      >
        {checked && <div className={styles.radioCheck} />}
      </div>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
