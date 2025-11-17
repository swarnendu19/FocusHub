/**
 * Formatting Utilities
 *
 * Helper functions for formatting numbers, currency, and other values.
 */

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as currency
 */
export function formatCurrency(
  value: number,
  currency = "USD",
  decimals = 2
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatCompactNumber(value: number, decimals = 1): string {
  if (value < 1000) {
    return value.toString();
  }

  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

  if (tier === 0) return value.toString();

  const suffix = abbreviations[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return `${scaled.toFixed(decimals)}${suffix}`;
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format XP with abbreviations
 */
export function formatXP(xp: number): string {
  return formatCompactNumber(xp, 1) + " XP";
}

/**
 * Format level
 */
export function formatLevel(level: number): string {
  return `Level ${level}`;
}

/**
 * Format ordinal numbers (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Convert camelCase or PascalCase to sentence case
 */
export function camelToSentence(str: string): string {
  if (!str) return str;
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}

/**
 * Convert snake_case to sentence case
 */
export function snakeToSentence(str: string): string {
  if (!str) return str;
  return str
    .split("_")
    .map((word, index) => (index === 0 ? capitalize(word) : word.toLowerCase()))
    .join(" ");
}

/**
 * Convert kebab-case to sentence case
 */
export function kebabToSentence(str: string): string {
  if (!str) return str;
  return str
    .split("-")
    .map((word, index) => (index === 0 ? capitalize(word) : word.toLowerCase()))
    .join(" ");
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number, suffix = "..."): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string to word boundary
 */
export function truncateWords(str: string, maxWords: number, suffix = "..."): string {
  if (!str) return str;
  const words = str.split(" ");
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + suffix;
}

/**
 * Pluralize word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural || singular + "s";
}

/**
 * Format count with word (e.g., "5 items")
 */
export function formatCount(
  count: number,
  singular: string,
  plural?: string
): string {
  return `${formatNumber(count)} ${pluralize(count, singular, plural)}`;
}

/**
 * Format list of items with "and" or "or"
 */
export function formatList(
  items: string[],
  conjunction: "and" | "or" = "and"
): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(", ")}, ${conjunction} ${lastItem}`;
}

/**
 * Format phone number (US format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Mask sensitive data (e.g., email, credit card)
 */
export function maskString(str: string, visibleChars = 4, maskChar = "*"): string {
  if (!str || str.length <= visibleChars) return str;
  const visible = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return masked + visible;
}

/**
 * Format email with masked domain
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  if (!domain) return email;

  const visibleUsername = username.length > 2 ? username.slice(0, 2) : username;
  const maskedUsername = visibleUsername + "*".repeat(Math.max(0, username.length - 2));

  return `${maskedUsername}@${domain}`;
}

/**
 * Format initials from name
 */
export function getInitials(name: string, maxChars = 2): string {
  if (!name) return "";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].slice(0, maxChars).toUpperCase();
  }

  return words
    .slice(0, maxChars)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Generate random color from string (for avatars, tags, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Format URL to display format (remove protocol, trailing slash)
 */
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Encode string for URL
 */
export function encodeUrl(str: string): string {
  return encodeURIComponent(str);
}

/**
 * Decode URL string
 */
export function decodeUrl(str: string): string {
  return decodeURIComponent(str);
}
