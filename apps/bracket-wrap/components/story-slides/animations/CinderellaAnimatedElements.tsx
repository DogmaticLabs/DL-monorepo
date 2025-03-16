import { motion } from 'motion/react'
import Image from 'next/image'

// Common types for positioning
type PositionProps = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  isExiting?: boolean
}

// Bracket element component
type BracketElementProps = PositionProps & {
  size?: string
  opacity?: number
  rotateDirection?: 'clockwise' | 'counterclockwise'
  color?: 'blue' | 'black' | 'white'
  bracketType?: 'left' | 'right' | 'full'
  delay?: number // Added delay prop for staggered animations
}

export const AnimatedBracket = ({
  top,
  bottom,
  left,
  right,
  size = '12',
  opacity = 0.8,
  rotateDirection = 'clockwise',
  color = 'blue',
  bracketType = 'left',
  isExiting = false,
  delay = 0, // Default delay is 0
}: BracketElementProps) => {
  // Define exit animation
  const exitAnimation = {
    y: top ? -200 : 200,
    x: right ? 100 : -100,
    opacity: 0,
    scale: 0.2,
    rotate: 180,
  }

  // Determine if we need to flip the bracket horizontally
  const shouldFlipHorizontal = bracketType === 'right'

  return (
    <motion.div
      className='absolute'
      style={{
        top: top || undefined,
        bottom: bottom || undefined,
        left: left || undefined,
        right: right || undefined,
        width: `${size}rem`,
        height: `${size}rem`,
        opacity: opacity,
        transform: shouldFlipHorizontal ? 'scaleX(-1)' : undefined,
      }}
      initial={{ y: top ? -100 : 100, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              y: 0,
              opacity: opacity,
              rotate: rotateDirection === 'clockwise' ? [0, 3, 0] : [0, -3, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.5, ease: 'easeOut' }
          : {
              y: { duration: 0.7, ease: 'easeOut', delay: delay },
              rotate: {
                duration: rotateDirection === 'clockwise' ? 3 : 3.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: delay + 0.2,
              },
              opacity: { duration: 0.5, delay: delay },
            }
      }
    >
      {/* Use the provided bracket image directly */}
      <Image
        src='/bracket.png'
        alt='March Madness bracket'
        width={100}
        height={100}
        className='w-full h-full object-contain'
      />
    </motion.div>
  )
}

// Basketball element
type BasketballProps = PositionProps & {
  size?: string
  opacity?: number
  bounceHeight?: 'low' | 'medium' | 'high'
  delay?: number // Added delay prop
}

export const AnimatedBasketball = ({
  top,
  bottom,
  left,
  right,
  size = '14',
  opacity = 0.7,
  bounceHeight = 'medium',
  isExiting = false,
  delay = 0, // Default delay is 0
}: BasketballProps) => {
  // Define exit animation
  const exitAnimation = {
    y: top ? -200 : 200,
    x: right ? 150 : -150,
    opacity: 0,
    scale: 0.2,
    rotate: right ? 180 : -180,
  }

  // Map bounce height to actual values (reduced from previous values)
  const bounceMap = {
    low: 10,
    medium: 15,
    high: 25,
  }
  const bounceValue = bounceMap[bounceHeight] || bounceMap.medium

  // Calculate size in pixels for emoji
  const sizeInPx = parseInt(size) * 16 // Approximate conversion from rem to px

  return (
    <motion.div
      className='absolute'
      style={{
        top: top || undefined,
        bottom: bottom || undefined,
        left: left || undefined,
        right: right || undefined,
        width: `${size}rem`,
        height: `${size}rem`,
        fontSize: `${size}rem`,
        lineHeight: 1,
        opacity: opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0, y: -50 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              scale: 1,
              opacity: opacity,
              rotate: [0, 60, 120, 180, 240, 300, 360],
              y: [0, bounceValue, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.8, ease: 'easeOut' }
          : {
              scale: { duration: 0.5, ease: 'easeOut', delay: delay },
              rotate: {
                duration: 8, // Slower rotation
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                delay: delay + 0.3,
              },
              y: {
                duration: 2.5, // Slower bounce
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: delay + 0.2,
              },
              opacity: { duration: 0.5, delay: delay },
            }
      }
    >
      {/* Basketball emoji instead of SVG */}
      <span role='img' aria-label='basketball'>
        🏀
      </span>
    </motion.div>
  )
}

// NCAA Logo element
type NcaaLogoProps = PositionProps & {
  size?: string
  opacity?: number
  pulseEffect?: boolean
  delay?: number // Added delay prop
}

export const AnimatedNcaaLogo = ({
  top,
  bottom,
  left,
  right,
  size = 'md',
  opacity = 0.5,
  pulseEffect = true,
  isExiting = false,
  delay = 0, // Default delay is 0
}: NcaaLogoProps & { size?: 'sm' | 'md' | 'lg' }) => {
  // Map size to actual size value
  const sizeMap = {
    sm: '3rem',
    md: '4rem',
    lg: '5rem',
  }
  const actualSize = sizeMap[size] || '4rem'

  // Define exit animation
  const exitAnimation = {
    scale: 2,
    opacity: 0,
    filter: 'blur(5px)',
  }

  return (
    <motion.div
      className='absolute'
      style={{
        top: top || undefined,
        bottom: bottom || undefined,
        left: left || undefined,
        right: right || undefined,
        width: actualSize,
        height: actualSize,
        opacity: opacity,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              opacity: pulseEffect ? [opacity, opacity * 0.7, opacity] : opacity,
              scale: pulseEffect ? [1, 1.1, 1] : 1,
            }
      }
      transition={
        isExiting
          ? { duration: 0.6, ease: 'easeOut' }
          : {
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
    >
      {/* NCAA Logo - simplified circular version */}
      <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
        <circle cx='50' cy='50' r='45' fill='#0067b1' />
        <text
          x='50'
          y='57'
          fontFamily='Arial, sans-serif'
          fontSize='20'
          fontWeight='bold'
          fill='white'
          textAnchor='middle'
        >
          NCAA
        </text>
      </svg>
    </motion.div>
  )
}

// Flash effect component
type FlashEffectProps = PositionProps & {
  size?: string
  color?: 'blue' | 'white'
  opacity?: number
  speed?: 'slow' | 'medium' | 'fast'
  delay?: number // Added delay prop
}

export const AnimatedFlash = ({
  top,
  bottom,
  left,
  right,
  size = '80px',
  color = 'blue',
  opacity = 0.6,
  speed = 'medium',
  isExiting = false,
  delay = 0, // Default delay is 0
}: FlashEffectProps) => {
  // Map color to actual CSS color
  const colorMap = {
    blue: '#0067b1', // NCAA blue
    white: '#ffffff',
  }
  const flashColor = colorMap[color] || colorMap.blue

  // Map speed to duration
  const speedMap = {
    slow: 3,
    medium: 1.5,
    fast: 0.7,
  }
  const flashDuration = speedMap[speed] || speedMap.medium

  // Define exit animation
  const exitAnimation = {
    scale: 3,
    opacity: 0,
  }

  // Create random initial delay
  const initialDelay = Math.random() * 2

  return (
    <motion.div
      className='absolute'
      style={{
        top: top || undefined,
        bottom: bottom || undefined,
        left: left || undefined,
        right: right || undefined,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${flashColor} 0%, rgba(255,255,255,0) 70%)`,
        borderRadius: '50%',
        opacity: 0,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              opacity: [0, opacity, 0],
              scale: [0.5, 1.5, 0.5],
            }
      }
      transition={
        isExiting
          ? { duration: 0.6, ease: 'easeOut' }
          : {
              opacity: {
                duration: flashDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: initialDelay,
              },
              scale: {
                duration: flashDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: initialDelay,
              },
            }
      }
    />
  )
}

// Composite component that combines all elements
type MarchMadnessAnimatedBackgroundProps = {
  isExiting?: boolean
  elements?: {
    brackets?: BracketElementProps[]
    basketballs?: BasketballProps[]
    ncaaLogos?: (NcaaLogoProps & { size?: 'sm' | 'md' | 'lg' })[]
    flashes?: FlashEffectProps[]
  }
}

// Rename this function but keep the original name as an alias for backward compatibility
export const CinderellaAnimatedBackground = ({
  isExiting = false,
  elements,
}: MarchMadnessAnimatedBackgroundProps) => {
  return (
    <>
      {/* Render brackets with staggered delays */}
      {elements?.brackets?.map((props, index) => (
        <AnimatedBracket
          key={`bracket-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : index * 0.1}
        />
      ))}

      {/* Render basketballs with staggered delays */}
      {elements?.basketballs?.map((props, index) => (
        <AnimatedBasketball
          key={`basketball-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : 0.3 + index * 0.15}
        />
      ))}

      {/* Render NCAA logos with staggered delays */}
      {elements?.ncaaLogos?.map((props, index) => (
        <AnimatedNcaaLogo
          key={`ncaa-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : 0.5 + index * 0.15}
        />
      ))}

      {/* Render flash effects with staggered delays */}
      {elements?.flashes?.map((props, index) => (
        <AnimatedFlash
          key={`flash-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : 0.7 + index * 0.2}
        />
      ))}
    </>
  )
}
