import anime from 'animejs'
import React, { useCallback, useRef, useEffect } from 'react'

const GRID_WIDTH = 60
const GRID_HEIGHT = 40

const DotGrid = () => {
  const lastMousePos = useRef({ x: 0, y: 0 })
  const isAnimating = useRef(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  const animateDots = useCallback((mouseX: number, mouseY: number) => {
    if (isAnimating.current) return

    isAnimating.current = true
    
    anime({
      targets: '.dot-point',
      scale: [
        { value: 1.35, easing: 'easeOutSine', duration: 600 },
        { value: 1, easing: 'easeInOutQuad', duration: 400 },
      ],
      translateY: [
        { value: -8, easing: 'easeOutSine', duration: 600 },
        { value: 0, easing: 'easeInOutQuad', duration: 400 },
      ],
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: 600 },
        { value: 0.5, easing: 'easeInOutQuad', duration: 400 },
      ],
      delay: anime.stagger(30, {
        grid: [GRID_WIDTH, GRID_HEIGHT],
        from: mouseX + (mouseY * GRID_WIDTH),
      }),
      complete: () => {
        isAnimating.current = false
      }
    })
  }, [])

  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const grid = e.currentTarget
    const rect = grid.getBoundingClientRect()
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellWidth = rect.width / GRID_WIDTH
    const cellHeight = rect.height / GRID_HEIGHT
    
    const dotX = Math.floor(x / cellWidth)
    const dotY = Math.floor(y / cellHeight)
    
    // Only trigger animation if mouse has moved to a different cell
    if (dotX !== lastMousePos.current.x || dotY !== lastMousePos.current.y) {
      lastMousePos.current = { x: dotX, y: dotY }
      
      // Clear any pending animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      
      // Schedule next animation with a small delay
      animationTimeoutRef.current = setTimeout(() => {
        animateDots(dotX, dotY)
      }, 16) // Approximately one frame at 60fps
    }
  }, [animateDots])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const dots = []
  let index = 0

  // Calculate the center area to exclude
  const centerStartX = Math.floor(GRID_WIDTH * 0.3)
  const centerEndX = Math.floor(GRID_WIDTH * 0.7)
  const centerStartY = Math.floor(GRID_HEIGHT * 0.15)
  const centerEndY = Math.floor(GRID_HEIGHT * 0.85)

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      // Skip dots in the center area
      if (
        i >= centerStartX &&
        i <= centerEndX &&
        j >= centerStartY &&
        j <= centerEndY
      ) {
        continue
      }

      dots.push(
        <div
          className='dot-container group cursor-crosshair rounded-full p-2 transition-colors'
          data-index={index}
          key={`${i}-${j}`}
        >
          <div
            className='dot-point h-1.5 w-1.5 rounded-full bg-gradient-to-b from-slate-700 to-slate-400 opacity-50 transition-colors group-hover:from-indigo-600 group-hover:to-white'
            data-index={index}
          />
        </div>,
      )
      index++
    }
  }

  return (
    <div
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
        width: '100vw',
        height: '100vh',
        placeItems: 'center',
        gap: '0.75rem',
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)'
      }}
      onMouseMove={handleGridMouseMove}
    >
      {dots}
    </div>
  )
}

const WaterDropGrid = () => {
  return (
    <div className='absolute inset-0 w-full h-full overflow-hidden'>
      <DotGrid />
    </div>
  )
}

export default WaterDropGrid 