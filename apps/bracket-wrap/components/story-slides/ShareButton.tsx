import { motion } from 'motion/react'

// Reusable ShareButton component
const ShareButton: React.FC<{
  isSharing: boolean
  handleShare: (e: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ isSharing, handleShare }) => {
  return (
    <motion.button
      onClick={handleShare}
      className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-madness-blue/60 to-madness-blue rounded-full text-white font-bold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isSharing}
      data-click='share-button'
      aria-label='Share'
    >
      {/* Button background glow effect */}
      <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-blue-200/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>

      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='w-5 h-5 relative z-10'
      >
        <path
          fillRule='evenodd'
          d='M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z'
          clipRule='evenodd'
        />
      </svg>
      <span className='relative z-10'>Share</span>
    </motion.button>
  )
}

export default ShareButton
