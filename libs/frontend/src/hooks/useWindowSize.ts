import { useEffect, useState } from 'react';

// //returns current width and height
// //issue this isn't reloading on width or dimension change
// //window.innerHeight and window.innerWidth cannot be used as dependencies in the dependency array because they are primitive values that won't trigger a re-run of the effect when the window is resized. Instead, you should use an event listener for the resize event.
const isBrowser = !!(typeof window !== 'undefined');

export const useWindowSize = () => {
  const [dim, setDim] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const setD = () =>
      setDim({ width: window.innerWidth, height: window.innerHeight });
    if (isBrowser) {
      setDim({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', setD);
    }
    return () => window.removeEventListener('resize', setD);
  }, []);

  return dim;
};
