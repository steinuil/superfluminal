export interface TorrentFileInfo {
  path: string[];
  length: number;
}

export interface TorrentFile {
  name: string;
  length: number;
  files: TorrentFileInfo[];
  private: boolean;
  pieceLength: number;
  pieces: Uint8Array[];
  announce: string[][];
  comment: string | null;
  creationDate: Date | null;
  createdBy: string | null;
}
