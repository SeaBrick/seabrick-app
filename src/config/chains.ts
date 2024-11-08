// import { mainnet, sepolia } from "wagmi/chains";
import { http } from "viem";
import { arbitrumSepolia } from "wagmi/chains";

// TODO: Use this to generate the chains and transports correctly
export const definedChain = process.env.NEXT_PUBLIC_CHAIN ?? "testnet";

export const appChains = [arbitrumSepolia];

// RPC URL for each chain
// Example: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
export const appTransports = {
  // If we have an env `ARBITRUM_SEPOLIA_RPC_URL`, we use it. Otherwise, we use the defaul
  [arbitrumSepolia.id]: http(
    process.env.ARBITRUM_SEPOLIA_RPC_URL ??
      arbitrumSepolia.rpcUrls.default.http[0]
  ),
};
