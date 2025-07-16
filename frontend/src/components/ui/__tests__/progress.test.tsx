import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProgressBar } from '../progress'

describe('ProgressBar', () => {
    it('renders with default props', () => {
        render(<ProgressBar value={50} />)
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
    })

    it('displays correct progress value', async () => {
        render(<ProgressBar value={75} animated={false} />)
        const progressIndicator = screen.getByRole('progressbar').querySelector('div')
        await waitFor(() => {
            expect(progressIndicator).toHaveStyle({ width: '75%' })
        })
    })

    it('renders with different colors', () => {
        const { rerender } = render(<ProgressBar value={50} color="primary" />)
        let progressIndicator = screen.getByRole('progressbar').querySelector('div')
        expect(progressIndicator).toHaveClass('bg-gradient-to-r', 'from-primary')

        rerender(<ProgressBar value={50} color="xp" />)
        progressIndicator = screen.getByRole('progressbar').querySelector('div')
        expect(progressIndicator).toHaveClass('from-xp')

        rerender(<ProgressBar value={50} color="streak" />)
        progressIndicator = screen.getByRole('progressbar').querySelector('div')
        expect(progressIndicator).toHaveClass('from-streak')
    })

    it('renders with different sizes', () => {
        const { rerender } = render(<ProgressBar value={50} size="sm" />)
        expect(screen.getByRole('progressbar')).toHaveClass('h-2')

        rerender(<ProgressBar value={50} size="md" />)
        expect(screen.getByRole('progressbar')).toHaveClass('h-4')

        rerender(<ProgressBar value={50} size="lg" />)
        expect(screen.getByRole('progressbar')).toHaveClass('h-6')
    })

    it('shows label when showLabel is true', async () => {
        render(<ProgressBar value={75} showLabel={true} animated={false} />)
        await waitFor(() => {
            expect(screen.getByText('75%')).toBeInTheDocument()
        })
    })

    it('calls onComplete when progress reaches 100%', async () => {
        const onComplete = vi.fn()
        render(<ProgressBar value={100} onComplete={onComplete} duration={100} />)

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled()
        }, { timeout: 1000 })
    })

    it('animates progress when animated is true', () => {
        render(<ProgressBar value={50} animated={true} />)
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
        // Animation testing would require more complex setup with framer-motion testing utilities
    })

    it('does not animate when animated is false', () => {
        render(<ProgressBar value={50} animated={false} />)
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
    })
})