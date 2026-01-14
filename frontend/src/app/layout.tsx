import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { ClerkProvider } from "@clerk/nextjs";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: {
    default: "Pato Hornets Football Academy | Elite Youth Football Training",
    template: "%s | Pato Hornets Academy"
  },
  description: "Premier football academy management system featuring player tracking, training schedules, performance analytics, and comprehensive club administration. Join Pato Hornets for elite youth football development.",
  keywords: ["football academy", "youth football", "soccer training", "sports management", "player development", "football club", "pato hornets", "academy management"],
  authors: [{ name: "Pato Hornets Academy" }],
  creator: "Pato Hornets Academy",
  publisher: "Pato Hornets Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Pato Hornets Football Academy | Elite Youth Football Training",
    description: "Premier football academy management system featuring player tracking, training schedules, and performance analytics.",
    siteName: "Pato Hornets Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pato Hornets Football Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pato Hornets Football Academy",
    description: "Elite youth football training and academy management system",
    images: ["/twitter-image.png"],
    creator: "@patohorents",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional SEO tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8B0000" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ThemeProvider>
            {children}
            <ToastContainer position="bottom-right" theme="dark" />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
