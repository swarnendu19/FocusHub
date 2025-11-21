/**
 * OAuth Callback Page
 *
 * Handles OAuth redirect and token exchange.
 */

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();

  const [error, setError] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(true);

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        // Get code from URL params
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          throw new Error(
            `Authentication failed: ${searchParams.get("error_description") || errorParam}`
          );
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code for tokens
        await handleOAuthCallback({ code, state: state || undefined });

        // Get redirect URL from state or default to projects
        const redirectUrl = state || "/projects";

        // Redirect to dashboard
        router.push(redirectUrl);
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setError(err.message || "Authentication failed");
        setIsProcessing(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?error=oauth_failed");
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAFAFA] to-white dark:from-[#1C1C1C] dark:to-black p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1C1C1C] dark:text-white">
            FocusHub
          </h1>
        </div>

        <div className="rounded-lg border-2 border-[#1C1C1C] dark:border-white bg-white dark:bg-[#1C1C1C] p-8">
          {isProcessing ? (
            <>
              {/* Loading State */}
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
              </div>

              <h2 className="text-2xl font-bold text-[#1C1C1C] dark:text-white mb-2">
                Signing you in...
              </h2>
              <p className="text-[#757373]">
                Please wait while we complete your authentication
              </p>
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="flex justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-[#1C1C1C] dark:text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-[#757373] mb-4">{error}</p>

              <p className="text-sm text-[#757373]">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-[#757373]">
          Having trouble?{" "}
          <a
            href="/login"
            className="text-[#1C1C1C] dark:text-white hover:underline"
          >
            Return to login
          </a>
        </p>
      </div>
    </div>
  );
}
