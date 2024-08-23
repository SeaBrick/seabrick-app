"use client";
import ERC20Mock from "./components/contracts/erc20";
import Seabrick from "./components/contracts/seabrick";
import TabList from "./components/tabs/Tablist";
import TabItem from "./components/tabs/TabItem";
import Market from "./components/contracts/market";
import { useAccount } from "wagmi";

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="w-3/4 mx-auto">
      {isConnected ? (
        <>
          <div className="mb-8 mt-14 text-2xl text-gray-800">Contracts</div>

          <div className="">
            <TabList>
              <TabItem label="Market">
                <Market />
              </TabItem>
              <TabItem label="Seabrick">
                <Seabrick />
              </TabItem>
              <TabItem label="ERC20 Mock">
                <ERC20Mock />
              </TabItem>
            </TabList>
          </div>
        </>
      ) : (
        <div className="mb-8 mt-14 text-2xl text-gray-800">
          Please, connect your wallet
        </div>
      )}
    </div>
  );
}

export default App;
