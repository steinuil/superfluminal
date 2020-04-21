import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '../components/Stack';
import { FormHeader } from '../components/FormHeader';
import { CheckboxField } from '../components/CheckboxField';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

const useStyles = createUseStyles({
  container: {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#393939',
    padding: '16px',
  },
});

interface Props {
  onDelete: (shouldDelete: boolean | null) => void;
  alsoDeleteFiles: boolean;
  toggleAlsoDeleteFiles: () => void;
}

export const DeleteTorrentForm: React.FC<Props> = ({
  onDelete: onDelete,
  alsoDeleteFiles,
  toggleAlsoDeleteFiles,
}) => {
  const styles = useStyles();

  return (
    <Modal onDismiss={onDelete} className={styles.container}>
      {(onDismiss) => (
        <Stack spacing="16px">
          <FormHeader title="Delete torrent" onClose={() => onDismiss()} />
          <div>Are you sure you want to delete this torrent?</div>
          <CheckboxField
            label="Delete files on disk"
            checked={alsoDeleteFiles}
            onChange={toggleAlsoDeleteFiles}
          />
          <Button onClick={() => onDismiss(true)} type="submit">
            Confirm
          </Button>
        </Stack>
      )}
    </Modal>
  );
};
