import { User } from '@prisma/client';
export interface Store {
  user: string | null; //userid
}
export interface Actions {
  auth: () => boolean;
  setUserId: () => Promise<any>;
  deleteUser: () => Promise<any>;
  fetchUserDetails: () => Promise<userDetails | void>;
}
export type UserStore = Store & Actions;

export type userDetails = Partial<User>;
