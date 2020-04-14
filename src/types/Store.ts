import {
  SynapseResource,
  SynapseId,
  SynapseSerial,
  Criterion,
  ServerResource,
  TorrentResource,
  FileResource,
  PeerResource,
  TrackerResource,
} from './SynapseProtocol';
import { RouterState } from 'connected-react-router';

export interface ResourceMap<R extends SynapseResource> {
  [id: string]: R;
}

export interface State {
  router: RouterState;
  socket: {
    uri: string | null;
    password: string | null;
    state: 'SOCKET_CONNECTED' | 'SOCKET_CONNECTING' | 'SOCKET_DISCONNECTED';
    reason: string | null;
  };
  selection: SynapseId[];
  subscribe: Array<{
    serial: SynapseSerial;
    id: SynapseId;
  }>;
  filter_subscribe: Array<{
    serial: SynapseSerial;
    kind: SynapseResource['type'];
    criteria: Criterion[];
  }>;
  // resources: {
  server: ServerResource;
  torrents: ResourceMap<TorrentResource>;
  files: ResourceMap<FileResource>;
  peers: ResourceMap<PeerResource>;
  trackers: ResourceMap<TrackerResource>;
  // };
}
