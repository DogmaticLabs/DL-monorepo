'use client'

import Image from 'next/image'
import React from 'react'

interface StorySlideProps {
  children: React.ReactNode
  bgColor?: string
  footer?: React.ReactNode
  spotlightPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

export default function StorySlide({
  children,
  footer,
  spotlightPosition = 'center',
}: StorySlideProps) {
  return (
    <div className='relative flex flex-col w-full h-full items-center justify-center bg-transparent overflow-hidden pt-6'>
      {/* Bracket background with spotlight effect */}
      <div className='absolute inset-0 w-full h-full z-0 pt-8'>
        <div
          className='absolute inset-0 bg-[url("/bracket-background.png")] bg-no-repeat'
          style={{
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            filter: 'invert(0.8) brightness(0.6) sepia(0.5) hue-rotate(170deg) saturate(6)',
            opacity: 0.2,
            mixBlendMode: 'screen',
          }}
        />

        {/* Logo centered on the bracket */}
        <div className='absolute inset-0 flex items-center justify-center z-10 pointer-events-none'>
          <Image
            src='/logo.png'
            alt='Bracket Wrap Logo'
            className='w-[150px] object-contain opacity-10'
            width={150}
            height={150}
          />
        </div>

        {/* Dark center with radial gradient outwards */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 70%)',
            mixBlendMode: 'multiply',
          }}
        />

        <div
          className={`absolute inset-0 bg-radial-gradient`}
          style={{
            background: `radial-gradient(circle at ${
              spotlightPosition === 'center'
                ? 'center'
                : spotlightPosition === 'top'
                  ? 'center top'
                  : spotlightPosition === 'bottom'
                    ? 'center bottom'
                    : spotlightPosition === 'left'
                      ? 'left center'
                      : 'right center'
            }, rgba(100,150,255,0.2), transparent 70%)`,
          }}
        />
      </div>

      {/* Content area (on top of background) */}
      <div className='flex items-center flex-1 w-full max-w-md text-white z-10 relative'>
        {children}
      </div>
      <div className='fixed bottom-0 w-full m-4 z-10'>{footer}</div>
    </div>
  )
}
