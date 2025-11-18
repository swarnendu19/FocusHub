/**
 * Auth Layout
 *
 * Layout for authentication pages (login, callback).
 * Minimal layout without navigation/sidebar.
 */

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {children}
    </div>
  );
}
