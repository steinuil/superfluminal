interface MagnetInfo {
  name: string | null;
  length: number | null;
}

export const readMagnet = (magnet: string): MagnetInfo => {
  const params = new URL(magnet).searchParams;

  const length = params.get('xl');

  return {
    name: params.get('dn'),
    length: length !== null ? parseInt(length, 10) : null,
  };
};
