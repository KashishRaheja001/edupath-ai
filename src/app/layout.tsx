import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EduPath — AI Career Navigation for Students",
  description:
    "Discover the right skills, projects, and learning resources for your career goals. AI-powered mentorship, skill visualization, and personalized learning paths.",
  keywords: ["AI", "career", "learning", "skills", "mentorship", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
