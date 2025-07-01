import { render, screen } from '@testing-library/react'

vi.mock('@tabler/icons-react', () => ({
  IconTrendingDown: vi.fn(() => <div data-testid="trending-down-icon" />),
  IconTrendingUp: vi.fn(() => <div data-testid="trending-up-icon" />),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: vi.fn(({ children, variant }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  )),
}))

vi.mock('@/components/ui/card', () => ({
  Card: vi.fn(({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  )),
  CardAction: vi.fn(({ children }) => <div data-testid="card-action">{children}</div>),
  CardDescription: vi.fn(({ children }) => <p data-testid="card-description">{children}</p>),
  CardFooter: vi.fn(({ children, className }) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  )),
  CardHeader: vi.fn(({ children }) => <div data-testid="card-header">{children}</div>),
  CardTitle: vi.fn(({ children, className }) => (
    <h3 data-testid="card-title" className={className}>
      {children}
    </h3>
  )),
}))

import { SectionCards } from '../section-cards'

describe('SectionCards', () => {
  it('should render the section cards container with correct structure', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const container = screen.getAllByTestId('card')[0].parentElement
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'px-4')
  })

  it('should render four cards', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(4)
  })

  it('should render total revenue card with correct content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,250.00')).toBeInTheDocument()
    expect(screen.getAllByText('+12.5%')[0]).toBeInTheDocument()
    expect(screen.getByText('Trending up this month')).toBeInTheDocument()
    expect(screen.getByText('Visitors for the last 6 months')).toBeInTheDocument()
  })

  it('should render new customers card with correct content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    expect(screen.getByText('New Customers')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByText('Down 20% this period')).toBeInTheDocument()
    expect(screen.getByText('Acquisition needs attention')).toBeInTheDocument()
  })

  it('should render active accounts card with correct content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    expect(screen.getByText('Active Accounts')).toBeInTheDocument()
    expect(screen.getByText('45,678')).toBeInTheDocument()
    expect(screen.getByText('Strong user retention')).toBeInTheDocument()
    expect(screen.getByText('Engagement exceed targets')).toBeInTheDocument()
  })

  it('should render growth rate card with correct content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    expect(screen.getByText('Growth Rate')).toBeInTheDocument()
    expect(screen.getByText('4.5%')).toBeInTheDocument()
    expect(screen.getByText('Steady performance increase')).toBeInTheDocument()
    expect(screen.getByText('Meets growth projections')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const container = screen.getAllByTestId('card')[0].parentElement
    expect(container).toHaveClass(
      '*:data-[slot=card]:from-primary/5',
      '*:data-[slot=card]:to-card',
      'dark:*:data-[slot=card]:bg-card',
      'grid',
      'grid-cols-1',
      'gap-4',
      'px-4',
      '*:data-[slot=card]:bg-gradient-to-t',
      '*:data-[slot=card]:shadow-xs',
      'lg:px-6',
      '@xl/main:grid-cols-2',
      '@5xl/main:grid-cols-4'
    )
  })

  it('should apply correct CSS classes to cards', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const cards = screen.getAllByTestId('card')
    cards.forEach(card => {
      expect(card).toHaveClass('@container/card')
    })
  })

  it('should apply correct CSS classes to card titles', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const titles = screen.getAllByTestId('card-title')
    titles.forEach(title => {
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'tabular-nums', '@[250px]/card:text-3xl')
    })
  })

  it('should render badges with outline variant', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const badges = screen.getAllByTestId('badge')
    badges.forEach(badge => {
      expect(badge).toHaveAttribute('data-variant', 'outline')
    })
  })

  it('should render trending up icons in badges', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const trendingUpIcons = screen.getAllByTestId('trending-up-icon')
    expect(trendingUpIcons.length).toBeGreaterThan(0)
  })

  it('should render trending down icons in badges', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const trendingDownIcons = screen.getAllByTestId('trending-down-icon')
    expect(trendingDownIcons.length).toBeGreaterThan(0)
  })

  it('should apply correct CSS classes to card footers', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const footers = screen.getAllByTestId('card-footer')
    footers.forEach(footer => {
      expect(footer).toHaveClass('flex-col', 'items-start', 'gap-1.5', 'text-sm')
    })
  })

  it('should render card actions', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const actions = screen.getAllByTestId('card-action')
    expect(actions).toHaveLength(4)
  })

  it('should render card headers', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const headers = screen.getAllByTestId('card-header')
    expect(headers).toHaveLength(4)
  })

  it('should render card descriptions', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const descriptions = screen.getAllByTestId('card-description')
    expect(descriptions).toHaveLength(4)
  })

  it('should render trending icons in footer content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const trendingIcons = screen.getAllByTestId('trending-up-icon')
    const trendingDownIcons = screen.getAllByTestId('trending-down-icon')
    expect(trendingIcons.length + trendingDownIcons.length).toBeGreaterThan(4)
  })

  it('should apply correct CSS classes to footer content containers', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const footerContentContainers = document.querySelectorAll('.line-clamp-1.flex.gap-2.font-medium')
    expect(footerContentContainers.length).toBeGreaterThan(0)
  })

  it('should apply correct CSS classes to muted text', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const mutedTexts = document.querySelectorAll('.text-muted-foreground')
    expect(mutedTexts.length).toBeGreaterThan(0)
  })

  it('should render all required text content', () => {
    // Arrange
    // Act
    render(<SectionCards />)

    // Assert
    const expectedTexts = [
      'Total Revenue',
      '$1,250.00',
      'Trending up this month',
      'Visitors for the last 6 months',
      'New Customers',
      '1,234',
      '-20%',
      'Down 20% this period',
      'Acquisition needs attention',
      'Active Accounts',
      '45,678',
      'Strong user retention',
      'Engagement exceed targets',
      'Growth Rate',
      '4.5%',
      'Steady performance increase',
      'Meets growth projections',
    ]

    expectedTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
}) 