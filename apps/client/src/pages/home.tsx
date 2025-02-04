import { useAppContext } from '@client/lib/hooks/useAppContext';
import {
  useAsyncEffect,
  usePlatformList,
  useWidth,
  useWindowSize,
} from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { userDetails } from '@client/lib/store/user/user.interface';
import { Routes } from '@client/router';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { customFetch } from '@posteve/utils/fetch/customFetch';

export function Home(): React.JSX.Element {
  const { user } = useAppContext();
  const { fetchUserDetails, initUser } = useUserStore();
  const [userDetails, setUserDetails] = useState<userDetails>();
  const { width, height } = useWindowSize();
  const { lg } = useWidth();
  const [d, setD] = useState<any>();
  // const { platformList } = usePlatformList();
  // console.log('home rendered', platformList);
  useEffect(() => {
    //fetch user from cached res
    fetchUserDetails().then((d) => {
      if (d) {
        setUserDetails(d);
      }
    });

  // customFetch('/api/platform').then((d) => {
  //   console.log(d);
  //   setD(JSON.stringify(d.data));
  // });
  }, []);
  useAsyncEffect(async () => {
    const { data } = await customFetch('/api/platform');
    if (data) {
      setD(JSON.stringify(data));
    }
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
        <p>{d}</p>
        {/* <p>{JSON.stringify(platformList)}</p> */}
        {lg && <p>lg : true</p>}
      </div>
    </>
  );
}
