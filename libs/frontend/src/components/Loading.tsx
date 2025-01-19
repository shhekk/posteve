import React from 'react';
import { LoaderIcon, Loader2Icon } from 'lucide-react';

const spin =
  '@keyframes spin {from {transform: rotate(0deg)}to {transform: rotate(360deg)}}';

export function Loading(): React.JSX.Element {
  return (
    <div
      style={{
        position: 'fixed',
        margin: 'auto',
        inset: 0,
        //just to make margin auto work set w,h for proper scalling
        width: 'fit-content',
        height: 'fit-content',
      }}
    >
      <Loader2Icon
        style={{
          animation: 'spin 1s linear infinite',
          width: 80,
          height: 80,
        }}
      />
      <style>{spin}</style>
    </div>
  );
}

//@todo add animation to icon
