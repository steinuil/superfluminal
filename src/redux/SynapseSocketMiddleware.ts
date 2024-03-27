import { Middleware } from 'redux';
import {
  SynapseClientMessage,
  SynapseServerMessage,
} from '../types/SynapseProtocol';
import { AppAction, AppDispatch, AppState } from './Store';

export type WebsocketAction =
  | { type: 'websocket/connect'; url: string; protocols?: string[] }
  | { type: 'websocket/disconnect'; code?: number; reason?: string }
  | {
      type: 'websocket/send';
      data: string | ArrayBuffer | Blob | ArrayBufferView;
    }
  | { type: 'websocket/opened'; event: Event }
  | { type: 'websocket/closed'; event: CloseEvent }
  | { type: 'websocket/error'; event: Event };

export type SynapseMessageAction = SynapseServerMessage | SynapseClientMessage;

export const websocketConnect = (
  url: string,
  protocols?: string[]
): AppAction => ({ type: 'websocket/connect', url, protocols });

export const websocketDisconnect = (
  code?: number,
  reason?: string
): AppAction => ({ type: 'websocket/disconnect', code, reason });

export const websocketSend = (
  data: string | ArrayBuffer | Blob | ArrayBufferView
): AppAction => ({ type: 'websocket/send', data });

export default function createWebsocketMiddleware(): Middleware<
  {},
  AppState,
  AppDispatch
> {
  let sock: WebSocket | null = null;

  return ({ dispatch }) => (next: AppDispatch) => (action: AppAction) => {
    switch (action.type) {
      case 'websocket/connect':
        sock = new WebSocket(action.url, action.protocols);

        sock.addEventListener('message', (event) => {
          dispatch(JSON.parse(event.data) as SynapseServerMessage);
        });

        sock.addEventListener('open', (event) => {
          dispatch({ type: 'websocket/opened', event });
        });

        sock.addEventListener('close', (event) => {
          dispatch({ type: 'websocket/closed', event });
          sock = null;
        });

        sock.addEventListener('error', (event) => {
          dispatch({ type: 'websocket/error', event });
        });
        break;

      case 'websocket/disconnect':
        if (!sock) {
          console.log('ayy!');
          break;
        }
        sock.close(action.code, action.reason);
        break;

      case 'websocket/send':
        if (!sock) {
          console.log('ayy!');
          break;
        }
        sock.send(action.data);
        break;
    }

    return next(action);
  };
}
