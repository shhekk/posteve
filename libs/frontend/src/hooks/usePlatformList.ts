import { usePlatform } from '@client/lib/store/Platform';
import { PlatformLists } from '@posteve/utils/types';
import { useAsyncEffect } from './useAsyncEffect';
import { useState } from 'react';

export const usePlatformList = () => {
  const [providers, setProviders] = useState<PlatformLists>(),
    { fetchPlatforms } = usePlatform();

  useAsyncEffect(async () => {
    let p: PlatformLists;

    fetchPlatforms()
      .then((data) => {
        p = data.map((d) => ({
          ...d,
          key: d.identifier,
          title: toCamelCase(d.identifier),
        }));
        setProviders(p);
      })
      .catch((err) => console.log('error in usePlatformList', err));
  }, []);

  return { platformList: providers as PlatformLists };
};

function toCamelCase(s: string) {
  let str = [...s];
  return [str.shift()?.toUpperCase(), ...str].join('');
}
