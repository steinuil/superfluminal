import React from 'react';
import { createUseStyles } from 'react-jss';
import { Columns } from './Columns';
import { TextSingleLine } from './TextSingleLine';
import { FiX } from 'react-icons/fi';
import { onKeyboardSelect } from '../EventHelpers';

const useStyles = createUseStyles({
  title: {
    flexGrow: 1,
  },
  closeButton: {
    flexShrink: 0,
    display: 'block',
    cursor: 'pointer',
  },
});

interface Props {
  title: string;
  onClose: () => void;
}

export const FormHeader: React.FC<Props> = ({ onClose, title }) => {
  const styles = useStyles();

  return (
    <Columns spacing="8px">
      <TextSingleLine bold fontSize="18px" className={styles.title}>
        {title}
      </TextSingleLine>
      <FiX
        size="24px"
        className={styles.closeButton}
        tabIndex={0}
        onClick={onClose}
        onKeyDown={onKeyboardSelect(onClose)}
        role="button"
      />
    </Columns>
  );
};
