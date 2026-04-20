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
        />
      ) : null}
      <div className="ultraman-placeholder" style={{
        background: `linear-gradient(135deg, ${current.color} 0%, #ffffff 50%, ${current.color} 100%)`,
        display: !current.image || imageError[current.id - 1] ? 'flex' : 'none'
      }}>
        <span className="placeholder-text">{current.name.charAt(0)}</span>
      </div>
      <p className="page-left-title">{current.era}</p>
    </div>
  )
})