import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navigation from "./components/Navigation";
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
  title: "Suyi Zhang - 个人网站",
  description: "欢迎访问我的个人网站，这里有我的作品集、博客文章和更多信息。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col antialiased" style={{
        fontFamily: `var(${geistSans.variable}), var(${geistMono.variable}), system-ui, sans-serif`
      }}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-200/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                © 2024 Suyi Zhang. All rights reserved.
              </p>
              <div className="flex items-center gap-8">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  GitHub
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
