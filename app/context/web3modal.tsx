"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ??
  "6b210571a14914a01545e7e5dbef6dfc";

// 2. Set chains
const arbitrum = {
  chainId: 42161,
  name: "Arbitrum One",
  currency: "ETH",
  explorerUrl: "https://arbiscan.io",
  rpcUrl:
    "https://arb-mainnet.g.alchemy.com/v2/Wet0SaQS47eHKLeUsYqyc5MlRU4WgP2T",
};
const arb_sepolia = {
  chainId: 421614,
  name: "Arbitrum Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.arbiscan.io",
  rpcUrl:
    "https://arb-sepolia.g.alchemy.com/v2/Wet0SaQS47eHKLeUsYqyc5MlRU4WgP2T",
};

// 3. Create a metadata object
const metadata = {
  name: "Seabrick",
  description: "Seabrick app",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 421614, // used for the Coinbase SDK
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [arbitrum, arb_sepolia],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function AppKit({ children }: any) {
  return children;
}
