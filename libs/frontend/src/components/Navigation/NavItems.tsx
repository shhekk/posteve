import { Routes } from '@client/router';
import { CalendarSyncIcon, HomeIcon, Rss } from 'lucide-react';
interface NavItem {
  to: string;
  title: string;
  key: string;
  icon: React.ReactNode;
}
export default function navItems() {
  let iconStyle: React.CSSProperties = {
    width: 24,
    height: 'auto',
    display: 'block', //to completely cover the parent element. -- otherwise adds extra pixels by parent
    color: 'rgb(31 41 55)',
  };
  // const navLists: NavItem[] = [
  return [
    {
      to: Routes.HOME,
      title: 'Home',
      key: 'header-home',
      icon: <HomeIcon style={iconStyle} />,
    },
    {
      to: Routes.CONNECT,
      title: 'Connect',
      key: 'header-connect',
      icon: <Rss style={iconStyle} />,
    },
    {
      to: Routes.POST,
      title: 'Post',
      key: 'header-post',
      icon: <CalendarSyncIcon style={iconStyle} />,
    },
  ] as NavItem[];
  // return navLists;
}
