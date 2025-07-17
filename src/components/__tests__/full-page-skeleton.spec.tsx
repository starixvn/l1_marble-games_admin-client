import { render, screen } from '@testing-library/react'

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: vi.fn(({ className }) => <div data-testid="skeleton" className={className} />),
}))

import { FullpageSkeleton } from '../full-page-skeleton'

describe('FullpageSkeleton', () => {
  it('should render the skeleton component', () => {
    // Arrange
    // Act
    render(<FullpageSkeleton />)

    // Assert
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to skeleton', () => {
    // Arrange
    // Act
    render(<FullpageSkeleton />)

    // Assert
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('w-full', 'h-full', 'rounded-md')
  })
}) 