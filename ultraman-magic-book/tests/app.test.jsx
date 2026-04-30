import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App 组件', () => {
  describe('封面页', () => {
    it('显示封面标题', () => {
      render(<App />)
      expect(screen.getByText('奥特曼魔法书')).toBeInTheDocument()
    })

    it('显示开始按钮', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /开启旅程/ })).toBeInTheDocument()
    })

    it('显示魔法圆圈', () => {
      render(<App />)
      expect(document.querySelector('.magic-circle')).toBeInTheDocument()
    })
  })

  describe('全家福页面', () => {
    it('点击开始按钮后显示全家福', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        expect(document.querySelector('.family-portrait')).toBeInTheDocument()
      })
    })

    it('显示29个头像', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      await waitFor(() => {
        const avatars = document.querySelectorAll('.avatar')
        expect(avatars.length).toBe(29)
      })
    })
  })

  describe('书籍页面', () => {
    it('点击头像后显示书籍', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(document.querySelector('.book-pages')).toBeInTheDocument()
      })
    })

    it('显示初代名称', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(screen.getByText(/初代/)).toBeInTheDocument()
      })
    })

    it('显示4个信息标签', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const tabs = document.querySelectorAll('.info-tab')
        expect(tabs.length).toBe(4)
      })
    })

    it('形态标签默认激活', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(screen.getByText('形态')).toBeInTheDocument()
      })
    })
  })

  describe('翻页功能', () => {
    it('显示页码指示器', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        expect(screen.getByText('1 / 29')).toBeInTheDocument()
      })
    })

    it('首页禁用上一页按钮', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const prevBtn = document.querySelector('.nav-button.prev')
        expect(prevBtn).toBeDisabled()
      })
    })

    it('首页启用下一页按钮', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => {
        const nextBtn = document.querySelector('.nav-button.next')
        expect(nextBtn).toBeEnabled()
      })
    })
  })

  describe('导航分支', () => {
    it('goNext跳转到下一页', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText('1 / 29'))
      const nextBtn = document.querySelector('.nav-button.next')
      fireEvent.click(nextBtn)
      await waitFor(() => {
        expect(screen.getByText('2 / 29')).toBeInTheDocument()
      })
    })

    it('goPrev跳转到上一页', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText('1 / 29'))
      const nextBtn = document.querySelector('.nav-button.next')
      fireEvent.click(nextBtn)
      await waitFor(() => screen.getByText('2 / 29'))
      const prevBtn = document.querySelector('.nav-button.prev')
      fireEvent.click(prevBtn)
      await waitFor(() => {
        expect(screen.getByText('1 / 29')).toBeInTheDocument()
      })
    })
  })

  describe('Tab切换', () => {
    it('切换到简介标签', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('简介'))
      await waitFor(() => {
        expect(screen.getByText(/M78星云/)).toBeInTheDocument()
      })
    })

    it('切换到人间体标签', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      fireEvent.click(screen.getByText('人间体'))
      await waitFor(() => {
        expect(screen.getByText(/早田进/)).toBeInTheDocument()
      })
    })

    it('显示技能按钮', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText(/初代/))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /斯派修姆光线/ })).toBeInTheDocument()
      })
    })
  })

  describe('声音切换', () => {
    it('点击切换到静音图标', () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      expect(screen.getByText('🔊')).toBeInTheDocument()
      fireEvent.click(screen.getByText('🔊'))
      expect(screen.getByText('🔇')).toBeInTheDocument()
    })
  })

  describe('边界条件', () => {
    it('首页上一页按钮禁用', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText('1 / 29'))
      const prevBtn = document.querySelector('.nav-button.prev')
      expect(prevBtn).toBeDisabled()
    })

    it('首页下一页按钮可用', async () => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /开启旅程/ }))
      const avatar = document.querySelector('.avatar')
      fireEvent.click(avatar)
      await waitFor(() => screen.getByText('1 / 29'))
      const nextBtn = document.querySelector('.nav-button.next')
      expect(nextBtn).toBeEnabled()
    })
  })
})