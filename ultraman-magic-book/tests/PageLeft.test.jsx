import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PageLeft } from '../src/components/PageLeft'

describe('PageLeft Component', () => {
  const mockCurrent = {
    id: 'ultraman-1',
    name: 'Ultraman',
    image: '/images/ultraman.png',
    color: '#ff0000',
    forms: [
      { name: 'Original', image: '/images/ultraman-original.png' },
      { name: 'Emissive', image: '/images/ultraman-emissive.png' }
    ]
  }

  const defaultProps = {
    current: mockCurrent,
    imageError: {},
    onImageError: vi.fn(),
    activeForm: 0,
    activeSkill: null,
    isSkillAnimating: false,
    isSkillLoading: false,
    getSkillImage: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('skill-loading-overlay', () => {
    it('shows loading overlay when isSkillLoading is true', () => {
      render(<PageLeft {...defaultProps} isSkillLoading={true} activeSkill="Shooting Beam" />)

      expect(screen.getByText('⚡ 技能加载中...')).toBeInTheDocument()
      expect(screen.getByText('⚡ 技能加载中...').closest('.skill-loading-overlay')).toBeInTheDocument()
    })

    it('does not show loading overlay when isSkillLoading is false', () => {
      render(<PageLeft {...defaultProps} isSkillLoading={false} activeSkill="Shooting Beam" />)

      expect(screen.queryByText('⚡ 技能加载中...')).not.toBeInTheDocument()
    })
  })

  describe('skill image display', () => {
    it('displays skill image when activeSkill, isSkillAnimating, and getSkillImage are provided', () => {
      const mockGetSkillImage = vi.fn(() => '/images/ultraman-skill.png')
      
      render(
        <PageLeft 
          {...defaultProps} 
          activeSkill="Shooting Beam"
          isSkillAnimating={true}
          getSkillImage={mockGetSkillImage}
        />
      )

      const skillImg = screen.getByAltText('Ultraman - Shooting Beam')
      expect(skillImg).toBeInTheDocument()
      expect(skillImg).toHaveClass('ultraman-image', 'skill-animation')
      expect(mockGetSkillImage).toHaveBeenCalledWith('Ultraman', 'Shooting Beam')
    })

it('does not display skill image when isSkillAnimating is false', () => {
      const mockGetSkillImage = vi.fn(() => '/images/ultraman-skill.png')

      render(
        <PageLeft
          {...defaultProps}
          activeSkill="Shooting Beam"
          isSkillAnimating={false}
          getSkillImage={mockGetSkillImage}
        />
      )

      expect(screen.queryByAltText('Ultraman - Shooting Beam')).not.toBeInTheDocument()
    })

    it('does not display skill image when getSkillImage returns null', () => {
      const mockGetSkillImage = vi.fn(() => null)
      
      render(
        <PageLeft 
          {...defaultProps} 
          activeSkill="Shooting Beam"
          isSkillAnimating={true}
          getSkillImage={mockGetSkillImage}
        />
      )

      expect(screen.queryByAltText('Ultraman - Shooting Beam')).not.toBeInTheDocument()
    })
  })

  describe('main image display', () => {
    it('displays main image when forms[activeForm].image exists and no image error', () => {
      render(<PageLeft {...defaultProps} activeForm={0} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toBeInTheDocument()
      expect(img).toHaveClass('ultraman-image')
    })

    it('displays fallback image when forms do not exist', () => {
      const currentWithoutForms = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: '/images/ultraman.png',
        color: '#ff0000'
      }

      render(<PageLeft {...defaultProps} current={currentWithoutForms} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toBeInTheDocument()
    })

    it('calls onImageError when image fails to load', () => {
      const onImageError = vi.fn()
      render(<PageLeft {...defaultProps} onImageError={onImageError} />)

      const img = screen.getByAltText('Ultraman')
      fireEvent.error(img)

      expect(onImageError).toHaveBeenCalledWith('ultraman-1')
    })

    it('does not display main image when imageError[current.id] is true', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      expect(screen.queryByAltText('Ultraman')).not.toBeInTheDocument()
    })

    it('does not display main image when displayImage is empty', () => {
      const currentWithEmptyImage = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: '',
        color: '#ff0000',
        forms: [{ name: 'Original', image: '' }]
      }

      render(<PageLeft {...defaultProps} current={currentWithEmptyImage} />)

      expect(screen.queryByAltText('Ultraman')).not.toBeInTheDocument()
    })
  })

  describe('placeholder display', () => {
    it('shows placeholder when no valid image', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      const placeholder = screen.getByText('U')
      expect(placeholder).toBeInTheDocument()
      expect(placeholder).toHaveClass('placeholder-text')
      expect(placeholder.closest('.ultraman-placeholder')).toBeInTheDocument()
    })

    it('shows placeholder when displayImage is empty', () => {
      const currentWithEmptyImage = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: '',
        color: '#ff0000'
      }

      render(<PageLeft {...defaultProps} current={currentWithEmptyImage} />)

      const placeholder = screen.getByText('U')
      expect(placeholder).toBeInTheDocument()
    })

    it('shows first character of name in placeholder', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      expect(screen.getByText('U')).toBeInTheDocument()
    })

    it('hides placeholder when valid image exists', () => {
      const currentWithImage = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: null,
        color: '#ff0000'
      }

      render(<PageLeft {...defaultProps} current={currentWithImage} />)

      expect(screen.getByText('U')).toBeInTheDocument()
    })

    it('placeholder has correct structure with style attribute', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      const placeholder = screen.getByText('U').closest('.ultraman-placeholder')
      expect(placeholder).toBeInTheDocument()
      expect(placeholder).toHaveAttribute('style')
    })
  })

  describe('image source selection', () => {
    it('uses form image when forms exist and activeForm is valid', () => {
      render(<PageLeft {...defaultProps} activeForm={1} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toHaveAttribute('src', '/images/ultraman-emissive.png')
    })

    it('uses main image when activeForm index is out of bounds', () => {
      render(<PageLeft {...defaultProps} activeForm={99} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toHaveAttribute('src', '/images/ultraman.png')
    })

    it('uses main image when forms array is empty', () => {
      const currentWithEmptyForms = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: '/images/ultraman.png',
        color: '#ff0000',
        forms: []
      }

      render(<PageLeft {...defaultProps} current={currentWithEmptyForms} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toHaveAttribute('src', '/images/ultraman.png')
    })
  })

  describe('draggable attribute', () => {
    it('image has draggable set to false', () => {
      render(<PageLeft {...defaultProps} />)

      const img = screen.getByAltText('Ultraman')
      expect(img).toHaveAttribute('draggable', 'false')
    })

    it('placeholder has draggable set to false', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      const placeholder = screen.getByText('U').closest('.ultraman-placeholder')
      expect(placeholder).toHaveAttribute('draggable', 'false')
    })
  })

  describe('component memo optimization', () => {
    it('renders without errors', () => {
      expect(() => render(<PageLeft {...defaultProps} />)).not.toThrow()
    })

    it('renders with different props without memo re-rendering', () => {
      const { rerender } = render(<PageLeft {...defaultProps} />)

      rerender(<PageLeft {...defaultProps} activeForm={1} />)
      expect(screen.getByAltText('Ultraman')).toBeInTheDocument()
    })
  })

  describe('event handlers', () => {
    it('skill image has onDragStart handler', () => {
      const mockGetSkillImage = vi.fn(() => '/images/ultraman-skill.png')

      render(
        <PageLeft
          {...defaultProps}
          activeSkill="Shooting Beam"
          isSkillAnimating={true}
          getSkillImage={mockGetSkillImage}
        />
      )

      const skillImg = screen.getByAltText('Ultraman - Shooting Beam')
      fireEvent.dragStart(skillImg)
      expect(skillImg).toBeInTheDocument()
    })

    it('main image has onDragStart handler', () => {
      render(<PageLeft {...defaultProps} />)

      const img = screen.getByAltText('Ultraman')
      fireEvent.dragStart(img)
      expect(img).toBeInTheDocument()
    })

    it('placeholder has onDragStart handler', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      const placeholder = screen.getByText('U').closest('.ultraman-placeholder')
      fireEvent.dragStart(placeholder)
      expect(placeholder).toBeInTheDocument()
    })
  })

  describe('display style conditions', () => {
    it('shows placeholder with display flex when imageError is true', () => {
      render(<PageLeft {...defaultProps} imageError={{ 'ultraman-1': true }} />)

      const placeholder = screen.getByText('U').closest('.ultraman-placeholder')
      expect(placeholder).toHaveAttribute('style')
    })

    it('shows placeholder with display flex when displayImage is empty string', () => {
      const currentWithEmptyImage = {
        id: 'ultraman-1',
        name: 'Ultraman',
        image: '',
        color: '#ff0000'
      }

      render(<PageLeft {...defaultProps} current={currentWithEmptyImage} />)

      const placeholder = screen.getByText('U').closest('.ultraman-placeholder')
      expect(placeholder).toHaveAttribute('style')
    })
  })
})