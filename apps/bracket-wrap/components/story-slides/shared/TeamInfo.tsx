import { Team } from '@/app/api/bracket-data'
import { motion } from 'motion/react'
import Image from 'next/image'

const TeamInfo = ({
  team,
  tags,
  className,
}: {
  team: Team
  tags: string[]
  className?: string
}) => {
  // Get the team's primary color or use a default color

  if (!team) return null
  const primaryColor = team.colors?.primary ?? ''
  const secondaryColor = team.colors?.secondary ?? ''
  return (
    <motion.div
      className={`flex items-end space-x-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Team Logo with enhanced rotation and bounce animation */}
      <motion.div
        className='flex-shrink-0 w-16 h-16 rounded-md overflow-hidden flex items-center justify-center'
        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          scale: { type: 'spring', stiffness: 300, damping: 15 },
          rotate: { type: 'spring', stiffness: 200, damping: 10 },
        }}
        style={{ backgroundColor: primaryColor }}
      >
        <Image
          src={team.images?.secondary || '/placeholder-team.png'}
          alt={team.name}
          width={48}
          height={48}
          className='w-12 h-12 object-contain'
          priority
          unoptimized
        />
      </motion.div>

      {/* Team Name and Details with staggered animations */}
      <div className='flex-1 min-w-0'>
        <motion.h3
          className='text-2xl font-black text-white tracking-tight flex items-center gap-2'
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {team.name}
          <span className='text-white/60 text-sm font-black'>{team.seed}</span>
        </motion.h3>
        <div className='flex items-center gap-2 mt-0'>
          {/* Region with seed in parentheses */}
          {tags.map(tag => (
            <motion.span
              key={tag}
              className='bg-madness-blue px-3 py-1 rounded text-white font-black uppercase text-sm tracking-wide'
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.7,
                type: 'spring',
                stiffness: 300,
              }}
              style={{ backgroundColor: primaryColor }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TeamInfo
