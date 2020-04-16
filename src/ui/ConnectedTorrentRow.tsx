import React, { useCallback, CSSProperties } from 'react';
import { TorrentResource, SynapseId } from '../types/SynapseProtocol';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types/Store';
import selectTorrent, { EXCLUSIVE } from '../actions/selection';
import { TorrentCard } from './TorrentCard';
import ws_send from '../socket';

interface Props {
  id: SynapseId;
  style?: CSSProperties;
  odd: boolean;
}

interface Selected {
  torrent: TorrentResource;
  selected: boolean;
}

export const ConnectedTorrentRow: React.FC<Props> = ({ id, style, odd }) => {
  const { torrent, selected } = useSelector<State, Selected>((s) => ({
    torrent: s.torrents[id],
    selected: s.selection.includes(id),
  }));

  const dispatch = useDispatch();

  const handleSelect = useCallback(() => {
    dispatch(selectTorrent([id], EXCLUSIVE));
  }, [id, dispatch]);

  const handleTogglePaused = useCallback(() => {
    ws_send(torrent.status === 'paused' ? 'RESUME_TORRENT' : 'PAUSE_TORRENT', {
      id: torrent.id,
    });
  }, [torrent.status, torrent.id]);

  return (
    <TorrentCard
      name={torrent.name}
      status={torrent.status}
      size={torrent.size}
      transferredUp={torrent.transferred_up}
      transferredDown={torrent.transferred_down}
      progress={torrent.progress}
      rateUp={torrent.rate_up}
      rateDown={torrent.rate_down}
      availability={torrent.availability}
      selected={selected}
      onSelect={handleSelect}
      style={style}
      odd={odd}
      onTogglePaused={handleTogglePaused}
    />
  );
};
