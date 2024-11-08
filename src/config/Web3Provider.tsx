"use client";
import { WagmiProvider, createConfig } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { appChains, appTransports } from "./chains";
import type { ReactNode } from "react";

// Get projectId from https://cloud.walletconnect.com
// export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "9338fd26b2d0b9c76905eb6599795425";
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

const config = createConfig(
  getDefaultConfig({
    // The dApp chains
    chains: appChains,
    transports: appTransports,

    // Required API Keys
    walletConnectProjectId: projectId,

    // Required App Info
    appName: "Seabrick App",

    // Optional App Info
    appDescription: "Seabrick App for a new world",
    appUrl: window.location.href,
    appIcon: "https://family.co/logo.png",
  })
);

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}
export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="soft"
          customTheme={{ "--ck-spinner-color": "2069a0" }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
