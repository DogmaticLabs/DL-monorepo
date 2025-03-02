'use client'

import React from 'react'

interface StorySlideProps {
  children: React.ReactNode
  bgColor?: string
}

export default function StorySlide({ children }: StorySlideProps) {
  return (
    <div className={`w-full h-full min-h-[100svh] flex items-center justify-center bg-transparent`}>
      <div className='w-full max-w-md p-6 text-white flex flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  )
}
