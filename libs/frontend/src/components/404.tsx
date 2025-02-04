import { Routes } from '@client/router';
import { NavLink } from 'react-router-dom';

export function NotFound() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        margin: 'auto',
        width: 'fit-content',
        // height: 'fit-content',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: 100,
          marginInline: 30,
          fontWeight: 'lighter',
        }}
      >
        <img
          //John Travolta Meme
          src="https://web.archive.org/web/20210411201151/https://thumbs.gfycat.com/ReliableSelfreliantIndigobunting.webp"
          style={{ width: 300 }}
        />
        <h2>Page Not Found</h2>
        <h3>
          The requested page cannot be found. Return to the{' '}
          <u>
            <NavLink
              to={Routes.HOME}
              style={{
                // textDecoration: 'none',
                color: '#3aa8ff',
                cursor: 'pointer',
                background: 'none',
              }}
            >
              homepage.
            </NavLink>
          </u>
        </h3>
      </div>
    </div>
  );
}
