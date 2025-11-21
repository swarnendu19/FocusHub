import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration, PWAInstallPrompt } from "@/components/pwa";
import { WebVitals } from "./web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FocusHub - Gamified Time Tracking",
    template: "%s | FocusHub",
  },
  description: "A gamified time tracking application with XP systems, achievements, skill trees, and leaderboards. Track your time, level up, and compete with others.",
  keywords: ["time tracking", "productivity", "gamification", "XP system", "achievements", "skill tree", "leaderboard"],
  authors: [{ name: "FocusHub Team" }],
  creator: "FocusHub",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  applicationName: "FocusHub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FocusHub",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FocusHub - Gamified Time Tracking",
    description: "Track your time, earn XP, unlock achievements, and level up your productivity.",
    siteName: "FocusHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusHub - Gamified Time Tracking",
    description: "Track your time, earn XP, unlock achievements, and level up your productivity.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1C1C1C" },
    { media: "(prefers-color-scheme: dark)", color: "#FFFFFF" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1C1C1C" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <WebVitals />
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
