import { useWindowSize } from './useWindowSize';

//uses tailwind breakpoint to manage breakpoints
enum TailwindBreakpoint {
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1280,
  xxl = 1536,
}
export const useWidth = () => {
  const { width } = useWindowSize();

  return {
    sm: width >= TailwindBreakpoint.sm,
    md: width >= TailwindBreakpoint.md,
    lg: width >= TailwindBreakpoint.lg,
    xl: width >= TailwindBreakpoint.xl,
    xxl: width >= TailwindBreakpoint.xxl,
  };
};
