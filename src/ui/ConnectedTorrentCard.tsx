import React, { useCallback, CSSProperties } from 'react';
import { TorrentResource, SynapseId } from '../types/SynapseProtocol';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { State } from '../types/Store';
// import selectTorrent, { EXCLUSIVE } from '../actions/selectionOld';
import { TorrentCard } from './TorrentCard';
import ws_send from '../socket';
import { makeSynapseConnection } from '../SynapseConnection';
import { selectTorrents } from '../actions/Selection';

const conn = makeSynapseConnection(ws_send);

const pause = (action: 'RESUME_TORRENT' | 'PAUSE_TORRENT', id: SynapseId) =>
  conn.send(action, { id });

interface Props {
  id: SynapseId;
  style?: CSSProperties;
  odd: boolean;
  onSelect: () => void;
}

interface Selected {
  torrent: TorrentResource;
  selected: boolean;
}

export const ConnectedTorrentCard: React.FC<Props> = ({
  id,
  style,
  odd,
  onSelect,
}) => {
  const { torrent, selected } = useSelector<State, Selected>(
    (s) => ({
      torrent: s.torrents[id],
      selected: s.selection.has(id),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const handleSelect = useCallback(() => {
    dispatch(selectTorrents([id]));
  }, [id, dispatch]);

  const handleTogglePaused = useCallback(() => {
    pause(
      torrent.status === 'paused' ? 'RESUME_TORRENT' : 'PAUSE_TORRENT',
      id
    ).then((msg) => {
      console.log('response', id, msg);
    });
    // ws_send(torrent.status === 'paused' ? 'RESUME_TORRENT' : 'PAUSE_TORRENT', {
    //   id,
    // });
  }, [torrent.status, id]);

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
      onGetInfo={onSelect}
    />
  );
};
