import { Loading, Navigation, SuspenseWrapper } from '@client/lib/components';
import { useWidth } from '@client/lib/hooks';
import { useUserStore } from '@client/lib/store/user';
import { Button } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RootLayout() {
  const [init, setInit] = useState(false);
  const { user } = useUserStore();
  const { lg } = useWidth();
  const [collapse, setCollapse] = useState<boolean>(
    localStorage.getItem('collapse') === 'true'
  );

  useEffect(() => {
    !lg ? setCollapse(localStorage.getItem('collapse') === 'true') : setCollapse(true);
  }, [lg]);

  useEffect(() => {
    console.log('rootlayout rendered', user);
    if (!user) {
      //i think this is not of any use
      alert(' check kar kha se aaya ye alert ');
      console.log('user not found so wont render: (reloading page)... ', user);
      window.location.href = '/'; //ye apni jgh shi hai it will do hard reload and undefined user need to catched in app.tsx
      //bsdk if user is undefined how user is getting redirect to this.
      return;
    }
    setInit(true);
  }, [user]);

  return init ? (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          // background: 'pink',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginInline: 'auto',
          paddingLeft: collapse ? '4rem' : '14rem',
        }}
      >
        {/* left side bar */}
        {/*nav + collapse btn  @todo learn prefer-color-scheme in css */}
        <aside
          style={{
            // background: 'rgb(250,250,250) ',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'flex-start',
            // alignItems: 'flex-start',
            userSelect: 'none',
            //stayed navigation -- always on left-side.
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            zIndex: 2, //so that main contain doesn't overlap
            // only this time strict width applied -- rest of content inside will manage with width 100%
            // boxShadow: horizontal vertical blur spread
            paddingInline: !collapse ? '16px' : '8px',
            width: !collapse ? '14rem' : '4rem',
          }}
        >
          {/*react doesnot support !important directly  */}
          <div
            style={{
              // backgroundColor:'red',
              padding: '24px 0',
              height: 'auto !important',
              //wdith full so that content not move outside parent
              width: '100%',
            }}
          >
            <Navigation collapse={collapse} />
          </div>

          <div
            className="collapse-btn"
            style={{
              // backgroundColor: 'blue',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              flexGrow: 1,
              // border: '1px solid blue',
            }}
            //or apply rel-absolute and make child bottom: 0;
          >
            <div
              onClick={() => {
                //@todo fix collapse localstorage -- or -- set collpase in zustand appearence store
                setCollapse((prev) => {
                  md && localStorage.setItem('collapse', String(!prev));
                  return !prev;
                });
              }}
              style={{
                // backgroundColor: 'red',
                // border: '1px solid red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // width: 'fit-content',
                width: '100%',
              }}
            >
              <Button
                style={{
                  // border: '1px solid blue',
                  cursor: 'pointer',
                  display: 'flex',
                  // https://i.stack.imgur.com/IE0Zw.png
                  // flexDirection: 'row', //ye to default hi hai
                  // flexGrow: 1,
                  alignItems: 'center',
                  gap: 4,
                  margin: '64px 0px',
                  marginLeft: !collapse ? '-6rem' : '',
                  padding: !collapse ? '10px 2px' : 10,
                }}
              >
                {collapse ? (
                  <ChevronRightIcon
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                ) : (
                  <>
                    <ChevronLeftIcon
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <div>Collapse</div>
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>
        <main
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            // border: '1rem solid red',
          }}
        >
          {/* <div>height will inc automattically depending on content height</div> */}
          <SuspenseWrapper />
        </main>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

/**
 * best way to center a div anurag singh bam
 * position fixed -- attach to viewport
 * inset 0 -- top.bottom.left.right -> 0
 * margin auto
 * min-h,w -- fit-content
 * set w,h for this to work
 * parent dimension is not req. as it is relative to viewport
 */
