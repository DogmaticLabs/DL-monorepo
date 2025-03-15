import { motion } from 'motion/react'

// Common types for positioning
type PositionProps = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  isExiting?: boolean
}

// Glass slipper component
type GlassSlipperProps = PositionProps & {
  size?: string
  opacity?: number
  rotateDirection?: 'clockwise' | 'counterclockwise'
}

export const AnimatedGlassSlipper = ({
  top,
  bottom,
  left,
  right,
  size = '12',
  opacity = 0.8,
  rotateDirection = 'clockwise',
  isExiting = false,
}: GlassSlipperProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Define exit animation
  const exitAnimation = {
    y: top ? -200 : 200,
    x: right ? 100 : -100,
    opacity: 0,
    scale: 0.2,
    rotate: 180,
  }

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${size} h-${size} opacity-${Math.round(opacity * 100)}`}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
      }}
      initial={{ y: top ? -50 : 50, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              y: [0, -10, 0],
              opacity: opacity,
              rotate: rotateDirection === 'clockwise' ? [0, 10, 0] : [0, -10, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.7, ease: 'easeOut' }
          : {
              y: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              rotate: {
                duration: rotateDirection === 'clockwise' ? 4 : 5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              opacity: { duration: 0.8 },
            }
      }
    >
      {/* SVG of a glass slipper */}
      <svg
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-full h-full'
      >
        <path
          d='M85 50C85 40 75 35 65 35C55 35 50 40 40 40C30 40 20 35 15 30C10 25 5 20 5 15C5 10 10 5 15 5C20 5 25 10 30 15C35 20 40 25 50 25C60 25 70 20 75 15C80 10 85 5 90 5C95 5 95 10 95 15C95 25 90 35 85 45C80 55 75 65 75 75C75 80 70 85 65 85C60 85 55 80 55 75C55 70 60 65 65 65C70 65 75 70 75 75'
          stroke='rgba(255, 255, 255, 0.9)'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M15 15C20 20 30 30 40 30C50 30 60 25 70 15'
          stroke='rgba(255, 255, 255, 0.7)'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
    </motion.div>
  )
}

// Crown component
type CrownProps = PositionProps & {
  size?: string
  color?: string
  opacity?: number
}

export const AnimatedCrown = ({
  top,
  bottom,
  left,
  right,
  size = '14',
  color = 'yellow-400',
  opacity = 0.6,
  isExiting = false,
}: CrownProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Define exit animation
  const exitAnimation = {
    y: top ? -150 : 150,
    x: right ? 150 : -150,
    opacity: 0,
    scale: 0.2,
    rotate: right ? 90 : -90,
  }

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${size} h-${size} opacity-${Math.round(opacity * 100)}`}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              scale: [1, 1.05, 1],
              opacity: opacity,
              rotate: [-2, 2, -2],
              y: [0, -5, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.8, ease: 'easeOut' }
          : {
              scale: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              rotate: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { duration: 0.8 },
            }
      }
    >
      {/* SVG of a crown */}
      <svg
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-full h-full'
      >
        <path
          d='M10 70L25 40L40 55L50 30L60 55L75 40L90 70H10Z'
          fill={`rgba(255, 215, 0, ${opacity})`}
          stroke='rgba(255, 255, 255, 0.8)'
          strokeWidth='3'
        />
        <circle cx='25' cy='40' r='5' fill='rgba(255, 255, 255, 0.9)' />
        <circle cx='50' cy='30' r='5' fill='rgba(255, 255, 255, 0.9)' />
        <circle cx='75' cy='40' r='5' fill='rgba(255, 255, 255, 0.9)' />
        <path
          d='M15 75H85'
          stroke='rgba(255, 255, 255, 0.8)'
          strokeWidth='3'
          strokeLinecap='round'
        />
      </svg>
    </motion.div>
  )
}

