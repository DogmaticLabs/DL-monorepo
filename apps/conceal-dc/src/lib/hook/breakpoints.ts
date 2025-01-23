import { useMediaQuery } from 'usehooks-ts'

// Tailwind's default breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const useBreakpoints = () => {
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm})`)
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`)
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg})`)
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl})`)
  const xxl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`)

  return {
    sm, // >= 640px
    md, // >= 768px
    lg, // >= 1024px
    xl, // >= 1280px
    xxl, // >= 1536px
    // Convenience getters for specific ranges
    isMobile: !sm, // < 640px
    isTablet: sm && !lg, // >= 640px && < 1024px
    isDesktop: lg, // >= 1024px
    current: xxl ? '2xl' : xl ? 'xl' : lg ? 'lg' : md ? 'md' : sm ? 'sm' : 'xs',
  } as const
}
