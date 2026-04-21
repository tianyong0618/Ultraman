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

  const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')

  const playAudioFile = useCallback((type) => {
    if (!soundOn || typeof window === 'undefined' || !current) return
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer = null
    }
    const safeName = sanitizeFilename(current.name)
    audioPlayer = new Audio(`/audio/${type}/${safeName}.mp3`)
    audioPlayer.play().catch(() => {})
  }, [soundOn, current])

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
    const typeMap = ['desc', 'human', 'catchphrase', 'forms']
    const type = typeMap[tabIndex]
    if (type) {
      playAudioFile(type)
    }
  }, [playAudioFile])

  const playSkill = useCallback((skillIndex) => {
    if (!soundOn || !current) return
    const skillName = current.skills[skillIndex]
    if (skillName) {
      const safeUltramanName = sanitizeFilename(current.name)
      const safeSkillName = skillName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
      const audio = new Audio(`/audio/skills/${safeUltramanName}_${safeSkillName}.mp3`)
      audio.play().catch(() => {})
    }
  }, [soundOn, current])

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