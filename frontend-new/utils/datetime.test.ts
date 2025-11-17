import { describe, it, expect } from "vitest";
import {
  formatTime,
  formatDuration,
  minutesToSeconds,
  hoursToSeconds,
  secondsToMinutes,
  secondsToHours,
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  getStartOfDay,
  getEndOfDay,
  addDays,
  getDaysDifference,
  isPast,
  isFuture,
} from "./datetime";

describe("datetime utilities", () => {
  describe("formatTime", () => {
    it("should format seconds to HH:MM:SS", () => {
      expect(formatTime(3661)).toBe("1:01:01");
      expect(formatTime(3600)).toBe("1:00:00");
      expect(formatTime(60)).toBe("0:01:00");
      expect(formatTime(0)).toBe("0:00:00");
    });

    it("should format seconds to MM:SS when showHours is false", () => {
      expect(formatTime(125, false)).toBe("2:05");
      expect(formatTime(60, false)).toBe("1:00");
    });
  });

  describe("formatDuration", () => {
    it("should format duration in long form", () => {
      expect(formatDuration(3661)).toBe("1 hour 1 minute"); // seconds not shown when hours present
      expect(formatDuration(3600)).toBe("1 hour");
      expect(formatDuration(125)).toBe("2 minutes 5 seconds"); // seconds shown when no hours
      expect(formatDuration(60)).toBe("1 minute");
      expect(formatDuration(0)).toBe("0 minutes");
    });

    it("should format duration in short form", () => {
      expect(formatDuration(3661, true)).toBe("1h 1m"); // seconds not shown when hours present
      expect(formatDuration(3600, true)).toBe("1h");
      expect(formatDuration(125, true)).toBe("2m 5s"); // seconds shown when no hours
      expect(formatDuration(60, true)).toBe("1m");
    });
  });

  describe("time conversions", () => {
    it("should convert minutes to seconds", () => {
      expect(minutesToSeconds(5)).toBe(300);
      expect(minutesToSeconds(0)).toBe(0);
    });

    it("should convert hours to seconds", () => {
      expect(hoursToSeconds(1)).toBe(3600);
      expect(hoursToSeconds(2.5)).toBe(9000);
    });

    it("should convert seconds to minutes", () => {
      expect(secondsToMinutes(300)).toBe(5);
      expect(secondsToMinutes(90)).toBe(1);
    });

    it("should convert seconds to hours", () => {
      expect(secondsToHours(3600)).toBe(1);
      expect(secondsToHours(7200)).toBe(2);
    });
  });

  describe("formatDate", () => {
    it("should format date in short form", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date, "short");
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2024");
    });
  });

  describe("getRelativeTime", () => {
    it("should return 'just now' for very recent dates", () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe("just now");
    });

    it("should return minutes ago", () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(date)).toBe("5 minutes ago");
    });

    it("should return hours ago", () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toBe("2 hours ago");
    });
  });

  describe("date checks", () => {
    it("should check if date is today", () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it("should check if date is yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);

      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });

    it("should check if date is in past", () => {
      const past = new Date("2020-01-01");
      expect(isPast(past)).toBe(true);

      const future = new Date(Date.now() + 1000000);
      expect(isPast(future)).toBe(false);
    });

    it("should check if date is in future", () => {
      const future = new Date(Date.now() + 1000000);
      expect(isFuture(future)).toBe(true);

      const past = new Date("2020-01-01");
      expect(isFuture(past)).toBe(false);
    });
  });

  describe("date manipulation", () => {
    it("should get start of day", () => {
      const date = new Date("2024-01-15T15:30:45");
      const start = getStartOfDay(date);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
    });

    it("should get end of day", () => {
      const date = new Date("2024-01-15T10:00:00");
      const end = getEndOfDay(date);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });

    it("should add days to date", () => {
      const date = new Date("2024-01-15");
      const newDate = addDays(date, 5);
      expect(newDate.getDate()).toBe(20);
    });

    it("should calculate days difference", () => {
      const date1 = new Date("2024-01-15");
      const date2 = new Date("2024-01-20");
      expect(getDaysDifference(date1, date2)).toBe(5);
    });
  });
});
