import { memo } from 'react'

export const BookCover = memo(function BookCover({ onStart }) {
  return (
    <div className="app">
      <div className="book-cover">
        <div className="magic-circle"></div>
        <div className="corner-ornament top-left">✦</div>
        <div className="corner-ornament top-right">✦</div>
        <div className="corner-ornament bottom-left">✦</div>
        <div className="corner-ornament bottom-right">✦</div>
        <h1 className="book-cover-title">奥特曼魔法书</h1>
        <p className="book-cover-subtitle">ULTRAMAN MAGIC BOOK</p>
        <button className="start-button" onClick={onStart}>
          ✦ 开启旅程 ✦
        </button>
      </div>
    </div>
  )
})