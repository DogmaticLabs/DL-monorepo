// Type definitions for Web Share API
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  canShare?: (data?: ShareData) => boolean
}
