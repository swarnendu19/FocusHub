/**
 * PWA Install Prompt Component
 *
 * Displays a prompt for users to install the PWA when conditions are met.
 */

"use client";

import * as React from "react";
import { Button, Card } from "@/components/ui";
import { cn } from "@/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show prompt if not dismissed or if it's been more than 7 days
      if (!dismissed || daysSinceDismissed > 7) {
        // Delay showing prompt for better UX
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log("[PWA] App installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show install prompt
      await deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("[PWA] User accepted install prompt");
        setShowPrompt(false);
        setDeferredPrompt(null);
      } else {
        console.log("[PWA] User dismissed install prompt");
        handleDismiss();
      }
    } catch (error) {
      console.error("[PWA] Install prompt failed:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md",
        "animate-in slide-in-from-bottom-5 duration-300"
      )}
    >
      <Card className="border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] shadow-xl">
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#1C1C1C] dark:bg-white">
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
                className="h-6 w-6 text-white dark:text-[#1C1C1C]"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[#1C1C1C] dark:text-white mb-1">
                Install FocusHub
              </h3>
              <p className="text-sm text-[#757373] mb-4">
                Install the app for a better experience with offline support and
                quick access.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  variant="primary"
                  className="flex-1"
                >
                  Install
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                >
                  Not Now
                </Button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-[#757373] hover:text-[#1C1C1C] dark:hover:text-white transition-colors"
              aria-label="Close"
            >
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
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Features list */}
          <div className="mt-4 pt-4 border-t-2 border-[#FAFAFA] dark:border-[#1C1C1C]/50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs font-semibold text-[#1C1C1C] dark:text-white mb-1">
                  Offline
                </div>
                <div className="text-xs text-[#757373]">
                  Work without internet
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C1C1C] dark:text-white mb-1">
                  Fast
                </div>
                <div className="text-xs text-[#757373]">
                  Instant load times
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C1C1C] dark:text-white mb-1">
                  Native
                </div>
                <div className="text-xs text-[#757373]">
                  App-like feel
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
