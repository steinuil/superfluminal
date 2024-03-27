import produce from 'immer';
import { Reducer } from 'redux';
import { SynapseId, SynapseSerial } from '../types/SynapseProtocol';
import { V } from '../types/Variant';
import { AppAction } from './Store';

type SidebarAddTorrentState =
  | { isLoading: true; serial: SynapseSerial }
  | { isLoading: false };

export type SidebarState =
  | V<'CLOSED'>
  | V<'SETTINGS'>
  | V<'ADD_TORRENT', SidebarAddTorrentState>
  | V<'TORRENT_INFO', { torrent: SynapseId }>;

export interface UiState {
  sidebar: SidebarState;
}

export type UiAction =
  | V<'sidebar/close'>
  | V<'sidebar/showTorrent', { id: SynapseId }>
  | V<'sidebar/showSettings'>
  | V<'sidebar/addTorrent'>;

export const closeSidebar = (): UiAction => ({ type: 'sidebar/close' });

export const showTorrentInfo = (id: SynapseId): UiAction => ({
  type: 'sidebar/showTorrent',
  id,
});

export const showSettings = (): UiAction => ({
  type: 'sidebar/showSettings',
});

export const showAddTorrent = (magnet?: string): UiAction => ({
  type: 'sidebar/addTorrent',
});

export const uiInitialState: UiState = {
  sidebar: { type: 'CLOSED' },
};

export const uiReducer: Reducer<UiState, AppAction> = (
  state = uiInitialState,
  action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'sidebar/close':
        draft.sidebar = { type: 'CLOSED' };
        break;
      case 'sidebar/showTorrent':
        draft.sidebar = { type: 'TORRENT_INFO', torrent: action.id };
        break;
      case 'sidebar/showSettings':
        draft.sidebar = { type: 'SETTINGS' };
        break;
      case 'sidebar/addTorrent':
        draft.sidebar = { type: 'ADD_TORRENT', isLoading: false };
        break;
      case 'RESOURCES_EXTANT':
        if (
          state.sidebar.type === 'ADD_TORRENT' &&
          state.sidebar.isLoading &&
          action.serial === state.sidebar.serial
        ) {
          draft.sidebar = {
            type: 'TORRENT_INFO',
            torrent: action.ids[0],
          };
          break;
        }
        break;
    }
  });
