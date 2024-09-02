import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import AppKitProvider from "@/context";
import { Navbar } from "./components/layout/Navbar";
import SplashScreen from "./components/layout/SplashScreen";
import { Footer } from "./components/layout/Footer";
import { ContractProvider } from "@/context/contractContext";
import { AccountProvider } from "@/context/accountContext";

export const metadata: Metadata = {
  title: "Seabrick Demo App",
  description: "Seabrick Web Demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <AppKitProvider initialState={initialState}>
      <ContractProvider>
        <AccountProvider>
          <html lang="en">
            <body className="flex flex-col min-h-svh">
              <Navbar />
              <main className="flex-grow">
                <SplashScreen>{children}</SplashScreen>
              </main>
              <Footer />
            </body>
          </html>
        </AccountProvider>
      </ContractProvider>
    </AppKitProvider>
  );
}
