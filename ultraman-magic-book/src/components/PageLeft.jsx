import { memo } from 'react'

export const PageLeft = memo(function PageLeft({ 
  current, 
  imageError, 
  onImageError, 
  activeForm,
  activeSkill,
  isSkillAnimating,
  getSkillImage 
}) {
  const displayImage = current.forms && current.forms.length > 0 && current.forms[activeForm]
    ? current.forms[activeForm].image
    : current.image

  const skillImageSrc = activeSkill && isSkillAnimating && getSkillImage ? getSkillImage(current.name, activeSkill) : null

  const hasValidMainImage = displayImage && !imageError[current.id]

  return (
    <div className="page-left">
      {skillImageSrc ? (
        <img 
          src={skillImageSrc} 
          alt={`${current.name} - ${activeSkill}`}
          className="ultraman-image skill-animation"
          onError={() => {}}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      ) : hasValidMainImage ? (
        <img 
          src={displayImage} 
          alt={current.name}
          className="ultraman-image"
          onError={() => onImageError(current.id)}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
        />
      ) : null}
      <div className="ultraman-placeholder" style={{
        background: `linear-gradient(135deg, ${current.color} 0%, #ffffff 50%, ${current.color} 100%)`,
        display: !displayImage || imageError[current.id] ? 'flex' : 'none'
      }} draggable="false" onDragStart={(e) => e.preventDefault()}>
        <span className="placeholder-text">{current.name.charAt(0)}</span>
      </div>
    </div>
  )
})