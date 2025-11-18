/**
 * Auth Loading Component
 *
 * Displayed while authentication pages are loading.
 */

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
          <div className="absolute inset-0 rounded-full border-4 border-black dark:border-white border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading authentication...
        </p>
      </div>
    </div>
  );
}
