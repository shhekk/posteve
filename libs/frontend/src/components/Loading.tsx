import React from 'react';
import { LoaderIcon, Loader2Icon } from 'lucide-react';

const spin =
  '@keyframes spin {from {transform: rotate(0deg)}to {transform: rotate(360deg)}}';

export function Loading(): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Loader2Icon
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{spin}</style>
    </div>
  );
}

//@todo add animation to icon
