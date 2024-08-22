import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

export const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ??
  "6b210571a14914a01545e7e5dbef6dfc";

export const metadata = {
  name: "Seabrick",
  description: "Seabrick app",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// Create wagmiConfig
const chains = [arbitrum, arbitrumSepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
