import Image from 'next/image'
import { ReactNode } from 'react'

interface ShareableContentProps {
  shareableRef: React.RefObject<HTMLDivElement>
  children: ReactNode
  showGradientOverlay?: boolean
  backgroundGradient?: string
}

/**
 * A reusable component for shareable content that maintains consistent styling
 * across different story slides. It includes a container with a background gradient,
 * the slide-specific content (passed as children), and a logo at the bottom.
 */
const ShareableContent = ({
  shareableRef,
  children,
  backgroundGradient = 'linear-gradient(to bottom right, #0067b1, #000000, #0067b1)',
}: ShareableContentProps) => {
  return (
    <div
      ref={shareableRef}
      className='relative w-full top-0 left-0 pointer-events-none overflow-hidden'
      style={{
        background: backgroundGradient,
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      {/* Radial gradient overlay for depth */}
      <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none' />

      {/* Content specific to the slide */}
      {children}

      {/* Logo text at bottom */}
      <div className='flex flex-col items-center justify-center -my-4'>
        <Image
          src='/logo.png'
          alt='BracketWrap Logo'
          width={64}
          height={64}
          className='size-20 object-contain'
        />
        <span
          className='text-white/80 text-[10px] -mt-3'
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          bracketwrap.com
        </span>
      </div>
    </div>
  )
}

export default ShareableContent
