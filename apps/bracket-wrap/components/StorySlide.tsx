'use client'

import Image from 'next/image'
import React from 'react'

interface StorySlideProps {
  children: React.ReactNode
  bgColor?: string
  footer?: React.ReactNode
  spotlightPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

export default function StorySlide({ children, footer }: StorySlideProps) {
  return (
    <div className='relative flex flex-col w-full h-full items-center justify-center bg-transparent overflow-hidden pt-6'>
      {/* Bracket background with spotlight effect */}
      <div className='absolute inset-0 w-full h-full pt-8'>
        {/* Bracket SVG with masked center for the logo */}
        <div
          className='absolute inset-0'
          style={{
            maskImage:
              'radial-gradient(circle at center, transparent 0%, transparent 60px, black 120px)',
            WebkitMaskImage:
              'radial-gradient(circle at center, transparent 0%, transparent 60px, black 120px)',
          }}
        >
          <div
            className='absolute inset-0 bg-[url("/bracket.svg")] bg-no-repeat'
            style={{
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              filter: 'invert(0.8) brightness(0.8) sepia(0.5) hue-rotate(170deg) saturate(4)',
              opacity: 0.2,
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Logo centered on the bracket - now visible through the "hole" */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div
            className='relative w-[200px] h-[200px] flex items-center justify-center'
            style={{
              filter: 'brightness(1) contrast(1)',
            }}
          >
            <Image
              src='/logo.png'
              alt='Bracket Wrap Logo'
              className='size-[200px] object-contain opacity-20'
              width={200}
              height={200}
              style={{
                mixBlendMode: 'soft-light',
              }}
            />
          </div>
        </div>

        {/* Add a radial gradient to the center of the bracket */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(circle at center, rgba(40,40,40,0.5) 5%, rgba(0,0,0,0) 100%)',
            mixBlendMode: 'multiply',
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
