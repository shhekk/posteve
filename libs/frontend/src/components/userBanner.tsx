import { asdf } from '@web/const';
import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import { useUserStore } from '../store/user';
import { DropdownMenu } from './DropdownMenu';
import { useNavigate } from 'react-router-dom';
import { BotIcon, Icon, LogOutIcon } from 'lucide-react';
import { customFetch } from '@posteve/utils/fetch/customFetch';

export function UserBanner(p: any) {
  const { getUsername, deleteUser } = useUserStore();
  const username = getUsername();
  const n = useNavigate();
  const navigateToProfile = () => {
    n('/connect');
  };
  const logoutHandler = async () => {
    const { data, status, statusText } = await customFetch(
      '/api/auth/signout',
      { method: 'GET' }
    );
    if (!data) {
      // console.log('error:', { status: status, cause: statusText });
      alert('something went wrong');
    } else {
      await deleteUser();
      alert('Logged out successfully, redirecting to auth page.');
      console.log('Logged out successfully, redirecting to auth page');
      setTimeout(() => {
        n('/');
      }, 2000);
    }
  };
  return (
    <div
      style={{
        // position: 'relative',
        // flexShrink: 0,
        // paddingInline: 4,
        // padding:4,
        // paddingTop: 4,
        // paddingBottom: 4,

        // background: 'red',
        paddingInline: 4,
        width: '100%',
        // backgroundColor: p.collapse ? 'white' : '',
      }}
    >
      <Dropdown>
        <MenuButton
          variant="plain"
          sx={{
            // border: '1px solid blue',
            roots: 'div',
            width: '100%',
            margin: '4px 0px' ,

            // backgroundColor: 'gold',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: p.collapse ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: '1rem',
            // padding: p.collapse ? '1px' : '',
          }}
        >
          {/* <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '1rem',
            }}
          > */}
          <div
          // style={{width:24, height:24}} //or set the icon display block to fill the entire div -- otherwise adds some extra pixel to the padding
          >
            <BotIcon
              style={{
                display: 'block',
                width: 24,
                height: 'auto',
                color: 'rgb(31 41 55)',
              }}
            />
          </div>
          {!p.collapse && (
            <span
              style={{
                fontSize: 17, //text-lg
                //to enable ... if the word exceeds the width (truncate)
                // so if username is like "goblin asdfasdfasd", -> goblin asd...
                overflow: 'hidden', //
                whiteSpace: 'nowrap', //turn off the font wrap, to avoid new line after white space
                textOverflow: 'ellipsis', //the '...' at last ( goblin... )
                // flexShrink: 1,
              }}
            >
              {username}
              {/* {asdf} */}
              {/* width depends on content which is bad you don't know hwo long content can be. */}
            </span>
          )}
          {/* </div> */}
        </MenuButton>
        <Menu placement="bottom-start">
          <MenuItem onClick={navigateToProfile}>
            <BotIcon /> <span>Profile</span>
          </MenuItem>
          <MenuItem onClick={logoutHandler}>
            <LogOutIcon />
            <span>Logout</span>
          </MenuItem>
        </Menu>
      </Dropdown>
    </div>
  );
}
