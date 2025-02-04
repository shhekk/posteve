import { Tooltip } from '@mui/joy';
import { usePlatformList } from '@client/lib/hooks';
import { useCallback, useState } from 'react';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { useAsyncEffect } from '@client/lib/hooks';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

export function PlatFormList() {
  const { platformList } = usePlatformList(),
    q = new URLSearchParams(useLocation().search),
    n = useNavigate(),
    [provider, setProvider] = useState<string>();

  const connectReq = useCallback(async (provider: string) => {
    console.log(provider, '---', `${q.get('code') ? q.get('code') : ''}`);
    // ('GET /api/platform/connect/:identifier  ');
    const { url } = (
      await customFetch<{ url: string }>(`/api/platform/connect/${provider}`, {
        method: 'GET',
      })
    ).data;
    if (!url) {
      //setError
      alert('can`t get url: ');
      return;
    }
    alert(`redirecting to ${provider.toUpperCase()} platform`);
    setTimeout(() => {
      // n(url, { state: { token } });
      // redirect(url);
      window.location.href = url; //ye bhi kr skte hai kyu ki apne aap hi to redirect hoga wapas is app me as i have given redirect_url in linkedin developer app
      //but point is after the user authorized the app they will redirected to /connect/:identifier(linkedin/x/or/anyplatforms)
      //so you need to create a child route
    }, 2000);
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

//this component will just render toast on dom which indicates successfull connection

export function AfterConnect() {
  const { provider } = useParams(),
    q = new URLSearchParams(useLocation().search),
    [data, setData] = useState<string>(),
    [code, token] = [q.get('code'), q.get('token')],
    n = useNavigate();

  let mount = false;
  useAsyncEffect(async () => {
    if (mount) {
      if (code && provider) {
        try {
          const { data: d, err } = (
            await customFetch(`/api/platform/connect/${provider}`, {
              method: 'POST',
              data: { code, token },
            })
          ).data;
          if (err) {
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
      mount = false;
    }
    mount = true;
  }, [code]);
  return (
    <>
      this is after connect component of
      {`/api/platform/connect/${provider}?code=${code}${
        token && '&token=' + token
      }`}
      <br />
      <b>resultan data: </b>
      <p>{data}</p>
    </>
  );
}
