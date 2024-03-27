import React, { ReactNode } from 'react';
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
  children?: ReactNode;
}

export const FieldLabel = ({ modified, className, children }: Props) => {
  const styles = useStyles();

  return (
    <TextSingleLine className={c(className, styles.label)}>
      {children}
      {modified && <span className={styles.modified}> *</span>}
    </TextSingleLine>
  );
};
