import { toPng } from 'html-to-image'
import { useState } from 'react'

interface ShareOptions {
  title: string
  text: string
  url: string
  watermark?: {
    text: string
    position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
    color?: string
    opacity?: number
  }
  captureOptions?: {
    quality?: number
    backgroundColor?: string
    pixelRatio?: number
    skipFonts?: boolean
    cacheBust?: boolean
    filter?: (node: HTMLElement) => boolean
  }
}

interface UseShareContentReturn {
  isSharing: boolean
  shareContent: (elementRef: React.RefObject<HTMLElement>, options: ShareOptions) => Promise<void>
  captureElementAsImage: (
    elementRef: React.RefObject<HTMLElement>,
    options?: ShareOptions,
  ) => Promise<Blob | null>
}

/**
 * Hook for sharing content with the Web Share API, with fallbacks
 * Includes functionality to capture an element as an image
 */
export const useShareContent = (): UseShareContentReturn => {
  const [isSharing, setIsSharing] = useState(false)

  /**
   * Captures an HTML element as an image
   */
  const captureElementAsImage = async (
    elementRef: React.RefObject<HTMLElement>,
    options?: ShareOptions,
  ): Promise<Blob | null> => {
    if (!elementRef.current) return null

    try {
      // Default capture options
      const captureOpts = {
        pixelRatio: 2, // Higher ratio for better quality
        backgroundColor: options?.captureOptions?.backgroundColor,
        skipFonts: false,
        cacheBust: true,
        ...options?.captureOptions,
      }

      // Capture the element as a PNG
      const dataUrl = await toPng(elementRef.current, captureOpts)

      // Add watermark if specified
      if (options?.watermark) {
        // Create a temporary canvas to add the watermark
        const img = new Image()
        await new Promise<void>(resolve => {
          img.onload = () => resolve()
          img.src = dataUrl
        })

        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Draw the original image
          ctx.drawImage(img, 0, 0)

          // Add watermark text
          ctx.font = '14px Arial'
          ctx.fillStyle = options.watermark.color || 'rgba(255, 255, 255, 0.7)'

          // Position the watermark based on the specified position or default to bottom right
          const position = options.watermark.position || 'bottomRight'
          ctx.textAlign = position.includes('Right') ? 'right' : 'left'

          const x = position.includes('Right') ? canvas.width - 10 : 10
          const y = position.includes('bottom') ? canvas.height - 10 : 20

          ctx.fillText(options.watermark.text, x, y)

          // Convert canvas to blob
          return new Promise(resolve => {
            canvas.toBlob(
              blob => {
                resolve(blob)
              },
              'image/png',
              0.9,
            )
          })
        }
      }

      // Convert data URL to blob if no watermark was added
      const response = await fetch(dataUrl)
      return await response.blob()
    } catch (error) {
      console.error('Error capturing element:', error)
      return null
    }
  }

  /**
   * Shares content using the Web Share API with fallbacks
   */
  const shareContent = async (
    elementRef: React.RefObject<HTMLElement>,
    options: ShareOptions,
  ): Promise<void> => {
    try {
      // Set sharing state
      setIsSharing(true)

      // Capture the element as an image if a ref is provided
      const imageBlob = elementRef ? await captureElementAsImage(elementRef, options) : null

      // Create share data
      const shareData: ShareData = {
        title: options.title,
        text: options.text,
        url: options.url,
      }

      // Add image file if available
      if (imageBlob) {
        const file = new File([imageBlob], 'shared-content.png', {
          type: 'image/png',
        })

        shareData.files = [file]
      }

      // Check if Web Share API is supported and can share files
      if (
        navigator.share &&
        (!imageBlob || (navigator.canShare && navigator.canShare({ files: shareData.files })))
      ) {
        // Try to share with files if supported
        await navigator.share(shareData)
        console.log('Shared successfully with Web Share API')
      } else if (navigator.share) {
        // Fallback to sharing without files
        const textOnlyShareData = {
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        }
        await navigator.share(textOnlyShareData)
        console.log('Shared successfully without image')
      } else {
        // Fallback for browsers without Web Share API
        console.log('Web Share API not supported in this browser')

        // Create a fallback share mechanism - download image and copy text
        if (imageBlob) {
          // Create a download link for the image
          const url = URL.createObjectURL(imageBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'shared-content.png'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          // Copy text to clipboard
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}\n${shareData.url}`,
          )

          alert('Image downloaded and text copied to clipboard!')
        } else {
          // Just copy text to clipboard
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}\n${shareData.url}`,
          )
          alert('Text copied to clipboard!')
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // If error is AbortError, user likely canceled the share
      if (error instanceof Error && error.name !== 'AbortError') {
        alert('There was an error sharing. Please try again.')
      }
    } finally {
      setIsSharing(false)
    }
  }

  return {
    isSharing,
    shareContent,
    captureElementAsImage,
  }
}
