import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediAI - Professional Clinical Assistant",
  description: "AI-powered clinical decision support for healthcare providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}