import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidUrl,
  isValidUsername,
  isValidPassword,
  getPasswordStrength,
  getPasswordStrengthLabel,
  isValidHexColor,
  isValidPhoneNumber,
  isInRange,
  isValidLength,
  isRequired,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isValidDateString,
  isFutureDate,
  isPastDate,
  isValidJson,
  hasMinLength,
  hasMaxLength,
  sanitizeString,
  escapeHtml,
  isValidCreditCard,
  isMatch,
  hasUniqueValues,
} from "./validation";

describe("validation utilities", () => {
  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://sub.example.com/path")).toBe(true);
      expect(isValidUrl("example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("not a url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("isValidUsername", () => {
    it("should validate correct usernames", () => {
      expect(isValidUsername("user123")).toBe(true);
      expect(isValidUsername("user_name")).toBe(true);
      expect(isValidUsername("user-name")).toBe(true);
    });

    it("should reject invalid usernames", () => {
      expect(isValidUsername("ab")).toBe(false); // too short
      expect(isValidUsername("a".repeat(31))).toBe(false); // too long
      expect(isValidUsername("user name")).toBe(false); // spaces
      expect(isValidUsername("user@name")).toBe(false); // special chars
    });
  });

  describe("isValidPassword", () => {
    it("should validate passwords of correct length", () => {
      expect(isValidPassword("password123")).toBe(true);
      expect(isValidPassword("12345678")).toBe(true);
    });

    it("should reject passwords that are too short or long", () => {
      expect(isValidPassword("short")).toBe(false);
      expect(isValidPassword("a".repeat(129))).toBe(false);
    });
  });

  describe("getPasswordStrength", () => {
    it("should calculate password strength", () => {
      expect(getPasswordStrength("weak")).toBe(0);
      expect(getPasswordStrength("password")).toBe(1);
      expect(getPasswordStrength("Password123")).toBe(3);
      expect(getPasswordStrength("P@ssw0rd123!")).toBe(4);
    });
  });

  describe("getPasswordStrengthLabel", () => {
    it("should return password strength labels", () => {
      expect(getPasswordStrengthLabel("weak")).toBe("Very Weak");
      expect(getPasswordStrengthLabel("password")).toBe("Weak");
      expect(getPasswordStrengthLabel("Password123")).toBe("Good");
    });
  });

  describe("isValidHexColor", () => {
    it("should validate hex colors", () => {
      expect(isValidHexColor("#000000")).toBe(true);
      expect(isValidHexColor("#FFF")).toBe(true);
      expect(isValidHexColor("#abc123")).toBe(true);
    });

    it("should reject invalid hex colors", () => {
      expect(isValidHexColor("000000")).toBe(false);
      expect(isValidHexColor("#GGG")).toBe(false);
      expect(isValidHexColor("#12345")).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should validate phone numbers", () => {
      expect(isValidPhoneNumber("1234567890")).toBe(true);
      expect(isValidPhoneNumber("(123) 456-7890")).toBe(true);
      expect(isValidPhoneNumber("+1-234-567-8900")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhoneNumber("123")).toBe(false);
      expect(isValidPhoneNumber("")).toBe(false);
    });
  });

  describe("isInRange", () => {
    it("should check if number is in range", () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  describe("isValidLength", () => {
    it("should validate string length", () => {
      expect(isValidLength("hello", 3, 10)).toBe(true);
      expect(isValidLength("hello", 1, 4)).toBe(false);
      expect(isValidLength("  hello  ", 3, 10)).toBe(true); // trims
    });
  });

  describe("isRequired", () => {
    it("should check required fields", () => {
      expect(isRequired("value")).toBe(true);
      expect(isRequired("")).toBe(false);
      expect(isRequired("  ")).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired([])).toBe(false);
      expect(isRequired([1])).toBe(true);
    });
  });

  describe("number validations", () => {
    it("should validate positive numbers", () => {
      expect(isPositiveNumber(5)).toBe(true);
      expect(isPositiveNumber(0.1)).toBe(true);
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-5)).toBe(false);
    });

    it("should validate non-negative numbers", () => {
      expect(isNonNegativeNumber(5)).toBe(true);
      expect(isNonNegativeNumber(0)).toBe(true);
      expect(isNonNegativeNumber(-5)).toBe(false);
    });

    it("should validate integers", () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(5.5)).toBe(false);
    });
  });

  describe("date validations", () => {
    it("should validate date strings", () => {
      expect(isValidDateString("2024-01-15")).toBe(true);
      expect(isValidDateString("invalid")).toBe(false);
    });

    it("should check if date is in future", () => {
      const future = new Date(Date.now() + 100000);
      const past = new Date("2020-01-01");
      expect(isFutureDate(future)).toBe(true);
      expect(isFutureDate(past)).toBe(false);
    });

    it("should check if date is in past", () => {
      const past = new Date("2020-01-01");
      const future = new Date(Date.now() + 100000);
      expect(isPastDate(past)).toBe(true);
      expect(isPastDate(future)).toBe(false);
    });
  });

  describe("isValidJson", () => {
    it("should validate JSON strings", () => {
      expect(isValidJson('{"key": "value"}')).toBe(true);
      expect(isValidJson("[1, 2, 3]")).toBe(true);
      expect(isValidJson("invalid json")).toBe(false);
    });
  });

  describe("array validations", () => {
    it("should check array minimum length", () => {
      expect(hasMinLength([1, 2, 3], 2)).toBe(true);
      expect(hasMinLength([1], 2)).toBe(false);
    });

    it("should check array maximum length", () => {
      expect(hasMaxLength([1, 2], 3)).toBe(true);
      expect(hasMaxLength([1, 2, 3, 4], 3)).toBe(false);
    });

    it("should check for unique values", () => {
      expect(hasUniqueValues([1, 2, 3])).toBe(true);
      expect(hasUniqueValues([1, 2, 2])).toBe(false);
    });
  });

  describe("sanitizeString", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeString("<p>Hello</p>")).toBe("Hello");
      expect(sanitizeString("<script>alert('xss')</script>")).toBe("alert('xss')");
    });
  });

  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
      expect(escapeHtml("A & B")).toBe("A &amp; B");
      expect(escapeHtml('"quoted"')).toBe("&quot;quoted&quot;");
    });
  });

  describe("isValidCreditCard", () => {
    it("should validate credit card numbers using Luhn algorithm", () => {
      expect(isValidCreditCard("4532015112830366")).toBe(true); // Valid Visa
      expect(isValidCreditCard("6011111111111117")).toBe(true); // Valid Discover
      expect(isValidCreditCard("1234567890123456")).toBe(false); // Invalid
    });
  });

  describe("isMatch", () => {
    it("should check if values match", () => {
      expect(isMatch("password", "password")).toBe(true);
      expect(isMatch("password", "different")).toBe(false);
      expect(isMatch(123, 123)).toBe(true);
    });
  });
});
