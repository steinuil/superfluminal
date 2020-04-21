import { useState } from 'react';

export const useToggle = (initial: boolean) => {
  const [value, setValue] = useState(initial);

  const toggle = (val?: boolean) =>
    setValue((prev) => (val === true || val === false ? val : !prev));

  return [value, toggle] as const;
};
