import { motion } from 'motion/react'

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
}: BasketballProps) => {
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
  }

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${size} h-${size} rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-${Math.round(opacity * 100)}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom right, #f97316, #c2410c)',
        backgroundSize: `${dotSize} ${dotSize}, 100% 100%`,
      }}
      initial={{ y: top ? -50 : 50, opacity: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              y: 0,
              opacity: opacity,
              rotate: rotateDirection === 'clockwise' ? [0, 360] : [0, -360],
            }
      }
      transition={
        isExiting
          ? { duration: 0.7, ease: 'easeOut' }
          : {
              y: { duration: 0.8, ease: 'easeOut' },
              rotate: {
                duration: rotateDirection === 'clockwise' ? 3 : 4,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: { duration: 0.8 },
            }
      }
    />
  )
}

// Bracket component
type BracketProps = PositionProps & {
  size?: string
  color?: string
  opacity?: number
  type?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}

export const AnimatedBracket = ({
  top,
  bottom,
  left,
  right,
  size = '14',
  color = 'yellow-400',
  opacity = 0.6,
  type = 'topLeft',
  isExiting = false,
}: BracketProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Determine border styles based on type
  let borderStyles = ''
  let roundedStyles = ''

  switch (type) {
    case 'topLeft':
      borderStyles = `border-l-4 border-t-4 border-${color}`
      roundedStyles = 'rounded-tl-lg'
      break
    case 'topRight':
      borderStyles = `border-r-4 border-t-4 border-${color}`
      roundedStyles = 'rounded-tr-lg'
      break
    case 'bottomLeft':
      borderStyles = `border-l-4 border-b-4 border-${color}`
      roundedStyles = 'rounded-bl-lg'
      break
    case 'bottomRight':
      borderStyles = `border-r-4 border-b-4 border-${color}`
      roundedStyles = 'rounded-br-lg'
      break
  }

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

  return (
    <motion.div
      className={`absolute ${positionClasses} w-${size} h-${size} ${borderStyles} ${roundedStyles} opacity-${Math.round(opacity * 100)}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isExiting
          ? exitAnimation
          : {
              scale: 1,
              opacity: opacity,
              rotate: [0, rotateDirection, 0],
              x: [0, moveDirection, 0],
            }
      }
      transition={
        isExiting
          ? { duration: 0.8, ease: 'easeOut' }
          : {
              scale: { duration: 0.8, ease: 'easeOut' },
              rotate: {
                duration: type.includes('Right') ? 6 : 5,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              x: {
                duration: type.includes('Right') ? 5 : 4,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              opacity: { duration: 0.8 },
            }
      }
    />
  )
}

// Percentage symbol component
type PercentageSymbolProps = PositionProps & {
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  opacity?: number
  floatDistance?: number
}

export const AnimatedPercentageSymbol = ({
  top,
  bottom,
  left,
  right,
  color = 'yellow-400',
  size = '3xl',
  opacity = 0.4,
  floatDistance = 15,
  isExiting = false,
}: PercentageSymbolProps) => {
  // Calculate position classes
  const positionClasses = [
    top ? `top-[${top}]` : '',
    bottom ? `bottom-[${bottom}]` : '',
    left ? `left-[${left}]` : '',
    right ? `right-[${right}]` : '',
  ]
    .filter(Boolean)
    .join(' ')

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
      className={`absolute ${positionClasses} text-${size} font-bold text-${color} opacity-${Math.round(opacity * 100)}`}
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
              y: { duration: top ? 4 : 5, repeat: Infinity, repeatType: 'reverse' },
              opacity: { duration: 0.8 },
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
      {/* Render basketballs */}
      {elements?.basketballs?.map((props, index) => (
        <AnimatedBasketball key={`basketball-${index}`} {...props} isExiting={isExiting} />
      ))}

      {/* Render brackets */}
      {elements?.brackets?.map((props, index) => (
        <AnimatedBracket key={`bracket-${index}`} {...props} isExiting={isExiting} />
      ))}

      {/* Render percentage symbols */}
      {elements?.percentageSymbols?.map((props, index) => (
        <AnimatedPercentageSymbol key={`percent-${index}`} {...props} isExiting={isExiting} />
      ))}
    </>
  )
}
