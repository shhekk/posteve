import { Loading } from '@client/lib/components';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export function SuspenseWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
}
