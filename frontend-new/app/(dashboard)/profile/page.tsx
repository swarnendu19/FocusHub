/**
 * Profile Page
 *
 * User profile settings and preferences.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | FocusHub",
  description: "Manage your profile and preferences",
};

export default function ProfilePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
        Profile
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Profile page - Component to be migrated from Vite app
      </p>
    </div>
  );
}
