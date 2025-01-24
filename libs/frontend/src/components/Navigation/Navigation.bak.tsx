import { NavLink } from 'react-router-dom';
import { UserBanner } from './userBanner';
import navItems from './NavItems';

export function Navigation(p: any) {
  const navList = navItems();

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
          // padding: '6px 4px',
          width: '100%',
          //padding: 'topbottom rightleft'
        }}
      >
        {navList.map((n) => (
          <NavLink
            to={n.to}
            key={n.key}
            style={{
              background: 'red',
              marginTop: 6,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: !p.collapse ? 'flex-start' : 'center',
              alignItems: 'center',
              borderRadius: '1rem',
              padding: !p.collapse ? '10px 16px' : 10,
              fontSize: 18,
              textDecoration: 'none',
              // backgroundColor: 'red',
            }}
          >
            <div
              style={
                p.collapse
                  ? {
                      width: 24,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
                  : {
                      width: 24,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
              }
            >
              {n.icon}
            </div>
            {/* {n.icon} */}
            {/* <Tooltip title={n.title} placement="right" arrow>
              </Tooltip> */}
            {!p.collapse && (
              <div
                style={{
                  marginLeft: 12,
                  //truncate -- for this to work, width should be fixed or not more that the width it will trucate
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

// import { Dropdown } from '@mui/base/Dropdown';
// // import { MenuButton } from '@mui/base/MenuButton';
// // import { MenuItem } from '@mui/base/MenuItem';
// import { Menu } from '@mui/base/Menu';
// function UserBanner() {
//   const { getUserByName } = useUserStore();
//   const createHandleMenuClick = (name: string) => {
//     console.log({ name });
//   };
//   const check = () => console.log('clickeddddddddddd');
//   // return (
//   // <div>
//   //   <Dropdown>
//   //     hello
//   //     {/* <MenuButton slots={{ root: 'div' }}> */}
//   //     <MenuButton slots={{ listbox: Listbox }}>
//   //       <div style={{ background: 'blue', margin: '2rem' }}>
//   //         {getUserByName()}
//   //       </div>
//   //     </MenuButton>
//   //     <Menu style={{ zIndex: '9999', padding: '1rem' }}>
//   //       <MenuItem onClick={check}>check</MenuItem>
//   //       <MenuItem onClick={check}>check</MenuItem>
//   //     </Menu>
//   //   </Dropdown>
//   // </div>
//   // );
// }

// import * as React from 'react';
// import { MenuListboxSlotp } from '@mui/base/Menu';
// import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
// import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
// import { styled } from '@mui/system';
// import { CssTransition } from '@mui/base/Transitions';
// import { PopupContext } from '@mui/base/Unstable_Popup';
// import zIndex from '@mui/material/styles/zIndex';
// function MenuIntroduction() {
//   const { getUserByName } = useUserStore();
//   const createHandleMenuClick = (menuItem: string) => {
//     return () => {
//       console.log(`Clicked on ${menuItem}`);
//     };
//   };
//   return (
//     <div style={{ zIndex: 9999 }}>
//       <Dropdown>
//         <MenuButton>{getUserByName()}</MenuButton>
//         <Menu
//           slots={{ listbox: 'animateTransform' }}
//           style={{ zIndex: 9999, backgroundColor: 'white' }}
//         >
//           <MenuItem onClick={createHandleMenuClick('Profile')}>
//             Profile
//           </MenuItem>
//           <MenuItem onClick={createHandleMenuClick('Language settings')}>
//             Language settings
//           </MenuItem>
//           <MenuItem onClick={createHandleMenuClick('Log out')}>
//             Log out
//           </MenuItem>
//         </Menu>
//       </Dropdown>
//     </div>
//   );
// }

// const blue = {
//   50: '#F0F7FF',
//   100: '#C2E0FF',
//   200: '#99CCF3',
//   300: '#66B2FF',
//   400: '#3399FF',
//   500: '#007FFF',
//   600: '#0072E6',
//   700: '#0059B3',
//   800: '#004C99',
//   900: '#003A75',
// };

// const grey = {
//   50: '#F3F6F9',
//   100: '#E5EAF2',
//   200: '#DAE2ED',
//   300: '#C7D0DD',
//   400: '#B0B8C4',
//   500: '#9DA8B7',
//   600: '#6B7A90',
//   700: '#434D5B',
//   800: '#303740',
//   900: '#1C2025',
// };

// const Listbox = styled('ul')(
//   ({ theme }) => `
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-size: 0.875rem;
//   box-sizing: border-box;
//   padding: 6px;
//   margin: 12px 0;
//   min-width: 200px;
//   border-radius: 12px;
//   overflow: auto;
//   outline: 0;
//   background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//   border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//   color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
//   box-shadow: 0 4px 30px ${
//     theme.palette.mode === 'dark' ? grey[900] : grey[200]
//   };
//   z-index: 1;

//   .closed & {
//     opacity: 0;
//     transform: scale(0.95, 0.8);
//     transition: opacity 200ms ease-in, transform 200ms ease-in;
//   }

//   .open & {
//     opacity: 1;
//     transform: scale(1, 1);
//     transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
//   }

//   .placement-top & {
//     transform-origin: bottom;
//   }

//   .placement-bottom & {
//     transform-origin: top;
//   }
//   `
// );

// const AnimatedListbox = React.forwardRef(function AnimatedListbox(
//   p: MenuListboxSlotProps,
//   ref: React.ForwardedRef<HTMLUListElement>
// ) {
//   const { ownerState, ...other } = p;
//   const popupContext = React.useContext(PopupContext);

//   if (popupContext == null) {
//     throw new Error(
//       'The `AnimatedListbox` component cannot be rendered outside a `Popup` component'
//     );
//   }

//   const verticalPlacement = popupContext.placement.split('-')[0];

//   return (
//     <CssTransition
//       className={`placement-${verticalPlacement}`}
//       enterClassName="open"
//       exitClassName="closed"
//     >
//       <Listbox {...other} ref={ref} />
//     </CssTransition>
//   );
// });

// const MenuItem = styled(BaseMenuItem)(
//   ({ theme }) => `
//   list-style: none;
//   padding: 8px;
//   border-radius: 8px;
//   cursor: default;
//   user-select: none;

//   &:last-of-type {
//     border-bottom: none;
//   }

//   &:focus {
//     outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
//     background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
//     color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
//   }

//   &.${menuItemClasses.disabled} {
//     color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
//   }
//   `
// );

// const MenuButton = styled(BaseMenuButton)(
//   ({ theme }) => `
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-weight: 600;
//   font-size: 0.875rem;
//   line-height: 1.5;
//   padding: 8px 16px;
//   border-radius: 8px;
//   transition: all 150ms ease;
//   cursor: pointer;
//   background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//   border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//   color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
//   box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

//   &:hover {
//     background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
//     border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
//   }

//   &:active {
//     background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
//   }

//   &:focus-visible {
//     box-shadow: 0 0 0 4px ${
//       theme.palette.mode === 'dark' ? blue[300] : blue[200]
//     };
//     outline: none;
//   }
//   `
// );
