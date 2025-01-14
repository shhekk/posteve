import { Loading, Navigation } from '@client/lib/components';
import SuspenseWrapper from '@client/lib/components/suspenseWrapper';
import { useWidth } from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { Routes } from '@client/router/router';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export function RootLayout() {
  const [init, setInit] = useState(false);
  const { user } = useUserStore();
  const { lg } = useWidth();
  const [sidebar, setSideBar] = useState(lg);
  const handleToggle = () => {
    setSideBar((prev) => !prev);
  };

  useEffect(() => {
    console.log('rootlayout rendered', user);
    if (!user) {
      //i think this is not of any use
      alert('check kar kha se aaya ye alert');
      console.log('user not found so wont render: (reloading page)... ', user);
      window.location.href = '/'; //ye apni jgh shi hai it will do full reload and undefined user need to catched in app.tsx
      //bsdk if user is undefined how user is getting redirect to this.
      return;
    }
    setInit(true);
  }, [user]);

  return init ? (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          background: 'pink',
          width: 'full',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginInline: 'auto',
        }}
      >
        {/* left side bar */}
        <div
          style={{
            background: 'red',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            userSelect: 'none',
            //stayed navigation -- always on left-side.
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            //
            zIndex: 2,
          }}
        >
          <nav
            style={{
              height: 'auto !important',
            }}
          >
            <Navigation />
          </nav>
          <div>collapse</div>
        </div>
        <main>
          <div>height will inc automattically depending on content height</div>
          <SuspenseWrapper />
        </main>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
