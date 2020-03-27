export type SynapseId = string & { __brand: 'ID' };

export type SynapseSerial = number & { __brand: 'SERIAL' };

export type CriterionOp =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'like'
  | 'ilike'
  | 'in'
  | '!in'
  | 'has'
  | '!has';

export interface Criterion {
  field: string;
  op: CriterionOp;
  value: any;
}

// Resources

export type ResourceType = 'server' | 'torrent' | 'file' | 'peer' | 'tracker';

interface ResourceBase<T extends ResourceType> {
  readonly id: SynapseId;
  readonly type: T;
}

export interface ServerResource extends ResourceBase<'server'> {
  readonly download_token: string;
  readonly rate_up: number;
  readonly rate_down: number;
  throttle_up: number | null;
  throttle_down: number | null;
  readonly transferred_up: number;
  readonly transferred_down: number;
  readonly ses_transferred_up: number;
  readonly ses_transferred_down: number;
  readonly free_space: number;
  readonly started: string;
}

export type TorrentStatus =
  | 'paused'
  | 'pending'
  | 'leeching'
  | 'idle'
  | 'seeding'
  | 'hashing'
  | 'magnet'
  | 'error';

export type TorrentStrategy = 'rarest' | 'sequential';

export interface TorrentResource extends ResourceBase<'torrent'> {
  readonly name: string | null;
  path: string;
  readonly created: string;
  readonly modified: string;
  readonly status: TorrentStatus;
  readonly error: string | null;
  readonly size: number | null;
  readonly progress: number;
  priority: 1 | 2 | 3 | 4 | 5;
  readonly availability: number;
  strategy: TorrentStrategy;
  readonly rate_up: number;
  readonly rate_down: number;
  throttle_up: number | null;
  throttle_down: number | null;
  readonly transferred_up: number;
  readonly transferred_down: number;
  readonly peers: number;
  readonly trackers: number;
  readonly tracker_urls: string[];
  readonly pieces: number;
  readonly piece_size: number;
  readonly piece_field: string;
  readonly files: number;
}

export interface FileResource extends ResourceBase<'file'> {
  readonly torrent_id: SynapseId;
  readonly path: string;
  readonly progress: number;
  priority: 1 | 2 | 3 | 4 | 5;
  readonly availability: number;
  readonly size: number;
}

export interface PeerResource extends ResourceBase<'peer'> {
  readonly torrent_id: SynapseId;
  readonly client_id: string;
  readonly ip: string;
  readonly rate_up: number;
  readonly rate_down: number;
  readonly availability: number;
}

export interface TrackerResource extends ResourceBase<'tracker'> {
  readonly torrent_id: SynapseId;
  readonly url: string;
  readonly error: string | null;
  readonly last_report: string;
}

export type SynapseResource =
  | ServerResource
  | TorrentResource
  | FileResource
  | PeerResource
  | TrackerResource;

// prettier-ignore
type IfEquals<X, Y, IfTrue, IfFalse> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? IfTrue : IfFalse;

type PickWritable<T> = Pick<
  T,
  {
    [P in keyof T]-?: IfEquals<
      { [Q in P]: T[P] },
      { -readonly [Q in P]: T[P] },
      P,
      never
    >;
  }[keyof T]
>;

export type ResourceUpdate = { id: SynapseId } & Partial<
  PickWritable<ServerResource> &
    PickWritable<TorrentResource> &
    PickWritable<FileResource> &
    PickWritable<PeerResource> &
    PickWritable<TrackerResource>
>;

// Messages

export interface SynapseMessage<T extends string> {
  type: T;
  serial: SynapseSerial;
}

// Server -> client

export interface UpdateResources {
  type: 'UPDATE_RESOURCES';
  serial: SynapseSerial | null;
  resources: SynapseResource[];
}

export interface ResourcesExtant {
  type: 'RESOURCES_EXTANT';
  serial: SynapseSerial | null;
  ids: SynapseId[];
}

export interface ResourcesRemoved {
  type: 'RESOURCES_REMOVED';
  serial: SynapseSerial | null;
  ids: SynapseId[];
}

// Special messages (server -> client)

