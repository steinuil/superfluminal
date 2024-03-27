import React from 'react';
import { AddTorrentForm, TorrentOptions } from './AddTorrentForm';
import { SelectedTorrent } from './AddTorrentSelect';
import { uploadTorrentFile, uploadMagnet } from '../UploadTorrent';

interface Props {
  onClose: () => void;
}

const upload = (t: SelectedTorrent, options: TorrentOptions) => {
  switch (t.type) {
    case 'FILE':
      return uploadTorrentFile(t.file, options, undefined);
    case 'MAGNET':
      return uploadMagnet(t.magnet, options);
  }
};

export const AddTorrent: React.FC<Props> = ({ onClose }) => {
  // TODO: MOVE INTO REDUX!! and then also move the UI state that tells whether
  // this addtorrent thing is open into redux.
  const handleSubmit = (t: SelectedTorrent, options: TorrentOptions) => {
    upload(t, options).then(
      (id) => {
        onClose();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  return (
    <AddTorrentForm
      initialMagnet=""
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};
