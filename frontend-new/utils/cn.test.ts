import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("should handle conditional class names", () => {
    const result = cn("text-red-500", false && "text-blue-500");
    expect(result).toBe("text-red-500");
  });

  it("should merge tailwind classes with conflicts", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["text-red-500", "font-bold"], "text-blue-500");
    expect(result).toBe("font-bold text-blue-500");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle undefined and null values", () => {
    const result = cn("text-red-500", undefined, null, "font-bold");
    expect(result).toBe("text-red-500 font-bold");
  });

  it("should handle objects with boolean values", () => {
    const result = cn({
      "text-red-500": true,
      "font-bold": false,
      "underline": true,
    });
    expect(result).toBe("text-red-500 underline");
  });

  it("should merge complex combinations", () => {
    const result = cn(
      "base-class",
      {
        "conditional-1": true,
        "conditional-2": false,
      },
      ["array-class-1", "array-class-2"],
      "override-class"
    );
    expect(result).toContain("base-class");
    expect(result).toContain("conditional-1");
    expect(result).not.toContain("conditional-2");
    expect(result).toContain("array-class-1");
    expect(result).toContain("array-class-2");
    expect(result).toContain("override-class");
  });
});
