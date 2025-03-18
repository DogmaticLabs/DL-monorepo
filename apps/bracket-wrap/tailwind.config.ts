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
      },
    },
  },
}

export default config
