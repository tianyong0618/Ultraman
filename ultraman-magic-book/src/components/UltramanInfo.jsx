import { memo } from 'react'
import { infoLabels } from '../data/ultraman'

const TabContent = memo(function TabContent({ activeTab, current }) {
  return (
    <>
      {activeTab === 0 && <p className="info-text">{current.desc}</p>}
      {activeTab === 1 && (
        <div className="forms-list">
          {current.forms.length > 0 ? current.forms.map((form, idx) => (
            <button key={form} className={`form-button ${activeTab === idx ? 'active' : ''}`}>
              {form}
            </button>
          )) : <p className="info-text">无多种形态</p>}
        </div>
      )}
      {activeTab === 2 && <p className="info-text">{current.skills.join('、') || '无技能数据'}</p>}
      {activeTab === 3 && <p className="info-text">{current.human || '待补充'}</p>}
      {activeTab === 4 && <p className="info-text" style={{fontStyle:'italic'}}>"{current.catchphrase}"</p>}
    </>
  )
})

export const UltramanInfo = memo(function UltramanInfo({ current, activeTab, setActiveTab, activeForm, setActiveForm, onPlaySkill }) {
  return (
    <div className="page-right">
      <h2 className="ultraman-name">{current.name}</h2>
      <p className="ultraman-year">{current.year} · {current.series}</p>

      <div className="info-tabs">
        {infoLabels.map((label, idx) => (
          <button
            key={label}
            className={`info-tab ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
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
        <button className="skill-button" onClick={() => onPlaySkill(current.skills[0])}>
          ⚡ {current.skills[0] || '暂无技能'}
        </button>
      </div>
    </div>
  )
})