import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UltramanInfo } from '../src/components/UltramanInfo.jsx'

const mockCurrentWithForms = {
  id: 11,
  name: '迪迦奥特曼',
  year: 1996,
  desc: '来自3000万年前的超古代战士',
  human: '圆大古',
  forms: [
    { name: '复合型', skills: ['哉佩利敖光线'] },
    { name: '空中型', skills: ['兰帕尔特光弹'] },
    { name: '强力型', skills: ['迪迦拉休尔光流'] },
  ],
  skills: ['哉佩利敖光线', '迪迦拉休尔光流'],
}

const mockCurrentWithNoForms = {
  id: 1,
  name: '初代奥特曼',
  year: 1966,
  desc: '来自M78星云光之国的奥特战士',
  human: '早田进',
  forms: [],
  skills: ['斯派修姆光线', '奥特屏障'],
}

const mockCurrentWithRelations = {
  id: 11,
  name: '迪迦奥特曼',
  year: 1996,
  desc: '来自3000万年前的超古代战士',
  human: '圆大古',
  forms: [],
  skills: ['哉佩利敖光线'],
}

const mockCurrentWithNoRelations = {
  id: 5,
  name: '泰罗奥特曼',
  year: 1973,
  desc: '奥特之父与奥特之母的亲生儿子',
  human: '东光太郎',
  forms: [],
  skills: ['斯特利姆光线'],
}

const mockCurrentWithNoSkills = {
  id: 16,
  name: '麦克斯奥特曼',
  year: 2005,
  desc: '最快最强的奥特战士',
  human: '东马快斗',
  forms: [],
  skills: [],
}

