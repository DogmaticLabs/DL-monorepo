import { useBracketSlides } from '@/components/providers'
import { toPng } from 'html-to-image'
import { useState } from 'react'

interface ShareOptions {
  url: string
  captureOptions?: {
    quality?: number
    backgroundColor?: string
    pixelRatio?: number
    skipFonts?: boolean
    cacheBust?: boolean
    filter?: (node: HTMLElement) => boolean
    skipTwitterOptimization?: boolean // Only used to disable Twitter optimization
  }
}

interface UseShareContentReturn {
  isSharing: boolean
  shareContent: (
    elementRefOrOptions?: React.RefObject<HTMLElement> | ShareOptions,
    options?: ShareOptions,
  ) => Promise<void>
  captureElementAsImage: (
    elementRef?: React.RefObject<HTMLElement>,
    options?: ShareOptions,
  ) => Promise<Blob | null>
}

/**
 * Hook for sharing content with the Web Share API, with fallbacks
 * Includes functionality to capture an element as an image
 * Automatically optimizes images for Twitter to prevent conversion to JPG
 */
export const useShareContent = (): UseShareContentReturn => {
  const [isSharing, setIsSharing] = useState(false)
  const [bracketSlidesData] = useBracketSlides()

  /**
   * Captures an HTML element as an image
   * Automatically optimizes for Twitter to prevent JPG conversion
   */
  const captureElementAsImage = async (
    elementRef?: React.RefObject<HTMLElement>,
    options?: ShareOptions,
  ): Promise<Blob | null> => {
    if (!elementRef?.current) return null

    try {
      // Default capture options
      const captureOpts = {
        pixelRatio: 2, // Higher ratio for better quality
        backgroundColor: options?.captureOptions?.backgroundColor || 'transparent',
        skipFonts: false,
        cacheBust: true,
        ...options?.captureOptions,
      }

      // Force transparent background to avoid white backgrounds
      // Only override if not explicitly set by user
      if (!options?.captureOptions?.backgroundColor) {
        captureOpts.backgroundColor = 'transparent'
      }

      await toPng(elementRef?.current, captureOpts)
      await toPng(elementRef?.current, captureOpts)
      await toPng(elementRef?.current, captureOpts)
      // Capture the element as a PNG
      const dataUrl = await toPng(elementRef?.current, {
        ...captureOpts,
        onImageErrorHandler: error => {
          console.error('Error capturing element:', error)
        },
      })

      // Convert data URL to blob
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
    elementRefOrOptions?: React.RefObject<HTMLElement> | ShareOptions,
    optionsParam?: ShareOptions,
  ): Promise<void> => {
    try {
      // Set sharing state
      setIsSharing(true)

      // Determine if first param is elementRef or options
      let elementRef: React.RefObject<HTMLElement> | undefined
      let options: ShareOptions | undefined

      if (elementRefOrOptions && 'current' in elementRefOrOptions) {
        // First param is elementRef
        elementRef = elementRefOrOptions
        options = optionsParam
      } else {
        // First param is options
        elementRef = undefined
        options = elementRefOrOptions as ShareOptions
      }

      // Make sure we have options
      if (!options) {
        throw new Error('Share options are required')
      }

      // Capture the element as an image if a ref is provided
      const imageBlob = elementRef ? await captureElementAsImage(elementRef, options) : null

      // Create share data
      const shareData: ShareData = {
        title: 'BracketWrap',
        text: `View your bracket wrap${bracketSlidesData?.info.group ? ` for ${bracketSlidesData?.info.group.data.name}` : ''} now! `,
        url: options?.url,
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
          title: 'BracketWrap',
          text: 'View your bracket wrap:',
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
      console.log('Error sharing:', error)
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
