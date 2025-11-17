import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
