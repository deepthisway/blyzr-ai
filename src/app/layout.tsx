import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "blyzer",
  description: "blyzer is a platform for building AI applications with ease.",
  icons: {
    icon: "/logo2.png",
  },
};
// add the icon for the tab logo view
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${interSans.variable} ${interMono.variable} antialiased` }
        >
        {children}
      </body>
    </html>
    </TRPCReactProvider>
    </ClerkProvider>
  );
}
