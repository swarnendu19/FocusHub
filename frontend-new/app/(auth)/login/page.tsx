/**
 * Login Page
 *
 * Public route for user authentication.
 */

import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | FocusHub",
  description: "Sign in to your FocusHub account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-black p-4">
      <LoginForm />
    </div>
  );
}
