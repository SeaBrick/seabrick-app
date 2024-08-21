"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId = "9338fd26b2d0b9c76905eb6599795425";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
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
  chains: [mainnet, arb_sepolia],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function AppKit({ children }: any) {
  return children;
}
