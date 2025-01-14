import { createContext, useEffect, useState } from 'react';
import { useUserStore } from '@client/lib/store/user';
import { Loading } from '../components';

interface State {
  user: string | null; //userId
  mode: 'light' | 'dark' | 'system';
  // loading: boolean; //this causes unNessesary re render of children(APP)
  // setLoading: (a: boolean) => void;
}
interface Action {
  setMode: (mode: State['mode']) => void;
}
export type Context = State & Action;

const defaultState: Context = {
  user: null,
  mode: 'system',
  setMode: () => {}, //placeholder function
};

export const AppContext = createContext<Context>(defaultState);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userStore = useUserStore();
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<State & Action>(defaultState);

  useEffect(() => {
    console.log('context----run--------');

    const intializeUser = new Promise(async (res, rej) => {
      try {
        console.log('inituser error');
        res(await userStore.setUserId());
      } catch (error) {
        rej(error);
      }
    });

    Promise.all([intializeUser])
      .then(() => setLoading(false))
      .catch((error) => {
        console.log({ FailedtoInitialiseUser: error });
        if (error.status === 500) {
          alert('server failed');
        }
        setLoading(false)
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...context,
        user: userStore.user,
        setMode: (mode) => setContext((p) => ({ ...p, mode })),
      }}
    >
      {!loading ? children : <Loading />}
    </AppContext.Provider>
  );
};
