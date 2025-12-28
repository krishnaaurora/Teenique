"use client"

import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text?: string
  duration?: number
  delay?: number
  className?: string
  onComplete?: () => void
}

export function TypingAnimation({
  text = "Gen-Z",
  duration = 100,
  delay = 0,
  className = "",
  onComplete,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setStarted(true)
      }, delay)
      return () => clearTimeout(delayTimeout)
    } else {
      setStarted(true)
    }
  }, [delay])

  useEffect(() => {
    if (started && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, duration)

      return () => clearTimeout(timeout)
    } else if (started && currentIndex === text.length) {
      onComplete?.()
    }
  }, [currentIndex, text, duration, started, onComplete])

  if (!started) return null

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}