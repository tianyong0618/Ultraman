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

// Generate stable random positions with popular heroes centered
function generatePositionsByPopularity(count) {
  const isMobile = window.innerWidth < 500
  const cacheKey = `ultraman_positions_${isMobile ? 'mobile' : 'desktop'}`
  
  // Try to get cached positions
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (parsed.length === count) {
        return parsed
      }
    } catch {}
  }
  
  const popularity = calculatePopularity()
  const margin = isMobile ? 30 : 60
  const minDistance = isMobile ? 50 : 100
  const positions = []
  const usedPositions = []
  
  // Sort by popularity (highest first)
  const sorted = ultramanData.map((u, idx) => ({
    idx,
    id: u.id,
    popularity: popularity[u.id] || 0,
  })).sort((a, b) => b.popularity - a.popularity)
  
  // Generate positions - popular ones get priority for inner positions
  sorted.forEach((item) => {
    let x, y, attempts = 0
    const targetRadius = 1 - (item.popularity / 4) * 0.5
    
    do {
      const maxRadius = window.innerWidth * targetRadius
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * maxRadius
      x = margin + Math.random() * (window.innerWidth - margin * 2 - 48)
      y = margin + Math.random() * (window.innerHeight - margin * 2 - 48)
      
      // For popular heroes, prefer center region
      if (item.popularity >= 2) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
        const maxDist = Math.min(centerX, centerY) * 0.3
        
        if (distFromCenter > maxDist) {
          attempts++
          continue
        }
      }
      
      attempts++
    } while (
      attempts < 100 &&
      usedPositions.some(pos => {
        const dx = pos.x - x
        const dy = pos.y - y
        return Math.sqrt(dx * dx + dy * dy) < minDistance
      })
    )
    
    usedPositions.push({ x, y })
    
    const layer = getLayerConfig(item.popularity)
    const size = window.innerWidth < 500 ? 36 : layer.size
    positions[item.idx] = {
      x,
      y,
      size,
      layer: layer.name,
    }
  })
  
  // Cache the positions
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(positions))
  } catch {}
  
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
      
      <div className="relation-legend">
        <div className="legend-item"><span className="legend-line brother"></span>奥特兄弟</div>
        <div className="legend-item"><span className="legend-line master"></span>师徒</div>
        <div className="legend-item"><span className="legend-line parallel"></span>平成三杰</div>
        <div className="legend-item"><span className="legend-line parent"></span>父子</div>
      </div>
      
      <svg className="relation-lines">
        <defs>
          <marker id="arrow-brother" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#FFD700" />
          </marker>
          <marker id="arrow-master" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#00BFFF" />
          </marker>
          <marker id="arrow-parallel" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#FF69B4" />
          </marker>
          <marker id="arrow-parent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#98FB98" />
          </marker>
        </defs>
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
              markerEnd={`url(#arrow-${line.type})`}
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