import { customFetch } from '@posteve/utils/fetch/customFetch';
import { PlatformLists } from '@posteve/utils/types';
import { useAsyncEffect } from './useAsyncEffect';
import { useState } from 'react';

const cache = new Map<string, PlatformLists>();

export const usePlatformList = () => {
  const [providers, setProviders] = useState<PlatformLists>();

  useAsyncEffect(async () => {
    let p: PlatformLists;
    if (!cache.has('providers')) {
      const { data } = await customFetch<PlatformLists>('/api/platform', {
        method: 'GET',
      });
      if (!data) {
        throw new Error('Something went wrong in GET /platform');
      }
      p = data.map((d) => ({ ...d, key: d.identifier }));
      console.log('providers fetched from server', p);
      cache.set('providers', p!);
    } else {
      p = cache.get('providers')!;
      console.log('providers cached', p);
    }
    setProviders(p);
  }, []);

  return { platformList: providers as PlatformLists };
};
