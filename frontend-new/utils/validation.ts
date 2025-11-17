/**
 * Validation Utilities
 *
 * Helper functions for data validation.
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation regex
 */
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Username validation regex (alphanumeric, underscore, hyphen)
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Hex color validation regex
 */
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return URL_REGEX.test(url.trim());
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false;
  const trimmed = username.trim();
  return (
    trimmed.length >= 3 &&
    trimmed.length <= 30 &&
    USERNAME_REGEX.test(trimmed)
  );
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  return password.length >= 8 && password.length <= 128;
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  return Math.min(4, strength);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password);
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return labels[strength];
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== "string") return false;
  return HEX_COLOR_REGEX.test(color.trim());
}

/**
 * Validate phone number (basic)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Validate number in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate string length
 */
export function isValidLength(
  str: string,
  min: number,
  max: number
): boolean {
  if (!str || typeof str !== "string") return false;
  const length = str.trim().length;
  return length >= min && length <= max;
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === "number" && value > 0 && !isNaN(value);
}

/**
 * Validate non-negative number
 */
export function isNonNegativeNumber(value: number): boolean {
  return typeof value === "number" && value >= 0 && !isNaN(value);
}

/**
 * Validate integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * Validate date string
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== "string") return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate date is in future
 */
export function isFutureDate(date: Date | string): boolean {
  const d = new Date(date);
  return d.getTime() > Date.now();
}

/**
 * Validate date is in past
 */
export function isPastDate(date: Date | string): boolean {
  const d = new Date(date);
  return d.getTime() < Date.now();
}

/**
 * Validate file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * Validate JSON string
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate array has minimum length
 */
export function hasMinLength<T>(arr: T[], min: number): boolean {
  return Array.isArray(arr) && arr.length >= min;
}

/**
 * Validate array has maximum length
 */
export function hasMaxLength<T>(arr: T[], max: number): boolean {
  return Array.isArray(arr) && arr.length <= max;
}

/**
 * Sanitize string (remove HTML tags)
 */
export function sanitizeString(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize HTML (basic)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  const allowedTags = ["p", "br", "strong", "em", "u", "a", "ul", "ol", "li"];
  const tagRegex = /<(\/?[a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tagRegex, (match, tag) => {
    const tagName = tag.toLowerCase().replace("/", "");
    return allowedTags.includes(tagName) ? match : "";
  });
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== "string") return false;

  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate match (e.g., password confirmation)
 */
export function isMatch(value1: unknown, value2: unknown): boolean {
  return value1 === value2;
}

/**
 * Validate unique values in array
 */
export function hasUniqueValues<T>(arr: T[]): boolean {
  return new Set(arr).size === arr.length;
}

/**
 * Create validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate form data with multiple rules
 */
export function validateForm(
  data: Record<string, unknown>,
  rules: Record<string, Array<(value: unknown) => string | null>>
): ValidationResult {
  const errors: string[] = [];

  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.push(`${field}: ${error}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
