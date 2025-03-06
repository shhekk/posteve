//@todo should create platform store to :- fetchProviders(), fetchConnectedProviders(), fetchProviderUrl(), fetchProviderToken()
import { create } from 'zustand';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { PlatformStore } from './platform.interface';
import { PlatformLists } from '@posteve/utils/types';

const cache = new Map<string, any>();

export const usePlatform = create<PlatformStore>((set, get) => ({
  platformList: null,
  fetchPlatforms: async () => {
    if (cache.has('platforms')) {
      console.log('platforms fetched from zustand cache');
      return cache.get('platforms');
    }
    try {
      const { data } = await customFetch<PlatformLists>('/api/platform', {
        method: 'GET',
      });
      if (!data) {
        throw new Error('Something went wrong in GET /platform');
      }
      console.log('platforms fetched from server', data);
      cache.set('platforms', data);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
  fetchConnectedPlatforms: async () => {
    if (cache.has('connected')) {
      console.log('platforms fetched from zustand cache');
      return cache.get('platforms');
    }
    try {
      const { data } = await customFetch<PlatformLists>('/api/platform', {
        method: 'GET',
      });
      if (!data) {
        throw new Error('Something went wrong in GET /platform');
      }
      console.log('platforms fetched from server', data);
      cache.set('connected', data);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
  fetchConnectionUrl: async () => {},
  fetchToken: async () => {},
}));
