import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CarbonQuest — Track, Reduce & Gamify Your Carbon Footprint",
  description:
    "AI-powered gamified carbon awareness platform. Track your carbon footprint, complete eco missions, earn achievements, and get personalized AI coaching to reduce your environmental impact.",
  keywords: [
    "carbon footprint",
    "carbon tracker",
    "sustainability",
    "eco friendly",
    "climate change",
    "carbon emissions",
    "green living",
    "gamification",
  ],
  authors: [{ name: "CarbonQuest" }],
  openGraph: {
    title: "CarbonQuest — Gamify Your Carbon Footprint",
    description:
      "Track, reduce, and gamify your carbon footprint with AI-powered coaching and eco missions.",
    type: "website",
    siteName: "CarbonQuest",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonQuest — Gamify Your Carbon Footprint",
    description:
      "Track, reduce, and gamify your carbon footprint with AI-powered coaching.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#020617" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f1f5f9',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
