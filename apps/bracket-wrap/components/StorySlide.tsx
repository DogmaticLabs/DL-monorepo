'use client'

import React from 'react'

interface StorySlideProps {
  children: React.ReactNode
  bgColor?: string
  footer?: React.ReactNode
}

export default function StorySlide({ children, footer }: StorySlideProps) {
  return (
    <div
      className={`flex flex-col w-full h-screen min-h-[100svh] items-center justify-center bg-transparent`}
    >
      <div className='flex-1 w-full max-w-md p-6 text-white'>{children}</div>
      <div className='sticky bottom-0 w-full m-4'>{footer}</div>
    </div>
  )
}
