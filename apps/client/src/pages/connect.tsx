import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { PlatForms } from '@client/lib/components/Connect';
import { Tooltip } from '@mui/joy';

export function Connect() {
  const [err, setErr] = useState<boolean>(),
    [data, setData] = useState<string>(),
    { provider } = useParams(),
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
            <p style={{ fontSize: 24, fontWeight: 'bolder' }}>
              Connect Platform
            </p>
          </div>
          <div
            style={{
              width: '100%',
              // border: '1px solid black',
              padding: '14px 18px',
              //to wrap the element in next row
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              // background: 'yellow',
            }}
          >
            {PlatForms.map((p) => (
              <Tooltip title={p.title} placement="bottom" arrow>
                <div
                  onClick={() => console.log('@todo replace code connect platform')}
                  key={p.key}
                  // title={p.title}
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
                    src={p.logo}
                    style={{
                      // width: 70,
                      width: '77%',
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
                      margin: '5px 10px 0 10px',
                      // paddingLeft: '18px',
                      //somehow truncate is related to display block
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 16,
                      lineHeight: 2,
                      // border: '4px solid black',
                    }}
                  >
                    {p.title}
                  </div>
                </div>
              </Tooltip>
            ))}
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
