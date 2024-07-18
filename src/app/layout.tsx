import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./redux/provider";
import { AuthProvider } from '@/providers/Provider';
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon2.png" type="image/png" sizes="32x32" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers >
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>

      </body>
    </html>
  )
}

