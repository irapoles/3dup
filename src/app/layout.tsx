import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

const bodyClassName = `${inter?.className ?? ""} antialiased`.trim();

export const metadata: Metadata = {
  title: "3DUp",
  description: "3D visualization asset management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bodyClassName}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
