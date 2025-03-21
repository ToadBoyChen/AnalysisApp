import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/style/globals.css";
import Nav from "@/Components/Nav.tsx";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Analysis by Toby Chen",
  description: "Web App to make money QUICK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`
        ${inter.variable} 
        bg-[var(--colour-background-primary)] 
        text-[var(--colour-text-news)]
        subpixel-antialiased`}>
        <Nav/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}