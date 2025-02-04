import { useEffect } from 'react';

export const useAsyncEffect = (
  callback: () => Promise<any>,
  dep: React.DependencyList
) => {
  useEffect(() => {
    (async () => {
      try {
        await callback();
      } catch (error) {
        console.error('Error in useAsyncEffect:', error);
      }
    })();
  }, dep);
};
