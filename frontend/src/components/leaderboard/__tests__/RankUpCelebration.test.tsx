import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RankUpCelebration } from '../RankUpCelebration';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('RankUpCelebration', () => {
    const defaultProps = {
        isVisible: true,
        onClose: vi.fn(),
        oldRank: 5,
        newRank: 3,
        username: 'TestUser',
        avatar: 'https://example.com/avatar.jpg',
        xpGained: 150,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders celebration when visible', () => {
        render(<RankUpCelebration {...defaultProps} />);

        expect(screen.getByText('Rank Up!')).toBeInTheDocument();
        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText('Third Place!')).toBeInTheDocument();
        expect(screen.getByText('Moved up 2 positions!')).toBeInTheDocument();
        expect(screen.getByText('+150 XP')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
        render(<RankUpCelebration {...defaultProps} isVisible={false} />);

        expect(screen.queryByText('Rank Up!')).not.toBeInTheDocument();
    });

    it('displays correct rank text for different positions', () => {
        // Test champion (rank 1)
        const { rerender } = render(
            <RankUpCelebration {...defaultProps} newRank={1} />
        );
        expect(screen.getByText('Champion!')).toBeInTheDocument();

        // Test runner-up (rank 2)
        rerender(<RankUpCelebration {...defaultProps} newRank={2} />);
        expect(screen.getByText('Runner-up!')).toBeInTheDocument();

        // Test top 10
        rerender(<RankUpCelebration {...defaultProps} newRank={7} />);
        expect(screen.getByText('Top 7!')).toBeInTheDocument();

        // Test regular rank
        rerender(<RankUpCelebration {...defaultProps} newRank={15} />);
        expect(screen.getByText('Rank #15')).toBeInTheDocument();
    });

    it('handles user without avatar', () => {
        render(<RankUpCelebration {...defaultProps} avatar={undefined} />);

        // Should show initials instead of avatar
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('handles zero XP gained', () => {
        render(<RankUpCelebration {...defaultProps} xpGained={0} />);

        // XP section should not be visible
        expect(screen.queryByText('+0 XP')).not.toBeInTheDocument();
    });

    it('calls onClose when clicking awesome button', () => {
        render(<RankUpCelebration {...defaultProps} />);

        const awesomeButton = screen.getByText('Awesome!');
        fireEvent.click(awesomeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking backdrop', () => {
        render(<RankUpCelebration {...defaultProps} />);

        const backdrop = screen.getByRole('button', { hidden: true });
        fireEvent.click(backdrop);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('auto-closes after specified duration', async () => {
        vi.useFakeTimers();

        render(<RankUpCelebration {...defaultProps} duration={1000} />);

        expect(defaultProps.onClose).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        vi.useRealTimers();
    });

    it('displays correct rank change calculation', () => {
        render(<RankUpCelebration {...defaultProps} oldRank={10} newRank={3} />);

        expect(screen.getByText('Moved up 7 positions!')).toBeInTheDocument();
    });

    it('handles single position change', () => {
        render(<RankUpCelebration {...defaultProps} oldRank={4} newRank={3} />);

        expect(screen.getByText('Moved up 1 position!')).toBeInTheDocument();
    });

    it('prevents event propagation when clicking card', () => {
        const onClose = vi.fn();
        render(<RankUpCelebration {...defaultProps} onClose={onClose} />);

        const card = screen.getByText('Rank Up!').closest('div');
        fireEvent.click(card!);

        // Should not call onClose when clicking the card itself
        expect(onClose).not.toHaveBeenCalled();
    });
});