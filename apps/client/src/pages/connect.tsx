import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { PlatFormList } from '@client/lib/components/Connect';
import { Tooltip } from '@mui/joy';
import { usePlatformList } from '@client/lib/hooks';

export function Connect() {
  const [err, setErr] = useState<boolean>(),
    [data, setData] = useState<string>(),
    // { provider } = useParams(),
    // [provider, setProvider] = useState<Providers>()
    code = new URLSearchParams(useLocation().search).get('code');

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '64rem', //so content doesn't grow more than it
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 0',
      }}
    >
      <div style={{ width: '100%', paddingInline: 24 }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '12px 18px',
            backgroundColor: 'white',
            borderRadius: '1rem',
            // border: '1px solid black',
          }}
        >
          <div
            style={{
              margin: '10px 18px',
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 'bolder' }}>
              Connect Platform
            </p>
          </div>
          <div
            style={{
              width: '100%',
              margin: '14px 18px',
              // background: 'yellow',
            }}
          >
            <PlatFormList />
          </div>
        </div>
      </div>
    </section>
  );
}
// import { useEffect, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';

// export default function Connect(): JSX.Element {
//   const [err, setErr] = useState<boolean>(false);
//   const [data, setdata] = useState<string>('');

//   const { provider } = useParams();
//   const code = new URLSearchParams(useLocation().search).get('code');

//   // console.log('component rendered')
//   let isMount = false;
//   useEffect((): any => {
//     // console.log('use effect rendered')
//     if (isMount) {
//       // console.log('mounted')
//       (async () => {
//         const res = (
//           await axios(`/api/platform/connect/${provider}?code=${code}`, {
//             method: 'POST',
//             withCredentials: true,
//             validateStatus: () => true,
//             headers: {
//               auth: token,
//             },
//           })
//         ).data;
//         const { data, err, } = res
//         console.log({ res });
//         if (err) setErr(true);
//         setdata(data);
//       })();
//     }
//     return () => {
//       // console.log('useEffect retrun run')

//       isMount = true;
//     }
//   }, []);

//   return (
//     <>
//       <div>code: {code}</div>
//       {err && <div>err: {err}</div>}
//       {data && <div>data: {data}</div>}
//     </>
//   );
// }

// //http://127.0.0.1:2020/callback/linkedin?code
