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
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default App;
