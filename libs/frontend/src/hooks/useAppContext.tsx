import { useContext } from 'react';
// import { AppContext } from '../contexts/appContext';
import { AppContext, Context } from '@client/lib/contexts/appContext';

export const useAppContext = () => {
  return useContext<Context>(AppContext);
};
