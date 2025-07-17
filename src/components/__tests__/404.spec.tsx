import { render, screen } from '@testing-library/react'
import NotFound from '../404'

describe('NotFound', () => {
  it('should render the 404 page with correct structure', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(screen.getByText("Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.")).toBeInTheDocument()
  })

  it('should apply correct CSS classes to main container', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const mainContainer = screen.getByText('Page Not Found').closest('div')?.parentElement?.parentElement
    expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-background')
  })

  it('should render the SVG illustration', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 400 300')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })

  it('should render the 404 text in SVG', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const svgText = document.querySelector('svg text')
    expect(svgText).toBeInTheDocument()
    expect(svgText).toHaveTextContent('404')
    expect(svgText).toHaveAttribute('font-size', '48')
    expect(svgText).toHaveAttribute('font-weight', 'bold')
  })

  it('should render animated circles in SVG', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const circles = document.querySelectorAll('svg circle')
    expect(circles.length).toBeGreaterThan(0)
    
    const animatedCircles = document.querySelectorAll('svg circle animate')
    expect(animatedCircles.length).toBeGreaterThan(0)
  })

  it('should render the question mark elements', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const questionMarks = document.querySelectorAll('svg text')
    expect(questionMarks.length).toBeGreaterThan(1)
  })

  it('should apply correct styling to content container', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const contentContainer = screen.getByText('Page Not Found').closest('div')?.parentElement
    expect(contentContainer).toHaveClass('max-w-md', 'w-full', 'text-center', 'space-y-8', 'p-6')
  })

  it('should render the main heading with correct styling', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Page Not Found')
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-foreground')
  })

  it('should render the description text with correct styling', () => {
    // Arrange
    // Act
    render(<NotFound />)

    // Assert
    const description = screen.getByText("Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.")
    expect(description).toHaveClass('text-lg', 'text-muted-foreground', 'max-w-sm', 'mx-auto')
  })
})
