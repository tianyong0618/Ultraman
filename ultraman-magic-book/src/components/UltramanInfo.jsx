import { memo } from 'react'
import { infoLabels } from '../data/ultraman'

const TabContent = memo(function TabContent({ activeTab, current }) {
  return (
    <>
      {activeTab === 0 && (
        <p className="info-text" id="tabpanel-0" role="tabpanel">
          {current.desc}
        </p>
      )}
      {activeTab === 1 && (
        <p className="info-text" id="tabpanel-1" role="tabpanel">
          {current.human || '待补充'}
        </p>
      )}
      {activeTab === 2 && (
        <p className="info-text" id="tabpanel-2" role="tabpanel" style={{ fontStyle: 'italic' }}>
          "{current.catchphrase}"
        </p>
      )}
      {activeTab === 3 && (
        <div className="forms-list" role="group" aria-label="形态选择">
          {current.forms.length > 0 ? (
            current.forms.map((form, idx) => (
              <button
                key={form}
                className="form-button"
                aria-pressed={activeTab === 3}
              >
                {form}
              </button>
            ))
          ) : (
            <p className="info-text">无多种形态</p>
          )}
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
}) {
  const handleTabClick = (idx) => {
    setActiveTab(idx)
    if (playTabAudio) {
      playTabAudio(idx)
    }
  }

  return (
    <div className="page-right">
      <h2 className="ultraman-name">{current.name} · {current.year} · {current.era}</h2>

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
        <TabContent activeTab={activeTab} current={current} />
      </div>

      <div className="skills-section">
        <p className="skills-title">技能展示</p>
        <div className="skills-list">
          {current.skills.length > 0 ? (
            current.skills.map((skill, idx) => (
              <button
                key={skill}
                className="skill-button"
                onClick={() => onPlaySkill && onPlaySkill(idx)}
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
