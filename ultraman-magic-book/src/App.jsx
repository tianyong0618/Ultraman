import './index.css'
import { BookCover, UltramanInfo, Navigation, PageLeft } from './components'
import { useMagicBook } from './hooks/useMagicBook'
import { usePageFlip } from './hooks/usePageFlip'

function App() {
  const {
    started,
    setStarted,
    currentPage,
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
  } = useMagicBook()

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  const swipeHandlers = usePageFlip({
    onSwipeLeft: isLastPage ? undefined : goNext,
    onSwipeRight: isFirstPage ? undefined : goPrev,
    disabled: isFlipping,
  })

  const handleImageError = (pageId) => {
    setImageLoadError(prev => ({...prev, [pageId]: true}))
  }

  const handleSoundToggle = () => {
    setSoundOn(prev => !prev)
  }

  if (!started) {
    return <BookCover onStart={() => { setStarted(true); playAudio('name') }} />
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
            />
            <UltramanInfo 
              current={current}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              onPlaySkill={playSkill}
              playTabAudio={playTabAudio}
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