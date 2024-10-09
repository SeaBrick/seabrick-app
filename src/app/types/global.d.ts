// types/globals.d.ts or just globals.d.ts in the root
import { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export {}; // This ensures the file is treated as a module.
