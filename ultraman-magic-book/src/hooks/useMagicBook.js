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

  const speak = useCallback((text) => {
    if (!soundOn || !text || typeof window === 'undefined') return
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }, [soundOn])

  const playAudio = useCallback((type) => {
    if (!soundOn) return
    const item = ultramanData[currentPage]
    if (!item) return
    
    const textMap = {
      name: item.name,
      desc: item.desc,
      forms: item.forms.length > 0 ? item.forms.join('、') : '无多种形态',
      skills: item.skills.length > 0 ? item.skills.join('、') : '无技能数据',
      human: item.human || '待补充',
      catchphrase: item.catchphrase,
    }
    
    if (textMap[type]) {
      speak(textMap[type])
    }
  }, [soundOn, currentPage, speak])

  const playTabAudio = useCallback((tabIndex) => {
    if (!soundOn) return
    const typeMap = ['desc', 'forms', 'skills', 'human', 'catchphrase']
    const type = typeMap[tabIndex]
    if (type) {
      playAudio(type)
    }
  }, [playAudio])

  const playSkill = useCallback((skillName) => {
    if (soundOn && skillName) {
      speak(skillName)
    }
  }, [soundOn, speak])

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
    playAudio,
    playTabAudio,
    playSkill,
    toggleSound,
    speak,
  }
}