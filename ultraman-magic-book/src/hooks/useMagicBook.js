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

  let audioPlayer = null

  const playAudioFile = useCallback((type) => {
    if (!soundOn || typeof window === 'undefined') return
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer = null
    }
    audioPlayer = new Audio(`/audio/${type}/${currentPage + 1}.mp3`)
    audioPlayer.play().catch(() => {})
  }, [soundOn, currentPage])

  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoadError(prev => ({...prev, [currentPage]: false}))
    img.onerror = () => setImageLoadError(prev => ({...prev, [currentPage]: true}))
    img.src = ultramanData[currentPage]?.image
  }, [currentPage])

  useEffect(() => {
    if (started && soundOn && current) {
      playAudioFile('name')
    }
  }, [currentPage, started, soundOn, playAudioFile])

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

  const playTabAudio = useCallback((tabIndex) => {
    if (!soundOn) return
    const typeMap = ['desc', 'forms', 'skills', 'human', 'catchphrase']
    const type = typeMap[tabIndex]
    if (type) {
      playAudioFile(type)
    }
  }, [playAudioFile])

  const playSkill = useCallback((skillIndex) => {
    if (!soundOn) return
    const item = ultramanData[currentPage]
    if (item && item.skills[skillIndex]) {
      const audio = new Audio(`/audio/skills/${currentPage + 1}.mp3`)
      audio.play().catch(() => {})
    }
  }, [soundOn, currentPage])

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
    playAudioFile,
    playTabAudio,
    playSkill,
    toggleSound,
  }
}