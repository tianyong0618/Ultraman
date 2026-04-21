import { memo } from 'react'

export const PageLeft = memo(function PageLeft({ current, imageError, onImageError }) {
  return (
    <div className="page-left">
      {current.image && !imageError[current.id - 1] ? (
        <img 
          src={current.image} 
          alt={current.name}
          className="ultraman-image"
          onError={() => onImageError(current.id - 1)}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      ) : null}
      <div className="ultraman-placeholder" style={{
        background: `linear-gradient(135deg, ${current.color} 0%, #ffffff 50%, ${current.color} 100%)`,
        display: !current.image || imageError[current.id - 1] ? 'flex' : 'none'
      }} draggable="false" onDragStart={(e) => e.preventDefault()}>
        <span className="placeholder-text">{current.name.charAt(0)}</span>
      </div>
    </div>
  )
})