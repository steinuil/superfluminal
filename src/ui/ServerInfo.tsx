import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types/Store';
import { ServerResource } from '../types/SynapseProtocol';
import { ws_disconnect } from '../socket';
import { useThrottle } from '../hooks/UseThrottle';
import { Stack } from '../components/Stack';
import { FormHeader } from '../components/FormHeader';
import { Definition } from '../components/Definition';
import { fmtSizeBin, fmtRatio } from '../Units';
import { Button } from '../components/Button';
import { Divider } from '../components/Divider';
import { ThrottleBitrate } from './ThrottleBitrate';
import { updateResource } from '../actions/resources';

interface Props {
  onClose: () => void;
}

export const ServerInfo: React.FC<Props> = ({ onClose }) => {
  const server = useSelector<State, ServerResource>((s) => s.server) || {};
  const dispatch = useDispatch();

  const handleDisconnect = ws_disconnect;
  const handlePurgeDns = () => dispatch('PURGE_DNS');

  const [dlThrottle, setDlThrottle, dlThrottleRaw] = useThrottle(
    server.throttle_down
  );
  const [ulThrottle, setUlThrottle, ulThrottleRaw] = useThrottle(
    server.throttle_up
  );
  const dlThrottleModified = dlThrottleRaw !== server.throttle_down;
  const ulThrottleModified = ulThrottleRaw !== server.throttle_up;

  const isModified = dlThrottleModified || ulThrottleModified;

  const handleChangeSettings = () =>
    dispatch(
      updateResource({
        id: server.id,
        throttle_up: ulThrottleModified ? ulThrottleRaw : undefined,
        throttle_down: dlThrottleModified ? dlThrottleRaw : undefined,
      })
    );

  return (
    <Stack spacing="16px" padding="16px">
      <FormHeader title="Synapse" onClose={onClose} />
      <Stack spacing="8px">
        <Definition label="Running since">
          {new Date(server.started).toLocaleString()}
        </Definition>
        <Definition label="Disk space free">
          {fmtSizeBin(server.free_space)}
        </Definition>
        <Definition label="Lifetime ratio">
          {fmtRatio(server.transferred_up / server.transferred_down)} - UL:{' '}
          {fmtSizeBin(server.transferred_up)}, DL:{' '}
          {fmtSizeBin(server.transferred_down)}
        </Definition>
        <Definition label="Session ratio">
          {fmtRatio(server.ses_transferred_up / server.ses_transferred_down)} -
          UL: {fmtSizeBin(server.ses_transferred_up)}, DL:{' '}
          {fmtSizeBin(server.ses_transferred_down)}
        </Definition>
      </Stack>
      <Button type="button" onClick={handleDisconnect}>
        Disconnect
      </Button>
      <Button type="button" onClick={handlePurgeDns}>
        Purge DNS cache
      </Button>
      <Divider />
      <ThrottleBitrate
        title="Download throttle"
        throttle={dlThrottle}
        onChange={setDlThrottle}
        modified={dlThrottleModified}
        noGlobal
      />
      <ThrottleBitrate
        title="Upload throttle"
        throttle={ulThrottle}
        onChange={setUlThrottle}
        modified={ulThrottleModified}
        noGlobal
      />
      <Button
        type="button"
        onClick={handleChangeSettings}
        disabled={!isModified}
      >
        Change settings
      </Button>
    </Stack>
  );
};
