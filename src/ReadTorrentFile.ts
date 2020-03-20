import { decode } from 'bencode';
import { TorrentFile, TorrentFileInfo } from './types/TorrentFile';

const readFile = (file: File) => {
  const fr = new FileReader();

  return new Promise<Buffer>((resolve, reject) => {
    fr.addEventListener('error', reject);

    fr.addEventListener('load', (ev) => {
      resolve(fr.result as Buffer);
    });

    fr.readAsArrayBuffer(file);
  });
};

interface RawTorrentFile {
  announce: Uint8Array;
  'announce-list'?: Uint8Array[][];
  'creation date'?: number;
  comment?: Uint8Array;
  'created by'?: Uint8Array;
  private?: Uint8Array;
  info: {
    name: Uint8Array;
    length?: number;
    files?: {
      path: Uint8Array[];
      length: number;
    }[];
    'piece length': number;
    pieces: Uint8Array;
  };
}

const readTorrentPieces = (pieces: Uint8Array) => {
  const hashes: Uint8Array[] = [];

  for (let pos = 0; pieces[pos] !== undefined; pos += 20) {
    hashes.push(pieces.subarray(pos, pos + 20));
  }

  return hashes;
};

const adaptTorrentFile = (raw: RawTorrentFile): TorrentFile => {
  const decoder = new TextDecoder();

  const name = decoder.decode(raw.info.name);

  const files: TorrentFileInfo[] = raw.info.files
    ? raw.info.files.map(({ length, path }) => ({
        length,
        path: path.map((item) => decoder.decode(item)),
      }))
    : [{ path: [name], length: raw.info.length! }];

  const length =
    raw.info.length || files.reduce((acc, { length }) => acc + length, 0);

  const announce: string[][] = raw['announce-list']
    ? raw['announce-list'].map((g) => g.map((url) => decoder.decode(url)))
    : [[decoder.decode(raw.announce)]];

  const pieces = readTorrentPieces(raw.info.pieces);

  return {
    name,
    length,
    files,
    private: !!raw.private,
    pieceLength: raw.info['piece length'],
    pieces,
    announce,
    comment: raw.comment ? decoder.decode(raw.comment) : null,
    creationDate: raw['creation date'] ? new Date(raw['creation date']) : null,
    createdBy: raw['created by'] ? decoder.decode(raw['created by']) : null,
  };
};

export const readTorrentFile = (file: File): Promise<TorrentFile> =>
  readFile(file)
    .then(decode)
    .then(adaptTorrentFile);
