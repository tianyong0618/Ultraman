import './index.css'
import { BookCover, UltramanInfo, Navigation, PageLeft } from './components'
import { useMagicBook } from './hooks/useMagicBook'

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
    playSkill,
  } = useMagicBook()

  const handleImageError = (pageId) => {
    setImageLoadError(prev => ({...prev, [pageId]: true}))
  }

  const handleSoundToggle = () => {
    setSoundOn(prev => !prev)
  }

  if (!started) {
    return <BookCover onStart={() => setStarted(true)} />
  }

  return (
    <div className="app">
      <button className="sound-toggle" onClick={handleSoundToggle}>
        {soundOn ? '🔊' : '🔇'}
      </button>

      <div className="magic-book">
        <div className={`book-pages active ${isFlipping ? 'flipping' : ''}`}>
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