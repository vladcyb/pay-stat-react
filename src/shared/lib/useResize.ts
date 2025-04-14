import { useState, useEffect } from 'react'

type WindowSize = {
  screenWidth: number
  screenHeight: number
}

export const useResize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return windowSize
}
