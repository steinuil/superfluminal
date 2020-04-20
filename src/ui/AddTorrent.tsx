import React from 'react';
import { AddTorrentForm, TorrentOptions } from './AddTorrentForm';
import { SelectedTorrent } from './AddTorrentSelect';
import { uploadTorrentFile, uploadMagnet } from '../UploadTorrent';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../types/Store';

interface Props {
  onClose: () => void;
}

const upload = (
  t: SelectedTorrent,
  options: TorrentOptions,
  socket: State['socket']
) => {
  switch (t.type) {
    case 'FILE':
      return uploadTorrentFile(t.file, options, socket);
    case 'MAGNET':
      return uploadMagnet(t.magnet, options);
  }
};

export const AddTorrent: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();

  const socket = useSelector<State, State['socket']>(({ socket }) => socket);

  const handleSubmit = (t: SelectedTorrent, options: TorrentOptions) => {
    upload(t, options, socket).then(
      (id) => {
        dispatch(push(`/torrents/${id}`));
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