// Star component
type StarProps = PositionProps & {
  size?: string
  color?: string
  opacity?: number
  blinkSpeed?: 'slow' | 'medium' | 'fast'
}

export const AnimatedStar = ({
  top,
  bottom,
  left,
  right,
  size = 'md',
  color = 'teal-200',
  opacity = 0.7,
  blinkSpeed = 'medium',
  isExiting = false,
}: StarProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Map size to actual size value
  const sizeMap = {
    sm: '4',
    md: '6',
    lg: '8',
    xl: '10',
  }
  const actualSize = sizeMap[size as keyof typeof sizeMap] || '6'

  // Map blink speed to duration
  const speedMap = {
    slow: 5,
    medium: 3,
    fast: 1.5,
  }
  const blinkDuration = speedMap[blinkSpeed]

  // Define exit animation
  const exitAnimation = {
    scale: 2,
    opacity: 0,
    filter: 'blur(10px)',
  }

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${actualSize} h-${actualSize} text-${color} opacity-${Math.round(opacity * 100)}`}
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              opacity: [opacity, opacity * 0.3, opacity],
              scale: [1, 0.8, 1],
            }
      }
      transition={
        isExiting
          ? { duration: 0.6, ease: 'easeOut' }
          : {
              opacity: { duration: blinkDuration, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: blinkDuration * 1.5, repeat: Infinity, ease: 'easeInOut' },
            }
      }
    >
      {/* Star shape */}
      <svg
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        className='w-full h-full'
      >
        <path d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' />
      </svg>
    </motion.div>
  )
}

// Sparkle component
type SparkleProps = PositionProps & {
  size?: string
  color?: string
  opacity?: number
}

export const AnimatedSparkle = ({
  top,
  bottom,
  left,
  right,
  size = '5',
  color = 'white',
  opacity = 0.6,
  isExiting = false,
}: SparkleProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Define exit animation
  const exitAnimation = {
    scale: 0,
    opacity: 0,
    rotate: 180,
  }

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${size} h-${size} text-${color} opacity-${Math.round(opacity * 100)}`}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              scale: [0, 1, 0],
              opacity: [0, opacity, 0],
              rotate: [0, 90, 180],
            }
      }
      transition={
        isExiting
          ? { duration: 0.5, ease: 'easeOut' }
          : {
              duration: 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              ease: 'easeInOut',
            }
      }
    >
      {/* Sparkle shape */}
      <svg
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        className='w-full h-full'
      >
        <path d='M12 2L12.9 9.1L20 10L14 14.9L15.1 22L12 18.5L8.9 22L10 14.9L4 10L11.1 9.1L12 2Z' />
      </svg>
    </motion.div>
  )
}

// Composite component that combines all elements
type CinderellaAnimatedBackgroundProps = {
  isExiting?: boolean
  elements?: {
    slippers?: GlassSlipperProps[]
    crowns?: CrownProps[]
    stars?: StarProps[]
    sparkles?: SparkleProps[]
  }
}

export const CinderellaAnimatedBackground = ({
  isExiting = false,
  elements,
}: CinderellaAnimatedBackgroundProps) => {
  return (
    <>
      {/* Render glass slippers */}
      {elements?.slippers?.map((props, index) => (
        <AnimatedGlassSlipper key={`slipper-${index}`} {...props} isExiting={isExiting} />
      ))}

      {/* Render crowns */}
      {elements?.crowns?.map((props, index) => (
        <AnimatedCrown key={`crown-${index}`} {...props} isExiting={isExiting} />
      ))}

      {/* Render stars */}
      {elements?.stars?.map((props, index) => (
        <AnimatedStar key={`star-${index}`} {...props} isExiting={isExiting} />
      ))}

      {/* Render sparkles */}
      {elements?.sparkles?.map((props, index) => (
        <AnimatedSparkle key={`sparkle-${index}`} {...props} isExiting={isExiting} />
      ))}
    </>
  )
}
