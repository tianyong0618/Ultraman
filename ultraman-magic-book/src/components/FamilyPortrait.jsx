import { memo, useMemo, useCallback } from 'react'
import { ultramanData, ultramanRelations } from '../data/ultraman'

const AVATAR_SIZE = 48
const MIN_DISTANCE = 100

function generatePositions(count) {
  const positions = []
  const margin = 60
  
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let x, y
    
    do {
      x = margin + Math.random() * (window.innerWidth - margin * 2 - AVATAR_SIZE)
      y = margin + Math.random() * (window.innerHeight - margin * 2 - AVATAR_SIZE)
      attempts++
    } while (
      attempts < 100 &&
      positions.some(pos => {
        const dx = pos.x - x
        const dy = pos.y - y
        return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE
      })
    )
    
    positions.push({ x, y })
  }
  
  return positions
}

export const FamilyPortrait = memo(function FamilyPortrait({
  isFilterMode = false,
  filterId = null,
  onAvatarClick,
}) {
  const positions = useMemo(() => generatePositions(ultramanData.length), [])
  
  const getRelationById = useCallback((id) => {
    return ultramanRelations.find(r => r.id === id)
  }, [])
  
  const lines = useMemo(() => {
    const result = []
    
    ultramanRelations.forEach(rel => {
      rel.relatedIds.forEach(targetId => {
        const fromIdx = ultramanData.findIndex(u => u.id === rel.id)
        const toIdx = ultramanData.findIndex(u => u.id === targetId)
        
        if (fromIdx !== -1 && toIdx !== -1) {
          const fromPos = positions[fromIdx]
          const toPos = positions[toIdx]
          
          if (fromPos && toPos) {
            result.push({
              fromId: rel.id,
              toId: targetId,
              fromPos,
              toPos,
              type: rel.relationType,
              label: rel.label,
            })
          }
        }
      })
    })
    
    return result
  }, [positions])
  
  const getAvatarClass = useCallback((id) => {
    if (!isFilterMode) return 'avatar'
    
    if (id === filterId) return 'avatar selected'
    
    const relation = getRelationById(id)
    if (relation) {
      const isRelated = relation.relatedIds.includes(filterId) ||
                       ultramanRelations.some(r => r.id === filterId && r.relatedIds.includes(id))
      if (isRelated) return 'avatar related'
    }
    
    return 'avatar dimmed'
  }, [isFilterMode, filterId, getRelationById])
  
  return (
    <div className="family-portrait">
      <div className="starfield">
        <div className="stars" />
      </div>
      
      <svg className="relation-lines">
        {lines.map((line, idx) => {
          const isVisible = !isFilterMode ||
                           line.fromId === filterId ||
                           line.toId === filterId ||
                           ultramanRelations.some(r => r.id === filterId && r.relatedIds.includes(line.fromId)) ||
                           ultramanRelations.some(r => r.id === filterId && r.relatedIds.includes(line.toId))
          
          return (
            <line
              key={idx}
              x1={line.fromPos.x + AVATAR_SIZE / 2}
              y1={line.fromPos.y + AVATAR_SIZE / 2}
              x2={line.toPos.x + AVATAR_SIZE / 2}
              y2={line.toPos.y + AVATAR_SIZE / 2}
              className={`relation-line ${line.type} ${isVisible ? '' : 'hidden'}`}
            />
          )
        })}
      </svg>
      
      {ultramanData.map((ultraman, idx) => {
        const pos = positions[idx]
        if (!pos) return null
        
        return (
          <button
            key={ultraman.id}
            className={getAvatarClass(ultraman.id)}
            style={{
              left: pos.x,
              top: pos.y,
              '--avatar-color': ultraman.color,
            }}
            onClick={() => onAvatarClick && onAvatarClick(ultraman.id)}
            title={ultraman.name}
          >
            <img
              src={ultraman.image}
              alt={ultraman.name}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </button>
        )
      })}
    </div>
  )
})