import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import SplashScreen from "@/components/layout/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { ContractProvider } from "@/context/contractContext";
import { AccountProvider } from "@/context/accountContext";
import { AggregatorsProvider } from "@/context/aggregatorsContext";
import { AuthProvider } from "@/context/authContext";
import { Web3Provider } from "@/config/Web3Provider";

export const metadata: Metadata = {
  title: "Seabrick App",
  description: "Seabrick Web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Provider>
      <AuthProvider>
        <ContractProvider>
          <AggregatorsProvider>
            <AccountProvider>
              <html lang="en">
                <body className="flex flex-col min-h-svh">
                  <Navbar />
                  <main className="flex-grow w-full h-auto self-center">
                    <SplashScreen>{children}</SplashScreen>
                  </main>
                  <Footer />
                </body>
              </html>
            </AccountProvider>
          </AggregatorsProvider>
        </ContractProvider>
      </AuthProvider>
    </Web3Provider>
  );
}
