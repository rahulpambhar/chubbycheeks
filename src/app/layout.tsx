import React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./redux/provider";
import { AuthProvider } from '@/providers/Provider';
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"


const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});



type RootLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      
        <link rel="icon" href="/favicon2.png" type="image/png" sizes="32x32" />
      </head>
      <body
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <Providers >
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}