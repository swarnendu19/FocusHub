/**
 * OAuth Callback Page
 *
 * Handles OAuth authentication callback and token exchange.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { CallbackHandler } from "@/components/auth/CallbackHandler";

export const metadata: Metadata = {
  title: "Authenticating... | FocusHub",
  description: "Completing authentication",
};

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-black">
        <div className="text-center">
          <svg
            className="h-12 w-12 animate-spin text-[#1C1C1C] dark:text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
