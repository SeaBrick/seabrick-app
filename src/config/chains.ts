import { type Chain, http } from "viem";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

// TODO: Use this to generate the chains and transports correctly.
// `appChains` should just one length, like [arbitrumSepolia] or [arbitrum]
// `appTransports` should have just one key. Like [arbitrumSepolia.id] or [arbitrum.id]
// export const definedChain: "arbitrum" |"testnet" = process.env.NEXT_PUBLIC_CHAIN?.toLocaleLowerCase() ?? "testnet";

// if the env is not "arbitrum" or "testnet", we default it to testnet
const chainEnv = process.env.NEXT_PUBLIC_CHAIN?.toLowerCase();
export const definedChain: "arbitrum" | "testnet" =
  chainEnv === "arbitrum" || chainEnv === "testnet" ? chainEnv : "testnet";

export const appChains: [Chain, ...Chain[]] =
  definedChain == "arbitrum" ? [arbitrum] : [arbitrumSepolia];

const arbitrumTransport = {
  [arbitrum.id]: http(
    process.env.ARBITRUM_RPC_URL ?? arbitrum.rpcUrls.default.http[0]
  ),
};

const arbitrumSepoliaTransport = {
  [arbitrumSepolia.id]: http(
    process.env.ARBITRUM_SEPOLIA_RPC_URL ??
      arbitrumSepolia.rpcUrls.default.http[0]
  ),
};

// RPC URL for each chain
// Example: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
export const appTransports =
  definedChain == "arbitrum" ? arbitrumTransport : arbitrumSepoliaTransport;
