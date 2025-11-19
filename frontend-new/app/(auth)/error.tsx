"use client";

/**
 * Auth Error Component
 *
 * Error boundary for authentication pages.
 */

import { useEffect } from "react";
import Link from "next/link";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    console.error("Authentication error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-8">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Authentication Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || "Failed to authenticate"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
