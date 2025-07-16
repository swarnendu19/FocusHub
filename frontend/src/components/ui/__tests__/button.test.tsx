import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
    it('renders with default variant and size', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-primary')
    })

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-secondary')

        rerender(<Button variant="destructive">Destructive</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-danger')

        rerender(<Button variant="super">Super</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r')

        rerender(<Button variant="locked">Locked</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-gray-400')
    })

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-9')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-14')

        rerender(<Button size="icon">Icon</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
    })

    it('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('applies Duolingo-style shadow classes', () => {
        render(<Button>Duolingo Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('shadow-duolingo')
    })

    it('supports asChild prop', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        )
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/test')
        expect(link).toHaveClass('bg-primary')
    })
})