import { Routes } from '@client/router';
import { collapseClasses, Tooltip } from '@mui/material';
import {
  CalendarSyncIcon,
  Handshake,
  HomeIcon,
  Rss,
  Share,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { UserBanner } from './userBanner';

interface NavItem {
  to: string;
  title: string;
  key: string;
  icon: React.ReactNode;
}
export function Navigation(p: any) {
  let iconStyle: React.CSSProperties = {
    width: 24,
    height: 'auto',
    display: 'block', //to completely cover the parent element. -- otherwise adds extra pixels by parent
    color: 'rgb(31 41 55)',
  };
  const Home: NavItem = {
    to: Routes.HOME,
    title: 'Home',
    key: 'header-home',
    icon: <HomeIcon style={iconStyle} />,
  };
  const Connect: NavItem = {
    to: Routes.CONNECT,
    title: 'Connect',
    key: 'header-connect',
    icon: <Rss style={iconStyle} />,
  };
  const Post: NavItem = {
    to: Routes.POST,
    title: 'Post',
    key: 'header-post',
    icon: <CalendarSyncIcon style={iconStyle} />,
  };

  const navList: NavItem[] = [Home, Connect, Post];

  return (
    <header
      style={{
        // background: 'red',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        //flex flexcol for userbanner and navlinks
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <UserBanner collapse={p.collapse} />
      <div
        style={{
          // border: '1px solid blue',
          padding: '6px 2px',
          // width: '100%',
          //padding: 'topbottom rightleft'
        }}
      >
        {navList.map((n) => (
          <NavLink
            to={n.to}
            key={n.key}
            style={{
              // background: 'red',
              marginTop: 6,
              display: p.collapse ? 'block' : 'flex', //so while collapse navlink takes whole space without some extra px
              flexDirection: 'row',
              justifyContent: !p.collapse ? 'flex-start' : 'center',
              alignItems: 'center',
              borderRadius: '1rem',
              padding: !p.collapse ? '8px 16px' : 8,
              fontSize: 18,
              textDecoration: 'none',
              // backgroundColor: 'red',
            }}
          >
            {/* @todo wrap this in tooltip to get title on Hover */}
            <Tooltip title={n.title} placement="right" arrow>
              <div
                style={
                  p.collapse
                    ? {
                        width: 24,
                        display: p.collapse ? 'block' : 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 18,
                      }
                    : {}
                }
              >
                {n.icon}
              </div>
            </Tooltip>
            {/* {n.icon} */}
            {/* <Tooltip title={n.title} placement="right" arrow>
              </Tooltip> */}
            {!p.collapse && (
              <div
                style={{
                  marginLeft: 12,
                  //truncate -- for this to work the width should be fixed or not more that the width it will trucate
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {n.title}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
