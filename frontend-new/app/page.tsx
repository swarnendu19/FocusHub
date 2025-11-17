import { cn } from "@/utils";
import { config, APP_NAME, TIMER, COLORS } from "@/config";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex max-w-4xl flex-col items-center gap-8 text-center">
        {/* Hero Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Welcome to FocusHub
          </h1>
          <p className="text-xl text-muted-foreground">
            Gamified Time Tracking with XP, Achievements & Skill Trees
          </p>
        </div>

        {/* Color Palette Demonstration */}
        <div className="w-full space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Dark Color */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-full rounded-lg bg-[#1C1C1C] shadow-lg" />
              <div className="text-sm">
                <div className="font-mono text-xs text-muted-foreground">#1C1C1C</div>
                <div className="font-medium">Dark</div>
              </div>
            </div>

            {/* Gray Color */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-full rounded-lg bg-[#757373] shadow-lg" />
              <div className="text-sm">
                <div className="font-mono text-xs text-muted-foreground">#757373</div>
                <div className="font-medium">Gray</div>
              </div>
            </div>

            {/* White Color */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-full rounded-lg border-2 border-border bg-[#FFFFFF] shadow-lg" />
              <div className="text-sm">
                <div className="font-mono text-xs text-muted-foreground">#FFFFFF</div>
                <div className="font-medium">White</div>
              </div>
            </div>

            {/* Light Color */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-full rounded-lg border-2 border-border bg-[#FAFAFA] shadow-lg" />
              <div className="text-sm">
                <div className="font-mono text-xs text-muted-foreground">#FAFAFA</div>
                <div className="font-medium">Light</div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            UI Components
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className={cn(
                "rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground",
                "transition-all hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              )}
            >
              Primary Button
            </button>
            <button
              className={cn(
                "rounded-lg border-2 border-border bg-background px-6 py-3 font-medium text-foreground",
                "transition-all hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              )}
            >
              Secondary Button
            </button>
            <button
              className={cn(
                "rounded-lg bg-muted px-6 py-3 font-medium text-muted-foreground",
                "transition-all hover:bg-border",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              )}
            >
              Muted Button
            </button>
          </div>
        </div>

        {/* Cards Example */}
        <div className="grid w-full gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-foreground">XP System</h3>
            <p className="text-sm text-muted-foreground">
              Earn experience points for every tracked activity
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Achievements</h3>
            <p className="text-sm text-muted-foreground">
              Unlock badges and rewards as you progress
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Skill Trees</h3>
            <p className="text-sm text-muted-foreground">
              Level up different skill categories
            </p>
          </div>
        </div>

        {/* Configuration Demo */}
        <div className="w-full space-y-4 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Configuration Demo
          </h2>
          <div className="grid gap-3 text-left text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">App Name:</span>
              <span className="font-mono text-muted-foreground">{APP_NAME}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">App Version:</span>
              <span className="font-mono text-muted-foreground">{config.app.version}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">API Base URL:</span>
              <span className="font-mono text-muted-foreground">{config.api.baseUrl}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">Work Duration:</span>
              <span className="font-mono text-muted-foreground">{TIMER.DEFAULT_WORK_DURATION / 60} minutes</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">Analytics Enabled:</span>
              <span className={cn(
                "font-mono",
                config.features.analytics ? "text-green-600" : "text-red-600"
              )}>
                {config.features.analytics ? "✓ Yes" : "✗ No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Theme Colors:</span>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded border border-border bg-[#1C1C1C]" title={COLORS.dark} />
                <div className="h-5 w-5 rounded border border-border bg-[#757373]" title={COLORS.gray} />
                <div className="h-5 w-5 rounded border border-border bg-[#FFFFFF]" title={COLORS.white} />
                <div className="h-5 w-5 rounded border border-border bg-[#FAFAFA]" title={COLORS.light} />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Tailwind CSS v4 configured • Environment variables validated • Configuration system ready
          </p>
        </div>
      </main>
    </div>
  );
}
