let current = 0;

export const uniqueId = (prefix: string = 'id') => {
  const id = `${prefix}${current}`;
  current += 1;
  return id;
};
