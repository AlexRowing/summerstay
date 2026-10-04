import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import ThemeProvider from "@/app/_components/ThemeProvider";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const description =
  "Student-to-student subleases near Virginia Tech. Find a place in Blacksburg for the summer, a semester, or winter break, or hand off your lease while you're away.";

export const metadata: Metadata = {
  metadataBase: new URL("https://summerstay.vercel.app"),
  title: {
    default: "SummerStay · Student subleases in Blacksburg",
    template: "%s · SummerStay",
  },
  description,
  openGraph: {
    title: "SummerStay · Student subleases in Blacksburg",
    description,
    url: "https://summerstay.vercel.app",
    siteName: "SummerStay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SummerStay · Student subleases in Blacksburg",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfafa" },
    { media: "(prefers-color-scheme: dark)", color: "#141011" },
  ],
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
      className={`${schibsted.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
