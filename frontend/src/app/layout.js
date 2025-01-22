import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kitchen Companion",
  description: "Your kitchen companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-w-[350px] bg-slate-100 text-[#333] antialiased`}
        >
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </body>
      </AuthProvider>
    </html>
  );
}
