import React, { useState } from 'react';
import { TorrentDetailsOptions } from './TorrentDetailsOptions';
import { Priority, TorrentStrategy, SynapseId } from '../types/SynapseProtocol';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { State } from '../types/Store';
import { useThrottle } from '../hooks/UseThrottle';
import { updateResource } from '../actions/resources';

interface SelectorProps {
  path: string;
  priority: Priority;
  strategy: TorrentStrategy;
  throttleUp: number | null;
  throttleDown: number | null;
}

interface Props {
  id: SynapseId;
}

export const TorrentDetailsOptionsController: React.FC<Props> = ({ id }) => {
  const dispatch = useDispatch();

  const t = useSelector<State, SelectorProps>((s) => {
    const i = s.torrents.id.indexOf(id);

    return {
      path: s.torrents.path[i],
      priority: s.torrents.priority[i],
      strategy: s.torrents.strategy[i],
      throttleUp: s.torrents.throttle_up[i],
      throttleDown: s.torrents.throttle_down[i],
    };
  }, shallowEqual);

  const [path, setPath] = useState(t.path);
  const pathModified = path !== t.path;
  const [priority, setPriority] = useState(t.priority);
  const priorityModified = priority !== t.priority;
  const [strategy, setStrategy] = useState(t.strategy);
  const strategyModified = strategy !== t.strategy;

  // Throttle doesn't seem to work right
  const [dlThrottle, setDlThrottle, dlThrottleRaw] = useThrottle(
    t.throttleDown
  );
  const dlThrottleModified = t.throttleDown !== dlThrottleRaw;
  const [ulThrottle, setUlThrottle, ulThrottleRaw] = useThrottle(t.throttleUp);
  const ulThrottleModified = t.throttleUp !== ulThrottleRaw;

  const canUpdateSettings =
    pathModified ||
    priorityModified ||
    strategyModified ||
    dlThrottleModified ||
    ulThrottleModified;

  const handleUpdateSettings = () => {
    dispatch(
      updateResource({
        id: id,
        path: pathModified ? path : undefined,
        priority: priorityModified ? priority : undefined,
        strategy: strategyModified ? strategy : undefined,
        throttle_up: ulThrottleModified ? ulThrottleRaw : undefined,
        throttle_down: dlThrottleModified ? dlThrottleRaw : undefined,
      })
    );
  };

  return (
    <TorrentDetailsOptions
      path={path}
      setPath={setPath}
      pathModified={pathModified}
      priority={priority}
      setPriority={setPriority}
      priorityModified={priorityModified}
      downloadStrategy={strategy}
      setDownloadStrategy={setStrategy}
      strategyModified={strategyModified}
      downloadThrottle={dlThrottle}
      uploadThrottle={ulThrottle}
      setDownloadThrottle={setDlThrottle}
      setUploadThrottle={setUlThrottle}
      downloadThrottleModified={dlThrottleModified}
      uploadThrottleModified={ulThrottleModified}
      onSubmit={handleUpdateSettings}
      submitDisabled={!canUpdateSettings}
    />
  );
};
