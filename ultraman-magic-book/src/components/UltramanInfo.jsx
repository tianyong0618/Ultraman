import { memo } from 'react'
import { infoLabels, ultramanRelations, ultramanData } from '../data/ultraman'

const TabContent = memo(function TabContent({ activeTab, current, activeForm, setActiveForm }) {
  const handleFormClick = (idx) => {
    setActiveForm(idx)
  }

  const getRelations = () => {
    const relation = ultramanRelations.find(r => r.id === current.id)
    if (!relation || relation.relatedIds.length === 0) return []
    
    return relation.relatedIds.map(id => {
      const ultraman = ultramanData.find(u => u.id === id)
      return ultraman ? { ...ultraman, relationType: relation.relationType, label: relation.label } : null
    }).filter(Boolean)
  }

  return (
    <>
      {activeTab === 0 && (
        <div className="forms-list" role="group" aria-label="形态选择">
          {current.forms.length > 0 ? (
            current.forms.map((form, idx) => (
              <button
                key={form.name}
                className={`form-button ${activeForm === idx ? 'active' : ''}`}
                aria-pressed={activeForm === idx}
                onClick={() => handleFormClick(idx)}
              >
                {form.name}
              </button>
            ))
          ) : (
            <button className="form-button active">普通形态</button>
          )}
        </div>
      )}
      {activeTab === 1 && (
        <p className="info-text" id="tabpanel-1" role="tabpanel">
          {current.desc}
        </p>
      )}
      {activeTab === 2 && (
        <p className="info-text" id="tabpanel-2" role="tabpanel">
          {current.human || '待补充'}
        </p>
      )}
      {activeTab === 3 && (
        <div className="relation-list" id="tabpanel-3" role="tabpanel">
          {(() => {
            const relations = getRelations()
            if (relations.length === 0) {
              return <p className="info-text">暂无关系</p>
            }
            return (
              <div className="relation-items">
                {relations.map(u => (
                  <div key={u.id} className="relation-item" style={{ borderLeftColor: u.color }}>
                    <span className="relation-name">{u.name}</span>
                    <span className="relation-label">{u.label}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </>
  )
})

export const UltramanInfo = memo(function UltramanInfo({
  current,
  activeTab,
  setActiveTab,
  activeForm,
  setActiveForm,
  onPlaySkill,
  playTabAudio,
  onRelationClick,
}) {
  const handleTabClick = (idx) => {
    if (idx === 3 && onRelationClick) {
      onRelationClick()
    } else {
      setActiveTab(idx)
      if (playTabAudio) {
        playTabAudio(idx)
      }
    }
  }

  const currentFormData = current.forms && current.forms.length > 0 ? current.forms[activeForm] : null
  const displaySkills = currentFormData && currentFormData.skills && currentFormData.skills.length > 0
    ? currentFormData.skills
    : current.skills

  return (
    <div className="page-right">
      <h2 className="ultraman-name" style={{ textAlign: 'center' }}>{current.name} · {current.year}
        {currentFormData && currentFormData.name !== '普通形态' && <span className="current-form"> · {currentFormData.name}</span>}
      </h2>

      <div className="info-tabs" role="tablist" aria-label="信息分类">
        {infoLabels.map((label, idx) => (
          <button
            key={label}
            role="tab"
            aria-selected={activeTab === idx}
            aria-controls={`tabpanel-${idx}`}
            className={`info-tab ${activeTab === idx ? 'active' : ''}`}
            onClick={() => handleTabClick(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="info-content">
        <TabContent activeTab={activeTab} current={current} activeForm={activeForm} setActiveForm={setActiveForm} />
      </div>

      <div className="skills-section">
        <p className="skills-title">技能展示</p>
        <div className="skills-list">
          {displaySkills.length > 0 ? (
            displaySkills.map((skill, idx) => (
              <button
                key={skill}
                className="skill-button"
                onClick={() => onPlaySkill && onPlaySkill(skill)}
                aria-label={`播放技能: ${skill}`}
              >
                ⚡ {skill}
              </button>
            ))
          ) : (
            <p className="info-text">无技能数据</p>
          )}
        </div>
      </div>
    </div>
  )
})
