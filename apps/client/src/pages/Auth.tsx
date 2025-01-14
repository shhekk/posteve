import { Loading } from '@client/lib/components';
import { useAppContext } from '@client/lib/hooks/useAppContext';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export function Auth() {
  const [init, setinit] = useState(false);
  const { user } = useAppContext();
  const n = useNavigate();
  const location = useLocation();
  console.log('auth rendered');

  useEffect(() => {
    if (user) {
      console.log({ locationInAuth: location , from: location.state?.from});

      n(location.state?.from ? location.state.from : '/', {
        replace: true,
      });
    }
    setinit(true);
  }, [n, user]);

  return init ? <Outlet /> : <Loading />;
}
