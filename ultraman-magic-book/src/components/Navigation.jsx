import { memo } from 'react'

export const Navigation = memo(function Navigation({ currentPage, totalPages, onPrev, onNext }) {
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  return (
    <>
      <button className="nav-button prev" onClick={onPrev} disabled={isFirstPage}>
        ‹
      </button>
      <button className="nav-button next" onClick={onNext} disabled={isLastPage}>
        ›
      </button>
      <p className="page-indicator">{currentPage + 1} / {totalPages}</p>
    </>
  )
})