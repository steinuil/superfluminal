import {
  SynapseServerMessage,
  SynapseClientMessage,
  SynapseSerial,
  SynapseErrorMessage,
} from './types/SynapseProtocol';

type Callbacks = { [serial: number]: (msg: SynapseServerMessage) => void };

type MessageHandlers = {
  [T in SynapseServerMessage['type']]?: (
    msg: Extract<SynapseServerMessage, { type: T }>
  ) => void;
};

export const makeSynapse = (url: string) => {
  const ws = new WebSocket(url);

  let serial = 0;
  const newSerial = (): SynapseSerial => {
    const s = serial;
    serial += 1;
    return s as SynapseSerial;
  };

  const callbacks: Callbacks = {};
  const handlers: MessageHandlers = {};
  const queuedMessages: SynapseClientMessage[] = [];

  const handle = <T extends SynapseServerMessage>(message: T) => {
    const handler = handlers[message.type] as ((msg: T) => void) | undefined;
    if (!handler) {
      console.error(
        `couldn't find handler for message type ${message.type}`,
        message
      );
      return;
    }
    handler(message);
  };

  ws.addEventListener('open', () => {
    queuedMessages.forEach((msg) => ws.send(JSON.stringify(msg)));
    queuedMessages.length = 0;
  });

  ws.addEventListener('message', (ev) => {
    const message: SynapseServerMessage = JSON.parse(ev.data);

    console.debug('server -> client', message);

    if (message.type === 'RPC_VERSION') return;

    if (message.serial !== null) {
      const handler = callbacks[message.serial];
      if (!handler)
        console.error(
          `couldn't find handler for serial ${message.serial}`,
          message
        );
      handler(message);
    } else {
      handle(message);
    }
  });

  ws.addEventListener('close', () => {});

  const send = (
    msg: SynapseClientMessage,
    cb: (resp: SynapseServerMessage) => void,
    serial = newSerial()
  ) => {
    callbacks[serial] = cb;

    if (ws.readyState !== WebSocket.OPEN) {
      queuedMessages.push(msg);
    } else {
      ws.send(JSON.stringify(msg));
    }
  };

  return {
    readyState: ws.readyState,
  };
};

type BodyOf<T extends string> = Omit<
  Extract<SynapseClientMessage, { type: T }>,
  'type' | 'serial'
> & { serial?: number };

type IterableIteratorFix<T> = Iterator<T, T> & Iterable<T>;

interface SynapseConnection {
  send: <T extends SynapseClientMessage['type']>(
    type: T,
    body: BodyOf<T>
  ) => Promise<SynapseServerMessage>;
  subscribe: <T extends SynapseClientMessage['type']>(
    type: T,
    body: BodyOf<T>
  ) => IterableIteratorFix<Promise<SynapseServerMessage>>;
  // handle: <T extends SynapseServerMessage>(
  //   type: T['type'],
  //   handler: (msg: T) => void
  // ) => void;
}

export const makeSynapseConnection = (
  wsSend: (type: string, body: any, callback: (resp: any) => void) => void
): SynapseConnection => ({
  send: (type, body) => new Promise((resolve) => wsSend(type, body, resolve)),

  subscribe: (type, body) => {
    const resolverQueue: ((v: SynapseServerMessage) => void)[] = [];
    const responseQueue: SynapseServerMessage[] = [];

    wsSend(type, body, (resp: SynapseServerMessage) => {
      const resolve = resolverQueue.shift();
      if (resolve) {
        resolve(resp);
      } else {
        responseQueue.push(resp);
      }
    });

    return {
      next: () => {
        const resp = responseQueue.shift();
        if (resp !== undefined) {
          return {
            done: false,
            value: Promise.resolve(resp),
          };
        }

        const promise = new Promise<SynapseServerMessage>((r) =>
          resolverQueue.push(r)
        );
        return {
          done: false,
          value: promise,
        };
      },

      [Symbol.iterator]: function () {
        return this;
      },
    };
  },
});

export const isSynapseError = (
  msg: SynapseServerMessage
): msg is SynapseErrorMessage =>
  [
    'UNKNOWN_RESOURCE',
    'INVALID_RESOURCE',
    'INVALID_MESSAGE',
    'INVALID_SCHEMA',
    'INVALID_REQUEST',
    'TRANSFER_FAILED',
    'PERMISSION_DENIED',
    'SERVER_ERROR',
  ].includes(msg.type);

export class SynapseError extends Error {
  type: SynapseErrorMessage['type'];
  serial: SynapseSerial;
  reason: string;

  constructor({ type, reason, serial }: SynapseErrorMessage, ...params: any[]) {
    super(...params);

    this.name = 'SynapseError';
    this.message = `${type}: ${reason}`;
    this.type = type;
    this.reason = reason;
    this.serial = serial;
  }
}

export class SynapseUnexpected extends Error {
  constructor(
    public expected: SynapseServerMessage['type'],
    public got: SynapseServerMessage,
    ...params: any[]
  ) {
    super(...params);

    this.name = 'SynapseUnexpected';
    this.message = `Expected ${expected}: ${JSON.stringify(got)}`;
  }
}

export function synapseExpect<
  T extends Exclude<SynapseServerMessage['type'], SynapseErrorMessage['type']>
>(
  type: T,
  msg: SynapseServerMessage
): Extract<SynapseServerMessage, { type: T }> {
  if (isSynapseError(msg)) {
    throw new SynapseError(msg);
  }

  if (msg.type !== type) {
    throw new SynapseUnexpected(type, msg);
  }

  return msg as any;
}
