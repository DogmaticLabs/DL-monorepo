import { Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface BracketOwnerCardProps {
  name: string
  bracketName: string
  teamLogo?: string
  label?: string
  iconColor?: string
  delay?: number
  teamBackground?: boolean
  Icon?: React.ReactNode
  description?: string
  className?: string
}

/**
 * A reusable component for displaying bracket owner information
 * across different story slides.
 */
const BracketOwnerCard: React.FC<BracketOwnerCardProps> = ({
  name,
  bracketName,
  teamLogo,
  label,
  iconColor = 'text-madness-orange',
  delay = 0.5,
  teamBackground = false,
  Icon,
  description,
  className,
}) => {
  Icon = Icon || <Trophy className={`h-5 w-5 ${iconColor}`} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <div className='py-1 border-white/20'>
        <h4 className='text-sm font-extrabold text-white/60 mb-1'>{label}</h4>
        <div className='flex items-center gap-4'>
          <div className='flex-1 flex items-center gap-x-2 min-w-0'>
            {Icon}
            <div className='flex flex-col min-w-0'>
              <p className='font-black text-lg text-white truncate leading-5'>{bracketName}</p>
              <p className='text-white/60 truncate font-bold text-sm leading-5'>{name}</p>
              {description && (
                <p className='text-white/60 truncate text-sm leading-5'>{description}</p>
              )}
            </div>
          </div>
          {teamLogo && (
            <Image
              src={teamLogo}
              alt={name}
              width={36}
              height={36}
              className={`w-8 h-8 object-cover rounded-lg flex-shrink-0 ${
                teamBackground ? 'bg-white border p-[1px]' : ''
              }`}
              priority
              unoptimized
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BracketOwnerCard
