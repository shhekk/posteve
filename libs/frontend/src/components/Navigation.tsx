import { Routes } from '@client/router/router';
import { Tooltip } from '@mui/material';
import { HomeIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  title: string;
  key: string;
  icon: React.ReactNode;
}
export function Navigation(props: any) {
  const Home: NavItem = {
    to: Routes.HOME,
    title: 'Home',
    key: 'header-home',
    icon: <HomeIcon />,
  };
  const Connect: NavItem = {
    to: Routes.CONNECT,
    title: 'Connect',
    key: 'header-connect',
    icon: <HomeIcon />,
  };
  const Post: NavItem = {
    to: Routes.POST,
    title: 'Post',
    key: 'header-post',
    icon: <HomeIcon />,
  };

  const navList: NavItem[] = [Home, Connect, Post];

  return (
    <header
      style={{
        background: 'white',
        height: '100%',
        width: '100%',
        overflow: 'auto',
        padding: '1rem ',
      }}
    >
      <NavLink to={'/profile'}>user banner</NavLink>
      <div>
        {navList.map((n) => (
          <NavLink to={n.to} key={n.key}>
            <div>
              <Tooltip title={n.title} placement='right' arrow>
                <>{n.icon}</>
              </Tooltip>
              <span style={{ marginLeft: '3rem' }}>{n.title}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </header>
  );
}
