import {
  SynapseServerMessage,
  SynapseClientMessage,
} from './types/SynapseProtocol';

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
}

export const makeSynapseConnection = (
  wsSend: (type: string, body: any, callback: (resp: any) => void) => void
): SynapseConnection => {
  return {
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

        [Symbol.iterator]: function() {
          return this;
        },
      };
    },
  };
};
