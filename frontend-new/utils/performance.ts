/**
 * Performance Monitoring Utilities
 *
 * Tools for tracking and optimizing application performance.
 */

/**
 * Web Vitals Types
 */
export interface WebVitalsMetric {
  id: string;
  name: "CLS" | "FCP" | "FID" | "LCP" | "TTFB" | "INP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType: string;
}

/**
 * Performance Mark
 */
export interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Performance]", metric);
  }

  // Send to analytics service
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") {
    fetch("/api/analytics/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch((error) => {
      console.error("[Performance] Failed to report vitals:", error);
    });
  }
}

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    performance.mark(`${name}-start`);
    const result = await fn();
    performance.mark(`${name}-end`);

    performance.measure(name, `${name}-start`, `${name}-end`);

    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    console.error(`[Performance] Error in ${name}:`, error);
    throw error;
  } finally {
    // Clean up marks
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  }
}

/**
 * Get all performance marks
 */
export function getPerformanceMarks(): PerformanceMark[] {
  if (typeof window === "undefined") return [];

  const marks = performance.getEntriesByType("mark") as PerformanceEntry[];

  return marks.map((mark) => ({
    name: mark.name,
    startTime: mark.startTime,
  }));
}

/**
 * Get all performance measures
 */
export function getPerformanceMeasures(): PerformanceMark[] {
  if (typeof window === "undefined") return [];

  const measures = performance.getEntriesByType("measure") as PerformanceMeasureOptions[];

  return measures.map((measure) => ({
    name: measure.name || "",
    startTime: measure.start as number || 0,
    duration: measure.duration as number,
  }));
}

/**
 * Clear all performance data
 */
export function clearPerformanceData(): void {
  if (typeof window === "undefined") return;

  performance.clearMarks();
  performance.clearMeasures();
  performance.clearResourceTimings();
}

/**
 * Get page load metrics
 */
export function getPageLoadMetrics() {
  if (typeof window === "undefined") return null;

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  if (!navigation) return null;

  return {
    // Time to First Byte
    ttfb: navigation.responseStart - navigation.requestStart,

    // DNS Lookup
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,

    // TCP Connection
    tcp: navigation.connectEnd - navigation.connectStart,

    // Request/Response
    request: navigation.responseEnd - navigation.requestStart,

    // DOM Processing
    domProcessing: navigation.domComplete - navigation.domInteractive,

    // Page Load
    pageLoad: navigation.loadEventEnd - navigation.loadEventStart,

    // Total
    total: navigation.loadEventEnd - navigation.fetchStart,
  };
}

/**
 * Get resource timing for specific resource type
 */
export function getResourceTiming(resourceType?: string) {
  if (typeof window === "undefined") return [];

  const resources = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];

  if (!resourceType) return resources;

  return resources.filter(
    (resource) =>
      resource.initiatorType === resourceType ||
      resource.name.includes(`.${resourceType}`)
  );
}

/**
 * Monitor long tasks (> 50ms)
 */
export function monitorLongTasks(
  callback: (task: PerformanceEntry) => void
): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          callback(entry);
        }
      }
    });

    observer.observe({ entryTypes: ["longtask"] });

    return () => observer.disconnect();
  } catch (error) {
    console.warn("[Performance] Long task monitoring not supported");
    return () => {};
  }
}

/**
 * Monitor layout shifts
 */
export function monitorLayoutShifts(
  callback: (shift: PerformanceEntry) => void
): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          callback(entry);
        }
      }
    });

    observer.observe({ entryTypes: ["layout-shift"] });

    return () => observer.disconnect();
  } catch (error) {
    console.warn("[Performance] Layout shift monitoring not supported");
    return () => {};
  }
}

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage() {
  if (
    typeof window === "undefined" ||
    !(performance as any).memory
  ) {
    return null;
  }

  const memory = (performance as any).memory;

  return {
    // Total JS heap size in MB
    totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2),

    // Used JS heap size in MB
    usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2),

    // JS heap size limit in MB
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2),

    // Usage percentage
    usagePercentage: (
      (memory.usedJSHeapSize / memory.jsHeapSizeLimit) *
      100
    ).toFixed(2),
  };
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary(): void {
  if (typeof window === "undefined") return;

  console.group("[Performance Summary]");

  // Page load metrics
  const loadMetrics = getPageLoadMetrics();
  if (loadMetrics) {
    console.table({
      "TTFB": `${loadMetrics.ttfb.toFixed(2)}ms`,
      "DNS Lookup": `${loadMetrics.dns.toFixed(2)}ms`,
      "TCP Connection": `${loadMetrics.tcp.toFixed(2)}ms`,
      "Request/Response": `${loadMetrics.request.toFixed(2)}ms`,
      "DOM Processing": `${loadMetrics.domProcessing.toFixed(2)}ms`,
      "Page Load": `${loadMetrics.pageLoad.toFixed(2)}ms`,
      "Total": `${loadMetrics.total.toFixed(2)}ms`,
    });
  }

  // Memory usage (Chrome only)
  const memory = getMemoryUsage();
  if (memory) {
    console.log("Memory Usage:", memory);
  }

  // Custom measures
  const measures = getPerformanceMeasures();
  if (measures.length > 0) {
    console.table(
      measures.map((m) => ({
        Name: m.name,
        Duration: `${m.duration?.toFixed(2)}ms`,
      }))
    );
  }

  console.groupEnd();
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if connection is slow (2G/3G)
 */
export function isSlowConnection(): boolean {
  if (typeof window === "undefined" || !("connection" in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  const slowTypes = ["slow-2g", "2g", "3g"];

  return (
    slowTypes.includes(connection?.effectiveType) ||
    connection?.downlink < 1
  );
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device has touch support
 */
export function hasTouchSupport(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1;

  return window.devicePixelRatio || 1;
}

/**
 * Preload resource
 */
export function preloadResource(
  href: string,
  as: "script" | "style" | "image" | "font"
): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;

  if (as === "font") {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
}

/**
 * Prefetch resource
 */
export function prefetchResource(href: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;

  document.head.appendChild(link);
}

/**
 * Request idle callback wrapper
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window === "undefined") return 0;

  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for browsers without requestIdleCallback
  return setTimeout(() => {
    const start = Date.now();
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as any;
}

/**
 * Cancel idle callback wrapper
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window === "undefined") return;

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Type augmentation for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, any>
    ) => void;
  }
}
