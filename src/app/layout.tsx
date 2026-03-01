import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItineraryGravity | Influencer Itinerary Marketplace",
  description: "Buy and sell travel itineraries from your favorite creators.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#ff85a2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ThemeProvider>
            <BackgroundAnimation />
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
