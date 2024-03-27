import React, { useCallback, CSSProperties } from 'react';
import { SynapseId, TorrentStatus } from '../types/SynapseProtocol';
import { useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../redux/Store';
import { TorrentCard } from './TorrentCard';
import { selectTorrents } from '../actions/Selection';
import useAppDispatch from '../hooks/UseAppDispatch';
import { synapseSend } from '../redux/Synapse';

interface Props {
  id: SynapseId;
  style?: CSSProperties;
  odd: boolean;
  onSelect: () => void;
}

interface Selected {
  name: string | null;
  status: TorrentStatus;
  size: number | null;
  transferredUp: number;
  transferredDown: number;
  rateUp: number;
  rateDown: number;
  progress: number;
  availability: number;
  selected: boolean;
}

export const ConnectedTorrentCard: React.FC<Props> = ({
  id,
  style,
  odd,
  onSelect,
}) => {
  const {
    name,
    status,
    size,
    transferredUp,
    transferredDown,
    progress,
    rateUp,
    rateDown,
    availability,
    selected,
  } = useSelector<AppState, Selected>((s) => {
    const i = s.torrents.id.indexOf(id);

    return {
      selected: s.selection.has(id),
      name: s.torrents.name[i],
      status: s.torrents.status[i],
      size: s.torrents.size[i],
      transferredUp: s.torrents.transferred_up[i],
      transferredDown: s.torrents.transferred_down[i],
      progress: s.torrents.progress[i],
      rateUp: s.torrents.rate_up[i],
      rateDown: s.torrents.rate_down[i],
      availability: s.torrents.availability[i],
    };
  }, shallowEqual);

  const dispatch = useAppDispatch();

  const handleSelect = useCallback(() => {
    dispatch(selectTorrents([id]));
  }, [id, dispatch]);

  const handleTogglePaused = useCallback(() => {
    dispatch(
      synapseSend(status === 'paused' ? 'RESUME_TORRENT' : 'PAUSE_TORRENT', {
        id,
      })
    );
  }, [status, id]);

  return (
    <TorrentCard
      name={name}
      status={status}
      size={size}
      transferredUp={transferredUp}
      transferredDown={transferredDown}
      progress={progress}
      rateUp={rateUp}
      rateDown={rateDown}
      availability={availability}
      selected={selected}
      onSelect={handleSelect}
      style={style}
      odd={odd}
      onTogglePaused={handleTogglePaused}
      onGetInfo={onSelect}
    />
  );
};
