/**
 * Footer Component
 *
 * Application footer with links, copyright, and social media.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import { APP_NAME } from "@/config";

interface FooterProps {
  /**
   * Additional className
   */
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t-2 border-[#757373]/40 bg-white dark:bg-[#1C1C1C] py-8",
        className
      )}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1C1C1C] dark:text-white">
              {APP_NAME}
            </h3>
            <p className="text-sm text-[#757373]">
              Gamified time tracking with XP, achievements, and skill trees.
              Level up your productivity!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/achievements"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Achievements
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1C1C1C] dark:text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t-2 border-[#757373]/40 pt-8 md:flex-row">
          <p className="text-sm text-[#757373]">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
              aria-label="Twitter"
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
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
              aria-label="GitHub"
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
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#757373] transition-colors hover:text-[#1C1C1C] dark:hover:text-white"
              aria-label="Discord"
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
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" x2="9.01" y1="9" y2="9" />
                <line x1="15" x2="15.01" y1="9" y2="9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
