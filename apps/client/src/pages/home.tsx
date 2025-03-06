import { useAppContext } from '@client/lib/hooks/useAppContext';
import { useAsyncEffect, useWidth, useWindowSize } from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { userDetails } from '@client/lib/store/user/user.interface';
import { Routes } from '@client/router';
import React, { useEffect, useState } from 'react';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { PlatFormList } from '@client/lib/components';
import { Outlet } from 'react-router-dom';

export function Home() {
  const { sm } = useWidth();

  return (
    <>
      {/* <div style={{ background: 'yellow', maxWidth: '50rem', width: '50rem', marginInline: '1.5rem', }} >
        <div>create post</div>
        <div>date list</div>
      </div> */}
      <ContentBox>
        <div>home</div>
        <div>calendar</div>
      </ContentBox>
    </>
  );
}

export function ContentBox(p: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  // the width is dependent on parent width so give width to parent of this component.
  return (
    <>
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
            ...p.style,
          }}
        >
          {p.children}
        </div>
      </div>
    </>
  );
}
