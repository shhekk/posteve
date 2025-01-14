import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { useUserStore } from '@client/lib/store/user';
import { useNavigate } from 'react-router-dom';

export function Logout(): React.JSX.Element {
  const n = useNavigate();
  const { deleteUser, user } = useUserStore();
  console.log('logout rendered');

  const clickHandler = async () => {
    const { data, status, statusText } = await customFetch(
      '/api/auth/signout',
      { method: 'GET' }
    );
    if (!data) {
      // console.log('error:', { status: status, cause: statusText });
      alert('something went wrong');
    } else {
      // console.log({ Cookieshouldbenill: data });
      await deleteUser();
      alert('Logged out successfully, redirecting to auth page');
      console.log('Logged out successfully, redirecting to auth page', user);
      setTimeout(() => {
        n('/');
      }, 2000);
    }
  };
  return (
    <>
      <h1>logout</h1>
      <Button onClick={clickHandler}>Logout</Button>
    </>
  );
}
