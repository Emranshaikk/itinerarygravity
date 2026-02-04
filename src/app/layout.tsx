import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItineraryGravity | Influencer Itinerary Marketplace",
  description: "Buy and sell travel itineraries from your favorite creators.",
};

import { dark } from "@clerk/themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: '#ffffff',
        colorBackground: '#09090b',
        colorText: '#ffffff',
        colorInputBackground: '#18181b',
        colorInputText: '#ffffff',
      },
      elements: {
        card: "glass",
        formButtonPrimary: "btn btn-primary",
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>
        <body suppressHydrationWarning>
          <ThemeProvider>
            <BackgroundAnimation />
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
