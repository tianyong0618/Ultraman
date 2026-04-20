import { memo } from 'react'

export const Navigation = memo(function Navigation({ currentPage, totalPages, onPrev, onNext }) {
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  return (
    <>
      <button
        className="nav-button prev"
        onClick={onPrev}
        disabled={isFirstPage}
        aria-label="上一页"
      >
        ‹
      </button>
      <button
        className="nav-button next"
        onClick={onNext}
        disabled={isLastPage}
        aria-label="下一页"
      >
        ›
      </button>
      <p className="page-indicator">{currentPage + 1} / {totalPages}</p>
    </>
  )
})