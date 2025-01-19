import { User } from '@prisma/client';
export interface Store {
  user: string | null; //userid
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
