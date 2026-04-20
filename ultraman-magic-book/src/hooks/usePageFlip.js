import { useRef, useCallback } from 'react'

const SWIPE_THRESHOLD = 50

export function usePageFlip({ onSwipeLeft, onSwipeRight, disabled = false }) {
  const startX = useRef(0)
  const startY = useRef(0)
  const currentX = useRef(0)
  const isSwiping = useRef(false)

  const handlePointerDown = useCallback((e) => {
    if (disabled) return
    startX.current = e.clientX
    startY.current = e.clientY
    currentX.current = e.clientX
    isSwiping.current = true
  }, [disabled])

  const handlePointerMove = useCallback((e) => {
    if (!isSwiping.current || disabled) return
    currentX.current = e.clientX
  }, [disabled])

  const handlePointerUp = useCallback((e) => {
    if (!isSwiping.current || disabled) {
      isSwiping.current = false
      return
    }

    const deltaX = currentX.current - startX.current
    const deltaY = Math.abs(e.clientY - startY.current)

    if (deltaY > Math.abs(deltaX) * 2) {
      isSwiping.current = false
      return
    }

    if (deltaX > SWIPE_THRESHOLD) {
      onSwipeRight?.()
    } else if (deltaX < -SWIPE_THRESHOLD) {
      onSwipeLeft?.()
    }

    isSwiping.current = false
  }, [disabled, onSwipeLeft, onSwipeRight])

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  }
}
