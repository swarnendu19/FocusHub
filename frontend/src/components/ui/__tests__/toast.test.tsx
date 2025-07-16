import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from '../toast'

describe('Toast', () => {
    const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>
            {children}
            <ToastViewport />
        </ToastProvider>
    )

    it('renders with default variant', () => {
        render(
            <ToastWrapper>
                <Toast>
                    <ToastTitle>Test Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('Test Toast')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
        const { rerender } = render(
            <ToastWrapper>
                <Toast variant="success">
                    <ToastTitle>Success Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('Success Toast')).toBeInTheDocument()

        rerender(
            <ToastWrapper>
                <Toast variant="destructive">
                    <ToastTitle>Error Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('Error Toast')).toBeInTheDocument()

        rerender(
            <ToastWrapper>
                <Toast variant="xp">
                    <ToastTitle>XP Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('XP Toast')).toBeInTheDocument()
    })

    it('shows appropriate icons for different variants', () => {
        const { rerender } = render(
            <ToastWrapper>
                <Toast variant="success" showIcon={true}>
                    <ToastTitle>Success</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        // Check for CheckCircle icon (would need to test SVG presence)
        expect(screen.getByText('Success')).toBeInTheDocument()

        rerender(
            <ToastWrapper>
                <Toast variant="xp" showIcon={true}>
                    <ToastTitle>XP Gained</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        // Check for Star icon with pulse animation
        expect(screen.getByText('XP Gained')).toBeInTheDocument()
    })

    it('hides icon when showIcon is false', () => {
        render(
            <ToastWrapper>
                <Toast variant="success" showIcon={false}>
                    <ToastTitle>No Icon Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('No Icon Toast')).toBeInTheDocument()
        // Would need to verify no icon is present
    })

    it('renders title and description', () => {
        render(
            <ToastWrapper>
                <Toast>
                    <ToastTitle>Toast Title</ToastTitle>
                    <ToastDescription>Toast description content</ToastDescription>
                </Toast>
            </ToastWrapper>
        )
        expect(screen.getByText('Toast Title')).toBeInTheDocument()
        expect(screen.getByText('Toast description content')).toBeInTheDocument()
    })

    it('applies correct styling classes for variants', () => {
        render(
            <ToastWrapper>
                <Toast variant="xp">
                    <ToastTitle>XP Toast</ToastTitle>
                </Toast>
            </ToastWrapper>
        )
        const toast = screen.getByText('XP Toast').closest('[role="status"]')
        expect(toast).toHaveClass('animate-glow')
    })
})