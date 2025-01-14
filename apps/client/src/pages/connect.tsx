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
export function Connect() {
  return <>connect</>;
}
