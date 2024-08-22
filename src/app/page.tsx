"use client";

import { useWalletInfo, useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Component() {
  const { open, close } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();

  return <button onClick={() => console.log(walletInfo?.name)}>Open</button>;
}

function ConnectButton() {
  return <w3m-button />;
}

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <ConnectButton />
      <Component />

      <p className="text-black">xd</p>
      <p className="text-red-500">xd</p>
    </>
  );
}

export default App;
