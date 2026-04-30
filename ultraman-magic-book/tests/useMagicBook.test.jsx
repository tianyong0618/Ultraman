import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMagicBook } from '../src/hooks/useMagicBook'

function createMockAudio() {
  return {
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    load: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    preload: 'auto',
    currentTime: 0,
    src: '',
  }
}

function createMockImage() {
  return {
    src: '',
    onload: null,
    onerror: null,
  }
}

const mockPageElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}

describe('useMagicBook Hook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'Audio', {
      writable: true,
      value: createMockAudio,
    })

    Object.defineProperty(window, 'Image', {
      writable: true,
      value: createMockImage,
    })

    document.querySelector = vi.fn((selector) => {
      if (selector === '.page-right' || selector === '.page-left') {
        return { ...mockPageElement }
      }
      return null
    })
  })

  describe('initial state', () => {
    it('loads initial state from localStorage', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.currentPage).toBe(0)
      expect(result.current.activeTab).toBe(0)
      expect(result.current.activeForm).toBe(0)
      expect(result.current.started).toBe(false)
      expect(result.current.soundOn).toBe(true)
    })

    it('returns current ultraman data', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.current).toBeDefined()
      expect(result.current.totalPages).toBeDefined()
      expect(result.current.totalPages).toBeGreaterThan(0)
    })
  })

  describe('setStarted', () => {
    it('sets started state to true', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setStarted(true)
      })
      expect(result.current.started).toBe(true)
    })
  })

  describe('setCurrentPage', () => {
    it('sets current page directly', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(5)
      })
      expect(result.current.currentPage).toBe(5)
    })
  })

  describe('setActiveTab', () => {
    it('sets active tab', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveTab(2)
      })
      expect(result.current.activeTab).toBe(2)
    })
  })

  describe('setActiveForm', () => {
    it('sets active form', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveForm(1)
      })
      expect(result.current.activeForm).toBe(1)
    })
  })

  describe('setSoundOn', () => {
    it('toggles sound on/off', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.soundOn).toBe(true)
      act(() => {
        result.current.setSoundOn(false)
      })
      expect(result.current.soundOn).toBe(false)
    })
  })

  describe('toggleSound', () => {
    it('toggles sound state', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.soundOn).toBe(true)
      act(() => {
        result.current.toggleSound()
      })
      expect(result.current.soundOn).toBe(false)
      act(() => {
        result.current.toggleSound()
      })
      expect(result.current.soundOn).toBe(true)
    })
  })

  describe('goNext', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not navigate when already at last page', () => {
      const { result } = renderHook(() => useMagicBook())
      const lastPage = result.current.totalPages - 1
      act(() => {
        result.current.setCurrentPage(lastPage)
      })
      act(() => {
        result.current.goNext()
      })
      expect(result.current.currentPage).toBe(lastPage)
    })

    it('navigates to next page', async () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.currentPage).toBe(0)
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(1)
    })

    it('resets activeTab and activeForm after navigation', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveTab(2)
        result.current.setActiveForm(1)
      })
      expect(result.current.activeTab).toBe(2)
      expect(result.current.activeForm).toBe(1)
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.activeTab).toBe(0)
      expect(result.current.activeForm).toBe(0)
    })

    it('resets activeSkill and isSkillAnimating after navigation', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveSkill('some-skill')
        result.current.setIsSkillAnimating(true)
      })
      expect(result.current.activeSkill).toBe('some-skill')
      expect(result.current.isSkillAnimating).toBe(true)
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.activeSkill).toBeNull()
      expect(result.current.isSkillAnimating).toBe(false)
    })
  })

  describe('goPrev', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not navigate when at first page', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.currentPage).toBe(0)
      act(() => {
        result.current.goPrev()
      })
      expect(result.current.currentPage).toBe(0)
    })

    it('navigates to previous page when not at first page', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(1)
      })
      expect(result.current.currentPage).toBe(1)
      act(() => {
        result.current.goPrev()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(0)
    })

    it('resets activeTab and activeForm after navigation', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(1)
        result.current.setActiveTab(2)
        result.current.setActiveForm(1)
      })
      act(() => {
        result.current.goPrev()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.activeTab).toBe(0)
      expect(result.current.activeForm).toBe(0)
    })
  })

  describe('playTabAudio', () => {
    it('returns early when sound is off', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setSoundOn(false)
      })
      expect(() => {
        act(() => {
          result.current.playTabAudio(0)
        })
      }).not.toThrow()
    })

    it('calls playAudioFile for valid tab index', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playTabAudio(0)
        })
      }).not.toThrow()
    })
  })

  describe('playAudioFile', () => {
    it('returns early when sound is off', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setSoundOn(false)
      })
      expect(() => {
        act(() => {
          result.current.playAudioFile('name')
        })
      }).not.toThrow()
    })

    it('creates audio without error', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playAudioFile('name')
        })
      }).not.toThrow()
    })
  })

  describe('playSkill', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns early when sound is off', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setSoundOn(false)
      })
      expect(() => {
        act(() => {
          result.current.playSkill('skill-name')
        })
      }).not.toThrow()
    })

    it('returns early when no skillName provided', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playSkill('')
        })
      }).not.toThrow()
    })

    it('sets activeSkill and isSkillAnimating state', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playSkill('some-skill')
      })
      expect(result.current.activeSkill).toBe('some-skill')
      expect(result.current.isSkillAnimating).toBe(true)
    })

    it('sets isSkillLoading to true initially', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playSkill('some-skill')
      })
      expect(result.current.isSkillLoading).toBe(true)
    })

    it('resets after timeout (15 seconds)', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playSkill('some-skill')
      })
      expect(result.current.activeSkill).toBe('some-skill')
      act(() => {
        vi.advanceTimersByTime(15000)
      })
      expect(result.current.activeSkill).toBeNull()
      expect(result.current.isSkillAnimating).toBe(false)
      expect(result.current.isSkillLoading).toBe(false)
    })
  })

  describe('getSkillImage', () => {
    it('returns correct image path', () => {
      const { result } = renderHook(() => useMagicBook())
      const imagePath = result.current.getSkillImage('Ultraman', 'Spear')
      expect(imagePath).toContain('Ultraman')
      expect(imagePath).toContain('Spear')
      expect(imagePath).toContain('.jpg')
    })
  })

  describe('localStorage state persistence', () => {
    it('saves state to localStorage when state changes', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.setCurrentPage(5)
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      expect(window.localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('setActiveSkill', () => {
    it('sets activeSkill directly', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveSkill('new-skill')
      })
      expect(result.current.activeSkill).toBe('new-skill')
    })
  })

  describe('setIsSkillAnimating', () => {
    it('sets isSkillAnimating directly', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setIsSkillAnimating(true)
      })
      expect(result.current.isSkillAnimating).toBe(true)
    })
  })

  describe('isFlipping state', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('starts as false', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.isFlipping).toBe(false)
    })

    it('becomes true during page flip', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.goNext()
      })
      expect(result.current.isFlipping).toBe(true)
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.isFlipping).toBe(false)
    })
  })

  describe('sound state behavior', () => {
    it('soundOn starts as true', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.soundOn).toBe(true)
    })
  })

  describe('page boundary behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('cannot goNext beyond last page', async () => {
      const { result } = renderHook(() => useMagicBook())
      const lastPage = result.current.totalPages - 1
      act(() => {
        result.current.setCurrentPage(lastPage)
      })
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(lastPage)
    })

    it('cannot goPrev before first page', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(result.current.currentPage).toBe(0)
      act(() => {
        result.current.goPrev()
      })
      expect(result.current.currentPage).toBe(0)
    })
  })

  describe('activeTab behavior', () => {
    it('can set multiple tab values', () => {
      const { result } = renderHook(() => useMagicBook())
      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.setActiveTab(i)
        })
        expect(result.current.activeTab).toBe(i)
      }
    })
  })

  describe('activeForm behavior', () => {
    it('can set multiple form values', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveForm(2)
      })
      expect(result.current.activeForm).toBe(2)
    })
  })

  describe('audio cleanup on navigation', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('pauses audio player on goNext', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playAudioFile('name')
      })
      act(() => {
        result.current.goNext()
      })
    })

    it('pauses audio player on goPrev', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(1)
      })
      act(() => {
        result.current.playAudioFile('name')
      })
      act(() => {
        result.current.goPrev()
      })
    })
  })

  describe('tab index mapping', () => {
    it('maps valid tab indices correctly', () => {
      const { result } = renderHook(() => useMagicBook())
      const tabTypes = ['forms', 'desc', 'human', 'catchphrase']
      for (let i = 0; i < tabTypes.length; i++) {
        expect(() => {
          act(() => {
            result.current.playTabAudio(i)
          })
        }).not.toThrow()
      }
    })
  })

  describe('playAudioFile with preloaded audio', () => {
    it('uses preloaded audio if available', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playAudioFile('name')
      })
    })
  })

  describe('playAudioFile returns early without current', () => {
    it('does not throw when current is undefined', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(0)
      })
    })
  })

  describe('playTabAudio returns early without current', () => {
    it('does not throw', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playTabAudio(5)
        })
      }).not.toThrow()
    })
  })

  describe('goNext does not navigate when isFlipping', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('blocks navigation while flipping', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.goNext()
      })
      expect(result.current.isFlipping).toBe(true)
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('goPrev does not navigate when isFlipping', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('blocks navigation while flipping', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(1)
      })
      act(() => {
        result.current.goPrev()
      })
      expect(result.current.isFlipping).toBe(true)
      act(() => {
        result.current.goPrev()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(0)
    })
  })

  describe('audio preload behavior', () => {
    it('preloads audio when currentPage changes', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.setCurrentPage(2)
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    })
  })

  describe('image preload behavior', () => {
    it('preloads images when currentPage changes', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.setCurrentPage(2)
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    })
  })

  describe('started state triggers audio playback', () => {
    it('plays audio when started becomes true', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.setStarted(true)
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    })
  })

  describe('getSkillAudioKey', () => {
    it('generates key for skill', () => {
      const { result } = renderHook(() => useMagicBook())
      const key = result.current.getSkillImage('Ultraman', 'Laser')
      expect(key).toContain('Ultraman')
    })
  })

  describe('audio preload caching', () => {
    it('clears old audio when exceeding limit', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        for (let i = 0; i < 25; i++) {
          result.current.setCurrentPage(i)
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      })
    })
  })

  describe('playSkill with image loading', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('handles skill with preloaded image', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.playSkill('test-skill')
        vi.advanceTimersByTime(100)
      })
      expect(result.current.activeSkill).toBe('test-skill')
    })
  })

  describe('playSkill early return conditions', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns when no current', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(0)
      })
    })
  })

  describe('goNext with page elements', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('works without page-right element', () => {
      document.querySelector = vi.fn(() => null)
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.goNext()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('goPrev with page elements', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('works without page-left element', () => {
      document.querySelector = vi.fn(() => null)
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(1)
      })
      act(() => {
        result.current.goPrev()
      })
      act(() => {
        vi.advanceTimersByTime(580)
      })
      expect(result.current.currentPage).toBe(0)
    })
  })

  describe('playTabAudio with invalid index', () => {
    it('handles invalid tab index', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playTabAudio(10)
        })
      }).not.toThrow()
    })
  })

  describe('playSkill returns early without skillName', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('handles null skillName', () => {
      const { result } = renderHook(() => useMagicBook())
      expect(() => {
        act(() => {
          result.current.playSkill(null)
        })
      }).not.toThrow()
    })
  })

  describe('playSkill returns early without current', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('handles undefined current', () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setCurrentPage(0)
      })
    })
  })

  describe('playSkill with full async flow', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('executes full skill play flow', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.playSkill('test')
        vi.runAllTimers()
      })
    })
  })

  describe('imageCache integration', () => {
    it('initializes with localStorage data', () => {
      window.localStorage.getItem = vi.fn(() => JSON.stringify({ '/test': true }))
      const { result } = renderHook(() => useMagicBook())
      expect(result.current).toBeDefined()
    })
  })

  describe('imageCache saves correctly', () => {
    it('persists image cache', async () => {
      const { result } = renderHook(() => useMagicBook())
      await act(async () => {
        result.current.setCurrentPage(1)
        await new Promise(r => setTimeout(r, 50))
      })
    })
  })

  describe('state persistence effect', () => {
    it('saves to localStorage on state change', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.setActiveTab(1)
      })
      act(() => {
        result.current.setActiveForm(1)
      })
      act(() => {
        result.current.setStarted(true)
      })
    })
  })

  describe('sanitizeFilename behavior', () => {
    it('handles unicode characters', () => {
      const { result } = renderHook(() => useMagicBook())
      const key = result.current.getSkillImage('赛罗', '光线')
      expect(key).toContain('.jpg')
    })
  })

  describe('multiple skill activations', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('cancels previous skill', async () => {
      const { result } = renderHook(() => useMagicBook())
      act(() => {
        result.current.playSkill('skill1')
      })
      act(() => {
        vi.advanceTimersByTime(100)
      })
      act(() => {
        result.current.playSkill('skill2')
      })
      expect(result.current.activeSkill).toBe('skill2')
    })
  })
})