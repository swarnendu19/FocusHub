/**
 * Button Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/tests/utils/test-utils";
import { Button } from "./Button";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("renders with default variant", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-[#1C1C1C]");
    });

    it("renders with primary variant", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-[#1C1C1C]");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-[#757373]");
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-[#FAFAFA]");
    });

    it("renders with outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-2");
    });

    it("renders different sizes", () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-9");

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-10");

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-11");
    });

    it("renders full width when specified", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });

  describe("Disabled State", () => {
    it("renders disabled button", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("hides children when loading", () => {
      render(<Button loading>Hidden Text</Button>);
      const button = screen.getByRole("button");
      const text = button.querySelector("span:not(.animate-spin)");
      expect(text).toHaveClass("opacity-0");
    });

    it("does not call onClick when loading", async () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be submitted in forms", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("supports keyboard navigation", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const user = userEvent.setup();
      const button = screen.getByRole("button");

      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByRole("button")).toHaveAccessibleName("Close dialog");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Button aria-describedby="btn-desc">Button</Button>
          <span id="btn-desc">This button does something</span>
        </>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "btn-desc");
    });
  });

  describe("As Different Element", () => {
    it("renders as link when asChild with anchor", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveClass("bg-[#1C1C1C]"); // Button styles applied
    });
  });
});
