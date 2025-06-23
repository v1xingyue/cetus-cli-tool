import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-context";
import { RealWalletProvider } from "../lib/real-wallet-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cetus CLI Web Interface",
  description:
    "Web interface for Cetus Protocol CLI tool with real Move package deployment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <RealWalletProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
              {children}
            </div>
          </RealWalletProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
