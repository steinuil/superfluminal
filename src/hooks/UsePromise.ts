import { useState, useLayoutEffect } from 'react';

export function usePromise<T>(
  provider: () => Promise<T>,
  onError?: (err: unknown) => void
) {
  const [state, setState] = useState<T | null>(null);

  useLayoutEffect(() => {
    setState(null);
    let isCancelled = false;

    provider().then(
      (data) => {
        if (isCancelled) return;

        setState(data);
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [provider]);

  return state;
}
