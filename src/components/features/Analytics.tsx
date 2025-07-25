import { useEffect } from 'react'

// Google Analytics 4 integration
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && import.meta.env.PROD) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', import.meta.env.VITE_GA_ID)
    }
  }, [])
}

// Page view tracking
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.VITE_GA_ID) {
    window.gtag('config', import.meta.env.VITE_GA_ID, {
      page_path: path,
    })
  }
}

// Event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}