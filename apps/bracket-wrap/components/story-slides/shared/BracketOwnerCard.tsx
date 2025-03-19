import { Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface BracketOwnerCardProps {
  owner: {
    name: string
    bracketName: string
    avatarUrl: string
    teamLogo?: string
  }
  label?: string
  iconColor?: string
  delay?: number
  iconBackground?: boolean
}

/**
 * A reusable component for displaying bracket owner information
 * across different story slides.
 */
const BracketOwnerCard: React.FC<BracketOwnerCardProps> = ({
  owner,
  label,
  iconColor = 'text-madness-orange',
  delay = 0.5,
  iconBackground = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className='py-1 border-white/20'>
        <h4 className='text-sm font-black text-white/60 mb-1 uppercase tracking-wide'>{label}</h4>
        <div className='flex items-center gap-4'>
          <div className='flex-1 flex items-center gap-x-2'>
            <Trophy className={`h-5 w-5 ${iconColor}`} />
            <div className='flex flex-col gap-x-2'>
              <p className='font-black text-lg text-white truncate'>{owner.bracketName}</p>
              <p className='text-white/60 truncate font-bold text-sm'>{owner.name}</p>
            </div>
          </div>
          <Image
            src={owner.avatarUrl}
            alt={owner.name}
            width={36}
            height={36}
            className={`w-8 h-8 object-cover rounded-lg ${
              iconBackground ? 'bg-white border p-[1px]' : ''
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default BracketOwnerCard
