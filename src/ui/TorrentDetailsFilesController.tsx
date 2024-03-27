import React, { useCallback } from 'react';
import { SynapseId, FileResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppState } from '../redux/Store';
import { TorrentDetailsFiles } from './TorrentDetailsFiles';
import useAppDispatch from '../hooks/UseAppDispatch';
import { synapseSend } from '../redux/Synapse';

interface Props {
  id: SynapseId;
}

const fileByIdSelector = createSelector(
  (state: AppState) => state.files,
  (_: AppState, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsFilesController: React.FC<Props> = ({ id }) => {
  const files = useSelector<AppState, FileResource[]>((s) =>
    fileByIdSelector(s, id)
  );

  const dispatch = useAppDispatch();

  const handleValidateResources = useCallback(() => {
    dispatch(synapseSend('VALIDATE_RESOURCES', { ids: [id] }))
  }, [id]);

  return (
    <TorrentDetailsFiles files={files} onValidate={handleValidateResources} />
  );
};
