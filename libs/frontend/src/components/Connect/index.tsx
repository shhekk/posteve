import { Tooltip } from '@mui/joy';
import { usePlatformList } from '@client/lib/hooks';
import { useCallback, useState } from 'react';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { useAsyncEffect } from '@client/lib/hooks';
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

export function PlatFormList() {
  const { platformList } = usePlatformList(),
    q = new URLSearchParams(useLocation().search);

  const connectReq = useCallback(async (provider: string) => {
    try {
      console.log(provider, '---', `${q.get('code') ? q.get('code') : ''}`);
      const { url, token, err } = (
        await customFetch<{ url: string; token: string; err: any }>(
          `/api/platform/connect/${provider}`,
          {
            method: 'GET',
          }
        )
      ).data;
      console.log({ url, token, err });
      if (err) {
        console.log(err as string);
        alert(err as string);
        return;
      }
      if (!url) {
        //setError
        alert('can`t get url: ');
        return;
      }
      token && sessionStorage.setItem('x-token', token);
      alert(`redirecting to ${provider.toUpperCase()} platform`);
      setTimeout(() => {
        // n(url, { state: { token } });
        // redirect(url);
        window.location.href = url; //ye bhi kr skte hai kyu ki apne aap hi to redirect hoga wapas is app me as i have given redirect_url in linkedin developer app
        //but point is after the user authorized the app they will redirected to /connect/:identifier(linkedin/x/or/anyplatforms)
        //so you need to create a child route
      }, 2000);
    } catch (err) {
      alert('something went wrong');
      console.log(err);
    }
    //so if token exists, state will return back token and we can use it(required for X)
    return;
  }, []);

  return (
    <div
      style={{
        width: '100%',
        // border: '1px solid black',
        padding: '14px 18px',
        //to wrap the element in next row
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {platformList?.length > 0 ? (
        platformList.map((p) => (
          <Tooltip title={p.title} placement="bottom" key={p.key} arrow>
            <div
              // onClick={() => console.log('@todo replace code connect platform')}
              onClick={() => connectReq(p.identifier)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // padding: '4px 8px',
                width: 90,
                cursor: 'pointer',
                // border: '1px solid black',
              }}
            >
              <img
                src={p.logoURL}
                style={{
                  // width: 70,
                  width: '65%',
                  // height: '77%',
                  borderRadius: '1rem',
                }}
              />
              <div
                style={{
                  // backgroundColor: 'pink',
                  // width: '105%', //this caused the text to start from left
                  maxWidth: '105%', //whereas this makes text at center while truncate enabled
                  // -- may be because this force default width to be content width(and flex-col items-center makes it center)
                  margin: '10px 10px 0px',
                  // paddingLeft: '18px',
                  //somehow truncate is related to display block
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 16,
                  // lineHeight: 2,
                  // border: '4px solid black',
                }}
              >
                {p.title}
              </div>
            </div>
          </Tooltip>
        ))
      ) : (
        <div>Unable to fetch platforms</div>
      )}
      <Outlet />
    </div>
  );
}

//need to hande different platform connection like linkedin sends code in query, x sends oauth_token in query and so on
//challenge is that different platform sends different query-parameters

export function AfterConnect() {
  let { provider } = useParams(),
    [data, setData] = useState<string>(),
    [searchParams] = useSearchParams(), //.entries() -> iterator fn which can iterate over each keys
    params = Object.fromEntries(searchParams.entries()), //
    n = useNavigate();

  let mount = false;
  useAsyncEffect(async () => {
    if (mount) {
      if (provider === 'x') {
        params = {
          ...params,
          code: params.oauth_verifier,
          token: params.oauth_token,
        };
      }
      try {
        console.log('params::::::;', params);
        const {
          data: d,
          err,
          error,
        } = (
          await customFetch(`/api/platform/connect/${provider}`, {
            method: 'POST',
            data: params,
          })
        ).data;
        if (err) {
          setData(JSON.stringify(error, null, 2));
          console.log('ye to galat hai', error);
          alert('something went wrong');
        }
        setData(JSON.stringify(d));
        console.log('resultant data from code is ', d);
      } catch (error) {
        console.log('errror<<<<>>>>', error);
      }
      n('/connect');
      return;
    }
    mount = true;
  }, []);
  return (
    <>
      this is after connect component of
      {searchParams.toString()}
      <br />
      <b>resultan data: </b>
      <p>{data}</p>
    </>
  );
}

function providerManager(p: { provider: string }): {
  code?: string;
  token?: string;
} {
  let searchParams = useSearchParams(useLocation().search),
    params = Object.fromEntries(searchParams.entries()),
    { provider } = p,
    n = useNavigate();

  if (provider === 'x') {
    params = {
      ...params,
      code: params.oauth_token,
      verifier: params.oauth_verifier,
    };
  }
  return { code: '', token: '' };
}