describe('UltramanInfo 组件', () => {
  let setActiveTab
  let setActiveForm
  let onPlaySkill
  let playTabAudio
  let onRelationClick

  beforeEach(() => {
    setActiveTab = vi.fn()
    setActiveForm = vi.fn()
    onPlaySkill = vi.fn()
    playTabAudio = vi.fn()
    onRelationClick = vi.fn()
  })

  describe('标题渲染', () => {
    it('显示奥特曼名称和年份', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText(/初代奥特曼/)).toBeInTheDocument()
      expect(screen.getByText(/1966/)).toBeInTheDocument()
    })

    it('显示当前形态名称在标题中', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={1}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const formSpan = document.querySelector('.current-form')
      expect(formSpan).toBeInTheDocument()
      expect(formSpan).toHaveTextContent(/空中型/)
    })

    it('无形态时不显示形态名称', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(document.querySelector('.current-form')).not.toBeInTheDocument()
    })
  })

  describe('Tab 导航', () => {
    it('显示4个信息标签', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const tabs = screen.getAllByRole('tab')
      expect(tabs.length).toBe(4)
      expect(screen.getByText('形态')).toBeInTheDocument()
      expect(screen.getByText('简介')).toBeInTheDocument()
      expect(screen.getByText('人间体')).toBeInTheDocument()
      expect(screen.getByText('关系')).toBeInTheDocument()
    })

    it('点击 Tab 调用 setActiveTab', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      fireEvent.click(screen.getByText('简介'))
      expect(setActiveTab).toHaveBeenCalledWith(1)
    })

    it('点击 Tab 调用 playTabAudio', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      fireEvent.click(screen.getByText('简介'))
      expect(playTabAudio).toHaveBeenCalledWith(1)
    })

    it('点击关系 Tab 调用 onRelationClick', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
          onRelationClick={onRelationClick}
        />
      )
      fireEvent.click(screen.getByText('关系'))
      expect(onRelationClick).toHaveBeenCalled()
      expect(setActiveTab).not.toHaveBeenCalled()
    })

    it('Tab 有正确的 aria-selected 状态', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={1}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const tabs = screen.getAllByRole('tab')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('TabContent - 形态 Tab (activeTab=0)', () => {
    it('渲染形态按钮列表', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('复合型')).toBeInTheDocument()
      expect(screen.getByText('空中型')).toBeInTheDocument()
      expect(screen.getByText('强力型')).toBeInTheDocument()
    })

    it('点击形态按钮调用 setActiveForm', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      fireEvent.click(screen.getByText('空中型'))
      expect(setActiveForm).toHaveBeenCalledWith(1)
    })

    it('激活的形态按钮有 active 类', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={1}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const buttons = document.querySelectorAll('.form-button')
      expect(buttons[1]).toHaveClass('active')
    })

    it('无形态时显示普通形态按钮', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('普通形态')).toBeInTheDocument()
    })

    it('形态按钮有正确的 aria-pressed 属性', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const buttons = document.querySelectorAll('.form-button')
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('TabContent - 简介 Tab (activeTab=1)', () => {
    it('渲染简介内容', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={1}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText(/来自M78星云光之国的奥特战士/)).toBeInTheDocument()
    })

    it('简介有正确的 role 和 id', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={1}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByRole('tabpanel', { id: 'tabpanel-1' })).toBeInTheDocument()
    })
  })

  describe('TabContent - 人间体 Tab (activeTab=2)', () => {
    it('渲染人间体信息', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={2}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('早田进')).toBeInTheDocument()
    })

    it('人间体为空时显示待补充', () => {
      const currentWithNoHuman = {
        ...mockCurrentWithNoForms,
        human: '',
      }
      render(
        <UltramanInfo
          current={currentWithNoHuman}
          activeTab={2}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('待补充')).toBeInTheDocument()
    })
  })

  describe('TabContent - 关系 Tab (activeTab=3)', () => {
    it('渲染关联的奥特曼', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithRelations}
          activeTab={3}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('戴拿奥特曼')).toBeInTheDocument()
      expect(screen.getByText('盖亚奥特曼')).toBeInTheDocument()
    })

    it('显示关系标签', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithRelations}
          activeTab={3}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getAllByText('平成三杰').length).toBe(2)
    })

    it('无关系时显示暂无关系', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoRelations}
          activeTab={3}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('暂无关系')).toBeInTheDocument()
    })

    it('关系项有正确的样式', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithRelations}
          activeTab={3}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      const relationItems = document.querySelectorAll('.relation-item')
      expect(relationItems.length).toBeGreaterThan(0)
    })
  })

  describe('技能展示', () => {
    it('显示技能标题', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('技能展示')).toBeInTheDocument()
    })

    it('渲染技能按钮', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText(/斯派修姆光线/)).toBeInTheDocument()
      expect(screen.getByText(/奥特屏障/)).toBeInTheDocument()
    })

    it('点击技能按钮调用 onPlaySkill', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      fireEvent.click(screen.getByText(/斯派修姆光线/))
      expect(onPlaySkill).toHaveBeenCalledWith('斯派修姆光线')
    })

    it('技能按钮有正确的 aria-label', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByLabelText(/播放技能: 斯派修姆光线/)).toBeInTheDocument()
    })

    it('无技能时显示无技能数据', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoSkills}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('无技能数据')).toBeInTheDocument()
    })

    it('使用当前形态的技能', () => {
      const currentWithFormSkills = {
        ...mockCurrentWithForms,
        activeForm: 1,
      }
      render(
        <UltramanInfo
          current={currentWithFormSkills}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={1}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText(/兰帕尔特光弹/)).toBeInTheDocument()
    })

    it('无 onPlaySkill 时技能按钮不报错', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={undefined}
          playTabAudio={playTabAudio}
        />
      )
      expect(() => {
        fireEvent.click(screen.getByText(/斯派修姆光线/))
      }).not.toThrow()
    })
  })

  describe('边界条件', () => {
    it('空 forms 数组时正常渲染', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('普通形态')).toBeInTheDocument()
    })

    it('activeForm 超出范围时使用默认形态', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={99}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={playTabAudio}
        />
      )
      expect(screen.getByText('复合型')).toBeInTheDocument()
    })

    it('无 playTabAudio 时不报错', () => {
      render(
        <UltramanInfo
          current={mockCurrentWithNoForms}
          activeTab={0}
          setActiveTab={setActiveTab}
          activeForm={0}
          setActiveForm={setActiveForm}
          onPlaySkill={onPlaySkill}
          playTabAudio={undefined}
        />
      )
      expect(() => {
        fireEvent.click(screen.getByText('简介'))
      }).not.toThrow()
    })
  })
})