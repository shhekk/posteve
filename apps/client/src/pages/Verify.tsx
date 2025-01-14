import { useUserStore } from '@client/lib/store/user';
import { red } from '@mui/material/colors';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Verify() {
  const [searchParams] = useSearchParams();
  const [err, setErr] = useState<string | null>();
  const n = useNavigate();
  const { setUserId } = useUserStore();

  useEffect(() => {
    if (!searchParams.get('t')) {
      setErr('token not found.');
    }
    (async () => {
      try {
        const { data } = await customFetch(`/api/auth/verify?t=${t}`);

        if (!data) {
          throw "User Couldn't Verified.";
        }

        await setUserId();
        setTimeout(() => {
          n('/');
        }, 3000);
      } catch (e) {
        setErr(e as string);
        console.log({ verifyUserError: e });
      }
    })();
  }, [n]);

  return (
    <div>
      <div>t: {t}</div>
      <div
        style={{
          background: red[900],
          color: 'white',
          margin: '1rem',
          textAlign: 'center',
          lineHeight: '4rem',
        }}
      >
        {err && <>{err}</>}
      </div>
    </div>
  );
}

const t = new URLSearchParams(window.location.search).get('t');
