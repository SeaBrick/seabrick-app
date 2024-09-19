import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, sepolia } from "@reown/appkit/networks";

// Get projectId from https://cloud.walletconnect.com
export const projectId = "9338fd26b2d0b9c76905eb6599795425";
// export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const networks = [arbitrum, sepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const config = wagmiAdapter.wagmiConfig;
