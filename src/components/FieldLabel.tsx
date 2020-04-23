import React from 'react';
import { createUseStyles } from 'react-jss';
import { TextSingleLine } from './TextSingleLine';
import { c } from '../ClassNames';

const useStyles = createUseStyles({
  label: {
    display: 'block',
    fontWeight: 'bold',
  },
  modified: {
    color: '#ffc800',
  },
});

interface Props {
  modified?: boolean;
  className?: string;
}

export const FieldLabel: React.FC<Props> = ({
  children,
  modified,
  className,
}) => {
  const styles = useStyles();

  return (
    <TextSingleLine className={c(className, styles.label)}>
      {children}
      {modified && <span className={styles.modified}> *</span>}
    </TextSingleLine>
  );
};
