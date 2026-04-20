import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePageFlip } from '../src/hooks/usePageFlip'

describe('usePageFlip Hook', () => {
  it('triggers onSwipeLeft when swiping left beyond threshold', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
    )

    const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerDown(event)
    })

    const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerMove(moveEvent)
    })

    const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerUp(upEvent)
    })

    expect(onSwipeLeft).toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('triggers onSwipeRight when swiping right beyond threshold', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
    )

    const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerDown(event)
    })

    const moveEvent = new PointerEvent('pointermove', { clientX: 180, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerMove(moveEvent)
    })

    const upEvent = new PointerEvent('pointerup', { clientX: 180, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerUp(upEvent)
    })

    expect(onSwipeRight).toHaveBeenCalled()
    expect(onSwipeLeft).not.toHaveBeenCalled()
  })

  it('does not trigger when swipe distance is below threshold', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
    )

    const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerDown(event)
    })

    const moveEvent = new PointerEvent('pointermove', { clientX: 120, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerMove(moveEvent)
    })

    const upEvent = new PointerEvent('pointerup', { clientX: 120, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerUp(upEvent)
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('does not trigger when disabled', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      usePageFlip({ onSwipeLeft, onSwipeRight, disabled: true })
    )

    const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerDown(event)
    })

    const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerMove(moveEvent)
    })

    const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerUp(upEvent)
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('does not trigger when vertical movement dominates', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      usePageFlip({ onSwipeLeft, onSwipeRight, disabled: false })
    )

    const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 })
    act(() => {
      result.current.handlers.onPointerDown(event)
    })

    const moveEvent = new PointerEvent('pointermove', { clientX: 30, clientY: 200 })
    act(() => {
      result.current.handlers.onPointerMove(moveEvent)
    })

    const upEvent = new PointerEvent('pointerup', { clientX: 30, clientY: 200 })
    act(() => {
      result.current.handlers.onPointerUp(upEvent)
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })
})
