import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@client/lib/hooks/useAppContext';
import { Loading } from '@client/lib/components';

export default function App() {
  const n = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAppContext();
  const location = useLocation();
  // const [init, setInit] = useState(false);

  useEffect(() => {
    console.log('app rendered');
    if (!user) {
      console.log('user not found', user);
      //if no user send the to auth page with state 
      //when there is user, auth.tsx will verify state and navigate the user to state.
      n('/auth/signin', {
        state: { from: location },
      });
      console.log({ locationInApp: location });
    }
    // else {
    //   const { pathname, search } = location;
    //   n(pathname + search, { replace: true }); //jugaad
    //   //replace true saves extra navigation history space
    // }
    //  else {  //can't do this as you won't be able to navigate other routes as app redirect yout back to root on hard reload
    //   n('/');
    // }
    setLoading(false);
  }, [user, n]);

  return !loading ? <Outlet /> : <Loading />;
}
