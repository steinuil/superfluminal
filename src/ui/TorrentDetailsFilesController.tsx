import React, { useCallback } from 'react';
import { SynapseId, FileResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { State } from '../types/Store';
import { TorrentDetailsFiles } from './TorrentDetailsFiles';
import ws_send from '../socket';

interface Props {
  id: SynapseId;
}

const fileByIdSelector = createSelector(
  (state: State) => state.files,
  (_: State, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsFilesController: React.FC<Props> = ({ id }) => {
  const files = useSelector<State, FileResource[]>((s) =>
    fileByIdSelector(s, id)
  );

  const handleValidateResources = useCallback(() => {
    ws_send('VALIDATE_RESOURCES', { ids: [id] });
  }, [id]);

  return (
    <TorrentDetailsFiles files={files} onValidate={handleValidateResources} />
  );
};
