import * as React from 'react';
import { FC, useState, useMemo, useRef } from 'react';
import { Button } from '../components/Button';
import { Stack } from '../components/Stack';
import { TextField } from '../components/TextField';
import { TextSingleLine } from '../components/TextSingleLine';
import { preventDefault } from '../EventHelpers';

interface SelectTorrentFileProps {
  onSubmit: (file: File) => void;
}

const SelectTorrentFile: FC<SelectTorrentFileProps> = ({ onSubmit }) => {
  const handleChangeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    onSubmit(file);
  };

  const fileFormRef = useRef<HTMLInputElement>(null);

  const onClick = () => fileFormRef.current && fileFormRef.current.click();

  return (
    <div>
      <Button type="button" onClick={onClick}>
        Select .torrent file
      </Button>
      <input
        type="file"
        ref={fileFormRef}
        style={{ display: 'none' }}
        accept=".torrent"
        onChange={handleChangeFile}
      />
    </div>
  );
};

interface SelectMagnetProps {
  onSubmit: (magnet: string) => void;
}

const SelectMagnet: FC<SelectMagnetProps> = ({ onSubmit }) => {
  const [magnet, setMagnet] = useState('');

  const isAddMagnetDisabled = useMemo(() => {
    if (magnet.length < 8) return true;

    const a = document.createElement('a');
    a.href = magnet;
    return a.protocol !== 'magnet:';
  }, [magnet]);

  return (
    <form onSubmit={preventDefault(() => onSubmit(magnet))}>
      <Stack spacing="8px">
        <TextField
          label="Magnet URI"
          type="url"
          value={magnet}
          onChange={setMagnet}
          required
        />
        <Button type="submit" disabled={isAddMagnetDisabled}>
          Select magnet
        </Button>
      </Stack>
    </form>
  );
};

export type SelectedTorrent =
  | { type: 'MAGNET'; magnet: string }
  | { type: 'FILE'; file: File };

interface Props {
  onSubmit: (torrent: SelectedTorrent) => void;
}

export const AddTorrentSelect: FC<Props> = ({ onSubmit }) => (
  <Stack spacing="16px">
    <SelectTorrentFile onSubmit={(file) => onSubmit({ type: 'FILE', file })} />
    <TextSingleLine center>- or -</TextSingleLine>
    <SelectMagnet onSubmit={(magnet) => onSubmit({ type: 'MAGNET', magnet })} />
  </Stack>
);