export interface RpcVersion {
  type: 'RPC_VERSION';
  major: number;
  minor: number;
}

export interface TransferOffer extends SynapseMessage<'TRANSFER_OFFER'> {
  expires: string;
  token: string;
  size: number;
}

export interface ResourcePending extends SynapseMessage<'RESOURCE_PENDING'> {
  id: SynapseId;
}

export interface SynapseError<T extends string> extends SynapseMessage<T> {
  reason: string;
}

export type UnknownResourceError = SynapseError<'UNKNOWN_RESOURCE'>;
export type InvalidResourceError = SynapseError<'INVALID_RESOURCE'>;
export type InvalidMessageError = SynapseError<'INVALID_MESSAGE'>;
export type InvalidSchemaError = SynapseError<'INVALID_SCHEMA'>;
export type InvalidRequestError = SynapseError<'INVALID_REQUEST'>;
export type TransferFailedError = SynapseError<'TRANSFER_FAILED'>;
export type PermissionDeniedError = SynapseError<'PERMISSION_DENIED'>;
export type ServerError = SynapseError<'SERVER_ERROR'>;

export type SynapseServerMessage =
  | UpdateResources
  | ResourcesExtant
  | ResourcesRemoved
  | RpcVersion
  | TransferOffer
  | ResourcePending
  | UnknownResourceError
  | InvalidResourceError
  | InvalidMessageError
  | InvalidSchemaError
  | InvalidRequestError
  | TransferFailedError
  | PermissionDeniedError
  | ServerError;

// Client -> server

export interface GetResources extends SynapseMessage<'GET_RESOURCES'> {
  ids: SynapseId[];
}

export interface Subscribe extends SynapseMessage<'SUBSCRIBE'> {
  ids: SynapseId[];
}

export interface Unsubscribe extends SynapseMessage<'UNSUBSCRIBE'> {
  ids: SynapseId[];
}

export interface FilterSubscribe extends SynapseMessage<'FILTER_SUBSCRIBE'> {
  kind: ResourceType;
  criteria: Criterion[];
}

export interface FilterUnsubscribe
  extends SynapseMessage<'FILTER_UNSUBSCRIBE'> {
  filter_serial: SynapseSerial;
}

export interface UpdateResource extends SynapseMessage<'UPDATE_RESOURCE'> {
  resource: ResourceUpdate;
}

export interface RemoveResource extends SynapseMessage<'REMOVE_RESOURCE'> {
  id: SynapseId;
  artifacts: boolean;
}

// Special messages (client -> server)

export interface UploadTorrent extends SynapseMessage<'UPLOAD_TORRENT'> {
  size: number;
  path?: string;
  start?: boolean;
  import?: boolean;
}

export interface UploadMagnet extends SynapseMessage<'UPLOAD_MAGNET'> {
  uri: string;
  path?: string;
  start?: boolean;
}

export interface UploadFiles extends SynapseMessage<'UPLOAD_FILES'> {
  size: number;
  path: string;
}

export interface PauseTorrent extends SynapseMessage<'PAUSE_TORRENT'> {
  id: SynapseId;
}

export interface ResumeTorrent extends SynapseMessage<'RESUME_TORRENT'> {
  type: 'RESUME_TORRENT';
  id: SynapseId;
}

export interface AddPeer extends SynapseMessage<'ADD_PEER'> {
  id: SynapseId;
  ip: string;
}

export interface AddTracker extends SynapseMessage<'ADD_TRACKER'> {
  id: SynapseId;
}

export interface ValidateResources
  extends SynapseMessage<'VALIDATE_RESOURCES'> {
  ids: SynapseId[];
}

export type PurgeDns = SynapseMessage<'PURGE_DNS'>;

export type SynapseClientMessage =
  | GetResources
  | Subscribe
  | Unsubscribe
  | FilterSubscribe
  | FilterUnsubscribe
  | UpdateResource
  | RemoveResource
  | UploadTorrent
  | UploadMagnet
  | UploadFiles
  | PauseTorrent
  | ResumeTorrent
  | AddPeer
  | AddTracker
  | ValidateResources
  | PurgeDns;
