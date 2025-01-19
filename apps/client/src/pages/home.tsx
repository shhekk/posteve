import { useAppContext } from '@client/lib/hooks/useAppContext';
import { useWidth, useWindowSize } from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { userDetails } from '@client/lib/store/user/user.interface';
import { Routes } from '@client/router/router';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';

export function Home(): React.JSX.Element {
  const { user } = useAppContext();
  const { fetchUserDetails, initUser } = useUserStore();
  const [userDetails, setUserDetails] = useState<userDetails>();
  const { width, height } = useWindowSize();
  const { lg } = useWidth();
  console.log('home rendered');
  useEffect(() => {
    //fetch user from cached res
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
        <Tooltip children={<></>} title="sdlkjfla"></Tooltip>
        <div>
          <h3>other routes</h3>
        </div>
        <div>
          <Link to={Routes.CONNECT}>{Routes.CONNECT}</Link>
          <br />
          <Link to={Routes.LOGOUT}>{Routes.LOGOUT}</Link>
          <br />
          <Link to={Routes.POST}>{Routes.POST}</Link>
          <br />
        </div>
        <p>email: {userDetails && userDetails.email}</p>
        {/* <p>username: {userDetails && userDetails.username}</p> */}
        <p>alsdjflkasjdfl </p>
        <p>{width}</p>
        <p>{height}</p>
        {lg && <p>lg : true</p>}
      </div>
    </>
  );
}
