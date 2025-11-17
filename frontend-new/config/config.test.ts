import { describe, it, expect } from "vitest";
import {
  clientEnv,
  config,
  getApiUrl,
  replaceUrlParams,
  isFeatureEnabled,
  APP_NAME,
  TIMER,
  COLORS,
  API_ENDPOINTS,
} from "./index";

describe("Configuration", () => {
  describe("clientEnv", () => {
    it("should have API base URL", () => {
      expect(clientEnv.apiBaseUrl).toBeDefined();
      expect(typeof clientEnv.apiBaseUrl).toBe("string");
    });

    it("should have API timeout", () => {
      expect(clientEnv.apiTimeout).toBeDefined();
      expect(typeof clientEnv.apiTimeout).toBe("number");
      expect(clientEnv.apiTimeout).toBeGreaterThan(0);
    });

    it("should have feature flags", () => {
      expect(clientEnv.features).toBeDefined();
      expect(typeof clientEnv.features.analytics).toBe("boolean");
      expect(typeof clientEnv.features.aiFeatures).toBe("boolean");
    });
  });

  describe("config object", () => {
    it("should have app metadata", () => {
      expect(config.app.name).toBe("FocusHub");
      expect(config.app.version).toBeDefined();
    });

    it("should have API configuration", () => {
      expect(config.api.baseUrl).toBeDefined();
      expect(config.api.timeout).toBeGreaterThan(0);
    });

    it("should have feature flags", () => {
      expect(config.features).toBeDefined();
      expect(typeof config.features.analytics).toBe("boolean");
    });
  });

  describe("Constants", () => {
    it("should have app name", () => {
      expect(APP_NAME).toBe("FocusHub");
    });

    it("should have timer configuration", () => {
      expect(TIMER.DEFAULT_WORK_DURATION).toBe(25 * 60);
      expect(TIMER.DEFAULT_SHORT_BREAK).toBe(5 * 60);
      expect(TIMER.TICK_INTERVAL).toBe(1000);
    });

    it("should have color palette", () => {
      expect(COLORS.dark).toBe("#1C1C1C");
      expect(COLORS.gray).toBe("#757373");
      expect(COLORS.white).toBe("#FFFFFF");
      expect(COLORS.light).toBe("#FAFAFA");
    });

    it("should have API endpoints", () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toBe("/auth/login");
      expect(API_ENDPOINTS.USER.PROFILE).toBe("/user/profile");
      expect(API_ENDPOINTS.TIMER.START).toBe("/timer/start");
    });
  });

  describe("Utility functions", () => {
    it("getApiUrl should construct full API URLs", () => {
      const url = getApiUrl("/test");
      expect(url).toContain("/test");
    });

    it("getApiUrl should handle endpoints with leading slash", () => {
      const url1 = getApiUrl("/test");
      const url2 = getApiUrl("test");
      expect(url1).toBe(url2);
    });

    it("replaceUrlParams should replace URL parameters", () => {
      const url = replaceUrlParams("/projects/:id", { id: "123" });
      expect(url).toBe("/projects/123");
    });

    it("replaceUrlParams should handle multiple parameters", () => {
      const url = replaceUrlParams("/projects/:projectId/tasks/:taskId", {
        projectId: "123",
        taskId: "456",
      });
      expect(url).toBe("/projects/123/tasks/456");
    });

    it("isFeatureEnabled should check feature flags", () => {
      const analyticsEnabled = isFeatureEnabled("analytics");
      expect(typeof analyticsEnabled).toBe("boolean");
    });
  });

  describe("Type safety", () => {
    it("should allow accessing nested config properties", () => {
      // This test mainly checks TypeScript compilation
      const { apiBaseUrl } = clientEnv;
      const { name } = config.app;
      const { analytics } = config.features;

      expect(apiBaseUrl).toBeDefined();
      expect(name).toBeDefined();
      expect(typeof analytics).toBe("boolean");
    });
  });
});
