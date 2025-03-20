'use client'

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
      {children}
      <div className='fixed bottom-0 w-full m-4 z-10'>{footer}</div>
    </div>
  )
}
