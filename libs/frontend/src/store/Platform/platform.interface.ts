//@todo should create platform store to :- fetchProviders(), fetchConnectedProviders(), fetchProviderUrl(), fetchProviderToken()
import { PlatformLists } from '@posteve/utils/types';
import { Platform } from '@prisma/client';

export interface Store {
  platformList: PlatformLists | null;
}
export interface Actions {
  fetchPlatforms: () => Promise<PlatformLists>; //cache the list of supported platforms
  fetchConnectedPlatforms: () => Promise<PlatformLists>; // cache the users connected platforms, if connected
  fetchConnectionUrl: () => Promise<any>; //no cache needed, if already-connected ? return : (fetch url)
  fetchToken: () => Promise<any>; //store {token and expiresIn} in cache && if cached check->if expiresIn > date.now() ? (return token): (refrestToken)
}
export type PlatformStore = Store & Actions;

export type PlatformDetails = Partial<Platform>;

/**
 * @notes
 * you can use zustand get() to cache results and return data in 1st method (caching in 1st method)
 * 
 * Most of the time, get() from Zustand is enough!
 * But if you need non-reactive, expirable, or large data, a separate cache (Map()) makes sense.
 * Use Zustand (get()) When:
 *  * You need global state that updates across components.
 *  * The data should trigger re-renders when updated.
 *  * The data is not too large and does not need expiration control.
 * Use a Separate Cache When:
 *  * You need non-reactive data that doesn’t trigger UI updates (e.g., tokens, timestamps).
 *  * You need manual expiration control.
 *  * The data is large and shouldn’t be in Zustand state.
 */
