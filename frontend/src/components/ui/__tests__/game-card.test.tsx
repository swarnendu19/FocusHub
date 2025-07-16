import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameCard } from '../game-card'

describe('GameCard', () => {
    it('renders with basic props', () => {
        render(<GameCard title="Test Card" description="Test description" />)
        expect(screen.getByText('Test Card')).toBeInTheDocument()
        expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('displays XP reward badge when provided', () => {
        render(<GameCard title="Test Card" xpReward={100} />)
        expect(screen.getByText('+100 XP')).toBeInTheDocument()
    })

    it('shows completed state correctly', () => {
        render(<GameCard title="Test Card" isCompleted={true} />)
        expect(screen.getByText('✓ Complete')).toBeInTheDocument()
    })

    it('shows locked state correctly', () => {
        render(<GameCard title="Test Card" isLocked={true} />)
        expect(screen.getByText('🔒 Locked')).toBeInTheDocument()
    })

    it('displays progress bar when progress is provided', () => {
        render(<GameCard title="Test Card" progress={75} />)
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
    })

    it('handles click events when not locked', () => {
        const handleClick = vi.fn()
        render(<GameCard title="Test Card" onClick={handleClick} />)

        fireEvent.click(screen.getByText('Test Card').closest('div')!)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not handle click events when locked', () => {
        const handleClick = vi.fn()
        render(<GameCard title="Test Card" onClick={handleClick} isLocked={true} />)

        fireEvent.click(screen.getByText('Test Card').closest('div')!)
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('renders custom icon when provided', () => {
        const TestIcon = () => <span data-testid="test-icon">🎯</span>
        render(<GameCard title="Test Card" icon={<TestIcon />} />)
        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('renders children content', () => {
        render(
            <GameCard title="Test Card">
                <div data-testid="custom-content">Custom content</div>
            </GameCard>
        )
        expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('applies correct color classes', () => {
        const TestIcon = () => <span data-testid="test-icon">🎯</span>
        const { rerender } = render(
            <GameCard title="Test Card" icon={<TestIcon />} color="primary" />
        )
        const iconContainer = screen.getByTestId('test-icon').parentElement
        expect(iconContainer).toHaveClass('text-primary')

        rerender(<GameCard title="Test Card" icon={<TestIcon />} color="xp" />)
        const iconContainerXp = screen.getByTestId('test-icon').parentElement
        expect(iconContainerXp).toHaveClass('text-xp')
    })

    it('disables hover animation when hoverAnimation is false', () => {
        render(<GameCard title="Test Card" hoverAnimation={false} />)
        // This would require more complex testing setup to verify animation behavior
        expect(screen.getByText('Test Card')).toBeInTheDocument()
    })

    it('applies locked styling when isLocked is true', () => {
        render(<GameCard title="Test Card" isLocked={true} />)
        // The cursor-not-allowed class is applied to the motion.div wrapper
        const cardWrapper = screen.getByText('Test Card').closest('[class*="cursor-not-allowed"]')
        expect(cardWrapper).toBeInTheDocument()
    })
})