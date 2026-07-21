import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

// Body copy — highly legible. Display — warmer, geometric, for headings.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rewire-habit-coach.vercel.app"),
  title: {
    default: "Rewire — AI habit & addiction recovery coach",
    template: "%s · Rewire",
  },
  description:
    "Break bad habits for good. Get a personalized, AI-built recovery plan with intelligent nudges, coping strategies, streak tracking, and in-the-moment craving support.",
  applicationName: "Rewire",
  keywords: [
    "habit tracker",
    "break bad habits",
    "AI coach",
    "addiction recovery",
    "screen time",
    "GenAI",
  ],
  openGraph: {
    type: "website",
    siteName: "Rewire",
    url: "https://rewire-habit-coach.vercel.app",
    title: "Rewire — Break bad habits for good, with an AI coach",
    description:
      "A free GenAI web app that helps you reduce or overcome harmful habits with a personalized recovery plan, an adaptive coach, and in-the-moment craving support.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewire — Break bad habits for good, with an AI coach",
    description:
      "A free GenAI habit-recovery coach: personalized plan, adaptive coaching, Craving SOS, and progress tracking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased app-backdrop min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
