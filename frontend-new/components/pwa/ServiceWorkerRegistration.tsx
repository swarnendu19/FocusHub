/**
 * Service Worker Registration Component
 *
 * Registers the service worker and handles updates.
 */

"use client";

import * as React from "react";

export function ServiceWorkerRegistration() {
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Only register service worker in production and if supported
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      console.log("[PWA] Service worker not supported or not in production");
      return;
    }

    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log("[PWA] Registering service worker...");

      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      setRegistration(reg);
      console.log("[PWA] Service worker registered successfully");

      // Check for updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;

        if (newWorker) {
          console.log("[PWA] New service worker found, installing...");

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("[PWA] New service worker installed, update available");
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Check for updates on page load
      reg.update();

      // Check for updates periodically (every hour)
      setInterval(() => {
        console.log("[PWA] Checking for service worker updates...");
        reg.update();
      }, 60 * 60 * 1000);
    } catch (error) {
      console.error("[PWA] Service worker registration failed:", error);
    }
  };

  const handleUpdate = () => {
    if (!registration || !registration.waiting) return;

    // Tell the waiting service worker to skip waiting
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Listen for controlling service worker change
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] New service worker activated, reloading page...");
      window.location.reload();
    });
  };

  // Show update notification if available
  if (updateAvailable) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md">
        <div className="rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] dark:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white dark:text-[#1C1C1C]"
              >
                <path d="M21.5 2v6h-6" />
                <path d="M2.5 22v-6h6" />
                <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
                <path d="M22 12.5a10 10 0 0 1-18.8 4.3" />
              </svg>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
                Update Available
              </p>
              <p className="text-xs text-[#757373]">
                A new version of FocusHub is ready to install.
              </p>
            </div>

            <button
              onClick={handleUpdate}
              className="rounded-lg bg-[#1C1C1C] dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-[#1C1C1C] hover:opacity-90 transition-opacity"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
