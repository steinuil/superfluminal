import React from 'react';
import { TorrentOptions, AddTorrentForm } from './AddTorrentForm';
import { SelectedTorrent } from './AddTorrentSelect';
import { uploadTorrentFile, uploadMagnet } from '../UploadTorrent';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  // onAddMagnet: (magnet: string, options: TorrentOptions) => void;
  // onAddTorrentFile: (file: File, options: TorrentOptions) => void;
  // match: { params: Record<string, string> };
  onClose: () => void;
}

export const AddTorrent: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();

  const socket = useSelector(({ socket }: any) => socket);

  const handleSubmit = (t: SelectedTorrent, options: TorrentOptions) => {
    switch (t.type) {
      case 'FILE':
        uploadTorrentFile(t.file, options, socket).then((id) => {
          dispatch(push(`/torrents/${id}`));
          onClose();
        });
        break;
      case 'MAGNET':
        uploadMagnet(t.magnet, options).then((id) => {
          dispatch(push(`/torrents/${id}`));
          onClose();
        });
        break;
    }
  };

  return (
    <AddTorrentForm
      initialMagnet=""
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};
