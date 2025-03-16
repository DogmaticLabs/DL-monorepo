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

// Basketball component
type BasketballProps = PositionProps & {
  size?: string
  opacity?: number
  rotateDirection?: 'clockwise' | 'counterclockwise'
  dotSize?: string
  delay?: number
}

export const AnimatedBasketball = ({
  top,
  bottom,
  left,
  right,
  size = '10',
  opacity = 0.8,
  rotateDirection = 'clockwise',
  dotSize = '8px',
  isExiting = false,
  delay = 0,
}: BasketballProps) => {
  // Define exit animation
  const exitAnimation = {
    y: top ? -200 : 200,
    x: right ? 100 : -100,
    opacity: 0,
    scale: 0.2,
  }

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
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              scale: 1,
              opacity: opacity,
              rotate: rotateDirection === 'clockwise' ? [0, 360] : [0, -360],
            }
      }
      transition={
        isExiting
          ? { duration: 0.7, ease: 'easeOut' }
          : {
              scale: { duration: 0.8, ease: 'easeOut', delay: delay },
              rotate: {
                duration: rotateDirection === 'clockwise' ? 6 : 7,
                repeat: Infinity,
                ease: 'linear',
                delay: delay + 0.2,
              },
              opacity: { duration: 0.8, delay: delay },
            }
      }
    >
      <span
        role='img'
        aria-label='basketball'
        style={{
          fontSize: `${size}rem`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        🏀
      </span>
    </motion.div>
  )
}

// Bracket component
type BracketProps = PositionProps & {
  size?: string
  color?: string
  opacity?: number
  type?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  delay?: number
}

export const AnimatedBracket = ({
  top,
  bottom,
  left,
  right,
  size = '14',
  opacity = 0.6,
  type = 'topLeft',
  color = 'blue-400',
  isExiting = false,
  delay = 0,
}: BracketProps) => {
  // Determine animation direction
  const rotateDirection = type.includes('Right') ? -10 : 10
  const moveDirection = type.includes('Right') ? -5 : 5

  // Define exit animation
  const exitAnimation = {
    x: type.includes('Right') ? 200 : -200,
    y: type.includes('bottom') ? 100 : -100,
    opacity: 0,
    rotate: type.includes('Right') ? 90 : -90,
    scale: 0.2,
  }

  // Convert Tailwind color to CSS color
  const colorMap: Record<string, string> = {
    'blue-400': '#0067b1', // NCAA Blue
    'yellow-400': '#facc15',
    'orange-500': '#ff6b00', // NCAA Orange
    // Add more color mappings as needed
  }

  const cssColor = colorMap[color] || '#0067b1'

  // Determine if we should flip the bracket
  const shouldFlipHorizontal = type.includes('Right')

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
      initial={{ y: top ? -100 : 100, x: left ? -100 : 100, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              y: 0,
              x: 0,
              opacity: opacity,
              rotate: [0, rotateDirection, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.8, ease: 'easeOut' }
          : {
              y: { duration: 0.7, ease: 'easeOut', delay: delay },
              x: { duration: 0.7, ease: 'easeOut', delay: delay },
              rotate: {
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: delay + 0.3,
              },
              opacity: { duration: 0.8, delay: delay },
            }
      }
    >
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

// Percentage symbol component
type PercentageSymbolProps = PositionProps & {
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  opacity?: number
  floatDistance?: number
  delay?: number
}

export const AnimatedPercentageSymbol = ({
  top,
  bottom,
  left,
  right,
  color = 'blue-400',
  size = '3xl',
  opacity = 0.4,
  floatDistance = 15,
  isExiting = false,
  delay = 0,
}: PercentageSymbolProps) => {
  // Convert Tailwind color to CSS color
  const colorMap: Record<string, string> = {
    'blue-400': '#0067b1', // NCAA Blue
    'yellow-400': '#facc15',
    'orange-500': '#ff6b00', // NCAA Orange
    // Add more color mappings as needed
  }

  const cssColor = colorMap[color] || '#0067b1'

  // Map text size to CSS font size
  const sizeMap: Record<string, string> = {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  }

  const fontSize = sizeMap[size] || '1.875rem'

  // Determine float direction based on position
  const initialY = top ? 20 : -20
  const floatY = top ? [0, -floatDistance, 0] : [0, floatDistance, 0]

  // Define exit animation
  const exitAnimation = {
    y: top ? -100 : 100,
    x: right ? 50 : -50,
    opacity: 0,
    scale: 0.5,
    rotate: right ? 45 : -45,
  }

  return (
    <motion.div
      className='absolute'
      style={{
        top: top || undefined,
        bottom: bottom || undefined,
        left: left || undefined,
        right: right || undefined,
        fontSize: fontSize,
        fontWeight: 'bold',
        color: cssColor,
        opacity: opacity,
      }}
      initial={{ y: initialY, opacity: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              y: floatY,
              opacity: opacity,
            }
      }
      transition={
        isExiting
          ? { duration: 0.6, ease: 'easeOut' }
          : {
              y: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: delay,
              },
              opacity: { duration: 0.8, delay: delay },
            }
      }
    >
      %
    </motion.div>
  )
}

// Composite component that combines all elements
type AnimatedBackgroundProps = {
  isExiting?: boolean
  elements?: {
    basketballs?: BasketballProps[]
    brackets?: BracketProps[]
    percentageSymbols?: PercentageSymbolProps[]
  }
}

export const AnimatedBackground = ({ isExiting = false, elements }: AnimatedBackgroundProps) => {
  return (
    <>
      {/* Render brackets with staggered delays */}
      {elements?.brackets?.map((props, index) => (
        <AnimatedBracket
          key={`bracket-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : index * 0.15}
        />
      ))}

      {/* Render basketballs with staggered delays */}
      {elements?.basketballs?.map((props, index) => (
        <AnimatedBasketball
          key={`basketball-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : 0.3 + index * 0.2}
        />
      ))}

      {/* Render percentage symbols with staggered delays */}
      {elements?.percentageSymbols?.map((props, index) => (
        <AnimatedPercentageSymbol
          key={`percent-${index}`}
          {...props}
          isExiting={isExiting}
          delay={props.delay !== undefined ? props.delay : 0.5 + index * 0.2}
        />
      ))}
    </>
  )
}
