import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import ThemeProvider from "@/app/_components/ThemeProvider";
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
  metadataBase: new URL("https://summerstay.vercel.app"),
  title: {
    default: "SummerStay — Summer sublets near campus",
    template: "%s · SummerStay",
  },
  description:
    "Find a summer sublet near campus, or list your place for the summer. A student-to-student marketplace.",
  openGraph: {
    title: "SummerStay — Summer sublets near campus",
    description:
      "Find a summer sublet near campus, or list your place for the summer.",
    url: "https://summerstay.vercel.app",
    siteName: "SummerStay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SummerStay — Summer sublets near campus",
    description:
      "Find a summer sublet near campus, or list your place for the summer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* suppressHydrationWarning: next-themes sets the .dark class on <html>
       in the browser before React loads, so the server-rendered HTML can
       differ here on purpose. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
