import { useState, useEffect, useCallback } from 'react'
import { ultramanData, totalPages } from '../data/ultraman'

export function useMagicBook() {
  const [started, setStarted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [activeForm, setActiveForm] = useState(0)
  const [soundOn, setSoundOn] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [imageLoadError, setImageLoadError] = useState({})

  const current = ultramanData[currentPage]

  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoadError(prev => ({...prev, [currentPage]: false}))
    img.onerror = () => setImageLoadError(prev => ({...prev, [currentPage]: true}))
    img.src = ultramanData[currentPage]?.image
  }, [currentPage])

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true)
      const rightPage = document.querySelector('.page-right')
      rightPage?.classList.add('flipping')
      setTimeout(() => {
        rightPage?.classList.remove('flipping')
        setCurrentPage(p => p + 1)
        setActiveTab(0)
        setActiveForm(0)
        setIsFlipping(false)
      }, 580)
    }
  }, [currentPage, isFlipping])

  const goPrev = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      const leftPage = document.querySelector('.page-left')
      leftPage?.classList.add('flipping')
      setTimeout(() => {
        leftPage?.classList.remove('flipping')
        setCurrentPage(p => p - 1)
        setActiveTab(0)
        setActiveForm(0)
        setIsFlipping(false)
      }, 580)
    }
  }, [currentPage, isFlipping])

  const playSkill = useCallback((skillName) => {
    if (soundOn) {
      const audio = new Audio(`data:audio/wav;base64,`)
      audio.play().catch(() => {})
    }
  }, [soundOn])

  const toggleSound = useCallback(() => {
    setSoundOn(prev => !prev)
  }, [])

  return {
    started,
    setStarted,
    currentPage,
    setCurrentPage,
    activeTab,
    setActiveTab,
    activeForm,
    setActiveForm,
    soundOn,
    setSoundOn,
    isFlipping,
    imageLoadError,
    current,
    totalPages,
    goNext,
    goPrev,
    playSkill,
    toggleSound,
  }
}