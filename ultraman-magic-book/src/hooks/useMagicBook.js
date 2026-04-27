import { useState, useEffect, useCallback, useRef } from 'react'
import { ultramanData, totalPages } from '../data/ultraman'

const STORAGE_KEY = 'ultraman-magic-book-state'

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        savedPage: parsed.currentPage ?? 0,
        savedTab: parsed.activeTab ?? 0,
        savedForm: parsed.activeForm ?? 0,
        savedStarted: parsed.started ?? false,
      }
    }
  } catch (e) {}
  return { savedPage: 0, savedTab: 0, savedForm: 0, savedStarted: false }
}

function saveStateToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {}
}

export function useMagicBook() {
  const saved = loadStateFromStorage()
  const [started, setStarted] = useState(saved.savedStarted)
  const [currentPage, setCurrentPage] = useState(saved.savedPage)
  const [activeTab, setActiveTab] = useState(saved.savedTab)
  const [activeForm, setActiveForm] = useState(saved.savedForm)
  const [soundOn, setSoundOn] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [imageLoadError, setImageLoadError] = useState({})
  const [activeSkill, setActiveSkill] = useState(null)
  const [isSkillAnimating, setIsSkillAnimating] = useState(false)

  const current = ultramanData[currentPage]

  const audioPlayerRef = useRef(null)
  const preloadedAudioRef = useRef({})

  const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')

  const getSkillImage = useCallback((ultramanName, skillName) => {
    const sanitize = (name) => name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
    return `/Ultraman/images/skills/${sanitize(ultramanName)}_${sanitize(skillName)}.jpg`
  }, [])

  const preloadAudio = useCallback((type, name) => {
    const key = `${type}/${name}`
    if (!preloadedAudioRef.current[key]) {
      const audio = new Audio(`/Ultraman/audio/${type}/${name}.mp3`)
      audio.preload = 'auto'
      preloadedAudioRef.current[key] = audio
    }
  }, [])

  const playAudioFile = useCallback((type) => {
    if (!soundOn || typeof window === 'undefined' || !current) return
    const safeName = sanitizeFilename(current.name)
    const key = `${type}/${safeName}`
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current = null
    }
    
    if (preloadedAudioRef.current[key]) {
      audioPlayerRef.current = preloadedAudioRef.current[key]
      audioPlayerRef.current.currentTime = 0
      const playPromise = audioPlayerRef.current.play()
      if (playPromise) playPromise.catch(() => {})
    } else {
      audioPlayerRef.current = new Audio(`/Ultraman/audio/${type}/${safeName}.mp3`)
      const playPromise = audioPlayerRef.current.play()
      if (playPromise) playPromise.catch(() => {})
      preloadAudio(type, safeName)
    }
  }, [soundOn, current, preloadAudio])

  useEffect(() => {
    const safeName = sanitizeFilename(ultramanData[currentPage]?.name)
    if (safeName) {
      preloadAudio('name', safeName)
    }
  }, [currentPage, preloadAudio])

  useEffect(() => {
    if (started && soundOn && current) {
      playAudioFile('name')
    }
  }, [started, soundOn, current, playAudioFile])

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
    if (!soundOn || !current) return
    const typeMap = ['forms', 'desc', 'human', 'catchphrase']
    const type = typeMap[tabIndex]
    if (type) {
      playAudioFile(type)
    }
  }, [playAudioFile, soundOn, current])

  const playSkill = useCallback((skillName) => {
    if (!soundOn || !current || !skillName) return
    const safeUltramanName = sanitizeFilename(current.name)
    const safeSkillName = skillName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
    const audioKey = `skills/${safeUltramanName}_${safeSkillName}`
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current = null
    }
    
    if (preloadedAudioRef.current[audioKey]) {
      audioPlayerRef.current = preloadedAudioRef.current[audioKey]
      audioPlayerRef.current.currentTime = 0
      const playPromise = audioPlayerRef.current.play()
      if (playPromise) playPromise.catch(() => {})
    } else {
      audioPlayerRef.current = new Audio(`/Ultraman/audio/skills/${safeUltramanName}_${safeSkillName}.mp3`)
      const playPromise = audioPlayerRef.current.play()
      if (playPromise) playPromise.catch(() => {})
      const skillAudio = new Audio(`/Ultraman/audio/skills/${safeUltramanName}_${safeSkillName}.mp3`)
      skillAudio.preload = 'auto'
      preloadedAudioRef.current[audioKey] = skillAudio
    }
    
    setActiveSkill(skillName)
    setIsSkillAnimating(true)
    
    setTimeout(() => {
      setIsSkillAnimating(false)
      setActiveSkill(null)
    }, 3000)
  }, [soundOn, current])

  const toggleSound = useCallback(() => {
    setSoundOn(prev => !prev)
  }, [])

  useEffect(() => {
    saveStateToStorage({
      currentPage,
      activeTab,
      activeForm,
      started,
    })
  }, [currentPage, activeTab, activeForm, started])

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
    activeSkill,
    setActiveSkill,
    isSkillAnimating,
    setIsSkillAnimating,
    getSkillImage,
  }
}