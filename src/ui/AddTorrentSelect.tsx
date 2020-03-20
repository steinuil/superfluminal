import * as React from 'react';
import { FC, useState, useMemo, useRef } from 'react';
import {
  FormGroup,
  Input,
  Button,
  Card,
  CardText,
  CardTitle,
  Form,
} from 'reactstrap';

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
    <FormGroup>
      <Button type="button" block color="primary" onClick={onClick}>
        Select .torrent file
      </Button>
      <input
        type="file"
        ref={fileFormRef}
        style={{ display: 'none' }}
        accept=".torrent"
        onChange={handleChangeFile}
      />
    </FormGroup>
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
    <Form>
      <FormGroup>
        <Input
          type="text"
          placeholder="Magnet link"
          value={magnet}
          onChange={(ev) => setMagnet(ev.target.value)}
        />
      </FormGroup>
      <Button
        type="submit"
        block
        color="primary"
        onClick={() => onSubmit(magnet)}
        disabled={isAddMagnetDisabled}
      >
        Select magnet
      </Button>
    </Form>
  );
};

export type SelectedTorrent =
  | { type: 'MAGNET'; magnet: string }
  | { type: 'FILE'; file: File };

interface Props {
  onSubmit: (torrent: SelectedTorrent) => void;
}

export const AddTorrentSelect: FC<Props> = ({ onSubmit }) => (
  <Card body>
    <SelectTorrentFile onSubmit={(file) => onSubmit({ type: 'FILE', file })} />
    <CardText className="text-center">- or -</CardText>
    <SelectMagnet onSubmit={(magnet) => onSubmit({ type: 'MAGNET', magnet })} />
  </Card>
);
