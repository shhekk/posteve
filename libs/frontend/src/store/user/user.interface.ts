import { User } from '@prisma/client';
export interface Store {
  user: string | null; //userid
  // userDetails: userDetails | null; //not storing userDetails in store but only user-id , storing userDetails only in cached res
  //@idea is to only store unique values(parentValues) in store and all other children values (i.e, depends on parent value) be stored in cached res  
}
export interface Actions {
  auth: () => boolean;
  initUser: () => Promise<any>; //when user reload user should not set from cached res
  setUserId: () => Promise<any>;
  deleteUser: () => Promise<any>;
  fetchUserDetails: () => Promise<userDetails | void>;
  getUsername: () => string;
}
export type UserStore = Store & Actions;

export type userDetails = Partial<User>;
