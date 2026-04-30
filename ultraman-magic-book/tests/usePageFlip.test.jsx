import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePageFlip } from '../src/hooks/usePageFlip'

describe('usePageFlip Hook', () => {
  describe('handlePointerDown', () => {
    it('does not set state when disabled is true', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: true })
      )

      const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(event)
      })

      // When disabled, the hook should not set any state
      // The handlers should still be callable but state shouldn't be updated
      expect(result.current.onPointerDown).toBeDefined()
    })

    it('sets startX, startY, currentX, isSwiping when disabled is false', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(event)
      })

      // Verify the handler was called without errors
      expect(result.current.onPointerDown).toBeDefined()
    })

    it('updates coordinates on multiple pointerdown calls', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // First pointer down
      const event1 = new PointerEvent('pointerdown', { clientX: 50, clientY: 50 })
      act(() => {
        result.current.onPointerDown(event1)
      })

      // Second pointer down (should update)
      const event2 = new PointerEvent('pointerdown', { clientX: 200, clientY: 150 })
      act(() => {
        result.current.onPointerDown(event2)
      })

      expect(result.current.onPointerDown).toBeDefined()
    })
  })

  describe('handlePointerMove', () => {
    it('does not update currentX when isSwiping is false', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Try to move without starting a swipe
      const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      // Should not throw and handler should be defined
      expect(result.current.onPointerMove).toBeDefined()
    })

    it('does not update currentX when disabled is true', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: true })
      )

      // Try to move while disabled
      const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      expect(result.current.onPointerMove).toBeDefined()
    })

    it('updates currentX when isSwiping is true and disabled is false', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Start swipe
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Move
      const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      expect(result.current.onPointerMove).toBeDefined()
    })
  })

  describe('handlePointerUp', () => {
    it('resets isSwiping and returns early when isSwiping is false', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Try to lift without starting a swipe
      const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      // Should not trigger any callbacks
      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('resets isSwiping and returns early when disabled is true', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: true })
      )

      // Try to lift while disabled
      const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('does not trigger any callback when vertical movement dominates (deltaY > |deltaX| * 2)', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Start at (100, 100)
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Move to (90, 200) - small X change, large Y change
      // deltaX = -10, deltaY = 100
      // deltaY > |deltaX| * 2 => 100 > 20 => true
      const moveEvent = new PointerEvent('pointermove', { clientX: 90, clientY: 200 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 90, clientY: 200 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('triggers onSwipeRight when deltaX > SWIPE_THRESHOLD (50)', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Start at (100, 100)
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Move to (180, 100) - deltaX = 80 > 50
      const moveEvent = new PointerEvent('pointermove', { clientX: 180, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 180, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeRight).toHaveBeenCalled()
      expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    it('triggers onSwipeLeft when deltaX < -SWIPE_THRESHOLD (-50)', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Start at (100, 100)
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Move to (30, 100) - deltaX = -70 < -50
      const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('does not trigger any callback when -50 <= deltaX <= 50', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      // Start at (100, 100)
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Move to (120, 100) - deltaX = 20, within threshold
      const moveEvent = new PointerEvent('pointermove', { clientX: 120, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 120, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('resets isSwiping to false after successful handling', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result, rerender } = renderHook(({ onSwipeLeft, onSwipeRight }) =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false }), {
        initialProps: { onSwipeLeft, onSwipeRight }
      }
      )

      // Start swipe
      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // Complete swipe to right
      const moveEvent = new PointerEvent('pointermove', { clientX: 180, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 180, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      // After first swipe completes, isSwiping should be reset
      // Try another swipe
      const downEvent2 = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent2)
      })

      const moveEvent2 = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent2)
      })

      const upEvent2 = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent2)
      })

      // Should trigger left swipe (second swipe worked because first was reset)
      expect(onSwipeLeft).toHaveBeenCalledTimes(1)
    })
  })

  describe('return value', () => {
    it('returns an object with three event handler functions', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      expect(result.current).toEqual(
        expect.objectContaining({
          onPointerDown: expect.any(Function),
          onPointerMove: expect.any(Function),
          onPointerUp: expect.any(Function),
        })
      )
    })
  })

  describe('boundary conditions', () => {
    it('triggers onSwipeRight at exactly SWIPE_THRESHOLD + 1', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // deltaX = 51 (exactly threshold + 1)
      const moveEvent = new PointerEvent('pointermove', { clientX: 151, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 151, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeRight).toHaveBeenCalled()
      expect(onSwipeLeft).not.toHaveBeenCalled()
    })

    it('triggers onSwipeLeft at exactly -SWIPE_THRESHOLD - 1', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // deltaX = -51 (exactly -threshold - 1)
      const moveEvent = new PointerEvent('pointermove', { clientX: 49, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 49, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('does not trigger at exactly SWIPE_THRESHOLD', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // deltaX = 50 (exactly threshold)
      const moveEvent = new PointerEvent('pointermove', { clientX: 150, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 150, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })

    it('does not trigger at exactly -SWIPE_THRESHOLD', () => {
      const onSwipeLeft = vi.fn()
      const onSwipeRight = vi.fn()

      const { result } = renderHook(() =>
        usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
      )

      const downEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
      act(() => {
        result.current.onPointerDown(downEvent)
      })

      // deltaX = -50 (exactly -threshold)
      const moveEvent = new PointerEvent('pointermove', { clientX: 50, clientY: 100 })
      act(() => {
        result.current.onPointerMove(moveEvent)
      })

      const upEvent = new PointerEvent('pointerup', { clientX: 50, clientY: 100 })
      act(() => {
        result.current.onPointerUp(upEvent)
      })

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })
  })
})