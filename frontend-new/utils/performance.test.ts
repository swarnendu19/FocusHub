/**
 * Performance Utilities Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  measurePerformance,
  debounce,
  throttle,
  prefersReducedMotion,
  isSlowConnection,
  isMobileDevice,
  hasTouchSupport,
  getDevicePixelRatio,
} from "./performance";

describe("Performance Utilities", () => {
  describe("measurePerformance", () => {
    it("measures execution time of synchronous function", async () => {
      const result = await measurePerformance("test-sync", () => {
        return 42;
      });

      expect(result).toBe(42);
    });

    it("measures execution time of async function", async () => {
      const result = await measurePerformance("test-async", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "done";
      });

      expect(result).toBe("done");
    });

    it("throws error if function fails", async () => {
      await expect(
        measurePerformance("test-error", () => {
          throw new Error("Test error");
        })
      ).rejects.toThrow("Test error");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("delays function execution", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("resets timer on subsequent calls", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);

      debounced();
      vi.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("passes arguments to debounced function", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("arg1", "arg2");
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("uses last call arguments", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("first");
      vi.advanceTimersByTime(50);

      debounced("second");
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("second");
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("executes function immediately on first call", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("ignores calls within throttle period", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("allows call after throttle period", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("passes arguments to throttled function", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled("arg1", "arg2");

      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });
  });

  describe("prefersReducedMotion", () => {
    it("returns false when not in reduced motion mode", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(prefersReducedMotion()).toBe(false);
    });

    it("returns true when in reduced motion mode", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(prefersReducedMotion()).toBe(true);
    });
  });

  describe("isSlowConnection", () => {
    it("returns false when connection is fast", () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: {
          effectiveType: "4g",
          downlink: 10,
        },
      });

      expect(isSlowConnection()).toBe(false);
    });

    it("returns true for 2G connection", () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: {
          effectiveType: "2g",
          downlink: 0.5,
        },
      });

      expect(isSlowConnection()).toBe(true);
    });

    it("returns true for low downlink", () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: {
          effectiveType: "4g",
          downlink: 0.8,
        },
      });

      expect(isSlowConnection()).toBe(true);
    });

    it("returns false when connection API not available", () => {
      Object.defineProperty(navigator, "connection", {
        writable: true,
        value: undefined,
      });

      expect(isSlowConnection()).toBe(false);
    });
  });

  describe("isMobileDevice", () => {
    it("detects iPhone", () => {
      Object.defineProperty(navigator, "userAgent", {
        writable: true,
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("detects Android", () => {
      Object.defineProperty(navigator, "userAgent", {
        writable: true,
        value: "Mozilla/5.0 (Linux; Android 10)",
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("returns false for desktop", () => {
      Object.defineProperty(navigator, "userAgent", {
        writable: true,
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      });

      expect(isMobileDevice()).toBe(false);
    });
  });

  describe("hasTouchSupport", () => {
    it("detects touch support", () => {
      Object.defineProperty(window, "ontouchstart", {
        writable: true,
        value: () => {},
      });

      expect(hasTouchSupport()).toBe(true);
    });

    it("returns false without touch support", () => {
      Object.defineProperty(window, "ontouchstart", {
        writable: true,
        value: undefined,
      });

      Object.defineProperty(navigator, "maxTouchPoints", {
        writable: true,
        value: 0,
      });

      expect(hasTouchSupport()).toBe(false);
    });
  });

  describe("getDevicePixelRatio", () => {
    it("returns device pixel ratio", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 2,
      });

      expect(getDevicePixelRatio()).toBe(2);
    });

    it("returns 1 as default", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: undefined,
      });

      expect(getDevicePixelRatio()).toBe(1);
    });

    it("handles high DPI displays", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 3,
      });

      expect(getDevicePixelRatio()).toBe(3);
    });
  });
});
