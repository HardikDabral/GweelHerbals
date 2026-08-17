import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Footer } from "@/components/layout/Footer";

// Google Analytics 4. Measurement IDs are public by design (they ship in the
// page source), so the live ID is the default and the env var is only there
// to point a staging deploy at a different property.
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-CKVR1K03R5";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gweel Herbals - Pure Himalayan Wellness",
  description: "Discover the essence of purity with Gweel Herbals. 100% organic, farm-to-bottle lemongrass essential oils, herbal teas, and natural fragrances from Pauri Garhwal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-background text-black dark:text-white transition-colors">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>

        {/*
          Loaded after hydration so analytics never blocks first paint. gtag
          tracks App Router route changes on its own, so no per-page wiring.
        */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
