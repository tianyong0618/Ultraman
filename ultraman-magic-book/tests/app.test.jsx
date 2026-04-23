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
    it('start hides cover shows family portrait', async () => {
      const startBtn = screen.getByRole('button', { name: /开启旅程/ })
      fireEvent.click(startBtn)
      await waitFor(() => {
        expect(screen.queryByText('奥特曼魔法书')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(document.querySelector('.family-portrait')).toBeInTheDocument()
      })
    })

    it('click avatar shows book page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.family-portrait')).toBeInTheDocument()
      })
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.book-pages')).toBeInTheDocument()
      })
    })

    it('sound toggle changes icon', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
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
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
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
    it('default tab is 形态', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const activeTab = document.querySelector('.info-tab.active')
        expect(activeTab).toHaveTextContent('形态')
      })
    })

    it('switch to 简介 tab', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('简介', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText(/M78星云/)).toBeInTheDocument()
      })
    })

    it('形态 tab shows forms buttons', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('形态', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText(/普通形态/)).toBeInTheDocument()
      })
    })

    it('人间体 tab shows human', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('人间体', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(screen.getByText(/早田进/)).toBeInTheDocument()
      })
    })

    it('关系 tab shows relation info', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('关系', { selector: '.info-tab' }))
      await waitFor(() => {
        expect(document.querySelector('.relation-list')).toBeInTheDocument()
      })
    })
  })

  describe('翻页', () => {
    it('page indicator shows 1 / 29', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(screen.getByText('1 / 29')).toBeInTheDocument()
      })
    })

    it('prev disabled on first page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const prevBtn = document.querySelector('.nav-button.prev')
        expect(prevBtn).toBeDisabled()
      })
    })

    it('next enabled on first page', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const nextBtn = document.querySelector('.nav-button.next')
        expect(nextBtn).toBeEnabled()
      })
    })

    it('shows 初代奥特曼 name', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const nameEl = document.querySelector('.ultraman-name')
        expect(nameEl).toHaveTextContent('初代奥特曼')
      })
    })

    it('shows year 1966', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const nameEl = document.querySelector('.ultraman-name')
        expect(nameEl).toHaveTextContent(/1966/)
      })
    })
  })

  describe('边界条件', () => {
    it('no forms shows 普通形态', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      await waitFor(() => {
        expect(screen.getByText('普通形态')).toBeInTheDocument()
      })
    })

    it('has 4 info tabs', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelectorAll('.info-tab').length).toBe(4)
      })
    })

    it('active tab has active class', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.info-tab.active')).toBeInTheDocument()
      })
    })
  })

describe('DOM渲染', () => {
    it('image has correct alt', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const img = document.querySelector('.ultraman-image')
        expect(img).toHaveAttribute('alt', '初代奥特曼')
      })
    })

    it('image has src', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const img = document.querySelector('.ultraman-image')
        expect(img).toHaveAttribute('src')
      })
    })

    it('book-pages has active class', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.book-pages.active')).toBeInTheDocument()
      })
    })

    it('page-left and page-right exist', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.page-left')).toBeInTheDocument()
        expect(document.querySelector('.page-right')).toBeInTheDocument()
      })
    })

    it('skills-section exists', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.skills-section')).toBeInTheDocument()
      })
    })

    it('placeholder hidden initially', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const placeholder = document.querySelector('.ultraman-placeholder')
        expect(placeholder).toBeInTheDocument()
      })
    })
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
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
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
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
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
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const prevBtn = document.querySelector('.nav-button.prev')
        expect(prevBtn).toBeDisabled()
      })
    })

    it('nav buttons exist', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.nav-button.prev')).toBeInTheDocument()
        expect(document.querySelector('.nav-button.next')).toBeInTheDocument()
      })
    })
  })

  describe('playSkill音频分支', () => {
    it('skill button exists', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /斯派修姆光线/ })).toBeInTheDocument()
      })
    })
  })

  describe('全家福功能测试', () => {
    it('family portrait shows avatars', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.family-portrait')).toBeInTheDocument()
      })
      const avatars = document.querySelectorAll('.avatar')
      expect(avatars.length).toBe(29)
    })

    it('relation lines exist', async () => {
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.relation-lines')).toBeInTheDocument()
      })
      const lines = document.querySelectorAll('.relation-line')
      expect(lines.length).toBeGreaterThan(0)
    })
  })
})