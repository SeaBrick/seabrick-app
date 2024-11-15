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
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TODO: Send email receipts after a buy that contains info of their tokens, like:
//       - Token IDs
//       - Amount Spent on Dollars (always) (if buy with crypto, it will means the amount spent on Dollars $ in that moment)
//       - Amounr spent on Crypto (if buy with crypto)
//       - Via: Stripe/Crypto
//       - Tx ID: Session ID for stripe or Tx Hash for Crypto
//       - Time of buy
//       - User email
//       - Wallet user (if apply)
//       - A buy with crypto can be made while logged a given user email. We should specify what wallet address made it

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
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={"light"}
                    transition={Bounce}
                  />
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
