/**
 * Automated Accessibility Testing with axe-core
 * 
 * This test suite runs automated accessibility checks on key components
 * using the axe-core library to catch common accessibility issues.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { ResponsiveNavigation } from '@/components/layout/ResponsiveNavigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/utils/responsive', () => ({
    useDeviceType: () => 'desktop',
    useBreakpoint: () => true,
    useSafeArea: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

vi.mock('@/utils/accessibility', () => ({
    useReducedMotion: () => false,
    FocusManager: {
        trapFocus: vi.fn(() => vi.fn()),
    },
    handleKeyboardNavigation: vi.fn(),
    announceToScreenReader: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Automated Accessibility Tests', () => {
    describe('Button Components', () => {
        it('should have no accessibility violations - basic button', async () => {
            const { container } = render(
                <AccessibleButton>Click me</AccessibleButton>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - button with icon', async () => {
            const { container } = render(
                <AccessibleButton
                    leftIcon={<span>🔥</span>}
                    rightIcon={<span>→</span>}
                    ariaLabel="Start timer with flame icon"
                >
                    Start Timer
                </AccessibleButton>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - loading button', async () => {
            const { container } = render(
                <AccessibleButton
                    loading={true}
                    loadingText="Processing your request..."
                    ariaLabel="Submit form"
                >
                    Submit
                </AccessibleButton>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - disabled button', async () => {
            const { container } = render(
                <AccessibleButton
                    disabled={true}
                    ariaLabel="Save changes (disabled)"
                >
                    Save Changes
                </AccessibleButton>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Navigation Components', () => {
        it('should have no accessibility violations - desktop navigation', async () => {
            const { container } = renderWithRouter(<ResponsiveNavigation />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - mobile navigation', async () => {
            // Mock mobile device
            vi.mocked(await import('@/utils/responsive')).useBreakpoint.mockReturnValue(false);
            vi.mocked(await import('@/utils/responsive')).useDeviceType.mockReturnValue('mobile');

            const { container } = renderWithRouter(<ResponsiveNavigation />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Layout Components', () => {
        it('should have no accessibility violations - responsive layout', async () => {
            const { container } = renderWithRouter(
                <ResponsiveLayout>
                    <main>
                        <h1>Page Title</h1>
                        <p>Page content goes here.</p>
                        <button>Action Button</button>
                    </main>
                </ResponsiveLayout>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - layout without navigation', async () => {
            const { container } = renderWithRouter(
                <ResponsiveLayout showNavigation={false}>
                    <main>
                        <h1>Standalone Page</h1>
                        <form>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" required />
                            <button type="submit">Submit</button>
                        </form>
                    </main>
                </ResponsiveLayout>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Form Components', () => {
        it('should have no accessibility violations - form with labels', async () => {
            const { container } = render(
                <form>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            aria-describedby="username-help"
                        />
                        <div id="username-help">Enter your username</div>
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            aria-describedby="password-help"
                        />
                        <div id="password-help">Must be at least 8 characters</div>
                    </div>

                    <fieldset>
                        <legend>Notification Preferences</legend>
                        <div>
                            <input id="email-notifications" type="checkbox" />
                            <label htmlFor="email-notifications">Email notifications</label>
                        </div>
                        <div>
                            <input id="sms-notifications" type="checkbox" />
                            <label htmlFor="sms-notifications">SMS notifications</label>
                        </div>
                    </fieldset>

                    <button type="submit">Create Account</button>
                </form>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - form with errors', async () => {
            const { container } = render(
                <form>
                    <div>
                        <label htmlFor="email-error">Email Address</label>
                        <input
                            id="email-error"
                            type="email"
                            required
                            aria-invalid="true"
                            aria-describedby="email-error-message"
                        />
                        <div id="email-error-message" role="alert">
                            Please enter a valid email address
                        </div>
                    </div>

                    <button type="submit">Submit</button>
                </form>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Data Display Components', () => {
        it('should have no accessibility violations - data table', async () => {
            const { container } = render(
                <table>
                    <caption>User Statistics</caption>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">XP</th>
                            <th scope="col">Level</th>
                            <th scope="col">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">John Doe</th>
                            <td>1,250</td>
                            <td>5</td>
                            <td>3rd</td>
                        </tr>
                        <tr>
                            <th scope="row">Jane Smith</th>
                            <td>2,100</td>
                            <td>7</td>
                            <td>1st</td>
                        </tr>
                    </tbody>
                </table>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - progress indicators', async () => {
            const { container } = render(
                <div>
                    <div>
                        <label htmlFor="xp-progress">XP Progress</label>
                        <progress
                            id="xp-progress"
                            value={750}
                            max={1000}
                            aria-describedby="xp-description"
                        >
                            75% complete
                        </progress>
                        <div id="xp-description">750 out of 1000 XP to next level</div>
                    </div>

                    <div>
                        <div role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Task completion">
                            <div style={{ width: '60%', height: '20px', backgroundColor: '#3b82f6' }}></div>
                        </div>
                    </div>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Interactive Components', () => {
        it('should have no accessibility violations - modal dialog', async () => {
            const { container } = render(
                <div>
                    <button>Open Modal</button>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <h2 id="modal-title">Confirm Action</h2>
                        <p id="modal-description">Are you sure you want to delete this item?</p>
                        <div>
                            <button>Cancel</button>
                            <button>Delete</button>
                        </div>
                    </div>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - dropdown menu', async () => {
            const { container } = render(
                <div>
                    <button
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="dropdown-menu"
                    >
                        Options
                    </button>
                    <ul id="dropdown-menu" role="menu">
                        <li role="none">
                            <button role="menuitem">Edit</button>
                        </li>
                        <li role="none">
                            <button role="menuitem">Delete</button>
                        </li>
                        <li role="none">
                            <button role="menuitem">Share</button>
                        </li>
                    </ul>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - tabs', async () => {
            const { container } = render(
                <div>
                    <div role="tablist" aria-label="Dashboard sections">
                        <button
                            role="tab"
                            aria-selected="true"
                            aria-controls="overview-panel"
                            id="overview-tab"
                        >
                            Overview
                        </button>
                        <button
                            role="tab"
                            aria-selected="false"
                            aria-controls="stats-panel"
                            id="stats-tab"
                        >
                            Statistics
                        </button>
                    </div>

                    <div
                        role="tabpanel"
                        id="overview-panel"
                        aria-labelledby="overview-tab"
                    >
                        <h3>Overview Content</h3>
                        <p>Dashboard overview information.</p>
                    </div>

                    <div
                        role="tabpanel"
                        id="stats-panel"
                        aria-labelledby="stats-tab"
                        hidden
                    >
                        <h3>Statistics Content</h3>
                        <p>Detailed statistics information.</p>
                    </div>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Media and Images', () => {
        it('should have no accessibility violations - images with alt text', async () => {
            const { container } = render(
                <div>
                    <img
                        src="/avatar.jpg"
                        alt="User profile picture showing John Doe"
                        width="100"
                        height="100"
                    />

                    <figure>
                        <img
                            src="/chart.png"
                            alt="Bar chart showing productivity trends over the last 7 days"
                        />
                        <figcaption>Weekly productivity chart</figcaption>
                    </figure>

                    {/* Decorative image */}
                    <img
                        src="/decoration.svg"
                        alt=""
                        role="presentation"
                    />
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - video with captions', async () => {
            const { container } = render(
                <video controls aria-label="Tutorial: How to use the timer">
                    <source src="/tutorial.mp4" type="video/mp4" />
                    <track
                        kind="captions"
                        src="/tutorial-captions.vtt"
                        srcLang="en"
                        label="English captions"
                        default
                    />
                    <p>Your browser doesn't support video. <a href="/tutorial.mp4">Download the video</a>.</p>
                </video>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Complex UI Patterns', () => {
        it('should have no accessibility violations - card grid', async () => {
            const { container } = render(
                <div>
                    <h2>Achievement Cards</h2>
                    <div role="grid" aria-label="Achievement grid">
                        <div role="row">
                            <div role="gridcell">
                                <article>
                                    <h3>First Timer</h3>
                                    <p>Complete your first time tracking session</p>
                                    <div aria-label="Achievement status: Unlocked">✅</div>
                                </article>
                            </div>
                            <div role="gridcell">
                                <article>
                                    <h3>Speed Demon</h3>
                                    <p>Complete 10 tasks in one day</p>
                                    <div aria-label="Achievement status: Locked">🔒</div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations - live region updates', async () => {
            const { container } = render(
                <div>
                    <button>Start Timer</button>
                    <div aria-live="polite" aria-atomic="true">
                        Timer started: 00:00:00
                    </div>
                    <div aria-live="assertive" aria-atomic="true">
                        {/* Emergency notifications would go here */}
                    </div>
                </div>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});