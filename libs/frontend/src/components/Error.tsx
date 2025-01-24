import { useRouteError } from 'react-router-dom';

export function ErrorElement() {
  const error = useRouteError();
  console.log(error);
  return <>something went wrong</>;
}
