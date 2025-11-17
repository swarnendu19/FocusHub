import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatFileSize,
  formatXP,
  formatLevel,
  formatOrdinal,
  capitalize,
  toTitleCase,
  truncate,
  pluralize,
  formatCount,
  formatList,
  maskString,
  getInitials,
  stringToColor,
} from "./format";

describe("format utilities", () => {
  describe("formatNumber", () => {
    it("should format numbers with thousand separators", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
      expect(formatNumber(123.456, 2)).toBe("123.46");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency values", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
      expect(formatCurrency(99.99)).toBe("$99.99");
      expect(formatCurrency(1000, "EUR")).toBe("€1,000.00");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentages", () => {
      expect(formatPercentage(50)).toBe("50%");
      expect(formatPercentage(33.33, 1)).toBe("33.3%");
      expect(formatPercentage(100)).toBe("100%");
    });
  });

  describe("formatCompactNumber", () => {
    it("should format large numbers with abbreviations", () => {
      expect(formatCompactNumber(500)).toBe("500");
      expect(formatCompactNumber(1500)).toBe("1.5K");
      expect(formatCompactNumber(1000000)).toBe("1.0M");
      expect(formatCompactNumber(1500000000)).toBe("1.5B");
    });
  });

  describe("formatFileSize", () => {
    it("should format file sizes", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });
  });

  describe("formatXP", () => {
    it("should format XP values", () => {
      expect(formatXP(100)).toBe("100 XP");
      expect(formatXP(1500)).toBe("1.5K XP");
      expect(formatXP(1000000)).toBe("1.0M XP");
    });
  });

  describe("formatLevel", () => {
    it("should format level values", () => {
      expect(formatLevel(1)).toBe("Level 1");
      expect(formatLevel(50)).toBe("Level 50");
    });
  });

  describe("formatOrdinal", () => {
    it("should format ordinal numbers", () => {
      expect(formatOrdinal(1)).toBe("1st");
      expect(formatOrdinal(2)).toBe("2nd");
      expect(formatOrdinal(3)).toBe("3rd");
      expect(formatOrdinal(4)).toBe("4th");
      expect(formatOrdinal(21)).toBe("21st");
      expect(formatOrdinal(22)).toBe("22nd");
      expect(formatOrdinal(100)).toBe("100th");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
      expect(capitalize("")).toBe("");
    });
  });

  describe("toTitleCase", () => {
    it("should convert to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
      expect(toTitleCase("the quick brown fox")).toBe("The Quick Brown Fox");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
      expect(truncate("Short", 10)).toBe("Short");
      expect(truncate("Hello World", 8, "…")).toBe("Hello W…");
    });
  });

  describe("pluralize", () => {
    it("should pluralize words based on count", () => {
      expect(pluralize(1, "item")).toBe("item");
      expect(pluralize(2, "item")).toBe("items");
      expect(pluralize(0, "item")).toBe("items");
      expect(pluralize(2, "child", "children")).toBe("children");
    });
  });

  describe("formatCount", () => {
    it("should format count with word", () => {
      expect(formatCount(1, "item")).toBe("1 item");
      expect(formatCount(5, "item")).toBe("5 items");
      expect(formatCount(1000, "user")).toBe("1,000 users");
    });
  });

  describe("formatList", () => {
    it("should format lists with conjunction", () => {
      expect(formatList(["apple"])).toBe("apple");
      expect(formatList(["apple", "banana"])).toBe("apple and banana");
      expect(formatList(["apple", "banana", "orange"])).toBe("apple, banana, and orange");
      expect(formatList(["apple", "banana"], "or")).toBe("apple or banana");
    });
  });

  describe("maskString", () => {
    it("should mask sensitive data", () => {
      expect(maskString("1234567890", 4)).toBe("******7890");
      expect(maskString("secret", 2)).toBe("****et");
      expect(maskString("hi", 4)).toBe("hi");
    });
  });

  describe("getInitials", () => {
    it("should extract initials from name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("John")).toBe("JO");
      expect(getInitials("John Middle Doe", 2)).toBe("JM");
    });
  });

  describe("stringToColor", () => {
    it("should generate consistent color from string", () => {
      const color1 = stringToColor("test");
      const color2 = stringToColor("test");
      expect(color1).toBe(color2);
      expect(color1).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });

    it("should generate different colors for different strings", () => {
      const color1 = stringToColor("test1");
      const color2 = stringToColor("test2");
      expect(color1).not.toBe(color2);
    });
  });
});
