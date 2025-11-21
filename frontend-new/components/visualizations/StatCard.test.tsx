/**
 * StatCard Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  describe("Rendering", () => {
    it("renders with label and value", () => {
      render(<StatCard label="Total XP" value={1250} />);

      expect(screen.getByText("Total XP")).toBeInTheDocument();
      expect(screen.getByText("1250")).toBeInTheDocument();
    });

    it("renders with suffix", () => {
      render(<StatCard label="Time Tracked" value={42} suffix=" hours" />);

      expect(screen.getByText(/42.*hours/i)).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(
        <StatCard
          label="Active Projects"
          value={5}
          description="Currently in progress"
        />
      );

      expect(screen.getByText("Currently in progress")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(
        <StatCard
          label="Achievements"
          value={10}
          icon={<svg data-testid="test-icon" />}
        />
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("renders small size", () => {
      const { container } = render(
        <StatCard label="Test" value={100} size="sm" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass("p-4");
    });

    it("renders medium size (default)", () => {
      const { container } = render(<StatCard label="Test" value={100} />);

      const card = container.firstChild;
      expect(card).toHaveClass("p-6");
    });

    it("renders large size", () => {
      const { container } = render(
        <StatCard label="Test" value={100} size="lg" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass("p-8");
    });
  });

  describe("Colors", () => {
    it("renders default color", () => {
      const { container } = render(<StatCard label="Test" value={100} />);

      const value = container.querySelector(".text-\\[\\#1C1C1C\\]");
      expect(value).toBeInTheDocument();
    });

    it("renders primary color", () => {
      const { container } = render(
        <StatCard label="Test" value={100} color="primary" />
      );

      const value = container.querySelector(".text-\\[\\#1C1C1C\\]");
      expect(value).toBeInTheDocument();
    });

    it("renders success color", () => {
      const { container } = render(
        <StatCard label="Test" value={100} color="success" />
      );

      const value = container.querySelector(".text-green-600");
      expect(value).toBeInTheDocument();
    });

    it("renders warning color", () => {
      const { container } = render(
        <StatCard label="Test" value={100} color="warning" />
      );

      const value = container.querySelector(".text-yellow-600");
      expect(value).toBeInTheDocument();
    });

    it("renders danger color", () => {
      const { container } = render(
        <StatCard label="Test" value={100} color="danger" />
      );

      const value = container.querySelector(".text-red-600");
      expect(value).toBeInTheDocument();
    });
  });

  describe("Trend", () => {
    it("shows positive trend", () => {
      render(<StatCard label="Test" value={100} trend={15} />);

      expect(screen.getByText("+15%")).toBeInTheDocument();
      expect(screen.getByText("from last month")).toBeInTheDocument();
    });

    it("shows negative trend", () => {
      render(<StatCard label="Test" value={100} trend={-5} />);

      expect(screen.getByText("-5%")).toBeInTheDocument();
    });

    it("shows zero trend", () => {
      render(<StatCard label="Test" value={100} trend={0} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("shows custom trend label", () => {
      render(
        <StatCard
          label="Test"
          value={100}
          trend={10}
          trendLabel="from yesterday"
        />
      );

      expect(screen.getByText("from yesterday")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner", () => {
      const { container } = render(
        <StatCard label="Test" value={100} loading />
      );

      const spinner = container.querySelector(".animate-pulse");
      expect(spinner).toBeInTheDocument();
    });

    it("hides content when loading", () => {
      render(<StatCard label="Test" value={100} loading />);

      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper structure", () => {
      render(<StatCard label="Total XP" value={1250} />);

      // Label should be visible
      expect(screen.getByText("Total XP")).toBeInTheDocument();

      // Value should be prominently displayed
      const value = screen.getByText("1250");
      expect(value).toBeInTheDocument();
    });

    it("supports custom className", () => {
      const { container } = render(
        <StatCard label="Test" value={100} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Number Formatting", () => {
    it("formats large numbers", () => {
      render(<StatCard label="Test" value={1000000} />);

      // AnimatedCounter should handle formatting
      expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
    });

    it("handles decimal values", () => {
      render(<StatCard label="Test" value={42.5} />);

      expect(screen.getByText(/42\.5/)).toBeInTheDocument();
    });

    it("handles negative values", () => {
      render(<StatCard label="Test" value={-100} />);

      expect(screen.getByText(/-100/)).toBeInTheDocument();
    });
  });
});
