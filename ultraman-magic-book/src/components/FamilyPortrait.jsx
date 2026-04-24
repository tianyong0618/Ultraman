import { memo, useMemo, useCallback } from 'react'
import { ultramanData, ultramanRelations } from '../data/ultraman'

// Size constants for each popularity layer
const LAYER_SIZES = {
  hot: 72,      // Popular: >= 2 relationships
  normal: 56,   // Normal: 1 relationship
  cold: 40,     // Cold: 0 relationships
}

// Distance from center ratios
const LAYER_RATIOS = {
  hot: 0.15,
  normal: 0.35,
  cold: 0.60,
}

// Calculate popularity (relationship count) for each Ultraman
function calculatePopularity() {
  const popularity = {}
  
  // Initialize all IDs to 0
  ultramanData.forEach(u => {
    popularity[u.id] = 0
  })
  
  // Count relationships in both directions
  ultramanRelations.forEach(rel => {
    // Count outgoing relationships
    popularity[rel.id] = (popularity[rel.id] || 0) + rel.relatedIds.length
    // Count incoming relationships
    rel.relatedIds.forEach(targetId => {
      popularity[targetId] = (popularity[targetId] || 0) + 1
    })
  })
  
  return popularity
}

// Get layer config by popularity
function getLayerConfig(popularity) {
  if (popularity >= 2) {
    return { name: 'hot', size: LAYER_SIZES.hot, ratio: LAYER_RATIOS.hot }
  } else if (popularity === 1) {
    return { name: 'normal', size: LAYER_SIZES.normal, ratio: LAYER_RATIOS.normal }
  } else {
    return { name: 'cold', size: LAYER_SIZES.cold, ratio: LAYER_RATIOS.cold }
  }
}

// Generate positions with concentric circle layout based on popularity
function generatePositionsByPopularity(count) {
  const popularity = calculatePopularity()
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const positions = []
  
  // Create position data for each Ultraman
  const positionData = ultramanData.map((u, idx) => {
    const pop = popularity[u.id] || 0
    const layer = getLayerConfig(pop)
    return {
      idx,
      id: u.id,
      popularity: pop,
      layer,
      // Use stable angle distribution + small random offset
      baseAngle: (idx / count) * Math.PI * 2,
      randomOffset: (Math.random() - 0.5) * 0.3,
    }
  })
  
  // Sort by popularity (most popular first = inner layer)
  positionData.sort((a, b) => b.popularity - a.popularity)
  
  // Generate coordinates
  positionData.forEach((item, i) => {
    const layer = item.layer
    const minDistance = Math.min(centerX, centerY)
    const distance = minDistance * layer.ratio
    const angle = item.baseAngle + item.randomOffset
    
    positions.push({
      x: centerX + Math.cos(angle) * distance - layer.size / 2,
      y: centerY + Math.sin(angle) * distance - layer.size / 2,
      size: layer.size,
      layer: layer.name,
    })
  })
  
  return positions
}

export const FamilyPortrait = memo(function FamilyPortrait({
  isFilterMode = false,
  filterId = null,
  onAvatarClick,
}) {
  const positions = useMemo(() => generatePositionsByPopularity(ultramanData.length), [])
  
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
              fromIdx,
              toIdx,
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
          const fromPos = positions[line.fromIdx]
          const toPos = positions[line.toIdx]
          if (!fromPos || !toPos) return null
          
          const isVisible = !isFilterMode ||
                           line.fromId === filterId ||
                           line.toId === filterId ||
                           ultramanRelations.some(r => r.id === filterId && r.relatedIds.includes(line.fromId)) ||
                           ultramanRelations.some(r => r.id === filterId && r.relatedIds.includes(line.toId))
          
          return (
            <line
              key={idx}
              x1={line.fromPos.x + fromPos.size / 2}
              y1={line.fromPos.y + fromPos.size / 2}
              x2={line.toPos.x + toPos.size / 2}
              y2={line.toPos.y + toPos.size / 2}
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
              width: pos.size,
              height: pos.size,
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