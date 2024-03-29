import { default as wsSend } from './socket';
import { TorrentOptions } from './ui/AddTorrentForm';
import { makeSynapseConnection, synapseExpect } from './SynapseConnection';
import { SynapseId } from './types/SynapseProtocol';
import { throttleToNumber } from './hooks/UseThrottle';

const conn = makeSynapseConnection(wsSend);

// TODO: REIMPLEMENT ALL AS STATE MACHINE IN REDUX

export const uploadMagnet = async (
  magnet: string,
  options: TorrentOptions
): Promise<SynapseId> => {
  const shouldCustomize =
    options.priority !== 3 ||
    options.downloadThrottle.type !== 'GLOBAL' ||
    options.uploadThrottle.type !== 'GLOBAL';

  const extant = synapseExpect(
    'RESOURCES_EXTANT',
    await conn.send('UPLOAD_MAGNET', {
      uri: magnet,
      start: options.startImmediately && !shouldCustomize,
      path: options.path || undefined,
    })
  );

  // if (isSynapseError(extant)) {
  //   throw new SynapseError(extant);
  // }

  // if (extant.type !== 'RESOURCES_EXTANT') {
  //   throw new SynapseUnexpected('RESOURCES_EXTANT', extant);
  // }

  const [id] = extant.ids;

  if (!shouldCustomize) return id;

  await conn.send('UPDATE_RESOURCE', {
    resource: {
      id,
      priority: options.priority,
      throttle_down: throttleToNumber(options.downloadThrottle),
      throttle_up: throttleToNumber(options.uploadThrottle),
    },
  });

  if (options.startImmediately) {
    await conn.send('RESUME_TORRENT', { id });
  }

  return id;
};

export const uploadTorrentFile = async (
  file: File,
  options: TorrentOptions,
  socket: any
): Promise<SynapseId> => {
  const shouldCustomize =
    options.priority !== 3 ||
    options.downloadThrottle.type !== 'GLOBAL' ||
    options.uploadThrottle.type !== 'GLOBAL';

  const uploadResponses = conn.subscribe('UPLOAD_TORRENT', {
    size: file.size,
    start: options.startImmediately && !shouldCustomize,
    path: options.path || undefined,
    import: options.shouldImport,
  });

  const offer = synapseExpect(
    'TRANSFER_OFFER',
    await uploadResponses.next().value
  );

  // if (isSynapseError(offer)) {
  //   throw new SynapseError(offer);
  // }

  // if (offer.type !== 'TRANSFER_OFFER') {
  //   throw new SynapseUnexpected('TRANSFER_OFFER', offer);
  // }

  const a = document.createElement('a');
  a.href = socket.uri;
  const protocol = a.protocol === 'ws:' ? 'http://' : 'https://';
  await fetch(protocol + a.host + a.pathname, {
    method: 'POST',
    body: file,
    headers: {
      Authorization: `Bearer ${offer.token}`,
    },
  });

  const extant = synapseExpect(
    'RESOURCES_EXTANT',
    await uploadResponses.next().value
  );

  // if (extant.type === 'INVALID_REQUEST') {
  //   throw new Error(extant.reason);
  // }

  // if (extant.type !== 'RESOURCES_EXTANT') {
  //   throw new Error(`expected RESOURCES_EXTANT: ${JSON.stringify(extant)}`);
  // }

  const [id] = extant.ids;

  if (!shouldCustomize) return id;

  await conn.send('UPDATE_RESOURCE', {
    resource: {
      id,
      priority: options.priority,
      throttle_down: throttleToNumber(options.downloadThrottle),
      throttle_up: throttleToNumber(options.uploadThrottle),
    },
  });

  if (options.startImmediately) {
    await conn.send('RESUME_TORRENT', { id });
  }

  return id;
};
