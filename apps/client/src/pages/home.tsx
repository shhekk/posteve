import { useAppContext } from '@client/lib/hooks/useAppContext';
import { useWindowSize } from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { userDetails } from '@client/lib/store/user/user.interface';
import { Routes } from '@client/router/router';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';

export function Home(): React.JSX.Element {
  const { user } = useAppContext();
  const { fetchUserDetails } = useUserStore();
  const [userDetails, setUserDetails] = useState<userDetails>();
  const { width, height } = useWindowSize();
  console.log('home rendered');
  useEffect(() => {
    fetchUserDetails().then((d) => {
      if (d) {
        setUserDetails(d);
      }
    });
  }, []);
  return (
    <>
      <div>
        <b>user: {user}</b>
        <Tooltip children={<>children</>} title='sdlkjfla'></Tooltip>
        <div>
          <h3>other routes</h3>
        </div>
        <div>
          <Link to={Routes.CONNECT}>{Routes.CONNECT}</Link>
          <br />
          <Link to={Routes.LOGOUT}>{Routes.LOGOUT}</Link>
          <br />
          <Link to={Routes.POST}>{Routes.POST}</Link>
          <br/>
        </div>
        <p>email: {userDetails && userDetails.email}</p>
        <p>username: {userDetails && userDetails.username}</p>
        <p>{width}</p>
        <p>{height}</p>
      </div>
    </>
  );
}
