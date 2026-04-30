import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { FloatingWhatsApp } from "@/components/product/floating-whatsapp";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "DataWatch NG",
  title: "DataWatch NG",
  description: "Know where your data goes.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DataWatch NG",
  },
};

export const viewport: Viewport = {
  themeColor: "#008751",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <AppProviders>
          {children}
          <FloatingWhatsApp />
        </AppProviders>
      </body>
    </html>
  );
}
