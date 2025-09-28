import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "🤖 Bot Binance Pro",
  description: "Trading automatizado inteligente para Binance com dashboard completo, monitor de preços em tempo real e configurações avançadas.",
  keywords: ["binance", "bot", "trading", "cryptocurrency", "bitcoin", "ethereum"],
  authors: [{ name: "Bot Binance Pro" }],
  viewport: "width=device-width, initial-scale=1",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_22da07d5-4b39-4206-8df2-34937624aff2-t0oEp7iYZ7mY2X2GIaXmSZ328zbbiR",
      button: {
        title: "Open Bot Binance Pro",
        action: {
          type: "launch_frame",
          name: "Bot Binance Pro",
          url: "https://theory-valuable-164.app.ohara.ai",
          splashImageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#000000"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="x-request-id" content={crypto.randomUUID()} />
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-black text-white font-sans`}
      >
        {children}
        <ResponseLogger />
      </body>
    </html>
  );
}