import sharedConfig from '@workspace/ui/tailwind.config'
import type { Config } from 'tailwindcss'

const config: Config = {
  // Extend the shared config
  ...sharedConfig,
  // Override or extend specific properties
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
      colors: {
        ...sharedConfig.theme?.extend?.colors,
        // Add the orange color for cinderella stories
        'madness-orange': '#ff6b00',
        'madness-blue': '#0067b1',
      },
      animation: {
        'fade-in': 'fadeIn 1s forwards',
        'bracket-pulse': 'bracketPulse 4s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bracketPulse: {
          '0%': {
            filter: 'invert(0.8) brightness(0.8) sepia(0.5) hue-rotate(170deg) saturate(4)',
            opacity: 0.2,
          },
          '50%': {
            filter: 'invert(0.8) brightness(0.8) sepia(0.5) hue-rotate(170deg) saturate(4)',
            opacity: 0.5,
          },
          '100%': {
            filter: 'invert(0.8) brightness(0.8) sepia(0.5) hue-rotate(170deg) saturate(4)',
            opacity: 0.2,
          },
        },
      },
    },
  },
}

export default config
