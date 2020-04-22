import { Tree, add } from './Avl';
import { parse } from 'papaparse';

interface IpRange {
  start: number;
  end: number;
}

export const lookup = (
  tree: Tree<IpRange, string>,
  ip: number
): string | null => {
  if (ip > tree.key.end) {
    if (!tree.right) return null;
    return lookup(tree.right, ip);
  }

  if (ip < tree.key.start) {
    if (!tree.left) return null;
    return lookup(tree.left, ip);
  }

  return tree.value;
};

export const ipToNumber = (ip: string): number =>
  ip.split('.').reduce((ip, octet) => (ip << 8) + parseInt(octet, 10), 0) >>> 0;

export const compareIpRanges = (
  { start: startA, end: endA }: IpRange,
  { start: startB, end: endB }: IpRange
) => {
  if (endA > startB) return 1;
  if (startA > endB) return -1;
  return 0;
};

// https://lite.ip2location.com/database/ip-country
// This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.
export const loadTree = () => {
  let result: Tree<IpRange, string> | null;

  return new Promise<Tree<IpRange, string> | null>((resolve) => {
    parse('/IP2LOCATION-LITE-DB1.CSV', {
      download: true,
      skipEmptyLines: true,
      step: (row) => {
        if (row.data[3] === '-') return;

        const key = {
          start: parseInt(row.data[0], 10),
          end: parseInt(row.data[1], 10),
        };

        result = add(result, key, row.data[2], compareIpRanges);
      },
      complete: () => {
        resolve(result);
      },
    });
  });
};

export const countryCodeToEmoji = (code: string) =>
  Array.from(code).map((char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
