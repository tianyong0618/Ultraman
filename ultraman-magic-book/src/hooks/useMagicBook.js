import { useState, useEffect, useCallback, useRef } from 'react'
import { ultramanData, totalPages } from '../data/ultraman'

const STORAGE_KEY = 'ultraman-magic-book-state'
const IMAGE_CACHE_KEY = 'ultraman-magic-book-image-cache'

function loadImageCache() {
  try {
    const saved = localStorage.getItem(IMAGE_CACHE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {}
  return {}
}

function saveImageCache(cache) {
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache))
  } catch (e) {}
}

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
  const [isSkillLoading, setIsSkillLoading] = useState(false)

  const current = ultramanData[currentPage]

  const audioPlayerRef = useRef(null)
  const preloadedAudioRef = useRef({})
  const skillTimeoutRef = useRef(null)
  const [imageCache, setImageCache] = useState(loadImageCache)
  const imageLoadingRef = useRef({})

const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
  
  const getSkillAudioKey = useCallback((ultramanName, skillName) => {
    return `${sanitizeFilename(ultramanName)}_${sanitizeFilename(skillName)}`
  }, [])
  
  const getSkillImage = useCallback((ultramanName, skillName) => {
    return `/images/skills/${sanitizeFilename(ultramanName)}_${sanitizeFilename(skillName)}.jpg`
  }, [])

  const preloadImage = useCallback((src) => {
    if (!src || imageCache[src] || imageLoadingRef.current[src]) return
    const img = new Image()
    img.onload = () => {
      const newCache = { ...imageCache, [src]: true }
      setImageCache(newCache)
      saveImageCache(newCache)
      delete imageLoadingRef.current[src]
    }
    img.onerror = () => {
      delete imageLoadingRef.current[src]
    }
    imageLoadingRef.current[src] = true
    img.src = src
  }, [imageCache])

  const preloadAudio = useCallback((type, name) => {
    const key = `${type}/${name}`
    if (!preloadedAudioRef.current[key]) {
      const audio = new Audio(`/audio/${type}/${name}.mp3`)
      audio.preload = 'auto'
      audio.addEventListener('error', () => console.warn('音频加载失败:', key))
      preloadedAudioRef.current[key] = audio
      
      if (Object.keys(preloadedAudioRef.current).length > 20) {
        const keys = Object.keys(preloadedAudioRef.current)
        keys.slice(0, 10).forEach(k => {
          preloadedAudioRef.current[k]?.pause()
          delete preloadedAudioRef.current[k]
        })
      }
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
      audioPlayerRef.current = new Audio(`/audio/${type}/${safeName}.mp3`)
      const playPromise = audioPlayerRef.current.play()
      if (playPromise) playPromise.catch(() => {})
      preloadAudio(type, safeName)
    }
  }, [soundOn, current, preloadAudio])

  useEffect(() => {
    const safeName = sanitizeFilename(ultramanData[currentPage]?.name)
    if (safeName) {
      preloadAudio('name', safeName)
      const currentUltraman = ultramanData[currentPage]
      if (currentUltraman) {
        currentUltraman.skills?.forEach(skillName => {
          preloadAudio('skills', getSkillAudioKey(currentUltraman.name, skillName))
        });
        currentUltraman.forms?.forEach(form => {
          form.skills?.forEach(skillName => {
            preloadAudio('skills', getSkillAudioKey(currentUltraman.name, skillName))
          })
        })
      }
    }
  }, [currentPage, preloadAudio, getSkillAudioKey])

  useEffect(() => {
    const currentUltraman = ultramanData[currentPage]
    if (currentUltraman) {
      preloadImage(currentUltraman.image)
      currentUltraman.forms?.forEach(form => {
        preloadImage(form.image)
      })
      currentUltraman.skills?.forEach(skillName => {
        preloadImage(getSkillImage(currentUltraman.name, skillName))
      })
      currentUltraman.forms?.forEach(form => {
        form.skills?.forEach(skillName => {
          preloadImage(getSkillImage(currentUltraman.name, skillName))
        })
      })
    }
  }, [currentPage, preloadImage, getSkillImage])

  useEffect(() => {
    if (started && soundOn && current) {
      playAudioFile('name')
    }
  }, [started, soundOn, current, playAudioFile])

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current = null
      }
      setIsFlipping(true)
      const rightPage = document.querySelector('.page-right')
      rightPage?.classList.add('flipping')
      setTimeout(() => {
        rightPage?.classList.remove('flipping')
        setCurrentPage(p => p + 1)
        setActiveTab(0)
        setActiveForm(0)
        setIsSkillAnimating(false)
        setActiveSkill(null)
        setIsFlipping(false)
      }, 580)
    }
  }, [currentPage, isFlipping])

  const goPrev = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current = null
      }
      setIsFlipping(true)
      const leftPage = document.querySelector('.page-left')
      leftPage?.classList.add('flipping')
      setTimeout(() => {
        leftPage?.classList.remove('flipping')
        setCurrentPage(p => p - 1)
        setActiveTab(0)
        setActiveForm(0)
        setIsSkillAnimating(false)
        setActiveSkill(null)
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
    const skillAudioKey = getSkillAudioKey(current.name, skillName)
    const audioKey = `skills/${skillAudioKey}`
    const skillImageSrc = getSkillImage(current.name, skillName)
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current = null
    }
    
    setActiveSkill(skillName)
    setIsSkillLoading(true)
    setIsSkillAnimating(true)
    
    const preloadImage = () => {
      return new Promise((resolve) => {
        if (imageCache[skillImageSrc]) {
          resolve(true)
          return
        }
        if (imageLoadingRef.current[skillImageSrc]) {
          imageLoadingRef.current[skillImageSrc].then(success => resolve(success))
          return
        }
        const img = new Image()
        const loadPromise = new Promise((res) => {
          img.onload = () => {
            const newCache = { ...imageCache, [skillImageSrc]: true }
            setImageCache(newCache)
            saveImageCache(newCache)
            delete imageLoadingRef.current[skillImageSrc]
            res(true)
          }
          img.onerror = () => {
            delete imageLoadingRef.current[skillImageSrc]
            res(false)
          }
        })
        imageLoadingRef.current[skillImageSrc] = loadPromise
        img.src = skillImageSrc
      })
    }
    
    const onImageLoaded = async () => {
      const imgLoaded = await preloadImage()
      if (!imgLoaded) {
        console.warn('技能图片加载失败:', skillImageSrc)
      }
      
      const onCanPlay = () => {
        setIsSkillLoading(false)
        if (audioPlayerRef.current) {
          audioPlayerRef.current.currentTime = 0
          audioPlayerRef.current.play().catch(console.warn)
        }
      }
      
      if (preloadedAudioRef.current[audioKey]) {
        audioPlayerRef.current = preloadedAudioRef.current[audioKey]
        onCanPlay()
      } else {
        const skillAudio = new Audio(`/audio/skills/${skillAudioKey}.mp3`)
        skillAudio.addEventListener('canplay', onCanPlay, { once: true })
        skillAudio.addEventListener('error', () => {
          setIsSkillLoading(false)
          console.warn('技能音频加载失败:', skillAudioKey)
        }, { once: true })
        audioPlayerRef.current = skillAudio
        skillAudio.load()
      }
    }
    
    skillTimeoutRef.current = setTimeout(() => {
      setIsSkillAnimating(false)
      setActiveSkill(null)
      setIsSkillLoading(false)
      skillTimeoutRef.current = null
    }, 15000)
    
    onImageLoaded()
  }, [soundOn, current, getSkillAudioKey, getSkillImage, imageCache])

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
    isSkillLoading,
    getSkillImage,
  }
}