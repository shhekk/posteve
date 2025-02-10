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
// // import { userDetails, UserStore } from './user.interface';
// // const cachedRes = new Map<string, any>();

// export const usePlatformProviders = create<UserStore>((set, get) => ({
//   user: null,
//   auth: () => {
//     if (cachedRes.has('user')) {
//       return !!cachedRes.get('user');
//     }
//     return !!get().user;
//   },
//   deleteUser: async () => {
//     if (cachedRes.has('user')) {
//       cachedRes.delete('user');
//     }
//     set({ user: null });
//     return;
//   },
//   initUser: async () => {
//     try {
//       //initially user should not fetched from cached res
//       let user;
//       const { data } = await customFetch('/api/user/me', {
//         method: 'GET',
//       });
//       user = data as userDetails;

//       // console.log({ userinStore: user });
//       if (user) {
//         console.log('user fetched from api, setting cachedRes', user);
//         cachedRes.set('user', user);
//         set((state) => ({ ...state, user: user.id }));
//       }
//       return;
//     } catch (error) {
//       console.log('error in initializing user', error);
//     }
//   },
//   setUserId: async () => {
//     try {
//       let user;
//       if (cachedRes.has('user')) {
//         user = cachedRes.get('user') as userDetails;
//         set({ user: user.id });
//         return;
//       }
//       const { data } = await customFetch('/api/user/me', {
//         method: 'GET',
//       });
//       user = data as userDetails;

//       // console.log({ userinStore: user });
//       if (user) {
//         console.log('setting cachedRes', user);
//         cachedRes.set('user', user);
//         set((state) => ({ ...state, user: user.id }));
//       }
//       return;
//     } catch (error) {
//       throw error;
//       // console.log('userstore.setuserId error ', error);
//     }
//   },
//   fetchUserDetails: async () => {
//     try {
//       if (cachedRes.has('user')) {
//         console.log('user details fetched form cachedRes');
//         return cachedRes.get('user') as userDetails;
//       }
//       const { data } = await customFetch('/api/user/me');
//       if (data) {
//         console.log('setting userDetails in cachedRes', data);
//         cachedRes.set('user', data);
//         set({ user: data.id });
//         return data as userDetails;
//       }
//     } catch (error) {
//       console.log('userstore.fetchUserDetails error ', error);
//     }
//   },
//   getUsername: () => {
//     let username;
//     if (cachedRes.has('user')) {
//       console.log('user details fetched form cachedRes');
//       username = (cachedRes.get('user') as userDetails).username;
//     }
//     return username || 'username-404';
//   },
// }));
