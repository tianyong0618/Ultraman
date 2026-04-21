import { memo } from 'react'

export const Navigation = memo(function Navigation({ currentPage, totalPages, onPrev, onNext, playAudio }) {
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  const handlePrev = () => {
    onPrev()
    if (playAudio) playAudio('name')
  }

  const handleNext = () => {
    onNext()
    if (playAudio) playAudio('name')
  }

  return (
    <>
      <button
        className="nav-button prev"
        onClick={handlePrev}
        disabled={isFirstPage}
        aria-label="上一页"
      >
        ‹
      </button>
      <button
        className="nav-button next"
        onClick={handleNext}
        disabled={isLastPage}
        aria-label="下一页"
      >
        ›
      </button>
      <p className="page-indicator">{currentPage + 1} / {totalPages}</p>
    </>
  )
})