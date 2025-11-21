/**
 * Web Vitals Component
 *
 * Tracks and reports Core Web Vitals metrics.
 */

"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVitals } from "@/utils/performance";

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals({
      id: metric.id,
      name: metric.name as any,
      value: metric.value,
      rating: metric.rating as any,
      delta: metric.delta,
      navigationType: metric.navigationType,
    });
  });

  return null;
}
