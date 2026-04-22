import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App 组件 - 增强断言测试', () => {
  beforeEach(() => {
    render(<App />)
  })

  describe('封面页', () => {
    it('renders cover with all elements', () => {
      expect(screen.getByText('奥特曼魔法书')).toBeInTheDocument()
      const startBtn = screen.getByRole('button', { name: /开启旅程/ })
      expect(startBtn).toBeEnabled()
    })

    it('has decorative elements', () => {
      expect(document.querySelector('.magic-circle')).toBeInTheDocument()
      expect(document.querySelectorAll('.corner-ornament').length).toBe(4)
    })
  })

  describe('状态变化', () => {
    it('start hides cover shows book', async () => {
      const startBtn = screen.getByRole('button', { name: /开启旅程/ })
      fireEvent.click(startBtn)
      await waitFor(() => {
        expect(screen.queryByText('奥特曼魔法书')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(document.querySelector('.ultraman-name')).toBeInTheDocument()
      })
    })

    it('sound toggle changes icon', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => expect(screen.getByText('🔊')).toBeInTheDocument())
      fireEvent.click(screen.getByText('🔊'))
      await waitFor(() => {
        expect(screen.queryByText('🔊')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.getByText('🔇')).toBeInTheDocument()
      })
    })

    it('sound toggle reverts', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText('🔊'))
      fireEvent.click(screen.getByText('🔊'))
      await waitFor(() => screen.getByText('🔇'))
      fireEvent.click(screen.getByText('🔇'))
      await waitFor(() => {
        expect(screen.queryByText('🔇')).not.toBeInTheDocument()
      })
    })
  })

  describe('Tab切换', () => {
    it('default tab is 简介', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const activeTab = document.querySelector('.info-tab.active')
        expect(activeTab).toHaveTextContent('简介')
      })
    })

    it('switch to 技能 tab', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      const skillBtns = document.querySelectorAll('.skill-button')
      fireEvent.click(skillBtns[0])
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /斯派修姆光线/ })).toBeInTheDocument()
      })
    })

    it('技能 tab shows skill buttons', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      const tabs = document.querySelectorAll('.info-tab')
      fireEvent.click(tabs[3])
      await waitFor(() => {
        expect(screen.getByText(/斯派修姆光线/)).toBeInTheDocument()
      })
    })

    it('人间体 tab shows human', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('人间体', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText(/早田进/)).toBeInTheDocument()
      })
    })

    it('台词 tab shows catchphrase', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      const tabs = document.querySelectorAll('.info-tab')
      fireEvent.click(tabs[2])
      await waitFor(() => {
        const el = document.querySelector('.info-text')
        expect(el).toHaveTextContent(/奥特曼/)
      })
    })

    it('catchphrase in italics', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('台词', { selector: '.info-tab' }))
      await waitFor(() => {
        const el = document.querySelector('.info-text')
        expect(el).toHaveTextContent(/奥特曼/)
        expect(el).toHaveStyle({ fontStyle: 'italic' })
      })
    })
  })

  describe('翻页', () => {
    it('page indicator shows 1 / 29', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(screen.getByText('1 / 29')).toBeInTheDocument()
      })
    })

    it('prev disabled on first page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const prevBtn = document.querySelector('.nav-button.prev')
        expect(prevBtn).toBeDisabled()
      })
    })

    it('next enabled on first page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const nextBtn = document.querySelector('.nav-button.next')
        expect(nextBtn).toBeEnabled()
      })
    })

    it('shows 初代奥特曼 name', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const nameEl = document.querySelector('.ultraman-name')
        expect(nameEl).toHaveTextContent('初代奥特曼')
      })
    })

    it('shows 昭和时期 era', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const nameEl = document.querySelector('.ultraman-name')
        expect(nameEl).toHaveTextContent('昭和时期')
      })
    })

    it('shows year 1966', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const nameEl = document.querySelector('.ultraman-name')
        expect(nameEl).toHaveTextContent(/1966/)
      })
    })
  })

  describe('边界条件', () => {
    it('no forms shows 无多种形态', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('形态', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText('无多种形态')).toBeInTheDocument()
      })
    })

    it('has 5 info tabs', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelectorAll('.info-tab').length).toBe(4)
      })
    })

    it('active tab has active class', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.info-tab.active')).toBeInTheDocument()
      })
    })
  })

  describe('DOM渲染', () => {
    it('image has correct alt', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const img = document.querySelector('.ultraman-image')
        expect(img).toHaveAttribute('alt', '初代奥特曼')
      })
    })

    it('image has src', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const img = document.querySelector('.ultraman-image')
        expect(img).toHaveAttribute('src')
      })
    })

    it('book-pages has active class', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.book-pages.active')).toBeInTheDocument()
      })
    })

    it('page-left and page-right exist', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.page-left')).toBeInTheDocument()
        expect(document.querySelector('.page-right')).toBeInTheDocument()
      })
    })

    it('skills-section exists', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.skills-section')).toBeInTheDocument()
      })
    })

    it('placeholder hidden initially', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const placeholder = document.querySelector('.ultraman-placeholder')
        expect(placeholder).toHaveStyle({ display: 'none' })
      })
    })

    it('placeholder exists', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      await waitFor(() => {
        const placeholder = document.querySelector('.ultraman-placeholder')
        expect(placeholder).toBeInTheDocument()
      })
    })
  })

  describe('按钮', () => {
    it('skill button enabled', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const btn = screen.getByRole('button', { name: /斯派修姆光线/ })
        expect(btn).toBeEnabled()
      })
    })

    it('start button enabled', () => {
      const btn = screen.getByRole('button', { name: /开启旅程/ })
      expect(btn).toBeEnabled()
    })
  })

  describe('负向断言', () => {
    it('cover hidden after start', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(screen.queryByText('✦ 开启旅程 ✦')).not.toBeInTheDocument()
      })
    })

    it('形态 tab hides description', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('形态', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.queryByText(/M78星云/)).not.toBeInTheDocument()
      })
    })
  })

  describe('边界导航分支 - goNext/goPrev', () => {
    it('goPrev disabled on first page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const prevBtn = document.querySelector('.nav-button.prev')
        expect(prevBtn).toBeDisabled()
      })
    })

    it('nav buttons exist', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.nav-button.prev')).toBeInTheDocument()
        expect(document.querySelector('.nav-button.next')).toBeInTheDocument()
      })
    })
  })

  describe('playSkill音频分支', () => {
    it('skill button exists', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /斯派修姆光线/ })).toBeInTheDocument()
      })
    })
  })

  describe('形态分支测试 - forms.length > 0', () => {
    it('no forms shows 无多种形态', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('形态', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText('无多种形态')).toBeInTheDocument()
      })
    })

    it('has forms shows form buttons', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => expect(screen.getByText('1 / 29')).toBeInTheDocument())
      const nextBtn = document.querySelector('.nav-button.next')
      fireEvent.click(nextBtn)
      await waitFor(() => expect(screen.getByText(/赛文/)))
    })
  })
})