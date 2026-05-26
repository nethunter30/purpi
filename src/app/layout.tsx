import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://enteropia.com"),
  title: {
    default: "enteropia | Enterprise Software Engineering & Cloud Solutions",
    template: "%s | enteropia",
  },
  description: "enteropia delivers cutting-edge software engineering, custom cloud-native infrastructure, AI pipelines, and zero-trust security integrations for enterprise scale-ups.",
  keywords: [
    "enterprise software development",
    "cloud native infrastructure",
    "zero trust security",
    "AI integration",
    "machine learning systems",
    "Next.js web development",
    "enteropia",
  ],
  authors: [{ name: "enteropia Team", url: "https://enteropia.com" }],
  creator: "enteropia",
  publisher: "enteropia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "enteropia | Enterprise Software Engineering & Cloud Solutions",
    description: "enteropia delivers cutting-edge software engineering, custom cloud-native infrastructure, AI pipelines, and zero-trust security integrations for enterprise scale-ups.",
    url: "https://enteropia.com",
    siteName: "enteropia",
    images: [
      {
        url: "/illustrations/digital-media.png",
        width: 1200,
        height: 630,
        alt: "enteropia - Enterprise Software Engineering & Cloud Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "enteropia | Enterprise Software Engineering & Cloud Solutions",
    description: "enteropia delivers cutting-edge software engineering, custom cloud-native infrastructure, AI pipelines, and zero-trust security integrations for enterprise scale-ups.",
    images: ["/illustrations/digital-media.png"],
    creator: "@enteropia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
