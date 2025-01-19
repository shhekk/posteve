import { Dropdown, ExtendMenuItem, Menu, MenuButton, MenuItem } from '@mui/joy';
import { MenuItemTypeMap } from '@mui/material';
import { ComponentProps } from 'react';

interface menuItems {
  onClick: () => void;
  title: string;
}

export function DropdownMenu(p: {
  title: string | React.ReactNode;
  menuItems: menuItems[];
}) {
  return (
    <div>
      <Dropdown>
        <MenuButton>{p.title}</MenuButton>
        <Menu>
          {p.menuItems.map((item, index) => (
            <MenuItem {...item} key={index}></MenuItem>
          ))}
        </Menu>
      </Dropdown>
    </div>
  );
}

// export function DropdownMenu() {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         background: 'brown',
//         position: 'absolute', //so that we can manually set the dimensions
//         // top: '2rem',
//         // left: '2rem',
//         width: '100%',
//         padding: 10,
//       }}
//     >
//       <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//         <li style={{}}>ddm</li>
//         <li style={{}}>ddm</li>
//         <li style={{}}>ddm</li>
//       </ul>
//     </div>
//   );
// }

// export function DropdownMenu(p: {
//   buttonText: string;
//   content: React.ReactNode;
// }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//       }}
//     >
//       <ul>
//         <li>hello</li>
//       </ul>
//     </div>
//   );
// }

// export function DropdownButton(p: { children: React.ReactNode }) {
//   return <div style={{}}>{p.children}</div>;
// }

// export function DropContent(p: {
//   buttonText: string;
//   content: React.ReactNode;
// }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//       }}
//     >
//       <ul>
//         <li>hello</li>
//       </ul>
//     </div>
//   );
// }
