/**
 * TimerNotifications Component Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { TimerNotifications } from "./TimerNotifications";

// Mock hooks
vi.mock("@/hooks", () => ({
  useTimer: vi.fn(),
}));

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: vi.fn(),
}));

import { useTimer } from "@/hooks";
import { useNotifications } from "@/hooks/useNotifications";

describe("TimerNotifications", () => {
  const mockShowTimerNotification = vi.fn();
  const mockRequestPermission = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useNotifications
    (useNotifications as any).mockReturnValue({
      showTimerNotification: mockShowTimerNotification,
      requestPermission: mockRequestPermission,
      isGranted: true,
      isSupported: true,
    });
  });

  it("should render without crashing (headless component)", () => {
    // Mock useTimer
    (useTimer as any).mockReturnValue({
      timerState: "idle",
      currentTimer: null,
      elapsedTime: 0,
    });

    const { container } = render(<TimerNotifications />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should request notification permission on mount when not granted", () => {
    (useNotifications as any).mockReturnValue({
      showTimerNotification: mockShowTimerNotification,
      requestPermission: mockRequestPermission,
      isGranted: false,
      isSupported: true,
    });

    (useTimer as any).mockReturnValue({
      timerState: "idle",
      currentTimer: null,
      elapsedTime: 0,
    });

    render(<TimerNotifications />);

    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it("should not send notification when permission is not granted", () => {
    (useNotifications as any).mockReturnValue({
      showTimerNotification: mockShowTimerNotification,
      requestPermission: mockRequestPermission,
      isGranted: false,
      isSupported: true,
    });

    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test timer" },
      elapsedTime: 0,
    });

    render(<TimerNotifications />);

    expect(mockShowTimerNotification).not.toHaveBeenCalled();
  });

  it("should send notification when timer starts", async () => {
    const { rerender } = render(<TimerNotifications notifyOnStart />);

    // Initially idle
    (useTimer as any).mockReturnValue({
      timerState: "idle",
      currentTimer: null,
      elapsedTime: 0,
    });

    rerender(<TimerNotifications notifyOnStart />);

    // Then running
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 0,
    });

    rerender(<TimerNotifications notifyOnStart />);

    await waitFor(() => {
      expect(mockShowTimerNotification).toHaveBeenCalledWith(
        "Timer Started",
        "Working on: Test task"
      );
    });
  });

  it("should send notification when timer stops", async () => {
    // Start with running
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 300, // 5 minutes
    });

    const { rerender } = render(<TimerNotifications notifyOnStop />);

    // Then idle
    (useTimer as any).mockReturnValue({
      timerState: "idle",
      currentTimer: null,
      elapsedTime: 300,
    });

    rerender(<TimerNotifications notifyOnStop />);

    await waitFor(() => {
      expect(mockShowTimerNotification).toHaveBeenCalledWith(
        "Timer Stopped",
        expect.stringContaining("Session completed:")
      );
    });
  });

  it("should send notification when timer pauses", async () => {
    // Start with running
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 180, // 3 minutes
    });

    const { rerender } = render(<TimerNotifications notifyOnPause />);

    // Then paused
    (useTimer as any).mockReturnValue({
      timerState: "paused",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 180,
    });

    rerender(<TimerNotifications notifyOnPause />);

    await waitFor(() => {
      expect(mockShowTimerNotification).toHaveBeenCalledWith(
        "Timer Paused",
        expect.stringContaining("Current session:")
      );
    });
  });

  it("should not send pause notification when notifyOnPause is false", async () => {
    // Start with running
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 180,
    });

    const { rerender } = render(<TimerNotifications notifyOnPause={false} />);

    // Then paused
    (useTimer as any).mockReturnValue({
      timerState: "paused",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 180,
    });

    rerender(<TimerNotifications notifyOnPause={false} />);

    await waitFor(() => {
      expect(mockShowTimerNotification).not.toHaveBeenCalledWith(
        "Timer Paused",
        expect.anything()
      );
    });
  });

  it("should send milestone notification at configured intervals", async () => {
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 0,
    });

    const { rerender } = render(
      <TimerNotifications notifyOnMilestone milestoneInterval={1} />
    );

    // Advance to 1 minute (60 seconds)
    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test task" },
      elapsedTime: 60,
    });

    rerender(<TimerNotifications notifyOnMilestone milestoneInterval={1} />);

    await waitFor(() => {
      expect(mockShowTimerNotification).toHaveBeenCalledWith(
        "Milestone Reached!",
        expect.stringContaining("1 minutes")
      );
    });
  });

  it("should not send notification when notifications are not supported", () => {
    (useNotifications as any).mockReturnValue({
      showTimerNotification: mockShowTimerNotification,
      requestPermission: mockRequestPermission,
      isGranted: false,
      isSupported: false,
    });

    (useTimer as any).mockReturnValue({
      timerState: "running",
      currentTimer: { id: "1", description: "Test timer" },
      elapsedTime: 0,
    });

    render(<TimerNotifications />);

    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(mockShowTimerNotification).not.toHaveBeenCalled();
  });
});
