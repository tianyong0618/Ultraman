import { useState, useCallback } from 'react'
import './index.css'
import { BookCover, UltramanInfo, Navigation, PageLeft, FamilyPortrait } from './components'
import { useMagicBook } from './hooks/useMagicBook'
import { usePageFlip } from './hooks/usePageFlip'

function App() {
  const {
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
    setImageLoadError,
    current,
    totalPages,
    goNext,
    goPrev,
    playAudioFile,
    playTabAudio,
    playSkill,
    activeSkill,
    isSkillAnimating,
    getSkillImage,
  } = useMagicBook()

  const [showFamilyPortrait, setShowFamilyPortrait] = useState(false)
  const [isFilterMode, setIsFilterMode] = useState(false)
  const [filterId, setFilterId] = useState(null)

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  const swipeHandlers = usePageFlip({
    onSwipeLeft: isLastPage ? undefined : goNext,
    onSwipeRight: isFirstPage ? undefined : goPrev,
    disabled: isFlipping,
  })

  const handleImageError = (ultramanId) => {
    setImageLoadError(prev => ({...prev, [ultramanId]: true}))
  }

  const handleSoundToggle = () => {
    setSoundOn(prev => !prev)
  }

  const handleStart = useCallback(() => {
    setShowFamilyPortrait(true)
    playAudioFile('name')
  }, [playAudioFile])

  const handleAvatarClick = useCallback((ultramanId) => {
    const pageIndex = ultramanId - 1
    setCurrentPage(pageIndex)
    setActiveTab(0)
    setActiveForm(0)
    setShowFamilyPortrait(false)
    setIsFilterMode(false)
    setFilterId(null)
    setStarted(true)
  }, [setCurrentPage, setActiveTab, setActiveForm, setStarted])

  const handleRelationClick = useCallback(() => {
    if (current) {
      setFilterId(current.id)
      setIsFilterMode(true)
      setShowFamilyPortrait(true)
    }
  }, [current])

  if (!started && !showFamilyPortrait) {
    return <BookCover onStart={handleStart} />
  }

  if (showFamilyPortrait) {
    return (
      <FamilyPortrait
        isFilterMode={isFilterMode}
        filterId={filterId}
        onAvatarClick={handleAvatarClick}
      />
    )
  }

  return (
    <div className="app">
      <button className="sound-toggle" onClick={handleSoundToggle}>
        {soundOn ? '🔊' : '🔇'}
      </button>

      <div className="magic-book">
        <div
          className={`book-pages active ${isFlipping ? 'flipping' : ''}`}
          onPointerDown={swipeHandlers.onPointerDown}
          onPointerMove={swipeHandlers.onPointerMove}
          onPointerUp={swipeHandlers.onPointerUp}
        >
          <div className="book-page">
            <PageLeft 
              current={current} 
              imageError={imageLoadError}
              onImageError={handleImageError}
              activeForm={activeForm}
              activeSkill={activeSkill}
              isSkillAnimating={isSkillAnimating}
              getSkillImage={getSkillImage}
            />
            <UltramanInfo 
              current={current}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              onPlaySkill={playSkill}
              playTabAudio={playTabAudio}
              onRelationClick={handleRelationClick}
            />
          </div>
        </div>

        <Navigation 
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </div>
  )
}

export default App